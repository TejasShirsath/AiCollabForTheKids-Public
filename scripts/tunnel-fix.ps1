# ═══════════════════════════════════════════════════════════════════════════════
# CLOUDFLARE TUNNEL HEALING SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════
#
# Purpose: Restore Cloudflare Tunnel on T5500 after authentication expiration
# Target: T5500 (192.168.0.101)
# Tunnel: for-the-kids
#
# Created: 2025-12-09 (Task #073)
# FOR THE KIDS. TRANSPARENCY IS TRUST.
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔧 CLOUDFLARE TUNNEL HEALING - FOR THE KIDS" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 1: TEST SSH CONNECTIVITY
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "📡 Step 1: Testing SSH connectivity to T5500..." -ForegroundColor Yellow
Write-Host ""

$sshTest = ssh t55o@192.168.0.101 "echo connected" 2>&1

if ($sshTest -eq "connected") {
    Write-Host "✅ SSH connectivity confirmed" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: Cannot connect to T5500 via SSH" -ForegroundColor Red
    Write-Host "   Output: $sshTest" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 2: CHECK FOR EXISTING CERT.PEM
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "🔍 Step 2: Checking for existing cert.pem..." -ForegroundColor Yellow
Write-Host ""

$certCheck = ssh t55o@192.168.0.101 "dir C:\Users\t55o\.cloudflared\cert.pem 2>&1"

if ($certCheck -match "cert.pem") {
    Write-Host "✅ cert.pem already exists - skipping login" -ForegroundColor Green
    $needsLogin = $false
} else {
    Write-Host "⚠️  cert.pem NOT found - authentication required" -ForegroundColor Yellow
    $needsLogin = $true
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 3: CLOUDFLARED LOGIN (IF NEEDED)
# ═══════════════════════════════════════════════════════════════════════════════

if ($needsLogin) {
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "⚠️  CAPTAIN INTERVENTION REQUIRED" -ForegroundColor Red
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "ACTION NEEDED:" -ForegroundColor Yellow
    Write-Host "1. RDP to T5500 (192.168.0.101)" -ForegroundColor White
    Write-Host "2. A browser window will open automatically" -ForegroundColor White
    Write-Host "3. Click 'Authorize' in the Cloudflare OAuth page" -ForegroundColor White
    Write-Host "4. Wait for cert.pem to be created" -ForegroundColor White
    Write-Host ""
    Write-Host "Press ENTER when you're ready to start cloudflared login..." -ForegroundColor Cyan
    Read-Host

    Write-Host ""
    Write-Host "🔐 Running: cloudflared login on T5500..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  BROWSER WILL OPEN ON T5500 - WATCH RDP SESSION!" -ForegroundColor Red
    Write-Host ""

    # Run cloudflared login in background (will open browser on T5500)
    $loginProcess = Start-Process ssh -ArgumentList "t55o@192.168.0.101 `"cloudflared login`"" -PassThru -NoNewWindow

    Write-Host "Waiting for authentication..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Checking for cert.pem every 5 seconds..." -ForegroundColor Gray

    # Poll for cert.pem creation (max 2 minutes)
    $timeout = 120
    $elapsed = 0
    $certCreated = $false

    while ($elapsed -lt $timeout -and -not $certCreated) {
        Start-Sleep -Seconds 5
        $elapsed += 5

        $certCheck = ssh t55o@192.168.0.101 "dir C:\Users\t55o\.cloudflared\cert.pem 2>&1"

        if ($certCheck -match "cert.pem") {
            $certCreated = $true
            Write-Host "✅ cert.pem created successfully!" -ForegroundColor Green
        } else {
            Write-Host "   [$elapsed/$timeout] Still waiting for cert.pem..." -ForegroundColor Gray
        }
    }

    if (-not $certCreated) {
        Write-Host ""
        Write-Host "❌ ERROR: Timeout waiting for cert.pem" -ForegroundColor Red
        Write-Host "   Did you authorize in the browser?" -ForegroundColor Yellow
        exit 1
    }

    Write-Host ""
} else {
    Write-Host "ℹ️  cert.pem exists - skipping authentication" -ForegroundColor Cyan
    Write-Host ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 4: RESTART CLOUDFLARE TUNNEL
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "🚀 Step 4: Restarting Cloudflare Tunnel..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Checking if tunnel is already running..." -ForegroundColor Gray
$tunnelCheck = ssh t55o@192.168.0.101 "tasklist | findstr cloudflared" 2>&1

if ($tunnelCheck -match "cloudflared") {
    Write-Host "⚠️  Tunnel process found - stopping existing process..." -ForegroundColor Yellow
    ssh t55o@192.168.0.101 "taskkill /IM cloudflared.exe /F" | Out-Null
    Start-Sleep -Seconds 3
    Write-Host "✅ Existing tunnel stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No existing tunnel process found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Starting tunnel: for-the-kids..." -ForegroundColor Yellow

# Start tunnel in background
$tunnelStart = ssh t55o@192.168.0.101 "Start-Process -FilePath 'cloudflared' -ArgumentList 'tunnel run for-the-kids' -WindowStyle Hidden -PassThru"

Start-Sleep -Seconds 5

# Verify tunnel is running
$tunnelRunning = ssh t55o@192.168.0.101 "tasklist | findstr cloudflared" 2>&1

if ($tunnelRunning -match "cloudflared") {
    Write-Host "✅ Tunnel started successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: Tunnel failed to start" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 5: VALIDATE TUNNEL
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "🔍 Step 5: Validating tunnel connectivity..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Testing: https://dao.youandinotai.com/health" -ForegroundColor Gray

# Wait for tunnel to establish
Start-Sleep -Seconds 10

try {
    $response = curl.exe -s https://dao.youandinotai.com/health 2>&1

    if ($response -match "ok" -or $response -match "healthy" -or $response -match "200") {
        Write-Host "✅ Tunnel validation PASSED!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Response: $response" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Unexpected response: $response" -ForegroundColor Yellow
        Write-Host "   Tunnel may be running but endpoint not responding as expected" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Tunnel validation FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Tunnel is running but may not be properly configured" -ForegroundColor Yellow
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════
# COMPLETE
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ CLOUDFLARE TUNNEL HEALING COMPLETE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Tunnel Status:" -ForegroundColor White
Write-Host "  • Name: for-the-kids" -ForegroundColor Gray
Write-Host "  • Status: RUNNING" -ForegroundColor Gray
Write-Host "  • Endpoint: https://dao.youandinotai.com" -ForegroundColor Gray
Write-Host "  • Target: T5500 (192.168.0.101)" -ForegroundColor Gray
Write-Host ""
Write-Host "FOR THE KIDS. TUNNEL RESTORED. 🌐" -ForegroundColor Green
Write-Host ""
