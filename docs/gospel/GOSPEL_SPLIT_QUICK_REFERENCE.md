# Gospel Split Implementation - Quick Reference

## Current Status
- **Account Type:** Standard (❌ Cannot split payments)
- **Charges Enabled:** No (pending approval)
- **Transfers:** Inactive (requires Platform account)
- **Account ID:** acct_1RpoSwICxJCevnbK

## What You Need to Do

### The Problem
Your Standard Stripe account **cannot automatically split payments** to multiple recipients (Verified Pediatric Charities, Infrastructure, Founder). Standard accounts only support payouts to a single linked bank account.

### The Solution
**Upgrade to Stripe Connect Platform Account** - This enables:
- Automatic fund distribution via Transfers API
- Connected accounts for each recipient
- Full automation via webhooks
- 50/30/20 Gospel Split implementation

## Immediate Action Items

### Week 1: Contact Stripe
```
Email: support@stripe.com
Subject: Upgrade Standard Account to Platform (Profit Split Processing)
Include:
- Account ID: acct_1RpoSwICxJCevnbK
- Use case: Automated profit allocation splits
- Recipient info request
```

### Weeks 2-3: Prepare Recipient Accounts
Gather from each recipient:

**Verified Pediatric Charities (50%)**
- Partner EIN: (pending) ✓ (in progress)
- Bank account for receiving transfers
- Contact/representative email

**Infrastructure Fund (30%)**
- Account holder name/business name
- EIN or tax ID
- Bank account details
- Representative email

**Founder (20%)**
- Personal/business name
- Tax ID (SSN or EIN)
- Bank account details
- Email

### Week 4: Test
- Create test transfers (small amounts: $1-$10)
- Verify funds reach each account
- Test webhook integration
- Document process

### Week 5: Launch
- Enable automatic Gospel Split
- Monitor first transactions
- Set up reporting

## Technical Implementation

### Basic Transfer Code
```javascript
// When charge is successful, split into 3 transfers

const chargeAmount = 10000; // $100 in cents

// 50% to Verified Pediatric Charities
stripe.transfers.create({
  amount: 5000,
  currency: 'usd',
  destination: 'acct_charity'
});

// 30% to Infrastructure
stripe.transfers.create({
  amount: 3000,
  currency: 'usd',
  destination: 'acct_infrastructure'
});

// 20% to Founder
stripe.transfers.create({
  amount: 2000,
  currency: 'usd',
  destination: 'acct_founder'
});
```

## Important Limitations

| Limitation | Detail |
|-----------|--------|
| Transfer Cap | Max $3,000 per transfer (Stripe limit) |
| Region | All accounts must be in same region (US) |
| Retry | Manual retry required if transfer fails |
| Speed | 2 business days to reach bank accounts |

## Cost Breakdown ($100 Example)

```
Donation Received:        $100.00
Stripe Fee (2.9% + $0.30):  -$3.29
Available for splits:       $96.71

Verified Pediatric Charities (50%): $48.36 ✓
Infrastructure (30%):    $29.01 ✓
Founder (20%):           $19.34 ✓
---
Total distributed:       $96.71 (96.7%)
```

## Key Benefits

✓ Fully automated (no manual transfers)
✓ Transparent to donors
✓ Compliant with payment regulations
✓ Tax-reportable for audit/IRS
✓ Scalable to any donation amount
✓ Built-in error handling possible

## Key Risks to Avoid

✗ Trying to split on Standard account (won't work)
✗ Manual transfers (error-prone, unsustainable)
✗ Assuming immediate payouts (2 business days typical)
✗ Ignoring transfer failures (requires manual retry)
✗ Cross-region transfers (US accounts only)

## Timeline Summary

```
Day 1-2:   Contact Stripe for upgrade
Day 5-10:  Stripe approves + Platform account ready
Day 10-15: Create connected accounts
Day 15-20: Verify all accounts + test transfers
Day 20-25: Deploy to production
Day 25+:   Monitor + optimize
```

**Total: 3-5 weeks to full implementation**

## FAQ

**Q: Can I do this with my Standard account?**
A: No, you need Platform account. Transfers API is for moving funds between Stripe accounts only.

**Q: What if one transfer fails?**
A: Stripe won't auto-retry. You'll need to manually retry failed transfers via dashboard or API.

**Q: How fast do recipients get the money?**
A: Typically 2 business days to their bank account (ACH transfer).

**Q: Do I need to apply for money transmitter license?**
A: No - Stripe handles compliance as the regulated entity. You just facilitate the splits.

**Q: What about tax reporting?**
A: Stripe generates 1099-NEC for transfers over $600. Keep detailed records.

**Q: Can I change the 50/30/20 split?**
A: Yes - it's just percentage calculations in your code. Update anytime.

**Q: Does the charity need a Stripe account?**
A: Yes - they need a connected account to receive transfers. It can be simpler than a full Platform.

## Resources

- Full Implementation Guide: `STRIPE_CONNECT_IMPLEMENTATION_RECOMMENDATION.md`
- Stripe Connect Docs: https://docs.stripe.com/connect
- Nonprofit Pricing: https://stripe.com/resources/more/charity-payment-processing-explained
- Transfers API: https://docs.stripe.com/api/transfers

---

**Next Action:** Email Stripe support this week requesting Platform account upgrade.

**Questions?** Check the full implementation guide.

