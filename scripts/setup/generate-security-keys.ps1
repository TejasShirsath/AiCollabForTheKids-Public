# 🔐 Security Keys Generator - FOR THE KIDS
# Run this script to generate all required security keys and add them to .env files

Write-Host "🔐 Generating Security Keys for AiCollabForTheKids..." -ForegroundColor Cyan
Write-Host ""

# Generate all 5 keys
Write-Host "Generating SALT..." -ForegroundColor Yellow
$SALT = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host "Generating ENCRYPTION_KEY..." -ForegroundColor Yellow
$ENCRYPTION_KEY = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host "Generating JWT_SECRET..." -ForegroundColor Yellow
$JWT_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host "Generating SESSION_SECRET..." -ForegroundColor Yellow
$SESSION_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host "Generating JULES_API_KEY..." -ForegroundColor Yellow
$JULES_API_KEY = "forkids_jules_" + (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

Write-Host ""
Write-Host "✅ All keys generated!" -ForegroundColor Green
Write-Host ""

# Display the keys
Write-Host "🔑 Generated Keys:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "SALT=$SALT"
Write-Host "ENCRYPTION_KEY=$ENCRYPTION_KEY"
Write-Host "JWT_SECRET=$JWT_SECRET"
Write-Host "SESSION_SECRET=$SESSION_SECRET"
Write-Host "JULES_API_KEY=$JULES_API_KEY"
Write-Host ""

# Prepare the keys block to append
$keysBlock = @"

# Security Keys (Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
SALT=$SALT
ENCRYPTION_KEY=$ENCRYPTION_KEY
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
JULES_API_KEY=$JULES_API_KEY
"@

# Add to root .env
Write-Host "📝 Adding keys to .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Add-Content -Path ".env" -Value $keysBlock
    Write-Host "✅ Keys added to .env" -ForegroundColor Green
} else {
    Write-Host "⚠️ Warning: .env file not found in root directory" -ForegroundColor Red
}

# Add to api/.env
Write-Host "📝 Adding keys to api/.env..." -ForegroundColor Yellow
if (Test-Path "api/.env") {
    Add-Content -Path "api/.env" -Value $keysBlock
    Write-Host "✅ Keys added to api/.env" -ForegroundColor Green
} else {
    Write-Host "⚠️ Warning: api/.env file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run database migrations: cd api && npx prisma migrate deploy" -ForegroundColor White
Write-Host "2. Restart server: taskkill /PID 9052 /F && cd api && npm start" -ForegroundColor White
Write-Host "3. Test endpoints: curl http://localhost:54112/health" -ForegroundColor White
Write-Host ""
Write-Host "💙 FOR THE KIDS!" -ForegroundColor Magenta
