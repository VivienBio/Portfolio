[CmdletBinding()]
param(
  [string]$ProjectId = (gcloud config get-value project 2>$null),
  [string]$Region = 'europe-west1',
  [string]$Service = 'portfolio',
  [Parameter(Mandatory = $true)][string]$Domain
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
$Domain = $Domain.Trim().ToLowerInvariant()
$BaseDomain = ($Domain -split '\.')[-2..-1] -join '.'

Invoke-Gcloud -Arguments @('config', 'set', 'project', $ProjectId)

if (-not (Test-GcloudResource -Arguments @('run', 'services', 'describe', $Service, '--region', $Region, "--project=$ProjectId"))) {
  throw "Cloud Run service '$Service' does not exist yet in $Region. Deploy the portfolio first, then map the domain."
}

$VerifiedDomains = & gcloud domains list-user-verified --format='value(id)'
if ($LASTEXITCODE -ne 0) {
  throw 'Unable to list verified domains.'
}

if ($VerifiedDomains -notcontains $BaseDomain) {
  Write-Host "Domain ownership is not verified yet for $BaseDomain."
  Write-Host "A browser will open for Google Search Console verification."
  Invoke-Gcloud -Arguments @('domains', 'verify', $BaseDomain)
  Write-Host "After verification is complete, rerun this script."
  exit 0
}

if (-not (Test-GcloudResource -Arguments @('beta', 'run', 'domain-mappings', 'describe', '--domain', $Domain, '--region', $Region, "--project=$ProjectId"))) {
  Invoke-Gcloud -Arguments @(
    'beta',
    'run',
    'domain-mappings',
    'create',
    '--service',
    $Service,
    '--domain',
    $Domain,
    '--region',
    $Region,
    "--project=$ProjectId"
  )
}

Write-Host ''
Write-Host "Add these DNS records at your domain registrar:"
Invoke-Gcloud -Arguments @(
  'beta',
  'run',
  'domain-mappings',
  'describe',
  '--domain',
  $Domain,
  '--region',
  $Region,
  "--project=$ProjectId",
  '--format',
  'table(status.resourceRecords.type,status.resourceRecords.name,status.resourceRecords.rrdata)'
)

Write-Host ''
Write-Host "Once DNS propagates, test: https://$Domain"
