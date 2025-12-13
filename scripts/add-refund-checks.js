// Add refund event checks to both webhook handlers
const fs = require('fs');
const f = 'C:/AiSolutions-DAO/backend/dao-logic.js';
let c = fs.readFileSync(f, 'utf8');

// Check if already has refund checks
if (c.includes("event.type === 'refund.created'")) {
    console.log('Refund checks already present');
    process.exit(0);
}

// Add refund check to MERCH webhook (first occurrence)
const merchOld = "if (event.type === 'payment.created' || event.type === 'payment.updated') {";
const merchNew = `if (event.type === 'refund.created' || event.type === 'refund.updated') { return handleSquareRefund(event, 'MERCH', res); }
        if (event.type === 'payment.created' || event.type === 'payment.updated') {`;
c = c.replace(merchOld, merchNew);

// Add refund check to DATING webhook (second occurrence)
// Count occurrences to find the dating one
let count = 0;
c = c.replace(/if \(event\.type === 'payment\.created' \|\| event\.type === 'payment\.updated'\) \{/g, (match) => {
    count++;
    if (count === 2) {
        return `if (event.type === 'refund.created' || event.type === 'refund.updated') { return handleSquareRefund(event, 'DATING', res); }
        if (event.type === 'payment.created' || event.type === 'payment.updated') {`;
    }
    return match;
});

fs.writeFileSync(f, c);
console.log('Refund checks added to both webhooks');
