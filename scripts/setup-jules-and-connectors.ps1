# ═══════════════════════════════════════════════════════════════════════════════
# JULES API + CLAUDE CONNECTORS SETUP - FOR THE KIDS
# Run: powershell -ExecutionPolicy Bypass -File setup-jules-and-connectors.ps1
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "`n=== JULES API + CLAUDE CONNECTORS SETUP ===" -ForegroundColor Cyan
$julesDir = "C:\AiCollabForTheKids\jules-api"

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 1: Install Jules API Dependencies
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n[1/4] Installing Jules API dependencies..." -ForegroundColor Yellow
Set-Location $julesDir
npm install
if ($LASTEXITCODE -eq 0) { Write-Host "  ✓ Dependencies installed" -ForegroundColor Green }

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 2: Start Jules API with PM2
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n[2/4] Starting Jules API with PM2..." -ForegroundColor Yellow
pm2 delete jules-api 2>$null
pm2 start server.js --name jules-api
pm2 save
Write-Host "  ✓ Jules API started on port 3000" -ForegroundColor Green

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 3: Update Cloudflare Tunnel (for-the-kids)
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n[3/4] Cloudflare Tunnel config needed:" -ForegroundColor Yellow
Write-Host @"
  Add this to your tunnel config for jules.youandinotai.com:
  
  - hostname: jules.youandinotai.com
    service: http://localhost:3000
    
  Or use quick tunnel: cloudflared tunnel --url http://localhost:3000
"@ -ForegroundColor Gray

# ═══════════════════════════════════════════════════════════════════════════════
# STEP 4: Claude.ai Connectors (Manual OAuth)
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n[4/4] Claude.ai Connectors (enable manually):" -ForegroundColor Yellow
Write-Host @"
  Go to: https://claude.ai/settings/integrations
  
  ENABLE THESE (OAuth login required):
  ┌────────────────┬────────────────────────────────────┐
  │ Stripe         │ joshlcoleman@gmail.com             │
  │ AWS            │ Your AWS account (EC2 fleet)       │
  │ PayPal         │ joshlcoleman@gmail.com             │
  │ Zapier         │ Workflow automation                │
  └────────────────┴────────────────────────────────────┘
  
  Already Connected: Square, Cloudflare, Google, Hugging Face
"@ -ForegroundColor Gray

# Open browser
Start-Process "https://claude.ai/settings/integrations"

# ═══════════════════════════════════════════════════════════════════════════════
# VERIFY
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n=== VERIFICATION ===" -ForegroundColor Cyan
Write-Host "Testing Jules API..." -ForegroundColor Yellow

Start-Sleep -Seconds 2
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "  ✓ Jules API healthy: $($response.status)" -ForegroundColor Green
    Write-Host "  ✓ Gospel Split: $($response.gospel_split.charity)/$($response.gospel_split.infrastructure)/$($response.gospel_split.founder)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Jules API not responding - check pm2 logs jules-api" -ForegroundColor Red
}

Write-Host "`n=== DONE ===" -ForegroundColor Green
Write-Host "Dashboard URL: https://6b2f4c58.youandinotai.pages.dev/dashboard"
Write-Host "Jules API: http://localhost:3000 (expose via Cloudflare tunnel)"
Write-Host "`nFOR THE KIDS 💚`n"
