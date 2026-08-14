import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const API_ROOT = 'https://firebasehosting.googleapis.com/v1beta1';
const projectId = requireIdentifier(process.env.PROJECT_ID, 'PROJECT_ID');
const siteId = requireIdentifier(process.env.FIREBASE_SITE, 'FIREBASE_SITE');
const configuration = JSON.parse(
  await readFile(new URL('../firebase.json', import.meta.url), 'utf8'),
);
const hosting = Array.isArray(configuration.hosting)
  ? configuration.hosting.find(({ site }) => site === siteId)
  : configuration.hosting;

if (!hosting || hosting.site !== siteId) {
  throw new Error(`firebase.json does not define Hosting site ${siteId}.`);
}

const rewrites = (hosting.rewrites ?? []).map(({ source, regex, run }) => {
  if ((!source && !regex) || !run?.serviceId) {
    throw new Error('Every Hosting rewrite must define a source or regex and a Cloud Run service.');
  }

  return {
    ...(source ? { glob: source } : { regex }),
    run: {
      serviceId: requireIdentifier(run.serviceId, 'Cloud Run service ID'),
      region: requireIdentifier(run.region, 'Cloud Run region'),
    },
  };
});

if (rewrites.length === 0) {
  throw new Error('At least one Firebase Hosting rewrite is required.');
}

const gcloudCommand = process.platform === 'win32' ? 'powershell.exe' : 'gcloud';
const gcloudArguments =
  process.platform === 'win32'
    ? ['-NoProfile', '-NonInteractive', '-Command', 'gcloud auth print-access-token']
    : ['auth', 'print-access-token'];
const accessToken = execFileSync(gcloudCommand, gcloudArguments, {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
}).trim();

if (!accessToken) {
  throw new Error('gcloud did not return an access token.');
}

const headers = {
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
  'X-Goog-User-Project': projectId,
};

const version = await request(`${API_ROOT}/sites/${siteId}/versions`, {
  method: 'POST',
  body: JSON.stringify({ config: { rewrites } }),
});

const populated = await request(`${API_ROOT}/${version.name}:populateFiles`, {
  method: 'POST',
  body: JSON.stringify({ files: {} }),
});

if ((populated.uploadRequiredHashes ?? []).length > 0) {
  throw new Error('The proxy-only Hosting deployment unexpectedly requires static file uploads.');
}

const finalized = await request(`${API_ROOT}/${version.name}?updateMask=status`, {
  method: 'PATCH',
  body: JSON.stringify({ status: 'FINALIZED' }),
});

const message = process.env.GITHUB_SHA
  ? `Cloud Run proxy for ${process.env.GITHUB_SHA}`
  : 'Cloud Run proxy deployment';
const release = await request(
  `${API_ROOT}/sites/${siteId}/releases?versionName=${encodeURIComponent(finalized.name)}`,
  {
    method: 'POST',
    body: JSON.stringify({ message }),
  },
);

process.stdout.write(
  `${JSON.stringify({ site: siteId, url: `https://${siteId}.web.app`, release: release.name })}\n`,
);

async function request(url, init) {
  const response = await fetch(url, { ...init, headers });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(
      `Firebase Hosting API ${init.method} ${url} failed (${response.status}): ${body.error?.message ?? text}`,
    );
  }

  return body;
}

function requireIdentifier(value, label) {
  const normalized = value?.trim();
  if (!normalized || !/^[a-z][a-z0-9-]*[a-z0-9]$/.test(normalized)) {
    throw new Error(`${label} must be a non-empty lowercase Google Cloud identifier.`);
  }

  return normalized;
}
