# Service Health Check & Auto-Restart
# Monitors local services without affecting Cloudflare Pages deployment

Write-Host "=== FOR THE KIDS - Service Health Check ===" -ForegroundColor Cyan

# Check API Server (Port 3000)
Write-Host "`nChecking API Server (Port 3000)..." -ForegroundColor Yellow
try {
    $apiResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ API Server: ONLINE" -ForegroundColor Green
} catch {
    Write-Host "❌ API Server: OFFLINE" -ForegroundColor Red
    Write-Host "Attempting restart..." -ForegroundColor Yellow
    
    # Kill existing processes
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*AiCollabForTheKids*"} | Stop-Process -Force
    
    # Start API server in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\team-claude-orchestrator\AiCollabForTheKids; npm start" -WindowStyle Minimized
    Write-Host "✅ API Server restarted" -ForegroundColor Green
}

# Check Jules Dashboard (Port 5173) - Local Dev Only
Write-Host "`nChecking Jules Dashboard (Port 5173 - Local Dev)..." -ForegroundColor Yellow
try {
    $dashResponse = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Local Dashboard: ONLINE" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Local Dashboard: OFFLINE (This is OK if using Cloudflare Pages)" -ForegroundColor Yellow
}

# Check Cloudflare Pages (Production)
Write-Host "`nChecking Cloudflare Pages (Production)..." -ForegroundColor Yellow
try {
    $cfResponse = Invoke-WebRequest -Uri "https://d41f5966.jules-dashboard.pages.dev" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Cloudflare Pages: ONLINE (Chromebook accessible)" -ForegroundColor Green
} catch {
    Write-Host "❌ Cloudflare Pages: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}

# Check Custom Domain
Write-Host "`nChecking Custom Domain..." -ForegroundColor Yellow
try {
    $domainResponse = Invoke-WebRequest -Uri "https://admin.youandinotai.com" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ admin.youandinotai.com: ONLINE (Chromebook accessible)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ admin.youandinotai.com: DNS may still be propagating" -ForegroundColor Yellow
    Write-Host "   Use Cloudflare direct link in the meantime" -ForegroundColor White
}

Write-Host "`n=== Chromebook Access URLs ===" -ForegroundColor Cyan
Write-Host "  Primary: https://admin.youandinotai.com" -ForegroundColor Green
Write-Host "  Backup:  https://d41f5966.jules-dashboard.pages.dev" -ForegroundColor Green

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
