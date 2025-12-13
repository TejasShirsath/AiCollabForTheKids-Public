/**
 * Add Telegram alerts to webhook handlers
 */

const fs = require('fs');
const file = 'C:\\AiSolutions-DAO\\backend\\dao-logic.js';

console.log('Reading dao-logic.js...');
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// Find and modify webhook response lines
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Stripe webhook
    if (line.includes("res.status(200).json({ status: 'STRIPE_SPLIT_COMPLETE'")) {
        console.log('Found Stripe webhook at line', i+1);
        // Insert alert before response
        const indent = '            ';
        const alert = indent + 'await sendTelegramAlert(`💰 Stripe! $${(grossAmount/100).toFixed(2)} | charity: $${(distribution.charity/100).toFixed(2)}`);';
        lines.splice(i, 0, alert);
        i++; // Skip the line we just inserted
    }

    // Square Merch webhook
    if (line.includes("res.status(200).json({") && lines[i+1] && lines[i+1].includes("status: 'GOSPEL_SPLIT_LOGGED'")) {
        console.log('Found Square Merch webhook at line', i+1);
        const indent = '            ';
        const alert = indent + 'await sendTelegramAlert(`💰 Square Merch! $${(grossAmount/100).toFixed(2)} | charity: $${(distribution.charity/100).toFixed(2)}`);';
        lines.splice(i, 0, alert);
        i++;
    }

    // Square Dating webhook
    if (line.includes("res.status(200).json({") && lines[i+1] && lines[i+1].includes("status: 'LEDGER_UPDATED'")) {
        console.log('Found Square Dating webhook at line', i+1);
        const indent = '            ';
        const alert = indent + 'await sendTelegramAlert(`💰 Square Dating! $${(grossAmount/100).toFixed(2)} | charity: $${(distribution.charity/100).toFixed(2)}`);';
        lines.splice(i, 0, alert);
        i++;
    }
}

// Write back
console.log('Writing updated file...');
fs.writeFileSync(file, lines.join('\n'));
console.log('✅ Webhook alerts added successfully!');
