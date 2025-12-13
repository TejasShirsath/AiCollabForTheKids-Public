<#
.SYNOPSIS
    GOSPEL SENTRY - Critical System Alert Monitor
.DESCRIPTION
    GOSPEL RULE #11 COMPLIANCE: Emergency Override System
    Monitors core platform services and sends multi-carrier SMS alerts
    via email-to-SMS gateways when any critical service fails.
.NOTES
    Platform: FOR THE KIDS
    Gospel Version: V1.2
    Created: December 11, 2025
    Author: Claude Opus 4.5 (The Architect)

    GOSPEL RULE #11 - EMERGENCY OVERRIDE:
    "In the event of a catastrophic failure that could harm children or
    donors, the Founder (Joshua Coleman) has emergency override authority.
    This system ensures immediate notification of any such failures."
#>

# ═══════════════════════════════════════════════════════════════════════════════
# GOSPEL RULE #11 - EMERGENCY ALERT CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

# Founder Contact Information (GOSPEL RULE #11)
$FOUNDER_PHONE = "3529735909"

# Multi-Carrier SMS Gateways (Failover Redundancy)
$SMS_TARGETS = @(
    "$FOUNDER_PHONE@txt.att.net",      # AT&T (Primary)
    "$FOUNDER_PHONE@tmomail.net",       # T-Mobile (Secondary)
    "$FOUNDER_PHONE@vtext.com",         # Verizon (Tertiary)
    "$FOUNDER_PHONE@msg.fi.google.com"  # Google Voice (Quaternary)
)

# SMTP Configuration (Gmail with App Password)
# NOTE: Requires Gmail App Password - generate at https://myaccount.google.com/apppasswords
$SMTP_SERVER = "smtp.gmail.com"
$SMTP_PORT = 587
$SMTP_FROM = "joshlcoleman@gmail.com"

# Load credentials from environment or secure file
$SMTP_CREDENTIAL_PATH = "$PSScriptRoot\..\..\api\.sentry-credentials"

# ═══════════════════════════════════════════════════════════════════════════════
# CORE SERVICE ENDPOINTS TO MONITOR
# ═══════════════════════════════════════════════════════════════════════════════

$CRITICAL_SERVICES = @(
    @{
        Name = "Backend API"
        URL = "https://api.aidoesitall.website/health"
        ExpectedStatus = 200
    },
    @{
        Name = "Dashboard"
        URL = "https://jules-dashboard.pages.dev"
        ExpectedStatus = 200
    },
    @{
        Name = "DAO Node (T5500)"
        URL = "http://192.168.0.101:3001/health"
        ExpectedStatus = 200
        Internal = $true
    }
)

# ═══════════════════════════════════════════════════════════════════════════════
# LOG CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

$LOG_DIR = "$PSScriptRoot\logs"
$LOG_FILE = "$LOG_DIR\sentry-$(Get-Date -Format 'yyyy-MM-dd').log"

