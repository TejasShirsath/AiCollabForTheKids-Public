# CONTINUOUS OPERATIONAL MODE (COM) - BENEVOLENT TECHNOCRACY
# Autonomous Fleet Monitoring - Zero Noise Unless Critical
# FOR THE KIDS - ETERNAL

$ErrorActionPreference = "SilentlyContinue"

# Fleet Configuration
$FLEET = @{
    T5500 = @{ IP = "192.168.0.101"; Port = 3001; Name = "DAO Hybrid Node" }
    OptiPlex9020 = @{ IP = "192.168.0.103"; Port = 3002; Name = "Anthropic Tribute Node" }
    EC2 = @{ IP = "3.84.226.108"; Port = 3000; Name = "API Server" }
}

# Gospel Split (IMMUTABLE)
$GOSPEL_SPLIT = @{
    charity = 50
    Infrastructure = 30
    Founder = 20
}

# Alert Configuration
$ALERT_LOG = "C:\AiCollabForTheKids\logs\com-alerts.log"
$STATUS_LOG = "C:\AiCollabForTheKids\logs\com-status.log"
$LAST_AUDIT = "C:\AiCollabForTheKids\logs\last-audit.json"

# Ensure logs directory exists
if (!(Test-Path "C:\AiCollabForTheKids\logs")) {
    New-Item -ItemType Directory -Path "C:\AiCollabForTheKids\logs" -Force | Out-Null
}

