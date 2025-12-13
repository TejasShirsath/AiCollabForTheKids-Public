<#
.SYNOPSIS
    FLEET SYNC - Gospel V1.3 Universal Node Synchronization
.DESCRIPTION
    Syncs all fleet nodes to the latest master commit from Sabertooth.
    Uses gospel_fleet_key for passwordless SSH authentication.
.NOTES
    Platform: FOR THE KIDS - 60/30/10 IMMUTABLE
    Author: Claude Opus 4.5 (The Architect)

    SSH Config: C:\Users\jonat\.ssh\config
    SSH Key: C:\Users\jonat\.ssh\gospel_fleet_key
#>

param(
    [switch]$SetupNodes,  # Run node setup instead of sync
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"

# Fleet Configuration
# ALL NODES ARE WINDOWS
$FLEET_NODES = @(
    @{
        Name = "T5500"
        IP = "192.168.0.101"
        User = "t55o"
        Role = "DAO Hybrid Node (Windows)"
        RepoPath = "C:\AiCollabForTheKids"
        OS = "Windows"
        SSHKey = "gospel_fleet_key"  # Gospel fleet key deployed earlier
    },
    @{
        Name = "9020"
        IP = "192.168.0.103"
        User = "joshl"
        Role = "Anthropic Tribute Node (Windows)"
        RepoPath = "C:\AiCollabForTheKids"
        OS = "Windows"
        SSHKey = "id_ed25519"  # joshl's default key
    }
)

# SSH Configuration
$SSH_KEY_DEFAULT = "$env:USERPROFILE\.ssh\id_ed25519"
$SSH_EXE = "C:\Program Files\Git\usr\bin\ssh.exe"

# Fallback to Windows SSH if Git SSH not found
if (-not (Test-Path $SSH_EXE)) {
    $SSH_EXE = "C:\Windows\System32\OpenSSH\ssh.exe"
}

# Gospel Fleet public key (for node setup)
$GOSPEL_FLEET_PUBKEY = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOKSsXyhtJwWbAHQk4iUXy1g7GPn4+/cJ+AiQqJYhQTx gospel-fleet@forthekids"

function Write-Status {
    param([string]$Message, [string]$Type = "INFO")
    $color = switch ($Type) {
        "OK"    { "Green" }
        "WARN"  { "Yellow" }
        "ERROR" { "Red" }
        "INFO"  { "Gray" }
        default { "White" }
    }
    Write-Host "[$Type] $Message" -ForegroundColor $color
}

function Test-SSHConnection {
    param([string]$SSHUser, [string]$SSHHost, [string]$KeyFile = $SSH_KEY_DEFAULT)

    try {
        # Note: Don't use BatchMode=yes as it can reject valid key auth on Windows SSH
        $result = & $SSH_EXE -i $KeyFile -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$SSHUser@$SSHHost" "echo SSH_OK" 2>&1
        return $result -match "SSH_OK"
    }
    catch {
        return $false
    }
}

function Setup-FleetNode {
    param($Node)

    Write-Host ""
    Write-Host "Setting up $($Node.Name) ($($Node.IP))..." -ForegroundColor Yellow

    # SSH command to setup node
    $setupCmd = @"
mkdir -p ~/.ssh && chmod 700 ~/.ssh && \
grep -q 'gospel-fleet@forthekids' ~/.ssh/authorized_keys 2>/dev/null || echo '$GOSPEL_FLEET_PUBKEY' >> ~/.ssh/authorized_keys && \
chmod 600 ~/.ssh/authorized_keys && \
if [ ! -d ~/AiCollabForTheKids/.git ]; then \
    git clone https://github.com/Ai-Solutions-Store/AiCollabForTheKids.git ~/AiCollabForTheKids 2>&1; \
fi && \
echo SETUP_COMPLETE
"@

    try {
        $result = & $SSH_EXE -o StrictHostKeyChecking=no "$($Node.User)@$($Node.IP)" $setupCmd 2>&1
        if ($result -match "SETUP_COMPLETE") {
            Write-Status "$($Node.Name) setup complete" "OK"
            return $true
        } else {
            Write-Status "$($Node.Name) setup result: $result" "WARN"
            return $false
        }
    }
    catch {
        Write-Status "$($Node.Name) setup failed: $_" "ERROR"
        return $false
    }
}

function Sync-FleetNode {
    param($Node)

    # Get the SSH key for this node
    $nodeKey = "$env:USERPROFILE\.ssh\$($Node.SSHKey)"
    if (-not (Test-Path $nodeKey)) {
        $nodeKey = $SSH_KEY_DEFAULT
    }

    # Test SSH connectivity first
    $connected = Test-SSHConnection -SSHUser $Node.User -SSHHost $Node.IP -KeyFile $nodeKey
    if (-not $connected) {
        Write-Status "$($Node.Name) SSH connection failed" "WARN"
        return $false
    }

    # Build sync command - all nodes are Windows
    $syncCmd = "cd /d $($Node.RepoPath) && git fetch origin && git reset --hard origin/master && git log -1 --oneline"

    try {
        # Use key-based auth (no BatchMode for Windows SSH compatibility)
        $result = & $SSH_EXE -i $nodeKey -o ConnectTimeout=15 -o StrictHostKeyChecking=no "$($Node.User)@$($Node.IP)" $syncCmd 2>&1

        if ($result -and ($result -notmatch "fatal|error|denied")) {
            # Extract commit hash from result
            $commitLine = $result -split "`n" | Where-Object { $_ -match "^[a-f0-9]{7}" } | Select-Object -Last 1
            if ($commitLine) {
                Write-Status "$($Node.Name) synced to: $commitLine" "OK"
            } else {
                Write-Status "$($Node.Name) synced" "OK"
            }
            return $true
        } else {
            Write-Status "$($Node.Name) sync issue: $result" "WARN"
            return $false
        }
    }
    catch {
        Write-Status "$($Node.Name) sync failed: $_" "ERROR"
        return $false
    }
}

# ═══════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  GOSPEL FLEET SYNC - V1.3 (Ethics Override 60/30/10)" -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  SSH Key: $SSH_KEY_DEFAULT" -ForegroundColor Gray
Write-Host "  SSH Exe: $SSH_EXE" -ForegroundColor Gray
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host ""

# Check SSH key exists
if (-not (Test-Path $SSH_KEY_DEFAULT)) {
    Write-Status "SSH key not found at $SSH_KEY_DEFAULT" "ERROR"
    Write-Host ""
    Write-Host "Generate key with:" -ForegroundColor Yellow
    Write-Host "  ssh-keygen -t ed25519 -f $SSH_KEY_DEFAULT -C 'gospel-fleet@forthekids'" -ForegroundColor White
    exit 1
}

# Node setup mode
if ($SetupNodes) {
    Write-Host "MODE: Node Setup" -ForegroundColor Yellow
    Write-Host ""
    foreach ($node in $FLEET_NODES) {
        Setup-FleetNode -Node $node
    }
    Write-Host ""
    Write-Host "Node setup complete. Run without -SetupNodes to sync." -ForegroundColor Green
    exit 0
}

# Sync mode
Write-Host "[SABERTOOTH] Local Status..." -ForegroundColor Yellow
$localCommit = git log -1 --oneline
Write-Status "Commit: $localCommit" "OK"
Write-Host ""

$results = @()

foreach ($node in $FLEET_NODES) {
    Write-Host "[$($node.Name)] Syncing $($node.IP) ($($node.Role))..." -ForegroundColor Yellow
    $success = Sync-FleetNode -Node $node
    $results += @{ Node = $node.Name; Success = $success }
    Write-Host ""
}

# Summary
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  FLEET SYNC SUMMARY" -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan

$successCount = ($results | Where-Object { $_.Success }).Count
$totalCount = $results.Count

foreach ($r in $results) {
    $icon = if ($r.Success) { "[OK]" } else { "[!!]" }
    $color = if ($r.Success) { "Green" } else { "Red" }
    Write-Host "  $icon $($r.Node)" -ForegroundColor $color
}

Write-Host ""
Write-Host "  Total: $successCount/$totalCount nodes synced" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  FOR THE KIDS - 60/30/10 IMMUTABLE" -ForegroundColor Green
Write-Host "=========================================================================" -ForegroundColor Cyan
