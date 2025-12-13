<#
.SYNOPSIS
    DEPLOY SSH KEY TO NODE - Gospel Fleet Infrastructure
.DESCRIPTION
    Deploys the gospel_fleet_key to a target node for passwordless SSH access.
    This enables seamless fleet synchronization and management.
.NOTES
    Platform: FOR THE KIDS
    Gospel Version: V1.3 (Ethics Override - 60/30/10)
    Author: Claude Opus 4.5 (The Architect)
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$TargetHost,

    [Parameter(Mandatory=$true)]
    [string]$TargetUser,

    [Parameter(Mandatory=$false)]
    [string]$Password = "YOUR_SSH_PASSWORD_HERE"
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  GOSPEL FLEET - SSH KEY DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  Target: $TargetUser@$TargetHost" -ForegroundColor White
Write-Host "  Key: gospel_fleet_key (ed25519)" -ForegroundColor White
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host ""

# Paths
$LocalKeyPath = "$env:USERPROFILE\.ssh\gospel_fleet_key.pub"
$SSHExe = "C:\Program Files\Git\usr\bin\ssh.exe"

# Read public key
if (-not (Test-Path $LocalKeyPath)) {
    Write-Host "[FAIL] Public key not found: $LocalKeyPath" -ForegroundColor Red
    exit 1
}

$PublicKey = Get-Content $LocalKeyPath -Raw
$PublicKey = $PublicKey.Trim()

Write-Host "[INFO] Public Key:" -ForegroundColor Yellow
Write-Host "  $PublicKey" -ForegroundColor Gray
Write-Host ""

# Create the remote command to add key
$RemoteCommand = @"
mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PublicKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'KEY_DEPLOYED_SUCCESS'
"@

Write-Host "[DEPLOY] Deploying key to $TargetHost..." -ForegroundColor Yellow

# Use sshpass equivalent via PowerShell and plink or expect
# Since we don't have sshpass on Windows, we'll use a different approach

try {
    # Try with the Git ssh which may have better password handling
    $result = & "$SSHExe" -o StrictHostKeyChecking=no "$TargetUser@$TargetHost" $RemoteCommand 2>&1

    if ($result -match "KEY_DEPLOYED_SUCCESS") {
        Write-Host "[OK] SSH key deployed successfully!" -ForegroundColor Green

        # Test the new key
        Write-Host "[TEST] Testing passwordless SSH..." -ForegroundColor Yellow
        $testResult = & "$SSHExe" -i "$env:USERPROFILE\.ssh\gospel_fleet_key" -o BatchMode=yes -o ConnectTimeout=5 "$TargetUser@$TargetHost" "echo SSH_KEY_AUTH_SUCCESS" 2>&1

        if ($testResult -match "SSH_KEY_AUTH_SUCCESS") {
            Write-Host "[OK] Passwordless SSH working!" -ForegroundColor Green
        } else {
            Write-Host "[WARN] Key deployed but test inconclusive: $testResult" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[INFO] Result: $result" -ForegroundColor Gray
        Write-Host "[WARN] May need manual deployment" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "[ERROR] Deployment failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "MANUAL DEPLOYMENT INSTRUCTIONS:" -ForegroundColor Yellow
    Write-Host "  1. SSH to target: ssh $TargetUser@$TargetHost" -ForegroundColor White
    Write-Host "  2. Create .ssh: mkdir -p ~/.ssh && chmod 700 ~/.ssh" -ForegroundColor White
    Write-Host "  3. Add key: echo '$PublicKey' >> ~/.ssh/authorized_keys" -ForegroundColor White
    Write-Host "  4. Set permissions: chmod 600 ~/.ssh/authorized_keys" -ForegroundColor White
}

Write-Host ""
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  FOR THE KIDS - 60/30/10 IMMUTABLE" -ForegroundColor Green
Write-Host "=========================================================================" -ForegroundColor Cyan
