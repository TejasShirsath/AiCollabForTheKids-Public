/**
 * Claude Droid Affiliate Tweet Scheduler
 * FOR THE KIDS - 50% to charity Children's Hospitals
 *
 * Runs as PM2 daemon with internal cron scheduling
 * Posts 1 affiliate recruitment tweet per day at 10:00 AM EST
 * Rotates through 5 tweets in config/scheduling.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { TwitterApi } from 'twitter-api-v2';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config({ path: path.join(path.dirname(__dirname), '.env') });

// Configuration paths
const CONFIG_FILE = path.join(__dirname, '../config/scheduling.json');
const LOG_FILE = path.join(__dirname, '../output/affiliate-schedule.log');
const STATE_FILE = path.join(__dirname, '../output/affiliate-state.json');

// Twitter client (initialized on startup)
let TwitterClient = null;

// Ensure directories exist
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

/**
 * Load scheduling configuration
 */
function loadConfig() {
    try {
        const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        log(`ERROR: Failed to load config from ${CONFIG_FILE}: ${error.message}`);
        return null;
    }
}

/**
 * Load or initialize state (tracks which tweet to post next)
 */
function loadState() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const stateData = fs.readFileSync(STATE_FILE, 'utf8');
            return JSON.parse(stateData);
        }
    } catch (error) {
        log(`Warning: Could not load state file, starting fresh: ${error.message}`);
    }

    // Default state
    return {
        current_index: 0,
        total_posted: 0,
        last_posted: null,
        campaign_start: new Date().toISOString()
    };
}

/**
 * Save state to disk
 */
function saveState(state) {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
        log(`State saved: index=${state.current_index}, total=${state.total_posted}`);
    } catch (error) {
        log(`ERROR: Failed to save state: ${error.message}`);
    }
}

/**
 * Initialize Twitter API client
 */
async function initializeTwitter() {
    const appKey = process.env.TWITTER_API_KEY;
    const appSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;

    if (!appKey || !appSecret || !accessToken || !accessSecret) {
        log('ERROR: Twitter credentials not found in environment');
        log('Required: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
        return null;
    }

    try {
        const client = new TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });

        // Verify credentials
        const me = await client.v2.me();
        log(`✅ Twitter authenticated: @${me.data.username}`);
        return client;
    } catch (error) {
        log(`ERROR: Twitter authentication failed: ${error.message}`);
        return null;
    }
}

/**
 * Post affiliate tweet
 */
async function postAffiliateTweet() {
    const startTime = Date.now();

    log('');
    log('═══════════════════════════════════════════════════════════════');
    log('AFFILIATE RECRUITMENT CAMPAIGN - POSTING TWEET');
    log('Mission: FOR THE KIDS - 50% to charity Children\'s Hospitals');
    log('═══════════════════════════════════════════════════════════════');

    // Load config and state
    const config = loadConfig();
    if (!config || !config.affiliate_campaign || !config.affiliate_campaign.enabled) {
        log('ERROR: Campaign not enabled in config');
        log('═══════════════════════════════════════════════════════════════');
        return { success: false, error: 'Campaign disabled' };
    }

    const campaign = config.affiliate_campaign;
    const state = loadState();

    // Get current tweet to post
    const tweetIndex = state.current_index % campaign.tweets.length;
    const tweetText = campaign.tweets[tweetIndex];

    log(`Tweet #${tweetIndex + 1} of ${campaign.tweets.length}`);
    log(`Rotation: ${state.total_posted + 1} total tweets posted`);
    log('');
    log('Tweet Content:');
    log('─────────────────────────────────────────────────────────────');
    log(tweetText);
    log('─────────────────────────────────────────────────────────────');

    // Post to Twitter if client available
    if (!TwitterClient) {
        log('⚠️  Twitter not configured - tweet logged but not posted');

        // Update state anyway
        state.current_index = (state.current_index + 1) % campaign.tweets.length;
        state.total_posted += 1;
        state.last_posted = new Date().toISOString();
        saveState(state);

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        log(`Duration: ${duration}s`);
        log('═══════════════════════════════════════════════════════════════');

        return { success: true, mode: 'logged', duration };
    }

    // Post to Twitter
    try {
        const result = await TwitterClient.v2.tweet(tweetText);
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        log(`✅ Tweet posted! ID: ${result.data.id}`);
        log(`🔗 URL: https://twitter.com/i/web/status/${result.data.id}`);

        // Update state
        state.current_index = (state.current_index + 1) % campaign.tweets.length;
        state.total_posted += 1;
        state.last_posted = new Date().toISOString();
        state.last_tweet_id = result.data.id;
        saveState(state);

        log(`Duration: ${duration}s`);
        log(`Next tweet: #${(state.current_index % campaign.tweets.length) + 1}`);
        log('═══════════════════════════════════════════════════════════════');

        return { success: true, mode: 'posted', tweetId: result.data.id, duration };

    } catch (error) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        log(`ERROR: Tweet posting failed: ${error.message}`);
        log(`Duration: ${duration}s`);
        log('Will retry at next scheduled time');
        log('═══════════════════════════════════════════════════════════════');

        return { success: false, error: error.message, duration };
    }
}

