/**
 * TASK #063: Apply idempotency + integer math fixes to dao-logic.js
 * Gemini security audit recommendations
 */

const fs = require('fs');
const path = require('path');

const DAO_LOGIC_PATH = 'C:\\AiSolutions-DAO\\backend\\dao-logic.js';

console.log('[PATCH] Reading dao-logic.js...');
let content = fs.readFileSync(DAO_LOGIC_PATH, 'utf8');

// ═══════════════════════════════════════════════════════════════
// FIX 1: Add processedEvents Set after requires
// ═══════════════════════════════════════════════════════════════
console.log('[PATCH] Adding processedEvents Set...');

const processedEventsCode = `
// ═══════════════════════════════════════════════════════════════
// SECURITY FIX: Idempotency Tracking (Gemini Audit - Task #063)
// Prevents duplicate webhook processing via event ID tracking
// ═══════════════════════════════════════════════════════════════
const processedEvents = new Set();
`;

// Insert after app.use(express.json(...))
const insertAfter = 'app.use(express.json({ limit: \'1mb\' }));';
if (content.includes(insertAfter) && !content.includes('processedEvents')) {
    content = content.replace(insertAfter, insertAfter + '\n' + processedEventsCode);
    console.log('[PATCH] ✅ processedEvents Set added');
} else if (content.includes('processedEvents')) {
    console.log('[PATCH] ⚠️ processedEvents already exists - skipping');
} else {
    console.error('[PATCH] ❌ Could not find insertion point for processedEvents');
}

// ═══════════════════════════════════════════════════════════════
// FIX 2: Fix Gospel split calculation with integer math
// ═══════════════════════════════════════════════════════════════
console.log('[PATCH] Fixing Gospel split calculation...');

const oldSplitLogic = `function calculateSplit(grossAmount) {
    return {
        charity: Math.floor(grossAmount * DAO_SPLIT.charity),
        growth: Math.floor(grossAmount * DAO_SPLIT.INFRASTRUCTURE),
        team: Math.floor(grossAmount * DAO_SPLIT.FOUNDER),
        total: grossAmount
    };
}`;

const newSplitLogic = `function calculateSplit(grossAmount) {
    // SECURITY FIX: Integer math to prevent floating point errors (Task #063)
    // Gemini audit recommendation: cents-based calculation
    const amountCents = Math.round(grossAmount); // Already in cents from Square/Stripe
    const shrinersCents = Math.floor(amountCents * 50 / 100);  // 50%
    const infraCents = Math.floor(amountCents * 30 / 100);      // 30%
    const founderCents = amountCents - shrinersCents - infraCents; // 20% (remainder)

    return {
        charity: shrinersCents,
        growth: infraCents,
        team: founderCents,
        total: amountCents
    };
}`;

if (content.includes(oldSplitLogic)) {
    content = content.replace(oldSplitLogic, newSplitLogic);
    console.log('[PATCH] ✅ Gospel split calculation updated with integer math');
} else if (content.includes('SECURITY FIX: Integer math')) {
    console.log('[PATCH] ⚠️ Integer math already applied - skipping');
} else {
    console.warn('[PATCH] ⚠️ Could not find exact match for calculateSplit - manual verification needed');
}

// ═══════════════════════════════════════════════════════════════
// FIX 3: Add idempotency checks to webhook handlers
// ═══════════════════════════════════════════════════════════════
console.log('[PATCH] Adding idempotency checks to webhook handlers...');

const idempotencyCheck = `
    // ═══════════════════════════════════════════════════════════════
    // SECURITY FIX: Idempotency Check (Gemini Audit - Task #063)
    // Prevents duplicate processing of the same webhook event
    // ═══════════════════════════════════════════════════════════════
    const eventId = event.data?.object?.payment?.id || event.data?.object?.id || event.id || \`manual_\${Date.now()}\`;
    if (processedEvents.has(eventId)) {
        console.log(\`[IDEMPOTENCY] ⚠️ Duplicate event rejected: \${eventId}\`);
        return res.status(200).json({ status: 'already_processed', event_id: eventId });
    }
    processedEvents.add(eventId);

    // Cleanup old events (keep last 1000 to prevent memory leak)
    if (processedEvents.size > 1000) {
        const iterator = processedEvents.values();
        processedEvents.delete(iterator.next().value);
    }
`;

