# Telegram Bot Setup for Kickstarter Autonomy

**Purpose:** Enable automated campaign updates to your Telegram channel/group

---

## Step 1: Create Bot via @BotFather

1. Open Telegram and search for **@BotFather**
2. Start a chat and send: `/newbot`
3. Follow the prompts:
   - **Name:** `Ai-Solutions Bot`
   - **Username:** `AiSolutionsForTheKids_bot` (must end in `_bot`)
4. BotFather will reply with your **Bot Token**

**Token format:**
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567
```

**Save this token!** You'll need it for `TELEGRAM_BOT_TOKEN`

---

## Step 2: Get Your Chat ID

### Option A: For a Group/Channel

1. Add your bot to the group/channel as admin
2. Send any message in the group
3. Open this URL in browser (replace YOUR_TOKEN):
   ```
   https://api.telegram.org/botYOUR_TOKEN/getUpdates
   ```
4. Look for `"chat":{"id":-1001234567890}`
5. The number (including minus sign) is your **Chat ID**

### Option B: For Personal DM

1. Message your bot directly
2. Open the getUpdates URL (above)
3. Find `"chat":{"id":123456789}`
4. This positive number is your personal Chat ID

**Group IDs** start with `-100`
**Personal IDs** are positive numbers

---

## Step 3: Add to .env File

On T5500, edit: `C:\AiSolutions-DAO\Kickstarter-Auto\.env`

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567
TELEGRAM_CHAT_ID=-1001234567890

# DAO Node URL
DAO_NODE_URL=http://localhost:3001

# Campaign Settings
CAMPAIGN_GOAL=100000
POST_INTERVAL=7200
```

---

## Step 4: Test the Bot

### Quick Test via curl

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "<YOUR_CHAT_ID>", "text": "Test from Kickstarter Autonomy! FOR THE KIDS"}'
```

### Python Test

```python
import requests

token = "YOUR_BOT_TOKEN"
chat_id = "YOUR_CHAT_ID"
url = f"https://api.telegram.org/bot{token}/sendMessage"

response = requests.post(url, json={
    "chat_id": chat_id,
    "text": "Kickstarter Autonomy Test! FOR THE KIDS",
    "parse_mode": "HTML"
})
print(response.json())
```

---

## Step 5: Start Kickstarter Autonomy

On T5500:

```cmd
cd C:\AiSolutions-DAO\Kickstarter-Auto
python autonomy_core.py
```

Or with Docker:

```cmd
docker-compose up -d
```

---

## What Gets Posted

Every 2 hours (configurable), the bot posts messages like:

```
UPDATE: We just hit $28.98 raised for Ai-Solutions!
The revolution is automated. #AiSolutions #Crowdfunding
```

---

## Bot Commands (Optional Enhancement)

You can add these commands to BotFather for user interaction:

1. Message @BotFather
2. Send `/setcommands`
3. Select your bot
4. Paste:
```
status - Get current campaign status
goal - Show campaign goal
help - Get help
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Telegram not configured" | Check both TOKEN and CHAT_ID are set |
| "Bad Request: chat not found" | Bot not added to group, or wrong Chat ID |
| "Unauthorized" | Invalid bot token |
| 429 Too Many Requests | Reduce POST_INTERVAL (Telegram limit: 30 msg/sec) |

---

## Security Notes

- **NEVER** share your bot token publicly
- Anyone with the token can control your bot
- Regenerate token via @BotFather if compromised: `/revoke`

---

## Quick Reference

| Setting | Example Value |
|---------|---------------|
| `TELEGRAM_BOT_TOKEN` | `1234567890:ABCdef...` |
| `TELEGRAM_CHAT_ID` (group) | `-1001234567890` |
| `TELEGRAM_CHAT_ID` (personal) | `123456789` |

---

**FOR THE KIDS - 50% to charity Children's Hospitals**
