/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MERCH STORE API ROUTES - FOR THE KIDS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Anti-AI Merchandise Store with Gospel-Compliant Revenue Split
 *
 * 50% → Verified Pediatric Charities (CHARITY_EIN=PENDING_VERIFICATION)
 * 30% → Infrastructure & Operations
 * 20% → Founder
 *
 * Stripe Integration for Secure Checkout
 * Webhook Processing for Order Fulfillment
 *
 * Created by Claude (Haiku 4.5) - December 7, 2025
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import express from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import prisma from '../prisma/client.js';
import { calculateGospelSplit, GOSPEL_SPLIT, recordTransaction } from '../services/gospel-revenue.js';

const router = express.Router();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/merch/products - List all active products with variants
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        variants: {
          where: { stockQuantity: { gt: 0 } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform for API response
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      sku: product.sku,
      inStock: product.variants.some(v => v.stockQuantity > 0),
      variants: product.variants.map(variant => ({
        id: variant.id,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        price: variant.price ? variant.price.toString() : product.price.toString(),
        stockQuantity: variant.stockQuantity,
        inStock: variant.stockQuantity > 0
      }))
    }));

    res.json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
      mission: 'FOR THE KIDS',
      gospelSplit: {
        charity: GOSPEL_SPLIT.CHARITY_PERCENTAGE,
        charityName: GOSPEL_SPLIT.CHARITY_NAME,
        charityEIN: GOSPEL_SPLIT.CHARITY_EIN
      }
    });

  } catch (error) {
    console.error('❌ PRODUCTS LIST ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/merch/products/:id - Get single product with variants
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          where: { stockQuantity: { gt: 0 } }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const response = {
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl,
        category: product.category,
        sku: product.sku,
        active: product.active,
        inStock: product.variants.some(v => v.stockQuantity > 0),
        variants: product.variants.map(variant => ({
          id: variant.id,
          size: variant.size,
          color: variant.color,
          sku: variant.sku,
          price: variant.price ? variant.price.toString() : product.price.toString(),
          stockQuantity: variant.stockQuantity,
          inStock: variant.stockQuantity > 0
        }))
      },
      mission: 'FOR THE KIDS'
    };

    res.json(response);

  } catch (error) {
    console.error('❌ PRODUCT DETAILS ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/merch/checkout - Create Stripe checkout session for merch purchase
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/checkout', async (req, res) => {
  try {
    const { items, email, successUrl, cancelUrl } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required and must contain at least one item'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Validate and fetch items from database
    const lineItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const { productId, variantId, quantity } = item;

      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          error: 'Each item must have productId and quantity (minimum 1)'
        });
      }

      // Fetch product
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true }
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product ${productId} not found`
        });
      }

      if (!product.active) {
        return res.status(400).json({
          success: false,
          error: `Product ${product.name} is no longer available`
        });
      }

      let price = product.price;
      let variantName = '';

      // If variant specified, get variant price and details
      if (variantId) {
        const variant = product.variants.find(v => v.id === variantId);

        if (!variant) {
          return res.status(404).json({
            success: false,
            error: `Variant ${variantId} not found for product ${product.name}`
          });
        }

        if (variant.stockQuantity < quantity) {
          return res.status(400).json({
            success: false,
            error: `Insufficient stock for ${product.name}. Available: ${variant.stockQuantity}, Requested: ${quantity}`
          });
        }

        price = variant.price || product.price;
        variantName = `${variant.color || ''}${variant.color && variant.size ? ' ' : ''}${variant.size || ''}`.trim();
      }

      const itemTotal = parseFloat(price) * quantity;
      totalAmount += itemTotal;

      // Create Stripe line item
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: variantName || product.description,
            images: product.imageUrl ? [product.imageUrl] : [],
            metadata: {
              productId: product.id,
              variantId: variantId || null,
              sku: product.sku
            }
          },
          unit_amount: Math.round(parseFloat(price) * 100) // Convert to cents
        },
        quantity: quantity
      });
    }

    // Calculate Gospel split
    const split = calculateGospelSplit(totalAmount);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: lineItems,
      success_url: successUrl || `${process.env.FRONTEND_URL}/merch/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/merch/cancel`,
      metadata: {
        orderType: 'merch',
        charityAmount: split.charity.amount.toString(),
        charityName: GOSPEL_SPLIT.CHARITY_NAME,
        charityEIN: GOSPEL_SPLIT.CHARITY_EIN,
        gospelCompliant: 'true',
        mission: 'FOR_THE_KIDS'
      }
    });

    console.log('🛍️ MERCH CHECKOUT SESSION CREATED:', {
      sessionId: session.id,
      email: email,
      itemCount: items.length,
      total: `$${totalAmount.toFixed(2)}`,
      charityAmount: `$${split.charity.amount}`,
      mission: 'FOR THE KIDS'
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      total: totalAmount.toFixed(2),
      itemCount: items.length,
      gospelSplit: {
        total: split.total.toFixed(2),
        charity: split.charity.amount.toString(),
        charityPercentage: split.charity.percentage,
        charityName: split.charity.recipient,
        charityEIN: split.charity.ein,
        infrastructure: split.infrastructure.amount.toString(),
        infrastructurePercentage: split.infrastructure.percentage,
        founder: split.founder.amount.toString(),
        founderPercentage: split.founder.percentage
      },
      mission: 'FOR THE KIDS'
    });

  } catch (error) {
    console.error('❌ MERCH CHECKOUT ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/merch/webhook - Stripe webhook for merch payments
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/webhook', async (req, res) => {
  try {
    // Verify Stripe signature
    const sig = req.headers['stripe-signature'];
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));

    if (!STRIPE_WEBHOOK_SECRET) {
      console.warn('⚠️  STRIPE_WEBHOOK_SECRET not configured. Skipping signature verification.');
      return res.status(400).json({
        success: false,
        error: 'Webhook secret not configured'
      });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('❌ WEBHOOK SIGNATURE VERIFICATION FAILED:', err.message);
      return res.status(400).json({
        success: false,
        error: 'Webhook signature verification failed'
      });
    }

    console.log(`🔔 STRIPE WEBHOOK RECEIVED: ${event.type}`);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      try {
        // Retrieve full session details with line items
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items']
        });

        const email = fullSession.customer_email;
        const amountTotal = fullSession.amount_total / 100; // Convert from cents
        const stripePaymentId = fullSession.payment_intent;

        // Calculate Gospel split
        const split = calculateGospelSplit(amountTotal);

        // Create Order record
        const visibleId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        const order = await prisma.order.create({
          data: {
            visibleId,
            email,
            status: 'PAID',
            total: amountTotal.toString(),
            stripePaymentId,
            shippingAddress: {}, // Will be populated by shipping webhook
            items: {
              create: fullSession.line_items.data.map(item => ({
                productId: item.price.product_data?.metadata?.productId || 'unknown',
                variantId: item.price.product_data?.metadata?.variantId || null,
                quantity: item.quantity,
                priceEach: (item.price.unit_amount / 100).toString()
              }))
            }
          },
          include: { items: true }
        });

        // Record transaction with Gospel split
        const transaction = await prisma.transaction.create({
          data: {
            amount: amountTotal.toString(),
            source: 'PRINTFUL_MERCH',
            projectType: 'EXISTING',
            description: `Merch Order ${order.visibleId}`,
            charityAmount: split.charity.amount.toString(),
            opsAmount: split.infrastructure.amount.toString(),
            founderAmount: split.founder.amount.toString(),
            metadata: {
              orderId: order.id,
              orderVisibleId: order.visibleId,
              sessionId: fullSession.id,
              email,
              itemCount: fullSession.line_items.data.length
            }
          }
        });

        // Also record using gospel-revenue service for ledger
        recordTransaction(
          amountTotal,
          'PRINTFUL_MERCH',
          {
            orderId: order.id,
            sessionId: fullSession.id,
            email: email,
            itemCount: fullSession.line_items.data.length
          }
        );

        console.log('✅ MERCH ORDER CREATED:', {
          orderId: order.visibleId,
          email: email,
          total: `$${amountTotal.toFixed(2)}`,
          charityAmount: `$${split.charity.amount}`,
          charityName: split.charity.recipient,
          transactionId: transaction.id,
          mission: 'FOR THE KIDS'
        });

      } catch (error) {
        console.error('❌ ERROR PROCESSING MERCH ORDER:', error);
        // Don't fail webhook - Stripe will retry
        // Log for manual intervention
        return res.status(500).json({
          success: false,
          error: 'Failed to process order',
          message: error.message,
          sessionId: session.id
        });
      }
    }

    // Handle charge.refunded event
    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const refundedAmount = charge.amount_refunded / 100; // Convert from cents

      try {
        // Find order by payment ID and update status
        const order = await prisma.order.findUnique({
          where: { stripePaymentId: charge.payment_intent }
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' }
          });

          console.log('🔄 MERCH ORDER REFUNDED:', {
            orderId: order.visibleId,
            refundAmount: `$${refundedAmount.toFixed(2)}`
          });
        }
      } catch (error) {
        console.error('❌ ERROR PROCESSING REFUND:', error);
      }
    }

    // Return success immediately (Stripe expects 200 response)
    res.json({ received: true, success: true });

  } catch (error) {
    console.error('❌ MERCH WEBHOOK ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/merch/order/:orderId - Get order details
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { visibleId: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: {
        id: order.visibleId,
        email: order.email,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map(item => ({
          product: item.product.name,
          variant: item.variant ? `${item.variant.color || ''}${item.variant.color && item.variant.size ? ' ' : ''}${item.variant.size || ''}`.trim() : null,
          quantity: item.quantity,
          priceEach: item.priceEach
        }))
      }
    });

  } catch (error) {
    console.error('❌ ORDER DETAILS ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/merch/session/:sessionId - Get checkout session details
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ['line_items']
    });

    res.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: (session.amount_total / 100).toFixed(2),
        itemCount: session.line_items.data.length,
        items: session.line_items.data.map(item => ({
          name: item.price.product_data?.name,
          quantity: item.quantity,
          unitAmount: (item.price.unit_amount / 100).toFixed(2)
        }))
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

export default router;
