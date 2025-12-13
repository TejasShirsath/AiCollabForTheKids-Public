#!/usr/bin/env node

/**
 * CLAUDE API BUDGET TRACKER
 * FOR THE KIDS - Cost Control Utility
 *
 * Monitors API usage against $200/month budget cap
 * Quick sanity check tool for cost-effective orchestration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG_PATH = path.join(__dirname, 'budget-config.json');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

/**
 * Load budget configuration from JSON file
 */
function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Error reading config file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Generate a progress bar visualization
 * @param {number} percentage - Value from 0-100
 * @param {number} width - Width of bar in characters
 * @returns {string} Progress bar string
 */
function createProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Determine status and color based on percentage
 * @param {number} percentage - Percentage of budget used
 * @returns {object} Status info with color and label
 */
function getStatus(percentage) {
  if (percentage < 50) {
    return { label: 'HEALTHY', color: colors.green, icon: '✅' };
  } else if (percentage < 80) {
    return { label: 'WARNING', color: colors.yellow, icon: '⚠️ ' };
  } else if (percentage < 95) {
    return { label: 'CRITICAL', color: colors.red, icon: '🚨' };
  } else {
    return { label: 'HALT', color: colors.red, icon: '❌' };
  }
}

/**
 * Format currency value
 * @param {number} value - Amount in dollars
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

/**
 * Calculate monthly projection based on current usage
 * @param {number} totalSpent - Total spent so far
 * @param {Date} periodStart - Start date of billing period
 * @returns {number} Projected monthly spend
 */
function calculateProjection(totalSpent, periodStart) {
  const now = new Date();
  const daysElapsed = Math.ceil((now - periodStart) / (1000 * 60 * 60 * 24));
  const daysInMonth = 30; // Approximation

  if (daysElapsed === 0) return totalSpent;

  return (totalSpent / daysElapsed) * daysInMonth;
}

/**
 * Main tracker function
 */
function runBudgetTracker() {
  const config = loadConfig();

  // Extract configuration
  const budgetCap = config.budget_cap;
  const currentPeriod = config.current_period;
  const usage = config.usage;

  // Calculate totals
  const opusSpent = usage.opus || 0;
  const sonnetSpent = usage.sonnet || 0;
  const haikuSpent = usage.haiku || 0;
  const totalSpent = opusSpent + sonnetSpent + haikuSpent;
  const remaining = budgetCap - totalSpent;
  const percentageUsed = (totalSpent / budgetCap) * 100;

  // Get status
  const status = getStatus(percentageUsed);

  // Calculate projection (assuming December 2025)
  const periodStart = new Date('2025-12-01');
  const projection = calculateProjection(totalSpent, periodStart);

  // Print header with decorative border
  console.log('\n' + colors.bright + colors.cyan);
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║          CLAUDE API BUDGET TRACKER                    ║');
  console.log('║              FOR THE KIDS - Cost Control              ║');
  console.log('╚═══════════════════════════════════════════════════════╝' + colors.reset);

  // Budget information
  console.log(`\n${colors.bright}Budget Period:${colors.reset} ${currentPeriod}`);
  console.log(`${colors.bright}Total Budget:${colors.reset} ${formatCurrency(budgetCap)}`);

  // Current usage section
  console.log(`\n${colors.bright}CURRENT USAGE:${colors.reset}`);

  // Opus 4.5
  const opusPercent = (opusSpent / budgetCap) * 100;
  console.log(
    `- Opus 4.5:    ${formatCurrency(opusSpent).padEnd(8)} (${opusPercent.toFixed(1)}%)  ${createProgressBar(opusPercent)}`
  );

  // Sonnet 4.5
  const sonnetPercent = (sonnetSpent / budgetCap) * 100;
  console.log(
    `- Sonnet 4.5:  ${formatCurrency(sonnetSpent).padEnd(8)} (${sonnetPercent.toFixed(1)}%)  ${createProgressBar(sonnetPercent)}`
  );

  // Haiku 3.5
  const haikuPercent = (haikuSpent / budgetCap) * 100;
  console.log(
    `- Haiku 3.5:   ${formatCurrency(haikuSpent).padEnd(8)} (${haikuPercent.toFixed(1)}%)  ${createProgressBar(haikuPercent)}`
  );

  // Totals section
  console.log(`\n${colors.bright}SUMMARY:${colors.reset}`);
  console.log(
    `Total Spent:   ${formatCurrency(totalSpent).padEnd(8)} (${percentageUsed.toFixed(1)}%)  ${createProgressBar(percentageUsed)}`
  );
  console.log(`Remaining:     ${formatCurrency(remaining).padEnd(8)} (${(100 - percentageUsed).toFixed(1)}%)`);

  // Status alert
  console.log(`\n${colors.bright}STATUS:${colors.reset} ${status.color}${status.icon} ${status.label}${colors.reset} - ${getStatusMessage(percentageUsed)}`);

  // Projection
  console.log(`${colors.bright}PROJECTION:${colors.reset} ${formatCurrency(projection)}/month at current rate`);

  // Alerts if needed
  if (percentageUsed >= 95) {
    console.log(`\n${colors.red}${colors.bright}🚨 BUDGET HALT THRESHOLD REACHED 🚨${colors.reset}`);
    console.log(`${colors.red}Only ${formatCurrency(remaining)} remaining. Stop new API calls immediately.${colors.reset}`);
  } else if (percentageUsed >= 80) {
    console.log(`\n${colors.red}${colors.bright}⚠️  CRITICAL BUDGET WARNING ⚠️${colors.reset}`);
    console.log(`${colors.red}${(100 - percentageUsed).toFixed(1)}% budget remaining. Optimize usage urgently.${colors.reset}`);
  } else if (percentageUsed >= 50) {
    console.log(`\n${colors.yellow}${colors.bright}⚠️  BUDGET WARNING ⚠️${colors.reset}`);
    console.log(`${colors.yellow}${(100 - percentageUsed).toFixed(1)}% budget remaining. Monitor closely.${colors.reset}`);
  }

  console.log('');
}

/**
 * Get human-readable status message
 * @param {number} percentageUsed - Percentage of budget used
 * @returns {string} Status message
 */
function getStatusMessage(percentageUsed) {
  if (percentageUsed < 50) {
    return 'Well within budget';
  } else if (percentageUsed < 80) {
    return 'Approaching midpoint - watch usage';
  } else if (percentageUsed < 95) {
    return 'Nearing limit - reduce non-essential calls';
  } else {
    return 'Budget exhausted - no more calls';
  }
}

// Run the tracker
runBudgetTracker();
