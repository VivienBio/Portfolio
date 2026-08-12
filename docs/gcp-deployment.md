# Déploiement GCP sécurisé

Le portfolio se déploie sur Cloud Run via GitHub Actions, sans clé JSON GCP et sans secret dans GitHub.

Architecture cible :

`GitHub Actions → Workload Identity Federation → Artifact Registry → Cloud Run → Secret Manager`

## Ce qui doit fonctionner en production

- Site Angular SSR servi par Cloud Run.
- Téléchargement des CV PDF français et anglais depuis `/assets`.
- Chatbot IA via `OPENAI_API_KEY` monté depuis Secret Manager.
- Formulaire de contact côté serveur via `CONTACT_FORM_ENDPOINT`, monté depuis Secret Manager.
- Smoke tests post-déploiement sur `/healthz`, les deux PDF et `/api/assistant`.
- Test réel du formulaire contact activable à la demande sur lancement manuel du workflow.

## Pré-requis bloquant : billing GCP

Cloud Run, Artifact Registry et Secret Manager nécessitent un projet avec facturation active.

Un garde-fou coût est configuré sur le projet :

- Budget mensuel : `Portfolio - garde-fou 5 EUR`.
- Montant : `5 EUR`.
- Alertes : 50 %, 80 %, 100 % et prévision 100 %.
- Kill switch : `portfolio-budget-kill-switch`.
- Déclenchement : notification Pub/Sub du budget vers `portfolio-budget-kill-switch`.
- Action : désassociation du compte de facturation du projet si `costAmount >= budgetAmount`.

Le projet actuellement configuré localement est :

```powershell
gcloud config get-value project
```

Si `scripts/bootstrap-gcp.ps1` indique que la facturation est désactivée, activer le billing dans Google Cloud Console avant de relancer le script. Le script ne lie pas de compte de facturation automatiquement, car cette action peut générer des coûts.

Pour vérifier le garde-fou :

```powershell
gcloud billing budgets list --billing-account=01133F-FF9B56-CB2F9F

gcloud functions describe portfolio-budget-kill-switch `
  --gen2 `
  --region=europe-west1 `
  --project=portfolio-505218
```

Si le budget est atteint, le portfolio peut devenir indisponible, car la facturation du projet est volontairement coupée. Pour réactiver après analyse :

```powershell
gcloud beta billing projects link portfolio-505218 `
  --billing-account=01133F-FF9B56-CB2F9F
```

## 1. Créer les ressources GCP sans secret

Lancer le bootstrap GCP :

```powershell
.\scripts\bootstrap-gcp.ps1 `
  -ProjectId "portfolio-505218" `
  -Region "europe-west1" `
  -GithubRepository "VivienBio/Portfolio" `
  -ConfigureGitHubVariables
```

Le script est idempotent. Il crée ou vérifie :

- APIs nécessaires : Cloud Run, Artifact Registry, IAM Credentials, STS, Secret Manager.
- Artifact Registry `portfolio`.
- Service account de déploiement `github-portfolio-deployer`.
- Service account runtime `portfolio-runtime`.
- Secret Manager `openai-api-key`.
- Secret Manager `contact-form-endpoint`.
- Workload Identity Pool/Provider limité au dépôt `VivienBio/Portfolio` et à `refs/heads/main`.
- Variables GitHub nécessaires au workflow.

Aucune clé GCP n’est créée.

## 2. Importer les secrets runtime dans Secret Manager

La clé OpenAI est créée via le flux Codex/OpenAI Platform et écrite temporairement dans `.env.local`, ignoré par Git. Ajouter aussi l’endpoint Formspree relié à `billot.vivien@gmail.com` :

```dotenv
OPENAI_API_KEY=...
CONTACT_FORM_ENDPOINT=https://formspree.io/f/votre-formulaire
```

Après activation du billing, importer les deux secrets puis supprimer la copie locale :

