<#
.SYNOPSIS
    Check status of all AI agents
    GOSPEL V1.3 - FOR THE KIDS

.EXAMPLE
    .\AGENT-STATUS.ps1
#>

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AGENT STATUS - FOR THE KIDS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Agent configurations
$AGENTS = @(
    @{ Name = "Merchant Compliance"; Port = 3010; Dir = "merchant-compliance" }
    @{ Name = "Security Monitor";    Port = 3011; Dir = "security-monitor" }
    @{ Name = "Treasury Audit";      Port = 3012; Dir = "treasury-audit" }
    @{ Name = "Content Moderation";  Port = 3013; Dir = "content-moderation" }
    @{ Name = "Fiduciary Search";    Port = 3014; Dir = "fiduciary-search" }
)

foreach ($agent in $AGENTS) {
    $port = $agent.Port
    $name = $agent.Name
    $dir = $agent.Dir
    $agentPath = "C:\AiCollabForTheKids\agents\$dir"

    # Check if scaffolded
    $scaffolded = Test-Path "$agentPath\package.json"

    # Check if running
    $running = $false
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$port/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $running = $true
        }
    } catch {
        $running = $false
    }

    # Display status
    $scaffoldStatus = if ($scaffolded) { "[READY]" } else { "[NOT SCAFFOLDED]" }
    $runStatus = if ($running) { "[RUNNING]" } else { "[STOPPED]" }
    $scaffoldColor = if ($scaffolded) { "Green" } else { "Yellow" }
    $runColor = if ($running) { "Green" } else { "Gray" }

    Write-Host "$name (Port $port)" -ForegroundColor White
    Write-Host "  Scaffolded: " -NoNewline
    Write-Host $scaffoldStatus -ForegroundColor $scaffoldColor
    Write-Host "  Status:     " -NoNewline
    Write-Host $runStatus -ForegroundColor $runColor
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Commands:" -ForegroundColor Yellow
Write-Host "  Start:  .\SPAWN-AGENT.ps1 -AgentType <type>" -ForegroundColor Gray
Write-Host "  Stop:   .\STOP-AGENT.ps1 -AgentType <type>" -ForegroundColor Gray
Write-Host "  Health: curl http://127.0.0.1:<port>/health" -ForegroundColor Gray
Write-Host ""
Write-Host "FOR THE KIDS - 60/30/10 IMMUTABLE" -ForegroundColor Cyan
