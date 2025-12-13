/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STRIPE SUBSCRIPTIONS - FOR THE KIDS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 3 Subscription Tiers:
 * - Starter: $9.99/month
 * - Pro: $29.99/month
 * - VIP: $99.99/month
 *
 * 50% of ALL revenue goes to Verified Pediatric Charities (CHARITY_EIN=PENDING_VERIFICATION)
 *
 * Created by Claude (Opus 4.5) - December 5, 2025
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import express from 'express';
import Stripe from 'stripe';
import { calculateGospelSplit, GOSPEL_SPLIT } from '../services/gospel-revenue.js';

const router = express.Router();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION PLANS - IMMUTABLE PRICING
// ═══════════════════════════════════════════════════════════════════════════════

const SUBSCRIPTION_PLANS = Object.freeze({
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals getting started',
    price: 999, // $9.99 in cents
    priceDisplay: '$9.99',
    interval: 'month',
    features: [
      '100 AI queries per month',
      'Basic chat support',
      'Email support',
      '50% goes to Verified Pediatric Charities'
    ],
    stripePriceId: process.env.STRIPE_PRICE_STARTER || null
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Best for professionals and small teams',
    price: 2999, // $29.99 in cents
    priceDisplay: '$29.99',
    interval: 'month',
    features: [
      '1,000 AI queries per month',
      'Priority chat support',
      'Phone support',
      'Advanced analytics',
      '50% goes to Verified Pediatric Charities'
    ],
    stripePriceId: process.env.STRIPE_PRICE_PRO || null
  },
  vip: {
    id: 'vip',
    name: 'VIP',
    description: 'Enterprise-grade features for power users',
    price: 9999, // $99.99 in cents
    priceDisplay: '$99.99',
    interval: 'month',
    features: [
      'Unlimited AI queries',
      'Dedicated account manager',
      '24/7 priority support',
      'Custom integrations',
      'Early access to features',
      '50% goes to Verified Pediatric Charities'
    ],
    stripePriceId: process.env.STRIPE_PRICE_VIP || null
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/stripe/plans - List all subscription plans
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/plans', (req, res) => {
  const plans = Object.values(SUBSCRIPTION_PLANS).map(plan => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    priceDisplay: plan.priceDisplay,
    interval: plan.interval,
    features: plan.features
  }));

  res.json({
    success: true,
    plans,
    mission: 'FOR THE KIDS',
    gospelSplit: {
      charity: GOSPEL_SPLIT.CHARITY_PERCENTAGE,
      charityName: GOSPEL_SPLIT.CHARITY_NAME,
      charityEIN: GOSPEL_SPLIT.CHARITY_EIN
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/stripe/create-checkout-session - Create Stripe Checkout Session
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { planId, customerEmail, successUrl, cancelUrl } = req.body;

    // Validate plan
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan ID',
        validPlans: Object.keys(SUBSCRIPTION_PLANS)
      });
    }

    // Calculate Gospel split for display
    const split = calculateGospelSplit(plan.price / 100);

    // Create or retrieve price in Stripe
    let priceId = plan.stripePriceId;

    if (!priceId) {
      // Create product and price on-the-fly if not pre-configured
      const product = await stripe.products.create({
        name: `AiCollabForTheKids - ${plan.name} Plan`,
        description: plan.description,
        metadata: {
          planId: plan.id,
          gospelSplit: '50-30-20',
          charity: 'Verified Pediatric Charities'
        }
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: 'usd',
        recurring: {
          interval: plan.interval
        },
        metadata: {
          planId: plan.id,
          charityAmount: Math.round(plan.price * 0.5), // 50% to charity
          gospelCompliant: 'true'
        }
      });

      priceId = price.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl || `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        planId: plan.id,
        planName: plan.name,
        charityAmount: split.charity.amount.toString(),
        charityName: GOSPEL_SPLIT.CHARITY_NAME,
        charityEIN: GOSPEL_SPLIT.CHARITY_EIN,
        gospelCompliant: 'true',
        mission: 'FOR_THE_KIDS'
      },
      subscription_data: {
        metadata: {
          planId: plan.id,
          gospelSplit: '50-30-20'
        }
      }
    });

    console.log('💳 CHECKOUT SESSION CREATED:', {
      sessionId: session.id,
      plan: plan.name,
      amount: plan.priceDisplay,
      charityAmount: `$${split.charity.amount}`,
      mission: 'FOR THE KIDS'
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.priceDisplay
      },
      gospelSplit: {
        charityAmount: split.charity.amount,
        charityPercentage: GOSPEL_SPLIT.CHARITY_PERCENTAGE,
        charityName: GOSPEL_SPLIT.CHARITY_NAME
      },
      mission: 'FOR THE KIDS'
    });

  } catch (error) {
    console.error('❌ STRIPE CHECKOUT ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/stripe/session/:sessionId - Get checkout session details
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ['subscription', 'customer']
    });

    res.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        metadata: session.metadata
      },
      mission: 'FOR THE KIDS'
    });

  } catch (error) {
    console.error('❌ SESSION RETRIEVAL ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/stripe/cancel-subscription - Cancel a subscription
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID is required'
      });
    }

    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    console.log('🚫 SUBSCRIPTION CANCELLED:', {
      subscriptionId: subscription.id,
      status: subscription.status
    });

    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        canceledAt: subscription.canceled_at
      }
    });

  } catch (error) {
    console.error('❌ CANCEL SUBSCRIPTION ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/stripe/customer-portal - Create customer portal session
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/customer-portal', async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || process.env.FRONTEND_URL
    });

    res.json({
      success: true,
      url: session.url
    });

  } catch (error) {
    console.error('❌ CUSTOMER PORTAL ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create portal session',
      message: error.message
    });
  }
});

export default router;