```powershell
.\scripts\import-runtime-secrets-gcp.ps1 `
  -ProjectId "portfolio-505218" `
  -EnvFile ".env.local" `
  -DeleteEnvFile
```

Le script n’affiche jamais les valeurs. Il ajoute une version aux secrets `openai-api-key` et `contact-form-endpoint`, puis supprime `.env.local` si le fichier ne contenait que ces variables.

## 3. Variables GitHub attendues

Le workflow lit ces variables via `vars.*` :

| Variable                         | Exemple                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `GCP_PROJECT_ID`                 | `portfolio-505218`                                                                                   |
| `GCP_REGION`                     | `europe-west1`                                                                                       |
| `GCP_ARTIFACT_REPOSITORY`        | `portfolio`                                                                                          |
| `GCP_CLOUD_RUN_SERVICE`          | `portfolio`                                                                                          |
| `GCP_DEPLOY_SERVICE_ACCOUNT`     | `github-portfolio-deployer@portfolio-505218.iam.gserviceaccount.com`                                 |
| `GCP_RUNTIME_SERVICE_ACCOUNT`    | `portfolio-runtime@portfolio-505218.iam.gserviceaccount.com`                                         |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/<number>/locations/global/workloadIdentityPools/github-actions/providers/github-portfolio` |
| `OPENAI_MODEL`                   | `gpt-5.6-terra`                                                                                      |

`CONTACT_FORM_ENDPOINT` n’est pas une variable GitHub : il est monté depuis le secret GCP `contact-form-endpoint`. Angular ne l’expose pas au navigateur.

## 4. Déploiement

Un push sur `main`, ou un lancement manuel du workflow **Deploy to GCP**, déclenche :

1. Audit npm production.
2. Génération CV FR/EN.
3. Typecheck strict.
4. Tests unitaires.
5. Build production.
6. Tests Playwright et AXE.
7. Build Docker avec provenance et SBOM.
8. Push Artifact Registry.
9. Déploiement Cloud Run avec `OPENAI_API_KEY` depuis Secret Manager.
10. Smoke tests `/healthz`, CV FR, CV EN, et assistant IA.

Pour tester aussi l’envoi email réel, lancer le workflow manuellement avec `run_contact_smoke_test=true`. Cela envoie un message de test via le formulaire contact.

## 5. Belle URL

Pour une URL propre, commencer simple avec un mapping Cloud Run direct :

```powershell
.\scripts\map-cloud-run-domain.ps1 `
  -ProjectId "portfolio-505218" `
  -Region "europe-west1" `
  -Service "portfolio" `
  -Domain "www.vivienbillot.dev"
```

Le script vérifie que le service Cloud Run existe, lance la vérification de propriété du domaine si nécessaire, crée le mapping et affiche les enregistrements DNS à ajouter chez le registrar.

Cloud Run émet ensuite un certificat HTTPS managé. La propagation DNS prend généralement quelques minutes, parfois plusieurs heures.

Pour un setup plus avancé, Google recommande un Load Balancer global. Pour un portfolio personnel, le mapping direct Cloud Run en `europe-west1` est le chemin le plus simple à opérer.

## 6. Sécurité

- Pas de `GOOGLE_CREDENTIALS`.
- Pas de clé JSON de service account.
- `id-token: write` limité au workflow de déploiement.
- Workload Identity limité au dépôt et à la branche `main`.
- Secret OpenAI uniquement dans Secret Manager.
- Endpoint de contact uniquement dans Secret Manager.
- Service account runtime séparé du service account deploy.
- Application démarrée en utilisateur non-root dans Docker.
- Cloud Run refuse le démarrage production si `OPENAI_API_KEY` ou `CONTACT_FORM_ENDPOINT` manque.

## 7. Rollback

```powershell
gcloud run revisions list `
  --service=portfolio `
  --region=europe-west1 `
  --project=portfolio-505218

gcloud run services update-traffic portfolio `
  --region=europe-west1 `
  --project=portfolio-505218 `
  --to-revisions="REVISION=100"
```