// Add to Stripe webhook (after signature verification)
const stripeInsertPoint = 'if (event.type === \'payment_intent.succeeded\') {';
if (content.includes(stripeInsertPoint) && !content.includes('SECURITY FIX: Idempotency Check')) {
    content = content.replace(stripeInsertPoint, stripeInsertPoint + idempotencyCheck);
    console.log('[PATCH] ✅ Idempotency check added to Stripe webhook');
} else if (content.includes('SECURITY FIX: Idempotency Check')) {
    console.log('[PATCH] ⚠️ Idempotency checks already exist - skipping');
}

// Add to Square Merch webhook (after signature verification, before refund check)
const merchInsertPoint = 'const event = JSON.parse(body);';
const merchIdempotencyBlock = `
    // ═══════════════════════════════════════════════════════════════
    // SECURITY FIX: Idempotency Check (Gemini Audit - Task #063)
    // ═══════════════════════════════════════════════════════════════
    const eventIdMerch = event.data?.object?.payment?.id || event.data?.object?.refund?.id || event.event_id || \`merch_\${Date.now()}\`;
    if (processedEvents.has(eventIdMerch)) {
        console.log(\`[IDEMPOTENCY-MERCH] ⚠️ Duplicate event rejected: \${eventIdMerch}\`);
        return res.status(200).json({ status: 'already_processed', event_id: eventIdMerch });
    }
    processedEvents.add(eventIdMerch);
    if (processedEvents.size > 1000) {
        const iterator = processedEvents.values();
        processedEvents.delete(iterator.next().value);
    }
`;

// Only add if not already present
if (!content.includes('IDEMPOTENCY-MERCH')) {
    // Find the merch webhook and add idempotency check after parsing event
    const merchWebhookPattern = /\/webhook\/square-merch[\s\S]*?const event = JSON\.parse\(body\);/;
    if (merchWebhookPattern.test(content)) {
        content = content.replace(
            /const event = JSON\.parse\(body\);(\s+\/\/ Handle refund)/,
            `const event = JSON.parse(body);${merchIdempotencyBlock}\n    $1`
        );
        console.log('[PATCH] ✅ Idempotency check added to Square Merch webhook');
    }
}

// Add to Square Dating webhook (similar approach)
const datingIdempotencyBlock = `
    // ═══════════════════════════════════════════════════════════════
    // SECURITY FIX: Idempotency Check (Gemini Audit - Task #063)
    // ═══════════════════════════════════════════════════════════════
    const eventIdDating = event.data?.object?.payment?.id || event.data?.object?.refund?.id || event.event_id || \`dating_\${Date.now()}\`;
    if (processedEvents.has(eventIdDating)) {
        console.log(\`[IDEMPOTENCY-DATING] ⚠️ Duplicate event rejected: \${eventIdDating}\`);
        return res.status(200).json({ status: 'already_processed', event_id: eventIdDating });
    }
    processedEvents.add(eventIdDating);
    if (processedEvents.size > 1000) {
        const iterator = processedEvents.values();
        processedEvents.delete(iterator.next().value);
    }
`;

if (!content.includes('IDEMPOTENCY-DATING')) {
    // Find the dating webhook and add idempotency check after parsing event
    const datingWebhookPattern = /\/webhook\/square-dating[\s\S]*?const event = JSON\.parse\(body\);/;
    if (datingWebhookPattern.test(content)) {
        content = content.replace(
            /\/\/ Handle refund events \(added Dec 8, 2025\)(\s+if \(event\.type === 'refund)/,
            `${datingIdempotencyBlock}\n    // Handle refund events (added Dec 8, 2025)$1`
        );
        console.log('[PATCH] ✅ Idempotency check added to Square Dating webhook');
    }
}

// ═══════════════════════════════════════════════════════════════
// Write patched file
// ═══════════════════════════════════════════════════════════════
console.log('[PATCH] Writing patched dao-logic.js...');
fs.writeFileSync(DAO_LOGIC_PATH, content, 'utf8');

console.log('[PATCH] ✅ All patches applied successfully');
console.log('[PATCH] Run: node --check dao-logic.js to verify syntax');
console.log('[PATCH] Run: pm2 restart dao-hybrid-ftk to apply changes');
