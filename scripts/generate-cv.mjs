import { mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(root, 'public', 'assets');
const documents = [
  {
    source: resolve(root, 'docs', 'cv', 'cv-fr.html'),
    output: resolve(outputDirectory, 'CV-Vivien-Billot-FR.pdf'),
  },
  {
    source: resolve(root, 'docs', 'cv', 'cv-en.html'),
    output: resolve(outputDirectory, 'CV-Vivien-Billot-EN.pdf'),
  },
];

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch(process.platform === 'win32' ? { channel: 'msedge' } : {});

try {
  for (const document of documents) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(document.source).href, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });

    const sheets = await page.locator('.sheet').count();
    if (sheets !== 2) {
      throw new Error(`${document.source} must contain exactly two CV pages; received ${sheets}.`);
    }

    await page.pdf({
      path: document.output,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
      outline: true,
    });
    await page.close();

    const contents = await readFile(document.output);
    const details = await stat(document.output);
    if (!contents.subarray(0, 4).equals(Buffer.from('%PDF')) || details.size < 20_000) {
      throw new Error(`${document.output} is not a valid generated PDF.`);
    }

    process.stdout.write(`Generated ${document.output} (${details.size} bytes)\n`);
  }
} finally {
  await browser.close();
}
