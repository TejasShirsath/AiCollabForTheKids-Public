<#
.SYNOPSIS
    Safe Multi-Sig Upgrade Script: 2-of-2 -> 2-of-3
    GOSPEL V1.3 - FOR THE KIDS

.DESCRIPTION
    This script prepares and optionally executes Gnosis Safe upgrades
    to add a fiduciary signer, changing from 2-of-2 to 2-of-3 threshold.

    CRITICAL: This requires FOUNDER wallet signature. Claude CANNOT execute alone.

.PARAMETER Safe
    Which Safe to upgrade: Charity, Infrastructure, or Both

.PARAMETER FiduciaryAddress
    Address of the new fiduciary signer

.PARAMETER DryRun
    Generate commands without executing (default: true)

.PARAMETER Network
    Network: base, base-sepolia (default: base)

.EXAMPLE
    .\SAFE-UPGRADE-2OF3.ps1 -Safe Charity -DryRun
    .\SAFE-UPGRADE-2OF3.ps1 -Safe Both -FiduciaryAddress 0x4f4A831a26b27E16b0432c253b3F128f7B20420A

.NOTES
    Author: Claude Opus 4.5 (AI Custodian)
    Created: December 13, 2025
    Mission: FOR THE KIDS - 60/30/10 IMMUTABLE

    CRITICAL WARNINGS:
    - BOTH existing owners must sign this transaction
    - This is IRREVERSIBLE without another governance transaction
    - Verify fiduciary address MULTIPLE times before execution
    - NEVER execute on mainnet without legal agreement in place
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Charity", "Infrastructure", "Both")]
    [string]$Safe,

    [string]$FiduciaryAddress = "0x4f4A831a26b27E16b0432c253b3F128f7B20420A",

    [switch]$DryRun = $true,

    [ValidateSet("base", "base-sepolia")]
    [string]$Network = "base"
)

