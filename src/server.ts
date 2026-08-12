import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { registerHealthCheck } from './app/core/infrastructure/health-check';
import { securityHeaders } from './app/core/infrastructure/security-headers';
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

app.use(securityHeaders);
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
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
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
  });
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