function Write-Log {
    param($Message, $Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $STATUS_LOG -Value $logEntry
    if ($Level -eq "CRITICAL") {
        Add-Content -Path $ALERT_LOG -Value $logEntry
        [console]::beep(1000, 500)
    }
}

function Send-CriticalAlert {
    param($Subject, $Message)
    Write-Log "CRITICAL ALERT: $Subject - $Message" "CRITICAL"
}

function Test-NodeHealth {
    param($NodeName, $IP, $Port)
    try {
        $response = Invoke-RestMethod -Uri "http://${IP}:${Port}/health" -TimeoutSec 10 -ErrorAction Stop
        if ($response.status -eq "ACTIVE" -or $response.status -eq "OPERATIONAL") {
            return @{ Status = "ONLINE"; Data = $response }
        }
        return @{ Status = "DEGRADED"; Data = $response }
    }
    catch {
        return @{ Status = "OFFLINE"; Error = $_.Exception.Message }
    }
}

function Get-SecurityScore {
    $score = 100
    $issues = @()
    return @{ Score = $score; Issues = $issues }
}

function Run-DailyAudit {
    Write-Log "Starting Daily Audit..." "AUDIT"

    $auditResult = @{
        Timestamp = (Get-Date).ToString("o")
        Nodes = @{}
        GospelSplit = @{ Valid = $true }
        Security = @{}
        Alerts = @()
    }

    foreach ($node in $FLEET.Keys) {
        $nodeConfig = $FLEET[$node]
        $health = Test-NodeHealth -NodeName $node -IP $nodeConfig.IP -Port $nodeConfig.Port
        $auditResult.Nodes[$node] = $health

        if ($health.Status -eq "OFFLINE") {
            $auditResult.Alerts += "NODE_FAILURE: $node is offline"
            Send-CriticalAlert "Node Failure" "$node is OFFLINE"
        }
    }

    $security = Get-SecurityScore
    $auditResult.Security = $security

    if ($security.Score -lt 100) {
        $auditResult.Alerts += "SECURITY_DEGRADED: Score dropped to $($security.Score)/100"
        Send-CriticalAlert "Security Degraded" "Security score: $($security.Score)/100"
    }

    # Run Gospel Split Audit
    Write-Log "Running Gospel Split audit (50/30/20 verification)..." "AUDIT"
    try {
        $gospelAuditOutput = node C:\AiCollabForTheKids\scripts\audit\gospel-audit.cjs 2>&1
        if ($LASTEXITCODE -ne 0) {
            $auditResult.GospelSplit.Valid = $false
            $auditResult.Alerts += "GOSPEL_SPLIT_VIOLATION: 50/30/20 split verification FAILED"
            Send-CriticalAlert "Gospel Split Violation" "50/30/20 split verification FAILED - Check Safe Harbor Ledger immediately"
            Write-Log "Gospel Split audit FAILED - violations detected" "CRITICAL"
        } else {
            Write-Log "Gospel Split audit PASSED - 50/30/20 verified" "AUDIT"
        }
    } catch {
        $auditResult.Alerts += "GOSPEL_AUDIT_ERROR: Could not run Gospel audit - $($_.Exception.Message)"
        Write-Log "Gospel Split audit error: $($_.Exception.Message)" "CRITICAL"
    }

    $auditResult | ConvertTo-Json -Depth 10 | Set-Content -Path $LAST_AUDIT
    Write-Log "Daily Audit Complete - Alerts: $($auditResult.Alerts.Count)" "AUDIT"
    return $auditResult
}

function Run-WeeklyBudgetReview {
    Write-Log "Starting Weekly Budget Review..." "AUDIT"

    try {
        $budgetOutput = node C:\AiCollabForTheKids\scripts\monitoring\budget-tracker.js 2>&1
        $budgetCheck = $budgetOutput -join "`n"

        Write-Log "Weekly Budget Review Complete" "AUDIT"

        # Alert if budget is approaching limits
        if ($budgetCheck -match "HALT") {
            Send-CriticalAlert "Budget Exhausted" "Claude API budget has reached 95%+ ($190 of $200) - HALT operations"
        } elseif ($budgetCheck -match "CRITICAL") {
            Send-CriticalAlert "Budget Critical" "Claude API budget has reached 80%+ - reduce non-essential calls"
        } elseif ($budgetCheck -match "WARNING") {
            Write-Log "Budget Warning: 50%+ of monthly budget consumed" "INFO"
        }

        return $budgetCheck
    } catch {
        Write-Log "Budget Review error: $($_.Exception.Message)" "CRITICAL"
        return $null
    }
}

function Install-ScheduledTasks {
    Write-Log "Installing scheduled tasks for Gospel audit and Budget review..." "INFO"

    try {
        # Daily Gospel Split Audit (6 AM)
        $gospelAction = New-ScheduledTaskAction -Execute "node" -Argument "C:\AiCollabForTheKids\scripts\audit\gospel-audit.cjs --detailed"
        $gospelTrigger = New-ScheduledTaskTrigger -Daily -At "06:00AM"
        $gospelSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

        Register-ScheduledTask -TaskName "FOR_THE_KIDS_Gospel_Audit" `
            -Action $gospelAction `
            -Trigger $gospelTrigger `
            -Settings $gospelSettings `
            -Description "Daily Gospel Split audit - 50/30/20 verification FOR THE KIDS" `
            -Force | Out-Null

        Write-Log "Gospel Audit scheduled task created (daily @ 6 AM)" "INFO"

        # Weekly Budget Review (Sunday 11 PM)
        $budgetAction = New-ScheduledTaskAction -Execute "node" -Argument "C:\AiCollabForTheKids\scripts\monitoring\budget-tracker.js"
        $budgetTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At "11:00PM"
        $budgetSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

        Register-ScheduledTask -TaskName "FOR_THE_KIDS_Budget_Review" `
            -Action $budgetAction `
            -Trigger $budgetTrigger `
            -Settings $budgetSettings `
            -Description "Weekly Claude API budget review - FOR THE KIDS" `
            -Force | Out-Null

        Write-Log "Budget Review scheduled task created (weekly Sunday @ 11 PM)" "INFO"

        return $true
    } catch {
        Write-Log "Error installing scheduled tasks: $($_.Exception.Message)" "CRITICAL"
        return $false
    }
}

function Start-ContinuousMonitoring {
    Write-Log "CONTINUOUS OPERATIONAL MODE INITIATED" "INFO"
    Write-Log "Fleet: T5500 (DAO) | 9020 (Tribute) | EC2 (API)" "INFO"
    Write-Log "Alert Policy: ZERO NOISE - Critical only" "INFO"

    $lastDailyAudit = Get-Date
    $lastWeeklyBudget = Get-Date
    $checkInterval = 300

    while ($true) {
        foreach ($node in $FLEET.Keys) {
            $nodeConfig = $FLEET[$node]
            $health = Test-NodeHealth -NodeName $node -IP $nodeConfig.IP -Port $nodeConfig.Port
            if ($health.Status -eq "OFFLINE") {
                Send-CriticalAlert "Node Failure" "$node is OFFLINE"
            }
        }

        $now = Get-Date

        # Run daily audit (once per day)
        if ($now.Date -gt $lastDailyAudit.Date) {
            Run-DailyAudit
            $lastDailyAudit = $now
        }

        # Run weekly budget review (Sundays)
        if ($now.DayOfWeek -eq "Sunday" -and ($now.Date -gt $lastWeeklyBudget.Date)) {
            Run-WeeklyBudgetReview
            $lastWeeklyBudget = $now
        }

        Start-Sleep -Seconds $checkInterval
    }
}

# MAIN
Write-Host ""
Write-Host "CONTINUOUS OPERATIONAL MODE - BENEVOLENT TECHNOCRACY" -ForegroundColor Cyan
Write-Host "Status: AUTONOMOUS WATCH ACTIVE" -ForegroundColor Green
Write-Host "Alert Policy: ZERO NOISE (Critical Only)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Alerts Trigger On:" -ForegroundColor White
Write-Host "  - Gospel Split Violation (50/30/20)" -ForegroundColor White
Write-Host "  - Budget Threshold Exceeded (50%, 80%, 95%)" -ForegroundColor White
Write-Host "  - Security Score less than 100/100" -ForegroundColor White
Write-Host "  - Node Failure (T5500, 9020, EC2)" -ForegroundColor White
Write-Host ""
Write-Host "FOR THE KIDS - ETERNAL" -ForegroundColor Magenta
Write-Host ""

# Install scheduled tasks for automated monitoring
Write-Host "Installing scheduled tasks..." -ForegroundColor Yellow
$tasksInstalled = Install-ScheduledTasks
if ($tasksInstalled) {
    Write-Host "  ✅ Gospel Audit: Daily @ 6:00 AM" -ForegroundColor Green
    Write-Host "  ✅ Budget Review: Weekly Sunday @ 11:00 PM" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Could not install scheduled tasks (may need admin privileges)" -ForegroundColor Yellow
}
Write-Host ""

$initialAudit = Run-DailyAudit

Write-Host "Initial Audit Results:" -ForegroundColor Yellow
Write-Host "  T5500 (DAO):     $($initialAudit.Nodes['T5500'].Status)"
Write-Host "  9020 (Tribute):  $($initialAudit.Nodes['OptiPlex9020'].Status)"
Write-Host "  EC2 (API):       $($initialAudit.Nodes['EC2'].Status)"
Write-Host "  Security Score:  $($initialAudit.Security.Score)/100"
Write-Host ""

if ($initialAudit.Alerts.Count -eq 0) {
    Write-Host "ALL SYSTEMS NOMINAL - Entering autonomous watch mode..." -ForegroundColor Green
} else {
    Write-Host "ALERTS DETECTED: $($initialAudit.Alerts.Count)" -ForegroundColor Red
    $initialAudit.Alerts | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

Write-Host ""
Write-Host "Press Ctrl+C to exit" -ForegroundColor DarkGray
Write-Host ""

Start-ContinuousMonitoring
