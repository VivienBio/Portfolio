[CmdletBinding()]
param(
  [string]$ProjectId = (gcloud config get-value project 2>$null),
  [string]$Region = 'europe-west1',
  [string]$GithubRepository = 'VivienBio/Portfolio',
  [string]$ArtifactRepository = 'portfolio',
  [string]$CloudRunService = 'portfolio',
  [string]$DeployServiceAccountId = 'github-portfolio-deployer',
  [string]$RuntimeServiceAccountId = 'portfolio-runtime',
  [string]$WorkloadPool = 'github-actions',
  [string]$WorkloadProvider = 'github-portfolio',
  [string]$OpenAiSecretName = 'openai-api-key',
  [string]$ContactEndpointSecretName = 'contact-form-endpoint',
  [string]$OpenAiModel = 'gpt-5.6-terra',
  [switch]$ConfigureGitHubVariables
)

$ErrorActionPreference = 'Stop'

function Invoke-Gcloud {
  param([Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)][string[]]$Arguments)

  & gcloud @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "gcloud failed: $($Arguments -join ' ')"
  }
}

function Test-GcloudResource {
  param([Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)][string[]]$Arguments)

  $PreviousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    & gcloud @Arguments 1>$null 2>$null
    $ExitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $PreviousErrorActionPreference
  }

  return $ExitCode -eq 0
}

if ([string]::IsNullOrWhiteSpace($ProjectId)) {
  throw 'ProjectId is required. Run gcloud config set project <project-id> or pass -ProjectId.'
}

$ProjectId = $ProjectId.Trim()
$DeployEmail = "$DeployServiceAccountId@$ProjectId.iam.gserviceaccount.com"
$RuntimeEmail = "$RuntimeServiceAccountId@$ProjectId.iam.gserviceaccount.com"

Invoke-Gcloud -Arguments @('config', 'set', 'project', $ProjectId)

$BillingEnabled = (& gcloud beta billing projects describe $ProjectId --format='value(billingEnabled)').Trim()
if ($LASTEXITCODE -ne 0) {
  throw 'Unable to read billing status for the selected project.'
}
if ($BillingEnabled -ne 'True' -and $BillingEnabled -ne 'true') {
  throw "Billing is not enabled for project '$ProjectId'. Enable billing in Google Cloud Console, then rerun this script."
}

$RequiredApis = @(
  'run.googleapis.com',
  'artifactregistry.googleapis.com',
  'iamcredentials.googleapis.com',
  'sts.googleapis.com',
  'secretmanager.googleapis.com'
)
$EnableApiArguments = @('services', 'enable') + $RequiredApis + @("--project=$ProjectId")
Invoke-Gcloud -Arguments $EnableApiArguments

if (-not (Test-GcloudResource -Arguments @('artifacts', 'repositories', 'describe', $ArtifactRepository, '--location', $Region, "--project=$ProjectId"))) {
  Invoke-Gcloud -Arguments @(
    'artifacts', 'repositories', 'create', $ArtifactRepository,
    '--repository-format', 'docker',
    '--location', $Region,
    '--description', 'Images du portfolio',
    "--project=$ProjectId"
  )
}

$DeployServiceAccountResource = "projects/$ProjectId/serviceAccounts/$DeployEmail"
if (-not (Test-GcloudResource -Arguments @('iam', 'service-accounts', 'describe', $DeployServiceAccountResource, "--project=$ProjectId"))) {
  Invoke-Gcloud -Arguments @(
    'iam', 'service-accounts', 'create', $DeployServiceAccountId,
    '--display-name', 'GitHub Portfolio Deployer',
    "--project=$ProjectId"
  )
}

$RuntimeServiceAccountResource = "projects/$ProjectId/serviceAccounts/$RuntimeEmail"
if (-not (Test-GcloudResource -Arguments @('iam', 'service-accounts', 'describe', $RuntimeServiceAccountResource, "--project=$ProjectId"))) {
  Invoke-Gcloud -Arguments @(
    'iam', 'service-accounts', 'create', $RuntimeServiceAccountId,
    '--display-name', 'Portfolio Cloud Run Runtime',
    "--project=$ProjectId"
  )
}

if (-not (Test-GcloudResource -Arguments @('secrets', 'describe', $OpenAiSecretName, "--project=$ProjectId"))) {
  Invoke-Gcloud -Arguments @(
    'secrets', 'create', $OpenAiSecretName,
    '--replication-policy', 'automatic',
    "--project=$ProjectId"
  )
}

if (-not (Test-GcloudResource -Arguments @('secrets', 'describe', $ContactEndpointSecretName, "--project=$ProjectId"))) {
  Invoke-Gcloud -Arguments @(
    'secrets', 'create', $ContactEndpointSecretName,
    '--replication-policy', 'automatic',
    "--project=$ProjectId"
  )
}

Invoke-Gcloud -Arguments @(
  'artifacts', 'repositories', 'add-iam-policy-binding', $ArtifactRepository,
  '--location', $Region,
  '--member', "serviceAccount:$DeployEmail",
  '--role', 'roles/artifactregistry.writer',
  "--project=$ProjectId"
)

