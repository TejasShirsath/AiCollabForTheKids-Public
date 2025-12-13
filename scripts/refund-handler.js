// ═══════════════════════════════════════════════════════════════
// REFUND HANDLER FUNCTION (Added Dec 8, 2025 - Opus 4.5)
// Call this from webhook handlers when refund events are received
// ═══════════════════════════════════════════════════════════════
function handleSquareRefund(event, stream, res, ledgerPath) {
    const refund = event.data.object.refund;

    if (refund.status !== 'COMPLETED') {
        return res.status(200).json({ status: 'REFUND_PENDING', refund_status: refund.status });
    }

    const refundAmount = refund.amount_money.amount;
    const distribution = calculateSplit(refundAmount);

    console.log(`\n[SQUARE-${stream}-REFUND] ═══════════════════════════════`);
    console.log(`[DAO] Refund ID: ${refund.id}`);
    console.log(`[DAO] Payment ID: ${refund.payment_id}`);
    console.log(`[DAO] Amount: -$${(refundAmount / 100).toFixed(2)}`);
    console.log(`[DAO] Stream: ${stream}`);
    console.log('[DAO] ═══════════════════════════════════════════════\n');

    const ledger = JSON.parse(fs.readFileSync(ledgerPath));

    // Initialize refund tracking arrays if not exists
    if (!ledger.refunds) ledger.refunds = [];
    if (!ledger.total_refunded_square) ledger.total_refunded_square = 0;
    if (!ledger.total_refunded_square_merch) ledger.total_refunded_square_merch = 0;
    if (!ledger.total_refunded_square_dating) ledger.total_refunded_square_dating = 0;

    // Subtract from pending (floor at 0)
    ledger.pending_charity = Math.max(0, ledger.pending_charity - distribution.charity);
    ledger.pending_growth = Math.max(0, ledger.pending_growth - distribution.growth);
    ledger.pending_team = Math.max(0, ledger.pending_team - distribution.team);
    ledger.total_raised_square = Math.max(0, ledger.total_raised_square - refundAmount);
    ledger.total_refunded_square += refundAmount;

    // Track by stream
    if (stream === 'MERCH') {
        ledger.total_refunded_square_merch += refundAmount;
        if (ledger.total_raised_square_merch) {
            ledger.total_raised_square_merch = Math.max(0, ledger.total_raised_square_merch - refundAmount);
        }
    } else if (stream === 'DATING') {
        ledger.total_refunded_square_dating += refundAmount;
        if (ledger.total_raised_square_dating) {
            ledger.total_raised_square_dating = Math.max(0, ledger.total_raised_square_dating - refundAmount);
        }
    }

    // Record refund transaction
    ledger.refunds.push({
        id: refund.id,
        payment_id: refund.payment_id,
        source: `SQUARE_${stream}`,
        stream: stream === 'MERCH' ? 'MERCH_AI' : 'DATING',
        amount: refundAmount,
        distribution_reversed: distribution,
        timestamp: new Date().toISOString(),
        reason: refund.reason || 'CUSTOMER_REQUEST'
    });

    atomicWriteSync(ledgerPath, ledger);

    return res.status(200).json({
        status: 'REFUND_LOGGED',
        stream: stream,
        refund_amount: `$${(refundAmount / 100).toFixed(2)}`,
        new_total: `$${(ledger.total_raised_square / 100).toFixed(2)}`,
        new_pending_charity: `$${(ledger.pending_charity / 100).toFixed(2)}`,
        total_refunded: `$${(ledger.total_refunded_square / 100).toFixed(2)}`
    });
}
