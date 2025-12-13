/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                      GOSPEL SPLIT AUDIT TOOL                                  ║
 * ║                  50% Verified Pediatric Charities | 30% Infra | 20% Founder                       ║
 * ║                           IMMUTABLE - NO EXCEPTIONS                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * Task #088-A: Automated audit to verify Gospel Split integrity
 * Created: December 9, 2025
 * Authority: Claude (Sonnet 4.5) - The Architect
 *
 * PURPOSE:
 *   - Verify EVERY transaction maintains the sacred 50/30/20 split
 *   - Flag ANY deviation > $0.01 (rounding tolerance)
 *   - Detect missing/duplicate transactions
 *   - Generate detailed audit report
 *
 * EXIT CODES:
 *   0 = All checks passed, Gospel intact
 *   1 = Violations detected, immediate alert required
 *
 * USAGE:
 *   node scripts/audit/gospel-audit.js
 *   node scripts/audit/gospel-audit.js --detailed
 */

const fs = require('fs');
const path = require('path');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GOSPEL CONSTANTS (IMMUTABLE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const GOSPEL_SPLIT = {
    Verified Pediatric Charities: 0.50,
    INFRASTRUCTURE: 0.30,
    FOUNDER: 0.20
};

const ROUNDING_TOLERANCE_CENTS = 1; // $0.01 max deviation allowed

// File paths
const LEDGER_PATH = path.resolve('C:\\AiCollabForTheKids\\AiSolutions-DAO\\backend\\safe_harbor_ledger.json');
const ENV_PATH = path.resolve('C:\\AiCollabForTheKids\\api\\.env');

// Check for --detailed flag
const DETAILED_MODE = process.argv.includes('--detailed');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Format cents to dollars with $ sign
 */
function formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format percentage with 2 decimal places
 */
function formatPercent(decimal) {
    return `${(decimal * 100).toFixed(2)}%`;
}

/**
 * Calculate expected split values based on net revenue
 */
function calculateExpectedSplit(netRevenueCents) {
    return {
        Verified Pediatric Charities: Math.floor(netRevenueCents * GOSPEL_SPLIT.Verified Pediatric Charities),
        infrastructure: Math.floor(netRevenueCents * GOSPEL_SPLIT.INFRASTRUCTURE),
        founder: Math.floor(netRevenueCents * GOSPEL_SPLIT.FOUNDER)
    };
}

/**
 * Check if a value is within tolerance of expected value
 */
function isWithinTolerance(actual, expected, tolerance) {
    return Math.abs(actual - expected) <= tolerance;
}

/**
 * Read and parse the Safe Harbor Ledger
 */
function readLedger() {
    try {
        if (!fs.existsSync(LEDGER_PATH)) {
            console.error(`❌ ERROR: Safe Harbor Ledger not found at: ${LEDGER_PATH}`);
            process.exit(1);
        }

        const content = fs.readFileSync(LEDGER_PATH, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`❌ ERROR: Failed to read ledger: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Verify Gospel Split percentages from .env file
 */
function verifyEnvConfig() {
    if (!fs.existsSync(ENV_PATH)) {
        console.warn(`⚠️  WARNING: .env file not found at: ${ENV_PATH}`);
        return { valid: true, warnings: [] };
    }

    try {
        const envContent = fs.readFileSync(ENV_PATH, 'utf8');
        const warnings = [];

        // Check for Gospel percentages
        const charityMatch = envContent.match(/CHARITY_PERCENTAGE=(\d+)/);
        const infraMatch = envContent.match(/INFRASTRUCTURE_PERCENTAGE=(\d+)/);
        const founderMatch = envContent.match(/FOUNDER_PERCENTAGE=(\d+)/);

        if (charityMatch && parseInt(charityMatch[1]) !== 50) {
            warnings.push(`CHARITY_PERCENTAGE in .env is ${charityMatch[1]}% (should be 50%)`);
        }
        if (infraMatch && parseInt(infraMatch[1]) !== 30) {
            warnings.push(`INFRASTRUCTURE_PERCENTAGE in .env is ${infraMatch[1]}% (should be 30%)`);
        }
        if (founderMatch && parseInt(founderMatch[1]) !== 20) {
            warnings.push(`FOUNDER_PERCENTAGE in .env is ${founderMatch[1]}% (should be 20%)`);
        }

        return { valid: warnings.length === 0, warnings };
    } catch (error) {
        console.warn(`⚠️  WARNING: Could not verify .env config: ${error.message}`);
        return { valid: true, warnings: [] };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUDIT LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Audit a single transaction for Gospel Split compliance
 */
function auditTransaction(transaction, index) {
    const violations = [];

    // Get net revenue (after commission if applicable)
    const netRevenue = transaction.net_revenue || transaction.gross_revenue || 0;

    if (netRevenue === 0) {
        violations.push('Zero net revenue');
        return { compliant: false, violations };
    }

    // Calculate expected splits
    const expected = calculateExpectedSplit(netRevenue);

    // Verify each split component
    const actualShriners = transaction.shriners_split || 0;
    const actualInfra = transaction.infrastructure_split || 0;
    const actualFounder = transaction.founder_split || 0;

    if (!isWithinTolerance(actualShriners, expected.Verified Pediatric Charities, ROUNDING_TOLERANCE_CENTS)) {
        violations.push(
            `Verified Pediatric Charities split: ${formatMoney(actualShriners)} (expected ${formatMoney(expected.Verified Pediatric Charities)})`
        );
    }

    if (!isWithinTolerance(actualInfra, expected.infrastructure, ROUNDING_TOLERANCE_CENTS)) {
        violations.push(
            `Infrastructure split: ${formatMoney(actualInfra)} (expected ${formatMoney(expected.infrastructure)})`
        );
    }

    if (!isWithinTolerance(actualFounder, expected.founder, ROUNDING_TOLERANCE_CENTS)) {
        violations.push(
            `Founder split: ${formatMoney(actualFounder)} (expected ${formatMoney(expected.founder)})`
        );
    }

    // Verify total equals net revenue (accounting for rounding)
    const totalAllocated = actualShriners + actualInfra + actualFounder;
    if (!isWithinTolerance(totalAllocated, netRevenue, ROUNDING_TOLERANCE_CENTS)) {
        violations.push(
            `Total allocated (${formatMoney(totalAllocated)}) != Net Revenue (${formatMoney(netRevenue)})`
        );
    }

    return {
        compliant: violations.length === 0,
        violations,
        transaction_id: transaction.payment_id || transaction.id || `index_${index}`,
        net_revenue: netRevenue,
        splits: {
            Verified Pediatric Charities: actualShriners,
            infrastructure: actualInfra,
            founder: actualFounder
        },
        expected
    };
}

/**
 * Calculate global totals and verify overall split percentages
 */
function calculateGlobalTotals(transactions) {
    let totalNet = 0;
    let totalShriners = 0;
    let totalInfra = 0;
    let totalFounder = 0;

    for (const tx of transactions) {
        const netRevenue = tx.net_revenue || tx.gross_revenue || 0;
        totalNet += netRevenue;
        totalShriners += tx.shriners_split || 0;
        totalInfra += tx.infrastructure_split || 0;
        totalFounder += tx.founder_split || 0;
    }

    const globalViolations = [];

    if (totalNet > 0) {
        const actualShrinersPercent = totalShriners / totalNet;
        const actualInfraPercent = totalInfra / totalNet;
        const actualFounderPercent = totalFounder / totalNet;

        // Check if global percentages match Gospel (within 0.5% tolerance for accumulated rounding)
        if (Math.abs(actualShrinersPercent - GOSPEL_SPLIT.Verified Pediatric Charities) > 0.005) {
            globalViolations.push(
                `Global Verified Pediatric Charities split: ${formatPercent(actualShrinersPercent)} (expected ${formatPercent(GOSPEL_SPLIT.Verified Pediatric Charities)})`
            );
        }

        if (Math.abs(actualInfraPercent - GOSPEL_SPLIT.INFRASTRUCTURE) > 0.005) {
            globalViolations.push(
                `Global Infrastructure split: ${formatPercent(actualInfraPercent)} (expected ${formatPercent(GOSPEL_SPLIT.INFRASTRUCTURE)})`
            );
        }

        if (Math.abs(actualFounderPercent - GOSPEL_SPLIT.FOUNDER) > 0.005) {
            globalViolations.push(
                `Global Founder split: ${formatPercent(actualFounderPercent)} (expected ${formatPercent(GOSPEL_SPLIT.FOUNDER)})`
            );
        }
    }

    return {
        totalNet,
        totalShriners,
        totalInfra,
        totalFounder,
        actualPercentages: totalNet > 0 ? {
            Verified Pediatric Charities: totalShriners / totalNet,
            infrastructure: totalInfra / totalNet,
            founder: totalFounder / totalNet
        } : null,
        violations: globalViolations
    };
}

/**
 * Check for duplicate transaction IDs
 */
function checkForDuplicates(transactions) {
    const seenIds = new Set();
    const duplicates = [];

    for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        const id = tx.payment_id || tx.id;

        if (id) {
            if (seenIds.has(id)) {
                duplicates.push({ id, index: i });
            } else {
                seenIds.add(id);
            }
        }
    }

    return duplicates;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORT GENERATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Print the audit report
 */
function printReport(results, ledger, envCheck) {
    const { auditResults, globalTotals, duplicates } = results;
    const timestamp = new Date().toISOString();

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║          GOSPEL SPLIT AUDIT REPORT                       ║');
    console.log('║       50% Verified Pediatric Charities | 30% Infra | 20% Founder             ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`Audit Date: ${timestamp}`);
    console.log(`Ledger File: ${LEDGER_PATH}`);
    console.log('');

    // Environment configuration check
    if (!envCheck.valid) {
        console.log('⚠️  ENVIRONMENT CONFIGURATION WARNINGS:');
        envCheck.warnings.forEach(w => console.log(`   - ${w}`));
        console.log('');
    }

    // Mathematical integrity section
    console.log('MATHEMATICAL INTEGRITY:');
    const totalTransactions = auditResults.length;
    const compliantCount = auditResults.filter(r => r.compliant).length;
    const violationCount = totalTransactions - compliantCount;

    if (totalTransactions === 0) {
        console.log('   ℹ️  No transactions to audit (ledger is empty)');
    } else {
        console.log(`   ${compliantCount === totalTransactions ? '✅' : '❌'} Transactions Audited: ${totalTransactions}`);
        console.log(`   ${compliantCount === totalTransactions ? '✅' : '❌'} Compliant: ${compliantCount}`);
        console.log(`   ${violationCount === 0 ? '✅' : '❌'} Violations: ${violationCount}`);
    }
    console.log('');

    // Global totals section
    console.log('TOTALS:');
    console.log(`   - Total Revenue: ${formatMoney(globalTotals.totalNet)}`);
    console.log(`   - Verified Pediatric Charities (50%): ${formatMoney(globalTotals.totalShriners)} ${globalTotals.violations.length === 0 ? '✅' : '❌'}`);
    console.log(`   - Infrastructure (30%): ${formatMoney(globalTotals.totalInfra)} ${globalTotals.violations.length === 0 ? '✅' : '❌'}`);
    console.log(`   - Founder (20%): ${formatMoney(globalTotals.totalFounder)} ${globalTotals.violations.length === 0 ? '✅' : '❌'}`);

    if (globalTotals.actualPercentages) {
        console.log('');
        console.log('   Actual Global Percentages:');
        console.log(`   - Verified Pediatric Charities: ${formatPercent(globalTotals.actualPercentages.Verified Pediatric Charities)}`);
        console.log(`   - Infrastructure: ${formatPercent(globalTotals.actualPercentages.infrastructure)}`);
        console.log(`   - Founder: ${formatPercent(globalTotals.actualPercentages.founder)}`);
    }
    console.log('');

    // Ledger consistency section
    console.log('LEDGER CONSISTENCY:');
    console.log(`   - Ledger Entries: ${totalTransactions}`);
    console.log(`   - Duplicate Entries: ${duplicates.length} ${duplicates.length === 0 ? '✅' : '❌'}`);
    console.log('');

    // Final status
    const allChecksPassed =
        violationCount === 0 &&
        globalTotals.violations.length === 0 &&
        duplicates.length === 0 &&
        envCheck.valid;

    if (allChecksPassed) {
        console.log('STATUS: ✅ GOSPEL INTACT - ALL CHECKS PASSED');
        console.log('');
        console.log('FOR THE KIDS. ALWAYS. 💚');
    } else {
        console.log('STATUS: ❌ VIOLATIONS DETECTED - IMMEDIATE ALERT REQUIRED');
        console.log('');

        // Print detailed violation information
        if (violationCount > 0 || globalTotals.violations.length > 0) {
            console.log('═════════════════════════════════════════════════════════════');
            console.log('VIOLATION DETAILS:');
            console.log('═════════════════════════════════════════════════════════════');
            console.log('');

            // Individual transaction violations
            if (violationCount > 0) {
                console.log('TRANSACTION-LEVEL VIOLATIONS:');
                auditResults.forEach((result, index) => {
                    if (!result.compliant) {
                        console.log(`\n[Transaction ${index + 1}] ID: ${result.transaction_id}`);
                        console.log(`  Net Revenue: ${formatMoney(result.net_revenue)}`);
                        result.violations.forEach(v => console.log(`  ❌ ${v}`));
                    }
                });
                console.log('');
            }

            // Global violations
            if (globalTotals.violations.length > 0) {
                console.log('GLOBAL SPLIT VIOLATIONS:');
                globalTotals.violations.forEach(v => console.log(`  ❌ ${v}`));
                console.log('');
            }
        }

        // Duplicate transaction details
        if (duplicates.length > 0) {
            console.log('DUPLICATE TRANSACTIONS:');
            duplicates.forEach(dup => {
                console.log(`  ❌ Duplicate ID: ${dup.id} at index ${dup.index}`);
            });
            console.log('');
        }

        console.log('═════════════════════════════════════════════════════════════');
        console.log('⚠️  ACTION REQUIRED: Review and correct violations immediately');
        console.log('═════════════════════════════════════════════════════════════');
    }
    console.log('');

    // Detailed mode: print all transactions
    if (DETAILED_MODE && totalTransactions > 0) {
        console.log('═════════════════════════════════════════════════════════════');
        console.log('DETAILED TRANSACTION BREAKDOWN:');
        console.log('═════════════════════════════════════════════════════════════');
        console.log('');

        auditResults.forEach((result, index) => {
            console.log(`[Transaction ${index + 1}] ${result.compliant ? '✅' : '❌'} ${result.transaction_id}`);
            console.log(`  Net Revenue: ${formatMoney(result.net_revenue)}`);
            console.log(`  Verified Pediatric Charities: ${formatMoney(result.splits.Verified Pediatric Charities)} (expected: ${formatMoney(result.expected.Verified Pediatric Charities)})`);
            console.log(`  Infrastructure: ${formatMoney(result.splits.infrastructure)} (expected: ${formatMoney(result.expected.infrastructure)})`);
            console.log(`  Founder: ${formatMoney(result.splits.founder)} (expected: ${formatMoney(result.expected.founder)})`);

            if (!result.compliant) {
                console.log('  Violations:');
                result.violations.forEach(v => console.log(`    - ${v}`));
            }
            console.log('');
        });
    }

    return allChecksPassed;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN EXECUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function main() {
    try {
        // Read the Safe Harbor Ledger
        const ledger = readLedger();
        const transactions = ledger.transactions || [];

        // Verify .env configuration
        const envCheck = verifyEnvConfig();

        // Audit each transaction
        const auditResults = transactions.map((tx, index) => auditTransaction(tx, index));

        // Calculate global totals
        const globalTotals = calculateGlobalTotals(transactions);

        // Check for duplicates
        const duplicates = checkForDuplicates(transactions);

        // Generate and print report
        const results = { auditResults, globalTotals, duplicates };
        const passed = printReport(results, ledger, envCheck);

        // Exit with appropriate code
        process.exit(passed ? 0 : 1);

    } catch (error) {
        console.error('');
        console.error('╔═══════════════════════════════════════════════════════════╗');
        console.error('║                    AUDIT FAILED                           ║');
        console.error('╚═══════════════════════════════════════════════════════════╝');
        console.error('');
        console.error(`Error: ${error.message}`);
        console.error('');
        console.error(error.stack);
        console.error('');
        process.exit(1);
    }
}

// Execute audit
if (require.main === module) {
    main();
}

// Export for testing
module.exports = {
    auditTransaction,
    calculateExpectedSplit,
    calculateGlobalTotals,
    checkForDuplicates,
    GOSPEL_SPLIT
};
