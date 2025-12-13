<#
.SYNOPSIS
    Install GOSPEL SENTRY as Windows Scheduled Task
.DESCRIPTION
    Creates a scheduled task that runs the GOSPEL SENTRY health check
    every 15 minutes with highest privileges.
.NOTES
    GOSPEL RULE #11 - Emergency Override
    Run this script as Administrator to install the scheduled task.
#>

$TaskName = "GOSPEL_SENTRY_AUDIT"
$ScriptPath = "C:\AiCollabForTheKids\scripts\sentry\SENTRY-CRITICAL-ALERT.ps1"

Write-Host @"

╔═══════════════════════════════════════════════════════════════════════════════╗
║            GOSPEL SENTRY - SCHEDULED TASK INSTALLATION                         ║
║                    GOSPEL RULE #11 COMPLIANCE                                  ║
╚═══════════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "Task '$TaskName' already exists. Removing..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Create the scheduled task
Write-Host "Creating scheduled task: $TaskName" -ForegroundColor Cyan

# Define the action
$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`""

# Define the trigger (every 15 minutes)
$trigger = New-ScheduledTaskTrigger `
    -Once `
    -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Minutes 15) `
    -RepetitionDuration ([TimeSpan]::MaxValue)

# Define settings
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5)

# Define principal (run with highest privileges)
$principal = New-ScheduledTaskPrincipal `
    -UserId "SYSTEM" `
    -LogonType ServiceAccount `
    -RunLevel Highest

# Register the task
try {
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal `
        -Description "GOSPEL RULE #11: Critical system monitoring - FOR THE KIDS" `
        -ErrorAction Stop

    Write-Host "`nScheduled task created successfully!" -ForegroundColor Green
    Write-Host @"

TASK DETAILS:
  Name: $TaskName
  Schedule: Every 15 minutes
  Script: $ScriptPath
  Run Level: Highest Privileges (SYSTEM)

NEXT STEPS:
  1. Run: .\SENTRY-CRITICAL-ALERT.ps1 -Setup
     (Configure SMTP credentials for SMS alerts)

  2. Run: .\SENTRY-CRITICAL-ALERT.ps1 -Test
     (Send a test SMS to verify configuration)

  3. The task will automatically run every 15 minutes.

GOSPEL RULE #11 - EMERGENCY OVERRIDE: ACTIVE

"@ -ForegroundColor Cyan

} catch {
    Write-Host "Failed to create scheduled task: $_" -ForegroundColor Red
    exit 1
}
