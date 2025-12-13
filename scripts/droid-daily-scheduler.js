/**
 * Claude Droid Daily Video Scheduler
 * FOR THE KIDS - 50% to charity Children's Hospitals
 *
 * Runs as PM2 daemon with internal cron scheduling
 * Generates one YouTube Shorts video per day at 8 AM EST
 */

// Node.js 18+ has native fetch - no import needed
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_URL = 'http://localhost:3000/api/droid/generate-full-video';
const LOG_FILE = path.join(__dirname, '../output/droid-schedule.log');
const CATEGORIES = ['technology', 'business', 'science', 'health', 'entertainment', 'general'];

// 8 AM EST = 13:00 UTC (EST is UTC-5)
// Cron: minute hour day month weekday
const CRON_SCHEDULE = '0 13 * * *'; // 8 AM EST daily

// Ensure log directory exists
const logDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

function log(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    console.log(logLine.trim());
    fs.appendFileSync(LOG_FILE, logLine);
}

function getRandomCategory() {
    // Weighted towards tech/business for engagement
    const weighted = ['technology', 'technology', 'business', 'business', 'science', 'health', 'entertainment', 'general'];
    return weighted[Math.floor(Math.random() * weighted.length)];
}

async function generateDailyVideo() {
    const category = getRandomCategory();
    const startTime = Date.now();

    log('');
    log('═══════════════════════════════════════════════════════════════');
    log('CLAUDE DROID DAILY SCHEDULER - GENERATING VIDEO');
    log(`Category: ${category}`);
    log('Mission: FOR THE KIDS - 50% to charity Children\'s Hospitals');
    log('═══════════════════════════════════════════════════════════════');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category }),
            timeout: 300000 // 5 minute timeout
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        log('SUCCESS! Video generated:');
        log(`  Status: ${result.status}`);
        log(`  Video: ${result.video?.filename || 'N/A'}`);
        log(`  Audio: ${result.audio?.filename || 'N/A'}`);
        log(`  Size: ${result.video?.sizeMB || 'N/A'} MB`);
        log(`  Words: ${result.wordCount || 'N/A'}`);
        log(`  Duration: ${duration}s`);
        log('═══════════════════════════════════════════════════════════════');

        return { success: true, result, duration };

    } catch (error) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        log(`ERROR: ${error.message}`);
        log(`Duration: ${duration}s`);
        log('Will retry at next scheduled time');
        log('═══════════════════════════════════════════════════════════════');

        return { success: false, error: error.message, duration };
    }
}

// Start scheduler
log('');
log('╔═══════════════════════════════════════════════════════════════╗');
log('║  CLAUDE DROID DAILY SCHEDULER - STARTED                       ║');
log('║  Schedule: Daily at 8:00 AM EST (13:00 UTC)                   ║');
log('║  Mission: FOR THE KIDS - 50% to charity Children\'s          ║');
log('╚═══════════════════════════════════════════════════════════════╝');
log(`Cron Expression: ${CRON_SCHEDULE}`);
log('Waiting for next scheduled run...');

// Schedule the daily job
cron.schedule(CRON_SCHEDULE, () => {
    log('Cron trigger fired - Starting daily video generation');
    generateDailyVideo();
}, {
    scheduled: true,
    timezone: 'America/New_York' // EST/EDT
});

// Also expose manual trigger endpoint info
log('');
log('Manual trigger: POST http://localhost:3000/api/droid/generate-full-video');
log('');

// Keep process alive
process.on('SIGINT', () => {
    log('Scheduler shutting down...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Scheduler received SIGTERM, shutting down...');
    process.exit(0);
});
