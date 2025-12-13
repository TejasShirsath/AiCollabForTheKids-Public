# Discord Webhook Setup for Kickstarter Autonomy

**Purpose:** Enable automated campaign updates to your Discord server

---

## Step 1: Create Discord Webhook

1. Open Discord and go to your server
2. Right-click the **channel** where you want updates posted
3. Click **Edit Channel** (gear icon)
4. Go to **Integrations** → **Webhooks**
5. Click **New Webhook**
6. Name it: `Ai-Solutions Bot`
7. (Optional) Upload an avatar
8. Click **Copy Webhook URL**

**The URL looks like:**
```
https://discord.com/api/webhooks/1234567890123456789/abcdefghijklmnopqrstuvwxyz...
```

---

## Step 2: Add to .env File

On T5500, create/edit: `C:\AiSolutions-DAO\Kickstarter-Auto\.env`

```env
# Discord Webhook URL (paste the URL you copied)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN

# DAO Node URL (connects to local DAO for live stats)
DAO_NODE_URL=http://localhost:3001

# Campaign Goal ($)
CAMPAIGN_GOAL=100000

# Post interval in seconds (7200 = 2 hours)
POST_INTERVAL=7200
```

---

## Step 3: Test the Webhook

Run this command on T5500 to test:

```powershell
# Quick test with curl
curl -X POST "YOUR_DISCORD_WEBHOOK_URL" `
  -H "Content-Type: application/json" `
  -d '{"content": "Test from Kickstarter Autonomy! FOR THE KIDS"}'
```

Or use this Python test:

```python
import requests
webhook_url = "YOUR_DISCORD_WEBHOOK_URL"
requests.post(webhook_url, json={"content": "Kickstarter Autonomy Test!"})
```

---

## Step 4: Start Kickstarter Autonomy

On T5500:

```cmd
cd C:\AiSolutions-DAO\Kickstarter-Auto
docker-compose up -d
```

Or run directly:

```cmd
python autonomy_core.py
```

---

## What Gets Posted

Every 2 hours (configurable), the bot posts:
- Current funding amount (from DAO node)
- Campaign progress percentage
- Marketing messages with links

**Example Discord Embed:**
```
┌──────────────────────────────────────┐
│ Campaign Update                      │
├──────────────────────────────────────┤
│ UPDATE: We just hit $28.98 raised    │
│ for Ai-Solutions! The revolution     │
│ is automated. #AiSolutions           │
├──────────────────────────────────────┤
│ FOR THE KIDS | Goal: $100,000        │
└──────────────────────────────────────┘
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Webhook not configured" | Check DISCORD_WEBHOOK_URL in .env |
| No posts appearing | Verify webhook URL is correct |
| 401 Unauthorized | Webhook may have been deleted - create new one |
| 429 Rate Limited | Reduce POST_INTERVAL (min recommended: 3600) |

---

## Security Notes

- **NEVER** share your webhook URL publicly
- Anyone with the URL can post to your channel
- Regenerate webhook if compromised

---

**FOR THE KIDS - 50% to charity Children's Hospitals**
