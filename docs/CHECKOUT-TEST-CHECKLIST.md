# Square Checkout End-to-End Test Checklist
**Created:** December 8, 2025
**Purpose:** Manual payment verification for ai-solutions.store and youandinotai.com

---

## Payment Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER PAYMENT FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. CUSTOMER CLICKS CHECKOUT                                            │
│     └── ai-solutions.store or youandinotai.com                          │
│                                                                         │
│  2. REDIRECT TO SQUARE HOSTED PAGE                                      │
│     └── https://square.link/u/XXXXXXXX                                  │
│                                                                         │
│  3. CUSTOMER ENTERS PAYMENT INFO                                        │
│     └── Square handles PCI-DSS compliance                               │
│                                                                         │
│  4. PAYMENT PROCESSED BY SQUARE                                         │
│     └── Square account receives funds                                   │
│                                                                         │
│  5. WEBHOOK FIRES TO DAO NODE                                           │
│     ├── Merch/AI → /webhook/square-merch (joshlcoleman@gmail.com)       │
│     └── Dating   → /webhook/square-dating (ebaytrashortreasure@gmail.com)│
│                                                                         │
│  6. DAO RECORDS GOSPEL SPLIT                                            │
│     ├── 50% → charity (pending ledger)                                 │
│     ├── 30% → Infrastructure                                            │
│     └── 20% → Founder                                                   │
│                                                                         │
│  7. LEDGER UPDATED                                                      │
│     └── safe-harbor-ledger.json                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Test Checklist

### AI-SOLUTIONS.STORE (Merch/AI Products)
**Square Account:** joshlcoleman@gmail.com
**Webhook:** /webhook/square-merch

| # | Product | Price | Square Link | Test Status |
|---|---------|-------|-------------|-------------|
| 1 | AI Starter Pack | $9.99 | https://square.link/u/dOy7qaZI | [ ] UNTESTED |
| 2 | AI Pro Pack | $29.99 | https://square.link/u/wsolGkpI | [ ] UNTESTED |
| 3 | AI Enterprise | $99.99 | https://square.link/u/nOvb4lZA | [ ] UNTESTED |

### YOUANDINOTAI.COM (Dating Platform)
**Square Account:** ebaytrashortreasure@gmail.com
**Webhook:** /webhook/square-dating

| # | Product | Price | Square Link | Test Status |
|---|---------|-------|-------------|-------------|
| 4 | Basic Plan | $9.99 | https://square.link/u/D2qocvKS | [ ] UNTESTED |
| 5 | Premium Plan | $19.99 | https://square.link/u/vT34jn4f | [ ] UNTESTED |
| 6 | Elite Plan | $29.99 | https://square.link/u/bArIo5qo | [ ] UNTESTED |

---

## Post-Payment Verification Steps

### JOSHUA: After each test payment, verify these items:

#### A. Square Dashboard Verification
1. Log into Square Dashboard (https://squareup.com/dashboard)
2. Navigate to **Transactions** → **All Transactions**
3. Verify the payment appears with correct amount
4. Note the Transaction ID for cross-reference

#### B. DAO Node Webhook Verification
**Option 1: If Cloudflare Tunnel Active**
```bash
# Check logs on T5500 or EC2
docker logs kickstarter-autonomy 2>&1 | grep "SQUARE"
# Or check dao-logic logs
pm2 logs dao-node --lines 50
```

**Option 2: Check Ledger File Directly**
```bash
# On T5500 (192.168.0.101) or EC2 (3.84.226.108)
cat /path/to/safe-harbor-ledger.json | jq '.transactions[-1]'
```

#### C. Gospel Split Verification
For each payment, confirm the ledger recorded:
- `source`: Should match "SQUARE_MERCH" or "SQUARE_DATING"
- `distribution.charity`: 50% of gross
- `distribution.growth`: 30% of gross
- `distribution.team`: 20% of gross

**Example: $9.99 payment should show:**
```json
{
  "amount": 999,
  "distribution": {
    "charity": 499,
    "growth": 299,
    "team": 199
  }
}
```

---

## Webhook Configuration Reference

### Square Developer Dashboard Settings

**AI Solutions (Merch):**
- App: joshlcoleman@gmail.com Square app
- Webhook URL: `https://dao.youandinotai.com/webhook/square-merch`
- Events: `payment.created`, `payment.updated`
- Signature Key: Set as `SQUARE_MERCH_WEBHOOK_SECRET` in .env

**YouAndINotAI (Dating):**
- App: ebaytrashortreasure@gmail.com Square app
- Webhook URL: `https://dao.youandinotai.com/webhook/square-dating`
- Events: `payment.created`, `payment.updated`
- Signature Key: Set as `SQUARE_WEBHOOK_SECRET` in .env

---

## Known Issues / Notes

1. **Cloudflare Tunnel Status:** As of Dec 8, tunnel may be broken. Webhooks will queue if DAO node unreachable.

2. **Signature Verification:** Both webhook endpoints require valid HMAC signatures. If secrets don't match, webhooks will be rejected with 401.

3. **Manual Fallback:** If webhooks fail, manually record transactions in ledger using transaction ID from Square dashboard.

---

## Test Completion Sign-Off

| Date | Tester | Products Tested | Issues Found |
|------|--------|-----------------|--------------|
| ___ | Joshua | ___ | ___ |

---

**FOR THE KIDS - 50% to charity Children's Hospitals**