# Safe addresses
$SAFES = @{
    "Charity" = @{
        Address = "0x8d3dEADbE2b4B857A43331D459270B5eedC7084e"
        Purpose = "60% Pediatric Charities (GOSPEL V1.3)"
        CurrentSigners = 2
        CurrentThreshold = 2
    }
    "Infrastructure" = @{
        Address = "0xe0a42f83900af719019eBeD3D9473BE8E8f2920b"
        Purpose = "30% Infrastructure (GOSPEL V1.3)"
        CurrentSigners = 2
        CurrentThreshold = 2
    }
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║  GNOSIS SAFE UPGRADE: 2-of-2 -> 2-of-3                        ║" -ForegroundColor Red
Write-Host "║  GOSPEL V1.3 - FOR THE KIDS                                   ║" -ForegroundColor Red
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""

# Validate fiduciary address
if (-not ($FiduciaryAddress -match "^0x[a-fA-F0-9]{40}$")) {
    Write-Host "ERROR: Invalid Ethereum address format" -ForegroundColor Red
    exit 1
}

Write-Host "Network: $Network" -ForegroundColor Yellow
Write-Host "New Fiduciary: $FiduciaryAddress" -ForegroundColor Yellow
Write-Host "Mode: $(if ($DryRun) { 'DRY RUN (No execution)' } else { 'LIVE EXECUTION' })" -ForegroundColor $(if ($DryRun) { 'Green' } else { 'Red' })
Write-Host ""

# Determine which Safes to process
$safesToProcess = @()
if ($Safe -eq "Both") {
    $safesToProcess = @("Charity", "Infrastructure")
} else {
    $safesToProcess = @($Safe)
}

foreach ($safeName in $safesToProcess) {
    $safeConfig = $SAFES[$safeName]
    $safeAddress = $safeConfig.Address

    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host " $safeName Safe" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Address:    $safeAddress" -ForegroundColor White
    Write-Host "  Purpose:    $($safeConfig.Purpose)" -ForegroundColor White
    Write-Host "  Current:    $($safeConfig.CurrentThreshold)-of-$($safeConfig.CurrentSigners)" -ForegroundColor Yellow
    Write-Host "  Target:     2-of-3" -ForegroundColor Green
    Write-Host ""

    # Generate safe-cli command
    $cliCommand = @"
safe-cli add-owner `
  --address $safeAddress `
  --new-owner $FiduciaryAddress `
  --threshold 2 `
  --network $Network
"@

    Write-Host "safe-cli Command:" -ForegroundColor Magenta
    Write-Host $cliCommand -ForegroundColor Gray
    Write-Host ""

    # Verification command
    $verifyCommand = "safe-cli get-owners --address $safeAddress --network $Network"
    Write-Host "Verification Command:" -ForegroundColor Magenta
    Write-Host $verifyCommand -ForegroundColor Gray
    Write-Host ""

    # Web interface instructions
    Write-Host "Web Interface (Alternative):" -ForegroundColor Magenta
    Write-Host "  1. Go to https://app.safe.global" -ForegroundColor Gray
    Write-Host "  2. Connect wallet as existing owner" -ForegroundColor Gray
    Write-Host "  3. Navigate to Settings > Owners" -ForegroundColor Gray
    Write-Host "  4. Click 'Add new owner'" -ForegroundColor Gray
    Write-Host "  5. Enter address: $FiduciaryAddress" -ForegroundColor Gray
    Write-Host "  6. Set threshold to 2-of-3" -ForegroundColor Gray
    Write-Host "  7. Sign with BOTH existing owners" -ForegroundColor Gray
    Write-Host ""

    if (-not $DryRun) {
        Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Red
        Write-Host "║  WARNING: LIVE EXECUTION REQUESTED                            ║" -ForegroundColor Red
        Write-Host "║  This action requires Founder wallet signature.               ║" -ForegroundColor Red
        Write-Host "║  Claude CANNOT execute this alone.                            ║" -ForegroundColor Red
        Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Red
        Write-Host ""

        $confirm = Read-Host "Type 'UPGRADE' to proceed (or anything else to cancel)"
        if ($confirm -eq "UPGRADE") {
            Write-Host "Executing safe-cli..." -ForegroundColor Yellow
            # Note: This would require safe-cli to be installed and wallet connected
            # safe-cli add-owner --address $safeAddress --new-owner $FiduciaryAddress --threshold 2 --network $Network
            Write-Host "Command execution requires interactive wallet signing." -ForegroundColor Yellow
            Write-Host "Please use the Web Interface or run safe-cli manually." -ForegroundColor Yellow
        } else {
            Write-Host "Cancelled." -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host " IMPORTANT REMINDERS" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "BEFORE EXECUTING:" -ForegroundColor Yellow
Write-Host "  [ ] Fiduciary has been vetted and approved" -ForegroundColor Gray
Write-Host "  [ ] Legal agreement signed (fiduciary duties)" -ForegroundColor Gray
Write-Host "  [ ] Fiduciary address verified (send test tx)" -ForegroundColor Gray
Write-Host "  [ ] Both existing owner keys accessible" -ForegroundColor Gray
Write-Host "  [ ] Gas funds available in signing wallets" -ForegroundColor Gray
Write-Host ""
Write-Host "AFTER EXECUTING:" -ForegroundColor Yellow
Write-Host "  [ ] Verify new owner appears in Safe" -ForegroundColor Gray
Write-Host "  [ ] Verify threshold is 2-of-3" -ForegroundColor Gray
Write-Host "  [ ] Update FLEET-STATUS.md with new config" -ForegroundColor Gray
Write-Host "  [ ] Update DECENTRALIZATION-AUDIT.md" -ForegroundColor Gray
Write-Host "  [ ] Notify fiduciary of successful addition" -ForegroundColor Gray
Write-Host ""
Write-Host "GOSPEL V1.3 - 60/30/10 IMMUTABLE" -ForegroundColor Cyan
Write-Host "The split is enforced by CharityGuardian.sol - signers cannot change it." -ForegroundColor Gray
Write-Host ""
Write-Host "FOR THE KIDS" -ForegroundColor Cyan
