# Add Refund Tracking to DAO Node
# Patches dao-logic.js on T5500 to track Square refunds

$refundMerchHandler = @'

// ═══════════════════════════════════════════════════════════════
// REFUND HANDLER: SQUARE MERCH (Added Dec 8, 2025)
// Tracks refunds and updates ledger accordingly
// ═══════════════════════════════════════════════════════════════
app.post('/webhook/square-merch-refund', async (req, res) => {
    const signature = req.headers['x-square-hmacsha256-signature'];
    const body = req.body.toString();

    const merchSecret = process.env.SQUARE_MERCH_WEBHOOK_SECRET;
    if (!merchSecret) {
        console.error('[DAO SECURITY] SQUARE_MERCH_WEBHOOK_SECRET not configured');
        return res.status(500).json({ error: 'WEBHOOK_NOT_CONFIGURED' });
    }

    const webhookUrl = process.env.SQUARE_MERCH_WEBHOOK_URL || 'https://dao.youandinotai.com/webhook/square-merch';
    const hmac = crypto.createHmac('sha256', merchSecret);
    hmac.update(webhookUrl + body);
    const expectedSignature = hmac.digest('base64');

    if (signature !== expectedSignature) {
        console.error('[DAO SECURITY] Invalid Square MERCH refund signature');
        return res.status(401).json({ error: 'INVALID_SIGNATURE', stream: 'MERCH_REFUND' });
    }

    const event = JSON.parse(body);

    if (event.type === 'refund.created' || event.type === 'refund.updated') {
        const refund = event.data.object.refund;

        if (refund.status === 'COMPLETED') {
            const refundAmount = refund.amount_money.amount;
            const distribution = calculateSplit(refundAmount);

            console.log('\n[SQUARE-MERCH-REFUND] ═══════════════════════════════');
            console.log(`[DAO] Refund ID: ${refund.id}`);
            console.log(`[DAO] Payment ID: ${refund.payment_id}`);
            console.log(`[DAO] Amount: -$${(refundAmount / 100).toFixed(2)}`);
            console.log('[DAO] ═══════════════════════════════════════════════\n');

            const ledger = JSON.parse(fs.readFileSync(SAFE_HARBOR_LEDGER));

            // Initialize refund tracking if not exists
            if (!ledger.refunds) ledger.refunds = [];
            if (!ledger.total_refunded_square) ledger.total_refunded_square = 0;
            if (!ledger.total_refunded_square_merch) ledger.total_refunded_square_merch = 0;

            // Subtract from pending (don't go negative)
            ledger.pending_charity = Math.max(0, ledger.pending_charity - distribution.charity);
            ledger.pending_growth = Math.max(0, ledger.pending_growth - distribution.growth);
            ledger.pending_team = Math.max(0, ledger.pending_team - distribution.team);
            ledger.total_raised_square = Math.max(0, ledger.total_raised_square - refundAmount);
            ledger.total_refunded_square += refundAmount;
            ledger.total_refunded_square_merch += refundAmount;

            if (ledger.total_raised_square_merch) {
                ledger.total_raised_square_merch = Math.max(0, ledger.total_raised_square_merch - refundAmount);
            }

            ledger.refunds.push({
                id: refund.id,
                payment_id: refund.payment_id,
                source: 'SQUARE_MERCH',
                stream: 'MERCH_AI',
                amount: refundAmount,
                distribution_reversed: distribution,
                timestamp: new Date().toISOString(),
                reason: refund.reason || 'CUSTOMER_REQUEST'
            });

            atomicWriteSync(SAFE_HARBOR_LEDGER, ledger);

            res.status(200).json({
                status: 'REFUND_LOGGED',
                stream: 'MERCH_AI',
                refund_amount: `$${(refundAmount / 100).toFixed(2)}`,
                new_pending_charity: `$${(ledger.pending_charity / 100).toFixed(2)}`
            });
        } else {
            res.status(200).json({ status: 'REFUND_NOT_COMPLETED' });
        }
    } else {
        res.status(200).end();
    }
});

