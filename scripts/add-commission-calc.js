/**
 * Task #067b - Add 15% Commission Calculation to Square Merch Webhook
 * CRITICAL: Ensures Gospel Split applies to NET (after commission), not GROSS
 */

const fs = require('fs');
const file = 'C:\\AiSolutions-DAO\\backend\\dao-logic.js';

console.log('Reading dao-logic.js...');
let content = fs.readFileSync(file, 'utf8');

// Backup first
fs.writeFileSync(file + '.pre-commission', content);
console.log('✅ Backup created: dao-logic.js.pre-commission');

// Find the insertion point (right after grossAmount is defined)
const marker = 'const grossAmount = payment.amount_money.amount;';
const insertionIndex = content.indexOf(marker);

if (insertionIndex === -1) {
    console.error('❌ Could not find insertion point');
    process.exit(1);
}

// Commission calculation code to insert
const commissionCode = `
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // COMMISSION CALCULATION (Task #067b - Dec 9, 2025)
            // Affiliates earn 15% BEFORE Gospel Split
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            let netAmount = grossAmount; // Default: no commission
            let commissionCents = 0;
            let affiliateId = null;

            // Check for referral_id in payment metadata
            if (payment.metadata && payment.metadata.referral_id) {
                affiliateId = payment.metadata.referral_id;

                // Calculate 15% commission (rounded down to avoid penny errors)
                commissionCents = Math.floor(grossAmount * 0.15);
                netAmount = grossAmount - commissionCents;

                console.log(\`[COMMISSION] Affiliate: \${affiliateId}\`);
                console.log(\`[COMMISSION] Gross: $\${(grossAmount / 100).toFixed(2)}\`);
                console.log(\`[COMMISSION] Commission (15%): $\${(commissionCents / 100).toFixed(2)}\`);
                console.log(\`[COMMISSION] Net (after commission): $\${(netAmount / 100).toFixed(2)}\`);

                // Record commission in commissions_ledger.json
                const commissionsLedger = 'C:\\\\AiSolutions-DAO\\\\backend\\\\commissions_ledger.json';
                let ledger = { commissions: [], total_paid: 0 };

                if (fs.existsSync(commissionsLedger)) {
                    ledger = JSON.parse(fs.readFileSync(commissionsLedger, 'utf8'));
                }

                ledger.commissions.push({
                    affiliate_id: affiliateId,
                    payment_id: payment.id,
                    sale_cents: grossAmount,
                    commission_cents: commissionCents,
                    commission_rate: 0.15,
                    timestamp: new Date().toISOString(),
                    status: 'PENDING_PAYOUT'
                });

                ledger.total_paid = (ledger.total_paid || 0) + commissionCents;

                atomicWriteSync(commissionsLedger, ledger);
                console.log(\`💰 15% commission: $\${(commissionCents / 100).toFixed(2)} to affiliate \${affiliateId}\`);
            }

            // CRITICAL: Gospel Split calculates on NET (after commission)
`;

// Find where to insert (after the marker line)
const markerEndIndex = content.indexOf('\n', insertionIndex);
content = content.slice(0, markerEndIndex) + commissionCode + content.slice(markerEndIndex);

// Now replace "calculateSplit(grossAmount)" with "calculateSplit(netAmount)"
content = content.replace(
    'const distribution = calculateSplit(grossAmount);',
    'const distribution = calculateSplit(netAmount); // NET after commission'
);

// Also update the Gross log line to show both gross and net
content = content.replace(
    /\[DAO\] Gross: \$\$\{.grossAmount \/ 100.\.toFixed\(2\)\}/,
    '[DAO] Gross: $${(grossAmount / 100).toFixed(2)} | Net: $${(netAmount / 100).toFixed(2)}'
);

// Write back
console.log('✍️  Writing updated dao-logic.js...');
fs.writeFileSync(file, content);

console.log('✅ Commission calculation added!');
console.log('');
console.log('📋 Summary:');
console.log('  - Checks payment.metadata.referral_id');
console.log('  - Calculates 15% commission (Math.floor for safety)');
console.log('  - Subtracts commission from gross → NET');
console.log('  - Records commission in commissions_ledger.json');
console.log('  - Gospel Split applies to NET (not gross)');
console.log('');
console.log('📍 Next: PM2 restart dao-hybrid-ftk on T5500');
