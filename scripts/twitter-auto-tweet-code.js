// Twitter Auto-Tweet Function
// Add this to AiSolutions-DAO/backend/dao-logic.js
// Task #050 - Auto-tweet on new donations

// =====================================================
// ADD TO TOP OF FILE (with other requires)
// =====================================================
const { TwitterApi } = require('twitter-api-v2');

// Twitter client (lazy init)
let twitterClient = null;
let lastTweetTime = 0;
const TWEET_COOLDOWN = 60000; // 1 minute between tweets

function getTwitterClient() {
    if (!twitterClient && process.env.TWITTER_API_KEY) {
        try {
            twitterClient = new TwitterApi({
                appKey: process.env.TWITTER_API_KEY,
                appSecret: process.env.TWITTER_API_SECRET,
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessSecret: process.env.TWITTER_ACCESS_SECRET,
            });
            console.log('[Twitter] ✅ Client initialized');
        } catch (err) {
            console.error('[Twitter] ❌ Failed to initialize:', err.message);
        }
    }
    return twitterClient;
}

// =====================================================
// ADD BEFORE WEBHOOK HANDLERS
// =====================================================

/**
 * Post donation announcement to Twitter
 * @param {number} amount - Donation amount
 * @param {string} source - Payment source (square-merch, square-dating, stripe)
 * @param {number} newTotal - New total raised
 */
async function postDonationTweet(amount, source, newTotal) {
    // Check if Twitter is enabled
    if (process.env.TWITTER_ENABLED !== 'true') {
        console.log('[Twitter] Disabled - set TWITTER_ENABLED=true to activate');
        return;
    }

    // Rate limiting - max 1 tweet per minute
    const now = Date.now();
    if (now - lastTweetTime < TWEET_COOLDOWN) {
        console.log('[Twitter] Rate limited - waiting', Math.ceil((TWEET_COOLDOWN - (now - lastTweetTime)) / 1000), 'seconds');
        return;
    }

    try {
        const client = getTwitterClient();
        if (!client) {
            console.log('[Twitter] ⚠️ Twitter API not configured - set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
            return;
        }

        // Calculate 50% split
        const charityAmount = (newTotal * 0.5).toFixed(2);

        // Format amounts
        const amountStr = amount.toFixed(2);
        const totalStr = newTotal.toFixed(2);

        // Construct tweet with AI disclosure (FTC/CA SB 1001/EU AI Act compliance)
        const tweetText = `🤖 AI-Generated | 🎉 New donation! $${amountStr} just raised for charity Children's Hospitals!

Total raised: $${totalStr}
50% to kids: $${charityAmount}

Every subscription helps heal children. Join us! 💚

#ForTheKids #VerifiedPediatricCharities
https://youandinotai.com`;

        // Post tweet
        console.log('[Twitter] Posting tweet:', tweetText.substring(0, 50) + '...');
        const tweet = await client.v2.tweet(tweetText);

        lastTweetTime = Date.now();
        console.log('[Twitter] ✅ Posted tweet ID:', tweet.data.id);
        console.log('[Twitter] View at: https://twitter.com/user/status/' + tweet.data.id);

    } catch (err) {
        console.error('[Twitter] ❌ Failed to post tweet:', err.message);

        // Log rate limit info if available
        if (err.rateLimit) {
            console.log('[Twitter] Rate limit - resets at:', new Date(err.rateLimit.reset * 1000));
        }
    }
}

// =====================================================
// ADD TO WEBHOOK HANDLERS
// =====================================================

// Example: In /webhook/square-merch handler
// After recording to ledger and calculating splits:

if (process.env.TWITTER_ENABLED === 'true') {
    // Post to Twitter (async, don't block webhook response)
    postDonationTweet(totalAmount, 'square-merch', ledger.total_revenue).catch(err => {
        console.error('[Twitter] Tweet failed:', err.message);
    });
}

// Same for /webhook/square-dating and /webhook/stripe-merch

// =====================================================
// PACKAGE INSTALLATION
// =====================================================

// Run on T5500:
// cd C:\AiSolutions-DAO\backend
// npm install twitter-api-v2

// =====================================================
// ENVIRONMENT VARIABLES (.env)
// =====================================================

// Add to C:\AiSolutions-DAO\backend\.env:
/*
# Twitter API (Auto-tweet on donations)
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
TWITTER_ENABLED=true
*/

// =====================================================
// RESTART PM2
// =====================================================

// After adding code and credentials:
// pm2 restart dao-hybrid-ftk

// =====================================================
// TESTING
// =====================================================

// Test in Node.js console:
/*
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

client.v2.tweet('Test tweet from AiCollab FOR THE KIDS! 💚')
    .then(tweet => console.log('✅ Tweet ID:', tweet.data.id))
    .catch(err => console.error('❌ Error:', err));
*/

// =====================================================
// FULL INTEGRATION EXAMPLE
// =====================================================

/*
// In /webhook/square-merch handler (around line 250-260):

app.post('/webhook/square-merch', async (req, res) => {
    // ... existing HMAC verification code ...

    if (eventType === 'payment.created' || eventType === 'payment.updated') {
        // ... existing payment processing code ...

        // Record to ledger
        const result = recordSquarePayment(transactionId, totalAmount, 'SQUARE_MERCH');

        // Auto-tweet (don't await - fire and forget)
        if (process.env.TWITTER_ENABLED === 'true') {
            postDonationTweet(totalAmount, 'square-merch', result.newTotal).catch(err => {
                console.error('[Twitter] Tweet failed:', err.message);
            });
        }

        res.json({ success: true, ...result });
    }
});
*/

// FOR THE KIDS. ALWAYS.
