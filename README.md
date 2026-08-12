# Portfolio — Vivien Billot

[![CI](https://github.com/VivienBio/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/VivienBio/Portfolio/actions/workflows/ci.yml)
[![Angular](https://img.shields.io/badge/Angular-22-c3002f)](https://angular.dev/)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org/)
[![WCAG AA](https://img.shields.io/badge/accessibility-WCAG_AA-176b45)](https://www.w3.org/WAI/WCAG2AA-Conformance)

Portfolio Angular SSR déployable sur Google Cloud Run, enrichi d’un double numérique IA strictement limité au profil professionnel de Vivien.

## Commandes

```bash
npm ci
npm start
npm run test:ci
npm run build
npm run check
```

La suite couvre le domaine, le contrat des données, l'immutabilité profonde, la persistance du thème, le rendu sémantique, les invariants d'accessibilité, la sécurité des liens, les routes lazy, les garde-fous IA et le health check Cloud Run.

| Niveau        | Preuves automatisées                                         |
| ------------- | ------------------------------------------------------------ |
| Domaine       | Immutabilité récursive et gestion des graphes cycliques      |
| Données       | Agrégat complet, identifiants uniques et contenu non vide    |
| UX            | Thème appliqué, persisté, restauré et compatible SSR         |
| Présentation  | Contenu métier, études de cas et structure sémantique        |
| Accessibilité | Landmarks, skip link, noms accessibles et IDs uniques        |
| Sécurité      | Liens HTTPS externes protégés par `noopener noreferrer`      |
| IA            | Périmètre, prompt injection, coordonnées et limite de saisie |
| Contact       | Validation, confirmation explicite et honeypot               |
| Architecture  | Route principale lazy-loadée et fallback contrôlé            |
| Exploitation  | Endpoint Cloud Run `/healthz` testé sur un vrai serveur HTTP |

## Déploiement

Le pipeline GitHub Actions valide le formatage et TypeScript, audite les dépendances, exécute les tests, construit une image Docker multi-stage avec SBOM et provenance, puis déploie une révision immuable sur Cloud Run via Artifact Registry.

L'authentification GCP repose sur Workload Identity Federation, sans clé de compte de service persistante. La clé OpenAI reste dans Secret Manager et n’est injectée que dans le runtime Cloud Run. La procédure complète se trouve dans [docs/gcp-deployment.md](docs/gcp-deployment.md).

Un budget mensuel GCP de 5 € est connecté à un kill switch Pub/Sub + Cloud Run Function : si le coût réel du projet atteint le budget, la facturation du projet est désassociée pour stopper les services payants.

Commandes principales après activation du billing GCP :

```powershell
.\scripts\bootstrap-gcp.ps1 -ProjectId "portfolio-505218" -ConfigureGitHubVariables
.\scripts\import-runtime-secrets-gcp.ps1 -ProjectId "portfolio-505218" -DeleteEnvFile
```

## Architecture applicative

Le projet sépare le domaine, les ports applicatifs, les cas d’usage, les adaptateurs d'infrastructure et les composants de présentation. La page principale est chargée paresseusement et rendue côté serveur. Les appels OpenAI et contact restent côté serveur ; aucune clé ni endpoint sensible n’est exposé dans Angular.

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