/**
 * Startup routine
 */
async function startup() {
    log('');
    log('╔═══════════════════════════════════════════════════════════════╗');
    log('║  CLAUDE DROID AFFILIATE SCHEDULER - STARTING                  ║');
    log('║  Campaign: Affiliate Recruitment                              ║');
    log('║  Mission: FOR THE KIDS - 50% to charity                      ║');
    log('╚═══════════════════════════════════════════════════════════════╝');

    // Load config to verify
    const config = loadConfig();
    if (!config || !config.affiliate_campaign) {
        log('FATAL: Could not load config/scheduling.json');
        process.exit(1);
    }

    const campaign = config.affiliate_campaign;
    log(`Config loaded: ${campaign.tweets.length} tweets in rotation`);
    log(`Schedule: ${campaign.schedule.frequency} at ${campaign.schedule.time} ${campaign.schedule.timezone}`);
    log(`Enabled: ${campaign.enabled ? 'YES' : 'NO'}`);

    if (!campaign.enabled) {
        log('WARNING: Campaign is DISABLED in config');
        log('Set affiliate_campaign.enabled = true to activate');
    }

    // Initialize Twitter
    TwitterClient = await initializeTwitter();

    // Load current state
    const state = loadState();
    log(`State loaded: ${state.total_posted} tweets posted so far`);
    if (state.last_posted) {
        log(`Last posted: ${new Date(state.last_posted).toLocaleString()}`);
    }
    log(`Next tweet: #${(state.current_index % campaign.tweets.length) + 1}`);

    log('');
    log('Scheduler ready. Waiting for next scheduled run...');
    log('Manual trigger: Call postAffiliateTweet() function');
    log('');
}

/**
 * Schedule the daily job
 * 10:00 AM EST = 15:00 UTC (EST is UTC-5)
 * Cron: minute hour day month weekday
 */
const CRON_SCHEDULE = '0 15 * * *'; // 10 AM EST daily

// Run startup
await startup();

// Schedule the daily job
cron.schedule(CRON_SCHEDULE, () => {
    log('Cron trigger fired - Posting affiliate tweet');
    postAffiliateTweet();
}, {
    scheduled: true,
    timezone: 'America/New_York' // EST/EDT
});

log(`Cron scheduled: ${CRON_SCHEDULE} (10:00 AM EST daily)`);

// Graceful shutdown handlers
process.on('SIGINT', () => {
    log('Scheduler shutting down (SIGINT)...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Scheduler shutting down (SIGTERM)...');
    process.exit(0);
});

// Keep process alive
process.stdin.resume();