Invoke-Gcloud -Arguments @(
  'projects', 'add-iam-policy-binding', $ProjectId,
  '--member', "serviceAccount:$DeployEmail",
  '--role', 'roles/run.admin'
)

Invoke-Gcloud -Arguments @(
  'iam', 'service-accounts', 'add-iam-policy-binding', $RuntimeEmail,
  '--member', "serviceAccount:$DeployEmail",
  '--role', 'roles/iam.serviceAccountUser',
  "--project=$ProjectId"
)

Invoke-Gcloud -Arguments @(
  'secrets', 'add-iam-policy-binding', $OpenAiSecretName,
  '--member', "serviceAccount:$RuntimeEmail",
  '--role', 'roles/secretmanager.secretAccessor',
  "--project=$ProjectId"
)

Invoke-Gcloud -Arguments @(
  'secrets', 'add-iam-policy-binding', $ContactEndpointSecretName,
  '--member', "serviceAccount:$RuntimeEmail",
  '--role', 'roles/secretmanager.secretAccessor',
  "--project=$ProjectId"
)

$ProjectNumber = (& gcloud projects describe $ProjectId --format='value(projectNumber)').Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($ProjectNumber)) {
  throw 'Unable to read the GCP project number.'
}

if (-not (Test-GcloudResource -Arguments @('iam', 'workload-identity-pools', 'describe', $WorkloadPool, '--location', 'global', "--project=$ProjectId"))) {
  Invoke-Gcloud -Arguments @(
    'iam', 'workload-identity-pools', 'create', $WorkloadPool,
    '--location', 'global',
    '--display-name', 'GitHub Actions',
    "--project=$ProjectId"
  )
}

if (-not (Test-GcloudResource -Arguments @('iam', 'workload-identity-pools', 'providers', 'describe', $WorkloadProvider, '--location', 'global', '--workload-identity-pool', $WorkloadPool, "--project=$ProjectId"))) {
  Invoke-Gcloud -Arguments @(
    'iam', 'workload-identity-pools', 'providers', 'create-oidc', $WorkloadProvider,
    '--location', 'global',
    '--workload-identity-pool', $WorkloadPool,
    '--display-name', 'Portfolio GitHub',
    '--issuer-uri', 'https://token.actions.githubusercontent.com',
    '--attribute-mapping', 'google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref',
    '--attribute-condition', "assertion.repository=='$GithubRepository' && assertion.ref=='refs/heads/main'",
    "--project=$ProjectId"
  )
}

$WorkloadIdentityProvider = "projects/$ProjectNumber/locations/global/workloadIdentityPools/$WorkloadPool/providers/$WorkloadProvider"
$WorkloadIdentityMember = "principalSet://iam.googleapis.com/projects/$ProjectNumber/locations/global/workloadIdentityPools/$WorkloadPool/attribute.repository/$GithubRepository"

Invoke-Gcloud -Arguments @(
  'iam', 'service-accounts', 'add-iam-policy-binding', $DeployEmail,
  '--role', 'roles/iam.workloadIdentityUser',
  '--member', $WorkloadIdentityMember,
  "--project=$ProjectId"
)

if ($ConfigureGitHubVariables) {
  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'GitHub CLI is required to configure repository variables automatically.'
  }

  & gh auth status --hostname github.com *> $null
  if ($LASTEXITCODE -ne 0) {
    throw 'GitHub CLI is not authenticated. Run gh auth login, then rerun this script.'
  }

  & gh api --method PUT "repos/$GithubRepository/environments/production" *> $null
  if ($LASTEXITCODE -ne 0) {
    throw 'Unable to create or update the GitHub production environment.'
  }

  $Variables = [ordered]@{
    GCP_PROJECT_ID                 = $ProjectId
    GCP_REGION                     = $Region
    GCP_ARTIFACT_REPOSITORY        = $ArtifactRepository
    GCP_CLOUD_RUN_SERVICE          = $CloudRunService
    GCP_DEPLOY_SERVICE_ACCOUNT     = $DeployEmail
    GCP_RUNTIME_SERVICE_ACCOUNT    = $RuntimeEmail
    GCP_WORKLOAD_IDENTITY_PROVIDER = $WorkloadIdentityProvider
    OPENAI_MODEL                   = $OpenAiModel
  }

  foreach ($Variable in $Variables.GetEnumerator()) {
    & gh variable set $Variable.Key --repo $GithubRepository --body $Variable.Value *> $null
    if ($LASTEXITCODE -ne 0) {
      throw "Unable to set GitHub variable $($Variable.Key)."
    }
  }
}

[pscustomobject]@{
  ProjectId                = $ProjectId
  Region                   = $Region
  ArtifactRepository       = $ArtifactRepository
  CloudRunService          = $CloudRunService
  DeployServiceAccount     = $DeployEmail
  RuntimeServiceAccount    = $RuntimeEmail
  WorkloadIdentityProvider = $WorkloadIdentityProvider
  OpenAiSecret             = $OpenAiSecretName
  ContactEndpointSecret    = $ContactEndpointSecretName
  GitHubVariablesUpdated   = [bool]$ConfigureGitHubVariables
} | Format-List
