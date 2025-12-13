# ═══════════════════════════════════════════════════════════════════════════════
# SYNC GITHUB SECRETS TO T5500 BACKEND
# FOR THE KIDS - Self-sufficient credential management
# ═══════════════════════════════════════════════════════════════════════════════

$T5500_IP = "192.168.0.101"
$T5500_USER = "t55o"
$API_PATH = "/home/t55o/AiCollabForTheKids/api"
$REPO = "Ai-Solutions-Store/AiCollabForTheKids"

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  SYNCING GITHUB SECRETS TO T5500 BACKEND" -ForegroundColor Cyan
Write-Host "  FOR THE KIDS - Secure credential sync" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan

# Secrets to sync (payment-critical)
$SECRETS = @(
    "SQUARE_ACCESS_TOKEN",
    "SQUARE_LOCATION_ID",
    "SQUARE_APP_ID",
    "SQUARE_ENVIRONMENT",
    "STRIPE_SECRET_KEY",
    "DATABASE_URL",
    "JWT_SECRET",
    "SESSION_SECRET"
)

Write-Host "`nNote: GitHub CLI cannot read secret VALUES (security feature)" -ForegroundColor Yellow
Write-Host "This script creates a template .env with placeholders." -ForegroundColor Yellow
Write-Host "You must manually copy values from GitHub Secrets UI." -ForegroundColor Yellow
Write-Host "`nGitHub Secrets URL:" -ForegroundColor Green
Write-Host "https://github.com/$REPO/settings/secrets/actions" -ForegroundColor White

Write-Host "`n--- Current GitHub Secrets (names only) ---" -ForegroundColor Cyan
gh secret list --repo $REPO | Where-Object { $_ -match "SQUARE|STRIPE|DATABASE|JWT|SESSION" }

Write-Host "`n--- To update T5500 manually ---" -ForegroundColor Yellow
Write-Host "1. SSH to T5500: ssh $T5500_USER@$T5500_IP" -ForegroundColor White
Write-Host "2. Edit .env: nano $API_PATH/.env" -ForegroundColor White
Write-Host "3. Update the following variables:" -ForegroundColor White
foreach ($secret in $SECRETS) {
    Write-Host "   - $secret" -ForegroundColor Gray
}
Write-Host "4. Restart the API: pm2 restart api" -ForegroundColor White

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  FOR THE KIDS - 50% to charity" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
