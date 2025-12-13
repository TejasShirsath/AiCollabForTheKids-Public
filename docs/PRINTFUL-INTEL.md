# PRINTFUL API INTEL
## Gathered by Haiku Agent for Gemini Oracle

**Date:** 2025-12-07
**Status:** VERIFIED

---

## AUTHENTICATION

**Method:** OAuth 2.0 Bearer Token (replaced legacy API keys March 30, 2023)

**Header Format:**
```
Authorization: Bearer YOUR_TOKEN
```

**Token Creation:**
1. Go to developers.printful.com/login
2. Navigate to Tokens section
3. Create token with appropriate scopes
4. Store securely in environment variables

**Scopes Available:**
- `sync_products/write` - Required for product creation
- Store-level or Account-level access

---

## BASE URL

```
https://api.printful.com
```

API Versions:
- v1 (current stable)
- v2 (Open Beta - enhanced security, real-time stock updates)

---

## KEY ENDPOINTS

### Products
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/store/products` | GET | List all products |
| `/store/products` | POST | Create new sync product |

**Required Fields for Product Creation:**
- `sync_product.name`
- `sync_variants.variant_id`
- `sync_variants.files.url`

### Orders
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orders` | GET | List all orders |
| `/orders` | POST | Create new order |
| `/orders/{order_id}/status` | GET | Get order status |

### Webhooks
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhooks` | POST | Register webhook endpoint |

---

## ORDER FULFILLMENT FLOW

```
draft → pending → in fulfillment → fulfilled → shipped
```

**Status Definitions:**
1. **Waiting for fulfillment** - Submitted and paid, awaiting processing
2. **In fulfillment** - Being picked, printed, packed (2-5 business days)
3. **Fulfilled** - Printed and packaged, awaiting shipment
4. **Partially shipped** - Some items shipped, others processing
5. **Canceled** - Order canceled by user or support

---

## WEBHOOK EVENTS

| Event | Description |
|-------|-------------|
| `package_shipped` | Shipment dispatched (fires per package) |
| `package_returned` | Shipment returns to facility |
| `order_put_hold` | Order placed on hold |
| `order_remove_hold` | Order removed from hold |
| `stock_updated` | Inventory changes (v2: every 5 minutes) |
| `product_updated` | Product/variant created or updated |

**Webhook Requirements:**
- HTTPS enforced
- Request signing enabled
- Expected Response: HTTP 200 OK
- Retry policy: 1, 4, 16, 64, 256, 1024 minutes

---

## RATE LIMITING

- **Authenticated:** Unlimited (within reason)
- **Unauthenticated:** 30 requests per 60 seconds
- **Lockout:** 60 seconds if exceeded

---

## INTEGRATION STEPS FOR MERCH STORE

1. Register Printful account at developers.printful.com
2. Create OAuth 2.0 Bearer Token with `sync_products/write` scope
3. Store token in `.env` as `PRINTFUL_API_TOKEN`
4. Implement product sync: POST /store/products
5. Set up order creation: POST /orders with recipient/item details
6. Configure webhook: Register endpoint for `package_shipped` events
7. Implement webhook handler in DAO node
8. Monitor order status via webhooks or polling
9. Update customer notifications based on status

---

## ENVIRONMENT VARIABLES NEEDED

```env
PRINTFUL_API_TOKEN=your_oauth_bearer_token
PRINTFUL_WEBHOOK_URL=https://dao.youandinotai.com/webhook/printful
```

---

## SOURCES

- https://developers.printful.com/docs/
- https://www.printful.com/api
- https://developers.printful.com/docs/v2-beta/
- https://www.printful.com/docs/webhooks
- https://www.printful.com/docs/products

---

*Intel gathered by Haiku 3.5 Agent*
*FOR THE KIDS. ALWAYS.*
