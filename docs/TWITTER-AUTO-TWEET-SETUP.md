# Twitter Auto-Tweet Setup Guide

**Created:** 2025-12-08
**Task:** #050 - Auto-tweet on new donations for viral marketing
**Goal:** Automatically announce donations on Twitter/X to amplify social proof

---

## Why This Matters

**Every donation tweet = Free viral marketing**

When a payment comes in, automatically posting to Twitter:
- Creates social proof (people see others donating)
- Amplifies the 50% charity mission
- Drives organic traffic back to the sites
- Builds community momentum
- Zero cost, maximum reach

**Example Tweet:**
```
🎉 New donation! $19.99 just raised for charity Children's Hospitals!

Total raised: $48.97
50% to kids: $24.49

Every subscription helps heal children. Join us! 💚

#ForTheKids #VerifiedPediatricCharities
https://youandinotai.com
```

---

## Twitter API Requirements

### Step 1: Apply for Twitter Developer Account

1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Sign in with the Twitter account you want to tweet from
   - Recommended: **@AiDoesItAll** or create dedicated account
3. Click "Sign up for Free Account"
4. Fill out application:
   - **Account Type:** "Hobbyist" → "Making a bot"
   - **App Name:** "AiCollabForTheKids Donation Bot"
   - **Use Case:** "Automatically tweet when donations are received for charity (charity Children's Hospitals). 50% of all revenue goes to charity. Tweets provide transparency and social proof."
   - **Will you make Twitter content available to government?** No
5. Accept Terms & Submit

**Approval Time:** Usually instant to 24 hours

### Step 2: Create Twitter App

Once approved:

1. In Developer Portal, click "Create Project"
2. **Project Name:** "AiCollab Donation Tracker"
3. **Use Case:** "Making a bot"
4. **App Name:** "ForTheKids Bot"
5. **App Environment:** "Production"

### Step 3: Get API Credentials

After creating the app:

1. Navigate to your app → "Keys and tokens" tab
2. **API Key** (also called Consumer Key) - Copy this
3. **API Secret Key** (also called Consumer Secret) - Copy this
4. Under "Authentication Tokens":
   - Click "Generate" for **Access Token** and **Access Token Secret**
   - Copy both

**You'll need 4 credentials total:**
- `TWITTER_API_KEY` (Consumer Key)
- `TWITTER_API_SECRET` (Consumer Secret)
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`

### Step 4: Set App Permissions

1. In your app settings, go to "User authentication settings"
2. Click "Set up"
3. **App permissions:** Select "Read and write"
4. **Type of App:** "Web App, Automated App or Bot"
5. **Callback URLs:** `https://dao.youandinotai.com/twitter/callback`
6. **Website URL:** `https://youandinotai.com`
7. Save

---

## Add Credentials to Environment

### On T5500 (Production DAO Node)

1. SSH or RDP to T5500
2. Edit `.env` file:

```bash
cd C:\AiSolutions-DAO\backend
notepad .env
```

3. Add these lines:

```env
# Twitter API (Auto-tweet on donations)
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
TWITTER_ENABLED=true
```

4. Save and restart PM2:

```bash
pm2 restart dao-hybrid-ftk
```

### In GitHub Secrets (Backup)

```bash
gh secret set TWITTER_API_KEY --body "your_api_key_here" --repo Ai-Solutions-Store/AiCollabForTheKids
gh secret set TWITTER_API_SECRET --body "your_api_secret_here" --repo Ai-Solutions-Store/AiCollabForTheKids
gh secret set TWITTER_ACCESS_TOKEN --body "your_access_token_here" --repo Ai-Solutions-Store/AiCollabForTheKids
gh secret set TWITTER_ACCESS_SECRET --body "your_access_secret_here" --repo Ai-Solutions-Store/AiCollabForTheKids
```

---

## Implementation (Already Added to dao-logic.js)

The auto-tweet function has been added to `AiSolutions-DAO/backend/dao-logic.js`:

### Function: `postDonationTweet(amount, source, newTotal)`

**Called by webhook handlers when payment received**

**Tweet Format:**
```javascript
🎉 New donation! $19.99 just raised for charity Children's Hospitals!

Total raised: $48.97
50% to kids: $24.49

Every subscription helps heal children. Join us! 💚

#ForTheKids #VerifiedPediatricCharities
https://youandinotai.com
```

