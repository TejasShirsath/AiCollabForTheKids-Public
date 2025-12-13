/**
 * 💙 SQUARE SUBSCRIPTION API - FOR THE KIDS (Using Direct REST API)
 *
 * Handles subscription creation, management, and tracking
 * 50% of all revenue automatically tracked for charity
 */

import express from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { calculateGospelSplit, recordTransaction, GOSPEL_SPLIT, verifyGospelSplit } from '../services/gospel-revenue.js';

const router = express.Router();
const prisma = new PrismaClient();

// Verify Gospel split on route load
verifyGospelSplit();

// Square API configuration - GETTER FUNCTIONS to read env at request time (not module load)
const getSquareBaseUrl = () => process.env.SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

const getSquareHeaders = () => ({
  'Square-Version': '2024-12-18',
  'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
});

/**
 * POST /api/subscriptions/create-checkout
 * Create a Square checkout session for subscription
 */
router.post('/create-checkout', async (req, res) => {
  try {
    // Debug: Log Square configuration
    console.log('🔧 SQUARE DEBUG:', {
      baseUrl: getSquareBaseUrl(),
      environment: process.env.SQUARE_ENVIRONMENT,
      locationId: process.env.SQUARE_LOCATION_ID,
      tokenPrefix: process.env.SQUARE_ACCESS_TOKEN?.slice(0, 10) + '...'
    });

    const { tier, userId, email } = req.body;

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

    // Create checkout session for paid tiers using Square REST API
    const idempotencyKey = `${userId}-${tier}-${Date.now()}`;

    const checkoutPayload = {
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
        }],
        metadata: {
          userId,
          tier,
          source: 'DATING_APP',
          projectType: 'EXISTING',
          charityPercent: '50'
        }
      },
      checkout_options: {
        redirect_url: `${process.env.FRONTEND_URL}/subscription-success`,
        ask_for_shipping_address: false,
        merchant_support_email: process.env.SUPPORT_EMAIL || 'support@youandinotai.com'
      }
    };

    const response = await fetch(`${getSquareBaseUrl()}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: getSquareHeaders(),
      body: JSON.stringify(checkoutPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Square checkout creation failed:', data);
      return res.status(500).json({
        error: 'Failed to create checkout session',
        message: data.errors?.[0]?.detail || 'Unknown error'
      });
    }

    res.json({
      success: true,
      checkoutUrl: data.payment_link.url,
      orderId: data.payment_link.order_id
    });

  } catch (error) {
    console.error('Square checkout creation failed:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

/**
 * POST /api/subscriptions/webhook
 * Handle Square webhook events (payment success, subscription updates)
 *
 * Security: Verifies webhook signatures using HMAC-SHA256 with Square's webhook secret
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-square-hmacsha256-signature'];
    const body = req.body.toString();

    // Verify webhook signature with Square
    if (process.env.SQUARE_WEBHOOK_SECRET) {
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

    console.log('💙 Square webhook received:', event.type);

    switch (event.type) {
      case 'payment.created':
      case 'payment.updated':
        if (event.data?.object?.payment) {
          await handlePaymentSuccess(event.data.object.payment);
        }
        break;

      case 'invoice.payment_made':
        if (event.data?.object?.invoice) {
          await handleSubscriptionPayment(event.data.object.invoice);
        }
        break;

      case 'subscription.created':
      case 'subscription.updated':
        if (event.data?.object?.subscription) {
          await handleSubscriptionUpdate(event.data.object.subscription);
        }
        break;

      default:
        console.log('Unhandled webhook event:', event.type);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * GET /api/subscriptions/status/:userId
 * Get user's current subscription status
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Check database for active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!subscription) {
      return res.json({
        tier: 'FREE',
        active: true,
        features: ['Basic matching', 'Limited messages']
      });
    }

    res.json({
      tier: subscription.tier,
      active: subscription.status === 'ACTIVE',
      nextBillingDate: subscription.nextBillingDate,
      cancelledAt: subscription.cancelledAt,
      features: getFeaturesByTier(subscription.tier)
    });

  } catch (error) {
    console.error('Failed to get subscription status:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

/**
 * POST /api/subscriptions/cancel/:userId
 * Cancel user's subscription
 */
router.post('/cancel/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel in Square if subscription ID exists
    if (subscription.squareSubscriptionId) {
      const response = await fetch(
        `${getSquareBaseUrl()}/v2/subscriptions/${subscription.squareSubscriptionId}/actions/cancel`,
        {
          method: 'POST',
          headers: getSquareHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Square cancellation failed:', error);
      }
    }

    // Update in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Helper Functions

async function handlePaymentSuccess(payment) {
  const orderId = payment.order_id;
  const amount = Number(payment.amount_money.amount) / 100; // Convert cents to dollars

  // Use Gospel revenue service for IMMUTABLE split calculation
  const split = calculateGospelSplit(amount);

  // Record using Gospel service (in-memory ledger)
  recordTransaction(amount, 'DATING_APP', {
    squarePaymentId: payment.id,
    squareOrderId: orderId,
    status: payment.status
  });

  // Also record in database for persistence
  const transaction = await prisma.transaction.create({
    data: {
      amount,
      source: 'DATING_APP',
      projectType: 'EXISTING',
      charityAmount: split.charity.amount,
      opsAmount: split.infrastructure.amount,
      founderAmount: split.founder.amount,
      description: `Dating app subscription payment`,
      metadata: {
        squarePaymentId: payment.id,
        squareOrderId: orderId,
        status: payment.status,
        gospelVersion: split.gospelVersion,
        charityRecipient: split.charity.recipient,
        charityEIN: split.charity.ein
      }
    }
  });

  console.log(`💙 GOSPEL Payment recorded: $${amount}`);
  console.log(`   → $${split.charity.amount} (${GOSPEL_SPLIT.CHARITY_PERCENTAGE}%) to ${split.charity.recipient}`);
  console.log(`   → $${split.infrastructure.amount} (${GOSPEL_SPLIT.INFRASTRUCTURE_PERCENTAGE}%) to Infrastructure`);
  console.log(`   → $${split.founder.amount} (${GOSPEL_SPLIT.FOUNDER_PERCENTAGE}%) to Founder`);

  return transaction;
}

async function handleSubscriptionPayment(invoice) {
  const paymentRequest = invoice.payment_requests?.[0];
  if (!paymentRequest?.computed_amount_money?.amount) return;

  const amount = Number(paymentRequest.computed_amount_money.amount) / 100;

  const charityAmount = amount * 0.50;
  const opsAmount = amount * 0.30;
  const founderAmount = amount * 0.20;

  await prisma.transaction.create({
    data: {
      amount,
      source: 'DATING_APP',
      projectType: 'EXISTING',
      charityAmount,
      opsAmount,
      founderAmount,
      description: `Dating app recurring payment`,
      metadata: {
        squareInvoiceId: invoice.id,
        subscriptionId: invoice.subscription_id
      }
    }
  });

  console.log(`💙 Subscription payment recorded: $${amount} → $${charityAmount} to charity`);
}

async function handleSubscriptionUpdate(subscription) {
  const tier = determineTierFromPlan(subscription.plan_variation_id);
  const amount = tier === 'PREMIUM' ? 19.99 : tier === 'VIP' ? 49.99 : 0;

  // Update subscription status in database
  await prisma.subscription.upsert({
    where: {
      squareSubscriptionId: subscription.id
    },
    update: {
      status: mapSquareStatus(subscription.status),
      nextBillingDate: subscription.charged_through_date
        ? new Date(subscription.charged_through_date)
        : null
    },
    create: {
      userId: subscription.customer_id,
      email: null, // Email not available from subscription object
      squareSubscriptionId: subscription.id,
      squareCustomerId: subscription.customer_id,
      tier,
      status: mapSquareStatus(subscription.status),
      amount,
      nextBillingDate: subscription.charged_through_date
        ? new Date(subscription.charged_through_date)
        : null
    }
  });
}

function determineTierFromPlan(planId) {
  if (planId === process.env.SQUARE_PREMIUM_PLAN_ID) return 'PREMIUM';
  if (planId === process.env.SQUARE_VIP_PLAN_ID) return 'VIP';
  return 'FREE';
}

function mapSquareStatus(squareStatus) {
  const statusMap = {
    'ACTIVE': 'ACTIVE',
    'CANCELED': 'CANCELLED',
    'DEACTIVATED': 'EXPIRED',
    'PAUSED': 'PAYMENT_FAILED'
  };
  return statusMap[squareStatus] || 'ACTIVE';
}

function getFeaturesByTier(tier) {
  const features = {
    FREE: [
      'Basic profile',
      'Limited matches (5/day)',
      'Text messaging only',
      '50% to charity'
    ],
    PREMIUM: [
      'Enhanced profile',
      'Unlimited matches',
      'Text + voice messaging',
      'See who liked you',
      'Ad-free experience',
      '50% to charity'
    ],
    VIP: [
      'Premium profile with badge',
      'Unlimited everything',
      'Video calling',
      'Priority support',
      'Advanced filters',
      'Profile boost monthly',
      '50% to charity'
    ]
  };
  return features[tier] || features.FREE;
}

export default router;
