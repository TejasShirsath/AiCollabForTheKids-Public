<#
.SYNOPSIS
    Spawn a persistent AI agent on T5500 or local node
    GOSPEL V1.3 - FOR THE KIDS

.DESCRIPTION
    This script spawns specialized AI agents that run as persistent services.
    Agents can be deployed locally or remotely via SSH.

.PARAMETER AgentType
    Type of agent to spawn:
    - merchant-compliance (Port 3010)
    - security-monitor (Port 3011)
    - treasury-audit (Port 3012)
    - content-moderation (Port 3013)
    - fiduciary-search (Port 3014)

.PARAMETER Node
    Target node: Local, T5500, Sabertooth, EC2
    Default: Local

.PARAMETER Port
    Custom port (overrides default)

.EXAMPLE
    .\SPAWN-AGENT.ps1 -AgentType fiduciary-search
    .\SPAWN-AGENT.ps1 -AgentType merchant-compliance -Node T5500

.NOTES
    Author: Claude Opus 4.5 (AI Custodian)
    Created: December 13, 2025
    Mission: FOR THE KIDS - 60/30/10 IMMUTABLE
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("merchant-compliance", "security-monitor", "treasury-audit", "content-moderation", "fiduciary-search")]
    [string]$AgentType,

    [ValidateSet("Local", "T5500", "Sabertooth", "EC2")]
    [string]$Node = "Local",

    [int]$Port = 0,

    [switch]$Background
)

# Agent port mappings
$AGENT_PORTS = @{
    "merchant-compliance" = 3010
    "security-monitor"    = 3011
    "treasury-audit"      = 3012
    "content-moderation"  = 3013
    "fiduciary-search"    = 3014
}

# Node IP mappings
$NODE_IPS = @{
    "Local"     = "127.0.0.1"
    "T5500"     = "192.168.0.101"
    "Sabertooth"= "192.168.0.104"
    "EC2"       = "3.84.226.108"
}

# Resolve port
if ($Port -eq 0) {
    $Port = $AGENT_PORTS[$AgentType]
}

$NodeIP = $NODE_IPS[$Node]
$AgentDir = "C:\AiCollabForTheKids\agents\$AgentType"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AGENT SPAWN - FOR THE KIDS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agent Type: $AgentType" -ForegroundColor Yellow
Write-Host "Target Node: $Node ($NodeIP)" -ForegroundColor Yellow
Write-Host "Port: $Port" -ForegroundColor Yellow
Write-Host "Directory: $AgentDir" -ForegroundColor Yellow
Write-Host ""

# Check if agent directory exists
if ($Node -eq "Local") {
    if (-not (Test-Path $AgentDir)) {
        Write-Host "ERROR: Agent directory not found: $AgentDir" -ForegroundColor Red
        Write-Host "Please ensure agent is scaffolded first." -ForegroundColor Red
        exit 1
    }

    # Check for package.json
    if (-not (Test-Path "$AgentDir\package.json")) {
        Write-Host "ERROR: package.json not found in $AgentDir" -ForegroundColor Red
        exit 1
    }

    # Install dependencies if needed
    if (-not (Test-Path "$AgentDir\node_modules")) {
        Write-Host "Installing dependencies..." -ForegroundColor Cyan
        Push-Location $AgentDir
        npm install
        Pop-Location
    }

    # Start agent
    Write-Host "Starting agent..." -ForegroundColor Green

    if ($Background) {
        # Start in background
        $process = Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory $AgentDir -WindowStyle Hidden -PassThru
        Write-Host "Agent started in background (PID: $($process.Id))" -ForegroundColor Green
    } else {
        # Start in foreground
        Push-Location $AgentDir
        $env:PORT = $Port
        node index.js
        Pop-Location
    }
}
elseif ($Node -eq "T5500") {
    # Remote spawn via SSH
    Write-Host "Spawning on remote node via SSH..." -ForegroundColor Cyan

    $sshCommand = @"
cd /c/AiCollabForTheKids/agents/$AgentType && npm install && PORT=$Port node index.js
"@

    # Use SSH (requires key-based auth configured)
    ssh t5500@$NodeIP $sshCommand
}
else {
    Write-Host "Remote spawn to $Node not yet implemented" -ForegroundColor Yellow
    Write-Host "Please SSH manually and run: cd $AgentDir && npm start" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Agent endpoint: http://${NodeIP}:${Port}" -ForegroundColor Green
Write-Host "  Health check:   curl http://${NodeIP}:${Port}/health" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "FOR THE KIDS - 60/30/10 IMMUTABLE" -ForegroundColor Cyan
