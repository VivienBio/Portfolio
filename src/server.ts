import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import compression from 'compression';
import express from 'express';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { registerHealthCheck } from './app/core/infrastructure/health-check';
import {
  buildSecurityHeaders,
  extractInlineScriptHashes,
} from './app/core/infrastructure/security-headers';
import { resolveAllowedHosts } from './app/core/infrastructure/allowed-hosts';
import { registerPortfolioApi } from './app/core/infrastructure/portfolio-api';
import { LocalPortfolioRepository } from './app/core/infrastructure/local-portfolio.repository';
import {
  buildPortfolioKnowledge,
  PortfolioAssistant,
} from './app/core/application/portfolio-assistant';
import { AssistantGateway } from './app/core/application/assistant.gateway';
import { OpenAiResponsesGateway } from './app/core/infrastructure/openai-responses.gateway';
import { FormspreeContactGateway } from './app/core/infrastructure/formspree-contact.gateway';
import { ProfileFallbackGateway } from './app/core/infrastructure/profile-fallback.gateway';
import {
  readRuntimeConfiguration,
  RuntimeConfiguration,
} from './app/core/infrastructure/runtime-configuration';
import { PortfolioLocale } from './app/core/domain/portfolio.models';

const browserDistFolder = join(import.meta.dirname, '../browser');
const runtimeConfiguration = readRuntimeConfiguration(process.env);

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
const angularApp = new AngularNodeAppEngine({
  allowedHosts: resolveAllowedHosts(process.env['NG_ALLOWED_HOSTS']),
});

app.use(buildSecurityHeaders(readPrerenderedScriptHashes()));
app.use(compression());
app.use((req, res, next) => {
  if (req.path === '/en' || req.path.startsWith('/en/')) {
    res.redirect(301, req.originalUrl.slice('/en'.length) || '/');
    return;
  }
  next();
});
registerHealthCheck(app);
const assistants = {
  fr: createAssistant('fr', runtimeConfiguration),
  en: createAssistant('en', runtimeConfiguration),
};

registerPortfolioApi(app, {
  assistant: assistants.fr,
  assistantForLocale: (locale) => assistants[locale],
  contactGateway: createContactGateway(runtimeConfiguration),
});

/**
 * Serve static files from /browser
 */
const HASHED_ASSET_PATTERN = /-[A-Z0-9]{8}\.\w+$/;

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders: (res, filePath) => {
      if (filePath.includes('/fonts/')) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
      } else if (!HASHED_ASSET_PATTERN.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 * Unknown paths render the not-found page with a real 404 status.
 */
const PAGE_PATHS = new Set([
  '/',
  '/fr',
  '/work/betclic',
  '/work/tf1',
  '/fr/work/betclic',
  '/fr/work/tf1',
]);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (!response) {
        next();
        return;
      }

      const path = req.path.length > 1 ? req.path.replace(/\/+$/, '') : req.path;
      const status = PAGE_PATHS.has(path) ? response.status : 404;
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');

      return writeResponseToNodeResponse(
        new Response(response.body, { status, headers, statusText: response.statusText }),
        res,
      );
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
    warmUpPrerenderedPages(Number(port));
  });
}

function warmUpPrerenderedPages(port: number): void {
  for (const path of PAGE_PATHS) {
    fetch(`http://localhost:${port}${path}`).catch(() => {});
  }
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

function createAssistant(
  locale: PortfolioLocale,
  configuration: RuntimeConfiguration,
): PortfolioAssistant {
  const apiKey = configuration.openAiApiKey;
  const portfolio = new LocalPortfolioRepository().getPortfolio(locale);
  const fallbackGateway = new ProfileFallbackGateway(locale);
  const gateway = apiKey
    ? createResilientAssistantGateway(
        new OpenAiResponsesGateway({
          apiKey,
          model: configuration.openAiModel,
        }),
        fallbackGateway,
      )
    : fallbackGateway;

  return new PortfolioAssistant(gateway, buildPortfolioKnowledge(portfolio), locale);
}

function readPrerenderedScriptHashes(): string[] {
  try {
    const html = readFileSync(join(browserDistFolder, 'index.html'), 'utf8');
    return extractInlineScriptHashes(html, (content) =>
      createHash('sha256').update(content, 'utf8').digest('base64'),
    );
  } catch {
    return [];
  }
}

function createContactGateway(
  configuration: RuntimeConfiguration,
): FormspreeContactGateway | undefined {
  return configuration.contactFormEndpoint
    ? new FormspreeContactGateway(configuration.contactFormEndpoint)
    : undefined;
}
function createResilientAssistantGateway(
  primary: AssistantGateway,
  fallback: AssistantGateway,
): AssistantGateway {
  return {
    async answer(request) {
      try {
        return await primary.answer(request);
      } catch (error: unknown) {
        const errorName = error instanceof Error ? error.name : 'UnknownError';
        console.error(
          JSON.stringify({ severity: 'WARNING', code: 'assistant_primary_failed', errorName }),
        );
        return fallback.answer(request);
      }
    },
  };
}