**Features:**
- ✅ Posts to Twitter via API v2
- ✅ Includes donation amount
- ✅ Shows running total
- ✅ Calculates 50% charity split
- ✅ Adds relevant hashtags
- ✅ Links back to site
- ✅ Rate limiting (max 1 tweet per minute)
- ✅ Error handling (logs failures, doesn't crash)
- ✅ Can be disabled via `TWITTER_ENABLED=false`

### Webhook Integration

Auto-tweet is called in **3 webhook handlers**:

1. `/webhook/square-merch` (Merch purchases)
2. `/webhook/square-dating` (Dating subscriptions)
3. `/webhook/stripe-merch` (Merch via Stripe)

**Code added:**
```javascript
// After recording to ledger
if (process.env.TWITTER_ENABLED === 'true') {
    postDonationTweet(totalAmount, 'square-merch', ledger.total_revenue);
}
```

---

## Testing the Auto-Tweet

### Test Mode (Without Twitter Credentials)

Auto-tweet will log to console but not post:

```
[Twitter] Would tweet: "🎉 New donation! $9.99..."
[Twitter] ⚠️ Twitter API not configured - set TWITTER_API_KEY
```

### Live Mode (With Twitter Credentials)

After adding credentials to `.env`:

1. Make a test purchase: https://square.link/u/D2qocvKS
2. Wait for webhook to fire
3. Check Twitter account for new tweet
4. Check logs: `pm2 logs dao-hybrid-ftk`

**Success Log:**
```
[Twitter] ✅ Posted tweet: "🎉 New donation! $9.99..."
[Twitter] Tweet ID: 1234567890123456789
```

**Error Log:**
```
[Twitter] ❌ Failed to tweet: Rate limit exceeded
[Twitter] Retrying in 60 seconds...
```

---

## Rate Limiting & Safeguards

### Built-in Protection

- **Max 1 tweet per minute** (prevents spam if multiple payments come in)
- **Duplicate detection** (won't tweet same amount twice in 5 minutes)
- **Error recovery** (retries failed tweets once)
- **Graceful degradation** (if Twitter API down, webhook still processes payment)

### Twitter API Limits

**Free Tier:**
- 1,500 tweets per month
- 50 tweets per day
- No cost

**With current revenue ($28.98):**
- ~3 donations/week = ~12 tweets/month
- Well within free tier limits

**At scale ($100K/year):**
- ~200 donations/month = ~200 tweets/month
- Still within free tier

---

## Tweet Variations (Future Enhancement)

Currently tweets are simple. Can add variety:

### Milestone Tweets
```javascript
// When reaching $1,000
🎊 MILESTONE! We just hit $1,000 raised for charity Children's Hospitals!

That's $500 going directly to help sick kids. Thank you! 💚

Join the mission: https://youandinotai.com
#ForTheKids #Milestone
```

### Large Donation Tweets
```javascript
// When donation > $50
🚀 WOW! $99.99 donation just came in for charity Children's!

That's $50 going straight to the kids. You're amazing! 💚

Total raised: $128.97
#ForTheKids #BigImpact
```

### Thank You Tweets
```javascript
// Random thank you (10% of tweets)
Thank you to everyone supporting charity Children's Hospitals through @YouAndINotAI! 💚

$XX.XX raised so far
Every subscription makes a difference

Join us: https://youandinotai.com
```

---

## Monitoring & Analytics

### Track Tweet Performance

Use Twitter Analytics (free):
1. Go to: https://analytics.twitter.com
2. Check:
   - **Impressions** (how many people saw it)
   - **Engagements** (likes, retweets, clicks)
   - **Link clicks** (traffic back to site)

**Expected Performance:**
- 100-500 impressions per tweet (organic)
- 5-10 engagements per tweet
- 2-5 website clicks per tweet

### Success Metrics

| Metric | Target |
|--------|--------|
| **Tweets/Week** | 2-5 (as donations grow) |
| **Avg Impressions** | 200+ per tweet |
| **Engagement Rate** | 2%+ (industry average) |
| **Click-Through** | 5+ clicks per tweet |

---

## Troubleshooting

### Issue: "Twitter API not configured"

**Solution:**
1. Check `.env` file has all 4 credentials
2. Restart PM2: `pm2 restart dao-hybrid-ftk`
3. Verify credentials are correct (no extra spaces)

### Issue: "Rate limit exceeded"

**Solution:**
- Twitter enforces rate limits
- Auto-tweet will retry in 60 seconds
- If persistent, check Twitter Developer Portal for limits

### Issue: "Invalid or expired token"

**Solution:**
1. Go to Twitter Developer Portal
2. Regenerate Access Token & Access Token Secret
3. Update `.env` with new credentials
4. Restart PM2

### Issue: "User authentication required"

**Solution:**
- App permissions must be "Read and write"
- Go to app settings → User authentication → Update permissions
- Regenerate tokens after changing permissions

---

## Legal & Compliance

### Twitter Terms of Service

✅ **Allowed:**
- Automated tweets about your own platform's activity
- Charity donation announcements
- Transparent bot behavior

❌ **Not Allowed:**
- Spamming unrelated hashtags
- Tweeting on behalf of users without permission
- Misleading or deceptive content

**Our Use Case:** ✅ Compliant
- Tweeting about our own donations
- Transparent (it's a bot announcing donations)
- Providing value (social proof + charity transparency)

### Privacy

- No personal information tweeted (names, emails, etc.)
- Only aggregate totals and donation amounts
- Compliant with GDPR/CCPA

---

## Alternative: Manual Tweets (No API)

If Twitter API is too complex, Joshua can tweet manually:

### Copy-Paste Template

```
🎉 New donation! $XX.XX just raised for charity Children's Hospitals!

Total raised: $XXX.XX
50% to kids: $XXX.XX

Every subscription helps heal children. Join us! 💚

#ForTheKids #VerifiedPediatricCharities
https://youandinotai.com
```

**When to Tweet:**
1. Check Safe Harbor Ledger: `curl https://dao.youandinotai.com/stats`
2. If new donations, update template with amounts
3. Post manually to Twitter

**Frequency:** 1-2 times per week (when donations come in)

---

## Next Steps (Immediate Action Required)

1. ⏳ Apply for Twitter Developer Account (https://developer.twitter.com)
2. ⏳ Create app + get 4 API credentials
3. ⏳ Add credentials to T5500 `.env` file
4. ⏳ Restart PM2: `pm2 restart dao-hybrid-ftk`
5. ⏳ Make test donation to verify auto-tweet works
6. ⏳ Monitor Twitter Analytics for engagement

---

**FOR THE KIDS. ALWAYS.**
**Every tweet = More visibility = More donations = More children helped**

---

## Technical Reference

### Twitter API v2 Endpoint

```javascript
POST https://api.twitter.com/2/tweets
Authorization: OAuth 1.0a
Content-Type: application/json

{
  "text": "Tweet content here"
}
```

### Node.js Package Used

```bash
npm install twitter-api-v2
```

**Documentation:** https://github.com/PLhery/node-twitter-api-v2

---

**Task #050 Status:** CODE COMPLETE (API setup required)
**Implementation:** Ready to activate once credentials added
