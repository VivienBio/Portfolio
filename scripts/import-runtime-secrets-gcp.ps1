[CmdletBinding()]
param(
  [string]$ProjectId = (gcloud config get-value project 2>$null),
  [string]$EnvFile = '.env.local',
  [string]$OpenAiSecretName = 'openai-api-key',
  [string]$ContactEndpointSecretName = 'contact-form-endpoint',
  [switch]$DeleteEnvFile
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

function Read-EnvValue {
  param(
    [Parameter(Mandatory = $true)][string[]]$Lines,
    [Parameter(Mandatory = $true)][string]$Name
  )

  $Line = $Lines |
    Where-Object { $_ -match "^\s*$([regex]::Escape($Name))\s*=" } |
    Select-Object -First 1

  if ([string]::IsNullOrWhiteSpace($Line)) {
    return $null
  }

  return ($Line -replace "^\s*$([regex]::Escape($Name))\s*=\s*", '').Trim().Trim('"').Trim("'")
}

function Add-SecretVersion {
  param(
    [Parameter(Mandatory = $true)][string]$Project,
    [Parameter(Mandatory = $true)][string]$Secret,
    [Parameter(Mandatory = $true)][string]$Value
  )

  if (-not (Test-GcloudResource -Arguments @('secrets', 'describe', $Secret, "--project=$Project"))) {
    Invoke-Gcloud -Arguments @(
      'secrets',
      'create',
      $Secret,
      '--replication-policy',
      'automatic',
      "--project=$Project"
    )
  }

  $Value | & gcloud secrets versions add $Secret "--project=$Project" '--data-file=-'
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to add a new version to Secret Manager secret '$Secret'."
  }
}

if ([string]::IsNullOrWhiteSpace($ProjectId)) {
  throw 'ProjectId is required. Run gcloud config set project <project-id> or pass -ProjectId.'
}

$ProjectId = $ProjectId.Trim()
$EnvPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $EnvFile))

if (-not (Test-Path -LiteralPath $EnvPath)) {
  throw "Environment file not found: $EnvPath"
}

$EnvLines = Get-Content -LiteralPath $EnvPath
$OpenAiApiKey = Read-EnvValue -Lines $EnvLines -Name 'OPENAI_API_KEY'
$ContactFormEndpoint = Read-EnvValue -Lines $EnvLines -Name 'CONTACT_FORM_ENDPOINT'

if ([string]::IsNullOrWhiteSpace($OpenAiApiKey)) {
  throw "OPENAI_API_KEY was not found in $EnvPath."
}
if ([string]::IsNullOrWhiteSpace($ContactFormEndpoint)) {
  throw "CONTACT_FORM_ENDPOINT was not found in $EnvPath."
}
$ContactEndpointUri = $null
if (-not ([System.Uri]::TryCreate($ContactFormEndpoint, [System.UriKind]::Absolute, [ref]$ContactEndpointUri))) {
  throw 'CONTACT_FORM_ENDPOINT must be an absolute HTTPS URL.'
}
if ($ContactEndpointUri.Scheme -ne 'https' -or $ContactEndpointUri.Host -ne 'formspree.io') {
  throw 'CONTACT_FORM_ENDPOINT must be an HTTPS formspree.io URL.'
}

$BillingEnabled = (& gcloud beta billing projects describe $ProjectId --format='value(billingEnabled)').Trim()
if ($LASTEXITCODE -ne 0) {
  throw 'Unable to read billing status for the selected project.'
}
if ($BillingEnabled -ne 'True' -and $BillingEnabled -ne 'true') {
  throw "Billing is not enabled for project '$ProjectId'. Secret Manager cannot be used until billing is enabled."
}

Invoke-Gcloud -Arguments @('services', 'enable', 'secretmanager.googleapis.com', "--project=$ProjectId")

Add-SecretVersion -Project $ProjectId -Secret $OpenAiSecretName -Value $OpenAiApiKey
Add-SecretVersion -Project $ProjectId -Secret $ContactEndpointSecretName -Value $ContactFormEndpoint

if ($DeleteEnvFile) {
  $RemainingLines = $EnvLines |
    Where-Object { $_ -notmatch '^\s*OPENAI_API_KEY\s*=' } |
    Where-Object { $_ -notmatch '^\s*CONTACT_FORM_ENDPOINT\s*=' }
  $MeaningfulLines = @($RemainingLines | Where-Object { $_.Trim().Length -gt 0 })

  if ($MeaningfulLines.Count -eq 0) {
    Remove-Item -LiteralPath $EnvPath -Force
  } else {
    Set-Content -LiteralPath $EnvPath -Value $RemainingLines -Encoding utf8NoBOM
  }
}

[pscustomobject]@{
  ProjectId             = $ProjectId
  OpenAiSecret          = $OpenAiSecretName
  ContactEndpointSecret = $ContactEndpointSecretName
  VersionsAdded         = 2
  EnvFileDeleted        = [bool]($DeleteEnvFile -and -not (Test-Path -LiteralPath $EnvPath))
  PlaintextOutput       = $false
} | Format-List
