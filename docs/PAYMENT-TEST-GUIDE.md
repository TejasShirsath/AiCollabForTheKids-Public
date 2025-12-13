# Payment Flow Test Guide
## End-to-End Merch Store Validation

**Created:** 2025-12-07
**Author:** Haiku Agent (Test Planning)
**Status:** READY TO EXECUTE

---

## Quick Test Commands

### 1. List Products
```bash
curl http://localhost:54112/api/merch/products
```
**Expected:** 5 products, 52 variants

### 2. Create Checkout Session
```bash
curl -X POST http://localhost:54112/api/merch/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "PRODUCT_ID", "variantId": "VARIANT_ID", "quantity": 1}],
    "email": "test@youandinotai.com"
  }'
```
**Expected:** Returns `checkoutUrl` and `orderId`

### 3. Complete Payment
1. Open `checkoutUrl` in browser
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry, any 3-digit CVC
4. Complete checkout

### 4. Verify Gospel Split
```bash
curl https://dao.youandinotai.com/dao/calculate/24.99
```
**Expected:**
```json
{
  "input_dollars": "24.99",
  "distribution": {
    "charity": "$12.00",
    "infrastructure": "$7.20",
    "founder": "$4.80"
  }
}
```

### 5. Check DAO Health
```bash
curl https://dao.youandinotai.com/health
```
**Expected:** `status: "ACTIVE"`

---

## Gospel Split Examples

| Total | charity (50%) | Infrastructure (30%) | Founder (20%) |
|-------|----------------|---------------------|---------------|
| $24.99 | $12.50 | $7.50 | $5.00 |
| $29.99 | $15.00 | $9.00 | $6.00 |
| $99.98 | $49.99 | $29.99 | $19.99 |
| $150.00 | $75.00 | $45.00 | $30.00 |

---

## Validation Checklist

| Step | Test | Status |
|------|------|--------|
| 1 | API health check | [ ] |
| 2 | Products listed (5) | [ ] |
| 3 | Checkout session created | [ ] |
| 4 | Stripe payment completes | [ ] |
| 5 | Webhook received | [ ] |
| 6 | Order status = PAID | [ ] |
| 7 | Gospel split calculated | [ ] |
| 8 | DAO ledger updated | [ ] |

---

## Database Verification

```sql
-- Check order
SELECT "visibleId", status, total
FROM "Order"
WHERE email = 'test@youandinotai.com'
ORDER BY "createdAt" DESC LIMIT 1;

-- Verify Gospel split
SELECT amount, "charityAmount", "opsAmount", "founderAmount"
FROM "Transaction"
WHERE source = 'MERCH'
ORDER BY "createdAt" DESC LIMIT 1;
```

---

## Stripe Dashboard Verification

1. Go to: https://dashboard.stripe.com/payments
2. Find test payment
3. Verify:
   - Status: Succeeded
   - Amount: Correct
   - Metadata: Contains Gospel split info

---

## Webhook Verification

Check DAO node logs for:
```
Stripe Webhook Received: checkout.session.completed
Gospel Split Applied: $XX.XX → $X / $X / $X
```

---

## Success Criteria

All 8 checkpoints must pass:
1. API responding
2. Products returning
3. Checkout creates session
4. Payment succeeds
5. Webhook fires
6. Order recorded
7. Split calculated
8. Ledger updated

---

*FOR THE KIDS. ALWAYS.*
