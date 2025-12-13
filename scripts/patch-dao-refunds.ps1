$daoFile = "C:\AiSolutions-DAO\backend\dao-logic.js"
$content = Get-Content $daoFile -Raw

$refundHandler = @'

// ═══════════════════════════════════════════════════════════════
// REFUND HANDLER FUNCTION (Added Dec 8, 2025 - Opus 4.5)
// ═══════════════════════════════════════════════════════════════
function handleSquareRefund(event, stream, res) {
    const refund = event.data.object.refund;
    if (refund.status !== 'COMPLETED') {
        return res.status(200).json({ status: 'REFUND_PENDING', refund_status: refund.status });
    }
    const refundAmount = refund.amount_money.amount;
    const distribution = calculateSplit(refundAmount);
    console.log('[SQUARE-' + stream + '-REFUND] Amount: -$' + (refundAmount / 100).toFixed(2));
    const ledger = JSON.parse(fs.readFileSync(SAFE_HARBOR_LEDGER));
    if (!ledger.refunds) ledger.refunds = [];
    if (!ledger.total_refunded_square) ledger.total_refunded_square = 0;
    ledger.pending_charity = Math.max(0, ledger.pending_charity - distribution.charity);
    ledger.pending_growth = Math.max(0, ledger.pending_growth - distribution.growth);
    ledger.pending_team = Math.max(0, ledger.pending_team - distribution.team);
    ledger.total_raised_square = Math.max(0, ledger.total_raised_square - refundAmount);
    ledger.total_refunded_square += refundAmount;
    ledger.refunds.push({ id: refund.id, payment_id: refund.payment_id, source: 'SQUARE_' + stream, amount: refundAmount, timestamp: new Date().toISOString() });
    atomicWriteSync(SAFE_HARBOR_LEDGER, ledger);
    return res.status(200).json({ status: 'REFUND_LOGGED', stream: stream, amount: '-$' + (refundAmount / 100).toFixed(2) });
}

'@

# Check if already patched
if ($content -match "handleSquareRefund") {
    Write-Host "Already patched - refund handler exists"
    exit 0
}

# Insert before Split Calculator
$content = $content -replace "// Split Calculator", ($refundHandler + "`n// Split Calculator")

# Add refund check to merch webhook
$merchCheck = "if (event.type === 'refund.created' || event.type === 'refund.updated') { return handleSquareRefund(event, 'MERCH', res); }`n        if (event.type === 'payment.created'"
$content = $content -replace "if \(event\.type === 'payment\.created' \|\| event\.type === 'payment\.updated'\) \{", $merchCheck

Set-Content $daoFile -Value $content -Encoding UTF8
Write-Host "Patch applied successfully"
