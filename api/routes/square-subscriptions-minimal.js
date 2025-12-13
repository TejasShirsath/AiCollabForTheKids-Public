/**
 * 💙 SQUARE SUBSCRIPTION API - FOR THE KIDS (Minimal - No Prisma for testing)
 */

import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Square API Configuration
const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

const SQUARE_HEADERS = {
  'Square-Version': '2024-11-20',
  'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * POST /api/subscriptions/create-checkout
 * Create a Square checkout session for subscription
 */
router.post('/create-checkout', async (req, res) => {
  try {
    const { tier, userId, email } = req.body;

    console.log('💙 Creating checkout:', { tier, userId, email });

    // Validate tier
    const validTiers = {
      'free': { price: 0, name: 'Free', planId: null },
      'premium': {
        price: 1999,
        name: 'Premium',
        planId: process.env.SQUARE_PREMIUM_PLAN_ID
      },
      'vip': {
        price: 4999,
        name: 'VIP',
        planId: process.env.SQUARE_VIP_PLAN_ID
      }
    };

    if (!validTiers[tier]) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }

    const plan = validTiers[tier];

    // Free tier - no checkout needed
    if (tier === 'free') {
      return res.json({
        success: true,
        tier: 'free',
        message: 'Free tier activated'
      });
    }

    // Create checkout session using direct REST API
    const idempotencyKey = `${userId}-${tier}-${Date.now()}`;

    const checkoutData = {
      idempotency_key: idempotencyKey,
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: [{
          name: `YouAndINotAI ${plan.name} Subscription`,
          quantity: '1',
          base_price_money: {
            amount: plan.price,
            currency: 'USD'
          },
          note: `50% benefits charity Children's Hospital`
        }]
      },
      checkout_options: {
        redirect_url: `${process.env.FRONTEND_URL || 'https://youandinotai.com'}/subscription-success`,
        ask_for_shipping_address: false,
        merchant_support_email: process.env.SUPPORT_EMAIL || 'support@youandinotai.com'
      }
    };

    console.log('Calling Square API...');
    const response = await fetch(`${SQUARE_BASE_URL}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: SQUARE_HEADERS,
      body: JSON.stringify(checkoutData)
    });

    const result = await response.json();

    if (response.ok && result.payment_link) {
      console.log('✅ Checkout created:', result.payment_link.url);

      return res.json({
        success: true,
        checkoutUrl: result.payment_link.url,
        orderId: result.payment_link.order_id,
        message: '💙 FOR THE KIDS - Payment system operational!'
      });
    } else {
      console.error('Square checkout creation failed:', result.errors);
      return res.status(500).json({
        error: 'Failed to create checkout session',
        message: result.errors?.[0]?.detail || 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Square checkout creation failed:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

// In-memory idempotency cache (upgrade to Redis/DB for production)
const processedEvents = new Map();

/**
 * POST /api/subscriptions/webhook
 * Handle Square webhook events with idempotency protection
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-square-hmacsha256-signature'];
    const body = req.body.toString();

    console.log('💙 Webhook received');

    // Verify webhook signature
    if (process.env.SQUARE_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac('sha256', process.env.SQUARE_WEBHOOK_SECRET);
      const webhookUrl = process.env.SQUARE_WEBHOOK_URL || 'https://youandinotai.com/api/subscriptions/webhook';
      hmac.update(webhookUrl + body);
      const expectedSignature = hmac.digest('base64');

      if (signature !== expectedSignature) {
        console.error('Webhook signature verification failed');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const event = JSON.parse(body);
    const eventId = event.event_id || event.id;

    console.log('Webhook event type:', event.type, 'ID:', eventId);

    // IDEMPOTENCY CHECK: Prevent duplicate processing
    if (processedEvents.has(eventId)) {
      console.log(`⚠️  Duplicate event detected: ${eventId} - skipping`);
      return res.json({ success: true, message: 'Event already processed' });
    }

    // Mark event as processed
    processedEvents.set(eventId, Date.now());

    // Clean old entries (keep last 1000 events)
    if (processedEvents.size > 1000) {
      const firstKey = processedEvents.keys().next().value;
      processedEvents.delete(firstKey);
    }

    // Log payment success
    if (event.type === 'payment.created' && event.data?.object?.payment) {
      const payment = event.data.object.payment;
      const amount = Number(payment.amount_money.amount) / 100;
      const beneficiaryAmount = amount * 0.50;
      console.log(`💙 Payment received: $${amount} (50% = $${beneficiaryAmount} → charity)`);
      console.log(`   Payment ID: ${payment.id} | Order: ${payment.order_id}`);
    }

    res.json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * GET /api/subscriptions/test
 * Test endpoint to verify routes are working
 */
router.get('/test', (req, res) => {
  res.json({
    status: 'operational',
    message: '💙 FOR THE KIDS - Payment API is live!',
    endpoints: {
      createCheckout: 'POST /api/subscriptions/create-checkout',
      webhook: 'POST /api/subscriptions/webhook',
      test: 'GET /api/subscriptions/test'
    }
  });
});

export default router;