# Ensure log directory exists
if (-not (Test-Path $LOG_DIR)) {
    New-Item -ItemType Directory -Force -Path $LOG_DIR | Out-Null
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LOG_FILE -Value $logLine

    switch ($Level) {
        "ERROR" { Write-Host $logLine -ForegroundColor Red }
        "WARN"  { Write-Host $logLine -ForegroundColor Yellow }
        "OK"    { Write-Host $logLine -ForegroundColor Green }
        default { Write-Host $logLine }
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# SMS ALERT FUNCTION (GOSPEL RULE #11)
# ═══════════════════════════════════════════════════════════════════════════════

function Send-SMSAlert {
    param(
        [string]$ServiceName,
        [string]$Status,
        [string]$Details = ""
    )

    # Keep under 140 chars for SMS delivery guarantee
    $timestamp = Get-Date -Format "HH:mm"
    $body = "CRIT: $ServiceName $Status. Time: $timestamp. Gospel Rule 11."
    if ($body.Length -gt 140) {
        $body = $body.Substring(0, 137) + "..."
    }

    $subject = "GOSPEL FAIL - PRIORITY 1"

    Write-Log "Sending SMS alert: $body" "WARN"

    # Load SMTP credentials
    $credential = $null

    # Try environment variable first
    $smtpPassword = $env:SENTRY_SMTP_PASSWORD
    if ($smtpPassword) {
        $securePassword = ConvertTo-SecureString $smtpPassword -AsPlainText -Force
        $credential = New-Object System.Management.Automation.PSCredential($SMTP_FROM, $securePassword)
    }
    # Try credential file
    elseif (Test-Path $SMTP_CREDENTIAL_PATH) {
        try {
            $credData = Get-Content $SMTP_CREDENTIAL_PATH | ConvertFrom-Json
            $securePassword = ConvertTo-SecureString $credData.password -AsPlainText -Force
            $credential = New-Object System.Management.Automation.PSCredential($credData.user, $securePassword)
        } catch {
            Write-Log "Failed to load credentials from file: $_" "ERROR"
        }
    }

    if (-not $credential) {
        Write-Log "NO SMTP CREDENTIALS CONFIGURED - Cannot send SMS alert!" "ERROR"
        Write-Log "Set SENTRY_SMTP_PASSWORD env var or create $SMTP_CREDENTIAL_PATH" "ERROR"
        return $false
    }

    $alertsSent = 0

    foreach ($target in $SMS_TARGETS) {
        try {
            Send-MailMessage `
                -From $SMTP_FROM `
                -To $target `
                -Subject $subject `
                -Body $body `
                -SmtpServer $SMTP_SERVER `
                -Port $SMTP_PORT `
                -UseSsl `
                -Credential $credential `
                -ErrorAction Stop

            Write-Log "SMS sent to: $target" "OK"
            $alertsSent++
        }
        catch {
            Write-Log "Failed to send SMS to $target : $_" "ERROR"
        }
    }

    Write-Log "Alert sent to $alertsSent/$($SMS_TARGETS.Count) carriers" "INFO"
    return ($alertsSent -gt 0)
}

# ═══════════════════════════════════════════════════════════════════════════════
# SERVICE AUDIT FUNCTION
# ═══════════════════════════════════════════════════════════════════════════════

function Audit-CriticalServices {
    Write-Log "Starting GOSPEL SENTRY audit..." "INFO"
    Write-Log "================================================" "INFO"

    $failures = @()

    foreach ($service in $CRITICAL_SERVICES) {
        $serviceName = $service.Name
        $url = $service.URL
        $expectedStatus = $service.ExpectedStatus
        $isInternal = $service.Internal -eq $true

        Write-Log "Checking: $serviceName ($url)" "INFO"

        try {
            $response = Invoke-WebRequest -Uri $url -TimeoutSec 30 -UseBasicParsing -ErrorAction Stop

            if ($response.StatusCode -eq $expectedStatus) {
                Write-Log "$serviceName : OK (HTTP $($response.StatusCode))" "OK"
            } else {
                Write-Log "$serviceName : UNEXPECTED STATUS (HTTP $($response.StatusCode))" "WARN"
                $failures += @{
                    Name = $serviceName
                    Status = "HTTP $($response.StatusCode)"
                    URL = $url
                }
            }
        }
        catch {
            $errorMsg = $_.Exception.Message

            # For internal services, check if it's just unreachable from this network
            if ($isInternal -and $errorMsg -match "Unable to connect|timeout|unreachable") {
                Write-Log "$serviceName : SKIPPED (Internal service, may be on different network)" "WARN"
            } else {
                Write-Log "$serviceName : DOWN ($errorMsg)" "ERROR"
                $failures += @{
                    Name = $serviceName
                    Status = "DOWN"
                    URL = $url
                    Error = $errorMsg
                }
            }
        }
    }

    Write-Log "================================================" "INFO"

    if ($failures.Count -gt 0) {
        Write-Log "CRITICAL FAILURES DETECTED: $($failures.Count) services down!" "ERROR"

        foreach ($failure in $failures) {
            $alertSent = Send-SMSAlert -ServiceName $failure.Name -Status $failure.Status
            if (-not $alertSent) {
                Write-Log "FAILED TO SEND ALERT FOR: $($failure.Name)" "ERROR"
            }
        }

        return $false
    } else {
        Write-Log "All critical services operational. FOR THE KIDS." "OK"
        return $true
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# CREDENTIAL SETUP HELPER
# ═══════════════════════════════════════════════════════════════════════════════

function Setup-SentryCredentials {
    Write-Host @"

GOSPEL SENTRY - SMTP CREDENTIAL SETUP
=====================================
To enable SMS alerts, you need a Gmail App Password.

1. Go to: https://myaccount.google.com/apppasswords
2. Generate an App Password for 'Mail'
3. Enter the 16-character password below

"@ -ForegroundColor Cyan

    $password = Read-Host "Enter Gmail App Password (or press Enter to skip)"

    if ($password) {
        $credData = @{
            user = $SMTP_FROM
            password = $password
        } | ConvertTo-Json

        $credData | Out-File -FilePath $SMTP_CREDENTIAL_PATH -Encoding UTF8
        Write-Host "Credentials saved to: $SMTP_CREDENTIAL_PATH" -ForegroundColor Green
        Write-Host "IMPORTANT: Add this file to .gitignore!" -ForegroundColor Yellow
    } else {
        Write-Host "Skipped. Set SENTRY_SMTP_PASSWORD environment variable instead." -ForegroundColor Yellow
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host @"

╔═══════════════════════════════════════════════════════════════════════════════╗
║                    GOSPEL SENTRY - CRITICAL ALERT SYSTEM                       ║
║                         GOSPEL RULE #11 COMPLIANCE                             ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║  Founder Alert: +1.352.973.5909 (4 carrier failover)                          ║
║  Mission: FOR THE KIDS - 60/30/10 IMMUTABLE (Ethics Override V1.3)            ║
╚═══════════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Check for setup flag
if ($args -contains "-Setup") {
    Setup-SentryCredentials
    exit 0
}

# Check for test flag
if ($args -contains "-Test") {
    Write-Host "Sending test alert..." -ForegroundColor Yellow
    Send-SMSAlert -ServiceName "TEST" -Status "This is a test alert"
    exit 0
}

# Run the audit
$result = Audit-CriticalServices

if ($result) {
    Write-Host "`nGOSPEL SENTRY: All systems operational." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nGOSPEL SENTRY: CRITICAL FAILURES DETECTED!" -ForegroundColor Red
    exit 1
}
