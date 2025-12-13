/**
 * Claude Droid Daily Video Scheduler
 * FOR THE KIDS - 50% to Verified Pediatric Charities
 *
 * Runs as PM2 daemon - checks every hour if it's time to generate
 * Target: 8:00 AM EST daily
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const API_URL = 'http://localhost:3000/api/droid/generate-full-video';
const LOG_FILE = path.join(__dirname, '../output/droid-schedule.log');
const STATE_FILE = path.join(__dirname, '../output/droid-last-run.json');
const TARGET_HOUR = 8; // 8 AM EST

// Ensure directories exist
const outputDir = path.dirname(LOG_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function log(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    console.log(logLine.trim());
    try {
        fs.appendFileSync(LOG_FILE, logLine);
    } catch (e) {}
}

function getRandomCategory() {
    const weighted = ['technology', 'technology', 'business', 'business', 'science', 'health', 'entertainment', 'general'];
    return weighted[Math.floor(Math.random() * weighted.length)];
}

function httpPost(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const postData = JSON.stringify(data);

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 80,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 300000
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.write(postData);
        req.end();
    });
}

function getESTDate() {
    // Get current time in EST
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

function getLastRunDate() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const data = JSON.parse(fs.readFileSync(STATE_FILE));
            return data.lastRun ? new Date(data.lastRun) : null;
        }
    } catch (e) {}
    return null;
}

function saveLastRunDate() {
    fs.writeFileSync(STATE_FILE, JSON.stringify({ lastRun: new Date().toISOString() }));
}

async function generateDailyVideo() {
    const category = getRandomCategory();
    const startTime = Date.now();

    log('');
    log('═══════════════════════════════════════════════════════════════');
    log('CLAUDE DROID - GENERATING DAILY VIDEO');
    log(`Category: ${category}`);
    log('Mission: FOR THE KIDS - 50% to Verified Pediatric Charities Children\'s Hospitals');
    log('═══════════════════════════════════════════════════════════════');

    try {
        const response = await httpPost(API_URL, { category });
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        if (response.status !== 200) {
            throw new Error(`API returned ${response.status}`);
        }

        const result = response.data;
        log('SUCCESS! Video generated:');
        log(`  Status: ${result.status}`);
        log(`  Video: ${result.video?.filename || 'N/A'}`);
        log(`  Audio: ${result.audio?.filename || 'N/A'}`);
        log(`  Size: ${result.video?.sizeMB || 'N/A'} MB`);
        log(`  Words: ${result.wordCount || 'N/A'}`);
        log(`  Duration: ${duration}s`);
        log('═══════════════════════════════════════════════════════════════');

        saveLastRunDate();
        return { success: true };

    } catch (error) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        log(`ERROR: ${error.message}`);
        log(`Duration: ${duration}s`);
        log('Will retry at next check');
        log('═══════════════════════════════════════════════════════════════');
        return { success: false };
    }
}

function checkAndRun() {
    const now = getESTDate();
    const lastRun = getLastRunDate();
    const currentHour = now.getHours();

    // Only run at target hour (8 AM EST)
    if (currentHour !== TARGET_HOUR) {
        return;
    }

    // Check if already ran today
    if (lastRun) {
        const lastRunDate = new Date(lastRun.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        if (now.toDateString() === lastRunDate.toDateString()) {
            return; // Already ran today
        }
    }

    log('8 AM EST - Triggering daily video generation');
    generateDailyVideo();
}

// Start scheduler
log('');
log('╔═══════════════════════════════════════════════════════════════╗');
log('║  CLAUDE DROID DAILY SCHEDULER - STARTED                       ║');
log('║  Schedule: Daily at 8:00 AM EST                               ║');
log('║  Check interval: Every 15 minutes                             ║');
log('║  Mission: FOR THE KIDS - 50% to Verified Pediatric Charities Children\'s          ║');
log('╚═══════════════════════════════════════════════════════════════╝');

const lastRun = getLastRunDate();
if (lastRun) {
    log(`Last run: ${lastRun.toISOString()}`);
} else {
    log('Last run: Never');
}
log('');
log('Manual trigger: POST http://localhost:3000/api/droid/generate-full-video');
log('');

// Check immediately on start
checkAndRun();

// Check every 15 minutes
setInterval(checkAndRun, 15 * 60 * 1000);

// Keep process alive
process.on('SIGINT', () => {
    log('Scheduler shutting down...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Scheduler received SIGTERM, shutting down...');
    process.exit(0);
});

log('Scheduler running. Next check in 15 minutes.');
