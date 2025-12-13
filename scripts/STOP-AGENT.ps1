<#
.SYNOPSIS
    Stop a running AI agent
    GOSPEL V1.3 - FOR THE KIDS

.PARAMETER AgentType
    Type of agent to stop

.PARAMETER Port
    Port the agent is running on (optional, uses default if not specified)

.EXAMPLE
    .\STOP-AGENT.ps1 -AgentType fiduciary-search
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("merchant-compliance", "security-monitor", "treasury-audit", "content-moderation", "fiduciary-search")]
    [string]$AgentType,

    [int]$Port = 0
)

# Agent port mappings
$AGENT_PORTS = @{
    "merchant-compliance" = 3010
    "security-monitor"    = 3011
    "treasury-audit"      = 3012
    "content-moderation"  = 3013
    "fiduciary-search"    = 3014
}

if ($Port -eq 0) {
    $Port = $AGENT_PORTS[$AgentType]
}

Write-Host "Stopping $AgentType agent on port $Port..." -ForegroundColor Yellow

# Find process by port
$netstat = netstat -ano | Select-String ":$Port"
if ($netstat) {
    $lines = $netstat -split "`n"
    foreach ($line in $lines) {
        if ($line -match "LISTENING") {
            $parts = $line -split '\s+'
            $pid = $parts[-1]
            if ($pid -match '^\d+$') {
                Write-Host "Killing process $pid..." -ForegroundColor Red
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    }
    Write-Host "Agent stopped." -ForegroundColor Green
} else {
    Write-Host "No agent found running on port $Port" -ForegroundColor Yellow
}
