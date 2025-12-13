🔒 SETUP CLOUDFLARE TUNNEL FOR HTTPS
# This script configures Cloudflare Tunnel to provide HTTPS for all domains
# No port forwarding needed - works securely from T5500

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔒 CLOUDFLARE TUNNEL HTTPS SETUP" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$configDir = "C:\team-claude-orchestrator\AiCollabForTheKids\.cloudflared"
$configFile = "C:\team-claude-orchestrator\AiCollabForTheKids\cloudflare-tunnel-config.yml"

# Step 1: Check if cloudflared is installed
Write-Host "📦 Step 1: Checking cloudflared installation..." -ForegroundColor Cyan
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cloudflared) {
  Write-Host "   ❌ cloudflared not found" -ForegroundColor Red
  Write-Host "   Installing cloudflared..." -ForegroundColor Yellow
  winget install Cloudflare.cloudflared
  Write-Host "   ✅ cloudflared installed" -ForegroundColor Green
}
else {
  Write-Host "   ✅ cloudflared is installed" -ForegroundColor Green
  cloudflared --version
}

# Step 2: Create .cloudflared directory
Write-Host "`n📁 Step 2: Creating configuration directory..." -ForegroundColor Cyan
if (-not (Test-Path $configDir)) {
  New-Item -ItemType Directory -Path $configDir -Force | Out-Null
  Write-Host "   ✅ Created: $configDir" -ForegroundColor Green
}
else {
  Write-Host "   ✅ Directory exists: $configDir" -ForegroundColor Green
}

# Step 3: Authenticate with Cloudflare
Write-Host "`n🔑 Step 3: Cloudflare Authentication..." -ForegroundColor Cyan
Write-Host "   This will open a browser window to authenticate." -ForegroundColor Yellow
Write-Host "   Please login with your Cloudflare account." -ForegroundColor Yellow
Read-Host "   Press Enter to continue"

cloudflared tunnel login

if ($LASTEXITCODE -ne 0) {
  Write-Host "   ❌ Authentication failed" -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}
Write-Host "   ✅ Authenticated successfully" -ForegroundColor Green

# Step 4: Create tunnel
Write-Host "`n🚇 Step 4: Creating Cloudflare Tunnel..." -ForegroundColor Cyan
$tunnelExists = cloudflared tunnel list 2>&1 | Select-String "for-the-kids"
if ($tunnelExists) {
  Write-Host "   ℹ️  Tunnel 'for-the-kids' already exists" -ForegroundColor Yellow
  Write-Host "   Skipping tunnel creation..." -ForegroundColor Yellow
}
else {
  cloudflared tunnel create for-the-kids
  if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Tunnel 'for-the-kids' created" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ Failed to create tunnel" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
  }
}

# Step 5: Route DNS
Write-Host "`n🌐 Step 5: Routing domains to tunnel..." -ForegroundColor Cyan
$domains = @(
  "youandinotai.com",
  "www.youandinotai.com",
  "youandinotai.online",
  "www.youandinotai.online",
  "aidoesitall.website",
  "www.aidoesitall.website",
  "api.youandinotai.com",
  "admin.youandinotai.com"
)

foreach ($domain in $domains) {
  Write-Host "   Routing $domain..." -ForegroundColor Yellow
  cloudflared tunnel route dns for-the-kids $domain 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ $domain routed" -ForegroundColor Green
  }
  else {
    Write-Host "   ⚠️  $domain may already be routed" -ForegroundColor Yellow
  }
}

# Step 6: Copy configuration file
Write-Host "`n⚙️  Step 6: Installing tunnel configuration..." -ForegroundColor Cyan
if (Test-Path $configFile) {
  Copy-Item $configFile "$configDir\config.yml" -Force
  Write-Host "   ✅ Configuration copied to $configDir\config.yml" -ForegroundColor Green
}
else {
  Write-Host "   ❌ Configuration file not found: $configFile" -ForegroundColor Red
}

# Step 7: Display instructions
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ CLOUDFLARE TUNNEL SETUP COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 TO START THE TUNNEL:" -ForegroundColor Yellow
Write-Host "   cloudflared tunnel --config `"$configDir\config.yml`" run for-the-kids" -ForegroundColor White
Write-Host ""
Write-Host "   OR run in background:" -ForegroundColor Yellow
Write-Host "   cloudflared service install" -ForegroundColor White
Write-Host "   cloudflared service start" -ForegroundColor White
Write-Host ""

Write-Host "🌐 YOUR DOMAINS WITH HTTPS:" -ForegroundColor Yellow
Write-Host "   https://youandinotai.com" -ForegroundColor Green
Write-Host "   https://www.youandinotai.com" -ForegroundColor Green
Write-Host "   https://youandinotai.online" -ForegroundColor Green
Write-Host "   https://www.youandinotai.online" -ForegroundColor Green
Write-Host "   https://aidoesitall.website" -ForegroundColor Green
Write-Host "   https://www.aidoesitall.website" -ForegroundColor Green
Write-Host "   https://api.youandinotai.com" -ForegroundColor Green
Write-Host "   https://admin.youandinotai.com" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   1. Keep the tunnel running for HTTPS to work" -ForegroundColor White
Write-Host "   2. DNS propagation may take 5-30 minutes" -ForegroundColor White
Write-Host "   3. All traffic now uses Cloudflare SSL (green padlock)" -ForegroundColor White
Write-Host "   4. No port forwarding needed on T5500" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "FOR THE KIDS! 🏥 | Now secure with HTTPS" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to close"
