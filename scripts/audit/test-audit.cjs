/**
 * Test script for Gospel Audit Tool
 * Creates temporary test ledger and runs audit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEST_LEDGER = path.resolve(__dirname, 'test-ledger.json');
const REAL_LEDGER = path.resolve('C:\\AiCollabForTheKids\\AiSolutions-DAO\\backend\\safe_harbor_ledger.json');
const BACKUP_LEDGER = REAL_LEDGER + '.backup';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║       GOSPEL AUDIT TOOL - TEST SUITE                     ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

// Backup real ledger
console.log('📦 Backing up real ledger...');
if (fs.existsSync(REAL_LEDGER)) {
    fs.copyFileSync(REAL_LEDGER, BACKUP_LEDGER);
    console.log('✅ Backup created at:', BACKUP_LEDGER);
}

// Copy test ledger to real location
console.log('📋 Installing test ledger...');
fs.copyFileSync(TEST_LEDGER, REAL_LEDGER);
console.log('✅ Test ledger installed');
console.log('');

console.log('═══════════════════════════════════════════════════════════');
console.log('TEST 1: Audit with compliant transactions');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

try {
    const output = execSync('node scripts/audit/gospel-audit.cjs', {
        cwd: 'C:\\AiCollabForTheKids',
        encoding: 'utf8'
    });
    console.log(output);
    console.log('✅ TEST 1 PASSED');
} catch (error) {
    console.log(error.stdout);
    console.error('❌ TEST 1 FAILED');
}

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('TEST 2: Detailed mode audit');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

try {
    const output = execSync('node scripts/audit/gospel-audit.cjs --detailed', {
        cwd: 'C:\\AiCollabForTheKids',
        encoding: 'utf8'
    });
    console.log(output);
    console.log('✅ TEST 2 PASSED');
} catch (error) {
    console.log(error.stdout);
    console.error('❌ TEST 2 FAILED');
}

// Create a ledger with violations
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('TEST 3: Audit with violations (intentional)');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

const violationLedger = {
    "pending_shriners": 0,
    "pending_growth": 0,
    "pending_team": 0,
    "total_raised_square": 10000,
    "total_raised_stripe": 0,
    "donations_made": [],
    "transactions": [
        {
            "id": "txn_bad",
            "payment_id": "sq_pay_bad",
            "timestamp": "2025-12-05T10:00:00Z",
            "gross_revenue": 10000,
            "net_revenue": 10000,
            "shriners_split": 4000,  // VIOLATION: Should be 5000 (50%)
            "infrastructure_split": 3500,  // VIOLATION: Should be 3000 (30%)
            "founder_split": 2500,  // VIOLATION: Should be 2000 (20%)
            "source": "square-merch"
        }
    ]
};

fs.writeFileSync(REAL_LEDGER, JSON.stringify(violationLedger, null, 2));

try {
    const output = execSync('node scripts/audit/gospel-audit.cjs', {
        cwd: 'C:\\AiCollabForTheKids',
        encoding: 'utf8'
    });
    console.log(output);
    console.error('❌ TEST 3 FAILED (should have detected violations)');
} catch (error) {
    console.log(error.stdout);
    console.log('✅ TEST 3 PASSED (correctly detected violations)');
}

// Restore real ledger
console.log('');
console.log('📦 Restoring original ledger...');
if (fs.existsSync(BACKUP_LEDGER)) {
    fs.copyFileSync(BACKUP_LEDGER, REAL_LEDGER);
    fs.unlinkSync(BACKUP_LEDGER);
    console.log('✅ Original ledger restored');
} else {
    console.log('ℹ️  No backup to restore (ledger was empty)');
}

console.log('');
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║            TEST SUITE COMPLETED                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');
console.log('FOR THE KIDS. ALWAYS. 💚');