// ═══════════════════════════════════════════════════════════════
// REFUND HANDLER: SQUARE DATING (Added Dec 8, 2025)
// ═══════════════════════════════════════════════════════════════
app.post('/webhook/square-dating-refund', async (req, res) => {
    const signature = req.headers['x-square-hmacsha256-signature'];
    const body = req.body.toString();

    const datingSecret = process.env.SQUARE_WEBHOOK_SECRET;
    if (!datingSecret) {
        console.error('[DAO SECURITY] SQUARE_WEBHOOK_SECRET not configured');
        return res.status(500).json({ error: 'WEBHOOK_NOT_CONFIGURED' });
    }

    const webhookUrl = process.env.SQUARE_WEBHOOK_URL || 'https://dao.youandinotai.com/webhook/square-dating';
    const hmac = crypto.createHmac('sha256', datingSecret);
    hmac.update(webhookUrl + body);
    const expectedSignature = hmac.digest('base64');

    if (signature !== expectedSignature) {
        console.error('[DAO SECURITY] Invalid Square DATING refund signature');
        return res.status(401).json({ error: 'INVALID_SIGNATURE', stream: 'DATING_REFUND' });
    }

    const event = JSON.parse(body);

    if (event.type === 'refund.created' || event.type === 'refund.updated') {
        const refund = event.data.object.refund;

        if (refund.status === 'COMPLETED') {
            const refundAmount = refund.amount_money.amount;
            const distribution = calculateSplit(refundAmount);

            console.log('\n[SQUARE-DATING-REFUND] ═════════════════════════════');
            console.log(`[DAO] Refund ID: ${refund.id}`);
            console.log(`[DAO] Payment ID: ${refund.payment_id}`);
            console.log(`[DAO] Amount: -$${(refundAmount / 100).toFixed(2)}`);
            console.log('[DAO] ═══════════════════════════════════════════════\n');

            const ledger = JSON.parse(fs.readFileSync(SAFE_HARBOR_LEDGER));

            if (!ledger.refunds) ledger.refunds = [];
            if (!ledger.total_refunded_square) ledger.total_refunded_square = 0;
            if (!ledger.total_refunded_square_dating) ledger.total_refunded_square_dating = 0;

            ledger.pending_charity = Math.max(0, ledger.pending_charity - distribution.charity);
            ledger.pending_growth = Math.max(0, ledger.pending_growth - distribution.growth);
            ledger.pending_team = Math.max(0, ledger.pending_team - distribution.team);
            ledger.total_raised_square = Math.max(0, ledger.total_raised_square - refundAmount);
            ledger.total_refunded_square += refundAmount;
            ledger.total_refunded_square_dating += refundAmount;

            if (ledger.total_raised_square_dating) {
                ledger.total_raised_square_dating = Math.max(0, ledger.total_raised_square_dating - refundAmount);
            }

            ledger.refunds.push({
                id: refund.id,
                payment_id: refund.payment_id,
                source: 'SQUARE_DATING',
                stream: 'DATING',
                amount: refundAmount,
                distribution_reversed: distribution,
                timestamp: new Date().toISOString(),
                reason: refund.reason || 'CUSTOMER_REQUEST'
            });

            atomicWriteSync(SAFE_HARBOR_LEDGER, ledger);

            res.status(200).json({
                status: 'REFUND_LOGGED',
                stream: 'DATING',
                refund_amount: `$${(refundAmount / 100).toFixed(2)}`,
                new_pending_charity: `$${(ledger.pending_charity / 100).toFixed(2)}`
            });
        } else {
            res.status(200).json({ status: 'REFUND_NOT_COMPLETED' });
        }
    } else {
        res.status(200).end();
    }
});

'@

Write-Host "Refund handler code generated. Copy to T5500 dao-logic.js before the PORT listener."
Write-Host $refundMerchHandler
