/**
 * 💙 SQUARE SUBSCRIPTION API - FOR THE KIDS (Direct REST API - No SDK)
 *
 * Handles subscription creation, management, and tracking
 * 50% of all revenue automatically tracked for charity
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

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

    const response = await fetch(`${SQUARE_BASE_URL}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: SQUARE_HEADERS,
      body: JSON.stringify(checkoutData)
    });

    const result = await response.json();

    if (response.ok && result.payment_link) {
      // Create subscription record in database
      await prisma.subscription.create({
        data: {
          userId,
          tier: tier.toUpperCase(),
          status: 'ACTIVE',
          squareSubscriptionId: result.payment_link.id,
          orderId: result.payment_link.order_id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      });

      return res.json({
        success: true,
        checkoutUrl: result.payment_link.url,
        orderId: result.payment_link.order_id
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

/**
 * POST /api/subscriptions/webhook
 * Handle Square webhook events (payment success, subscription updates)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-square-hmacsha256-signature'];
    const body = req.body.toString();

    // Verify webhook signature
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
    console.log('Square webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment.created':
      case 'payment.updated':
        if (event.data?.object?.payment) {
          await handlePaymentSuccess(event.data.object.payment);
        }
        break;

      case 'subscription.created':
      case 'subscription.updated':
        if (event.data?.object?.subscription) {
          await handleSubscriptionUpdate(event.data.object.subscription);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(payment) {
  try {
    const amount = Number(payment.amount_money.amount) / 100;
    const beneficiaryAmount = amount * 0.50;
    const opsAmount = amount * 0.30;
    const founderAmount = amount * 0.20;

    // Record transaction with 50/30/20 split
    await prisma.transaction.create({
      data: {
        amount,
        source: 'DATING_APP',
        projectType: 'EXISTING',
        beneficiaryAmount,
        opsAmount,
        founderAmount,
        status: 'completed',
        metadata: {
          squarePaymentId: payment.id,
          orderId: payment.order_id
        }
      }
    });

    console.log(`💙 Payment processed: $${amount} (50% = $${beneficiaryAmount} → charity)`);
  } catch (error) {
    console.error('Error handling payment:', error);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdate(subscription) {
  try {
    const userId = subscription.customer_id;
    const status = mapSquareStatus(subscription.status);

    await prisma.subscription.upsert({
      where: { squareSubscriptionId: subscription.id },
      update: {
        status,
        updatedAt: new Date()
      },
      create: {
        userId,
        tier: 'PREMIUM', // Default, should be determined from subscription plan
        status,
        squareSubscriptionId: subscription.id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    console.log(`Subscription ${subscription.id} updated to ${status}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

/**
 * GET /api/subscriptions/status/:userId
 * Get user's current subscription status
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

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
        status: 'inactive',
        features: getFeaturesByTier('FREE')
      });
    }

    res.json({
      tier: subscription.tier,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      features: getFeaturesByTier(subscription.tier)
    });

  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel on Square
    if (subscription.squareSubscriptionId) {
      const response = await fetch(
        `${SQUARE_BASE_URL}/v2/subscriptions/${subscription.squareSubscriptionId}/cancel`,
        {
          method: 'POST',
          headers: SQUARE_HEADERS
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Square cancellation failed:', error);
        return res.status(500).json({ error: 'Failed to cancel subscription' });
      }
    }

    // Update in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED' }
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Helper functions
function mapSquareStatus(squareStatus) {
  const statusMap = {
    'ACTIVE': 'ACTIVE',
    'CANCELED': 'CANCELLED',
    'DEACTIVATED': 'EXPIRED',
    'PAUSED': 'PAYMENT_FAILED',
  };
  return statusMap[squareStatus] || 'ACTIVE';
}

function getFeaturesByTier(tier) {
  const features = {
    FREE: ['Basic profile', 'Limited matches (5/day)', 'Text messaging only', '50% to charity'],
    PREMIUM: ['Enhanced profile', 'Unlimited matches', 'Text + voice messaging', 'See who liked you', 'Ad-free experience', '50% to charity'],
    VIP: ['Premium profile with badge', 'Unlimited everything', 'Video calling', 'Priority support', 'Advanced filters', 'Profile boost monthly', '50% to charity']
  };
  return features[tier] || features.FREE;
}

export default router;
