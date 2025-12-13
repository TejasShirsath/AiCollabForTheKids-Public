import express from 'express';

const router = express.Router();

// Square API configuration
const SQUARE_BASE_URL = 'https://connect.squareup.com/v2';
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

// POST /api/payments/create-checkout
// Create a Square checkout session for domain purchase
router.post('/create-checkout', async (req, res) => {
  try {
    const { domain, price, plan } = req.body;

    if (!domain || !price || !plan) {
      return res.status(400).json({
        error: 'Missing required fields: domain, price, plan'
      });
    }

    // Create payment link via Square REST API
    const response = await fetch(`${SQUARE_BASE_URL}/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': '2025-11-20',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: `${domain}-${Date.now()}`,
        quick_pay: {
          name: `${domain} - ${plan.toUpperCase()} Plan`,
          price_money: {
            amount: Math.round(price * 100), // Convert to cents
            currency: 'USD'
          },
          location_id: process.env.SQUARE_LOCATION_ID
        },
        checkout_options: {
          redirect_url: `http://localhost:54112/purchase/success?domain=${domain}`,
          ask_for_shipping_address: false
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to create checkout');
    }

    res.json({
      success: true,
      checkoutUrl: data.payment_link.url,
      orderId: data.payment_link.order_id
    });

  } catch (error) {
    console.error('Square checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

// POST /api/payments/verify
// Verify payment completed successfully
router.post('/verify', async (req, res) => {
  try {
    const { orderId } = req.body;

    const response = await fetch(`${SQUARE_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Square-Version': '2025-11-20',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to retrieve order');
    }

    const order = data.order;
    const isPaid = order.state === 'COMPLETED';

    res.json({
      success: true,
      isPaid,
      order: {
        id: order.id,
        state: order.state,
        totalMoney: order.total_money,
        createdAt: order.created_at
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      error: 'Failed to verify payment',
      message: error.message
    });
  }
});

// GET /api/payments/plans
// Get available domain subscription plans
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: [
      {
        id: 'basic',
        name: 'Basic Domain',
        description: 'Standard domain registration',
        price: 12.99,
        duration: '1 year',
        features: [
          'Domain registration',
          'DNS management',
          'Email forwarding',
          'WHOIS privacy'
        ]
      },
      {
        id: 'premium',
        name: 'Premium Domain + Hosting',
        description: 'Domain + basic hosting',
        price: 29.99,
        duration: '1 year',
        features: [
          'Everything in Basic',
          '10GB SSD storage',
          'SSL certificate',
          'Daily backups',
          'Email accounts (5)'
        ]
      },
      {
        id: 'business',
        name: 'Business Package',
        description: 'Full business solution',
        price: 99.99,
        duration: '1 year',
        features: [
          'Everything in Premium',
          '50GB SSD storage',
          'Priority support',
          'CDN integration',
          'Email accounts (unlimited)'
        ]
      }
    ],
    note: '50% of all revenue goes to charity Children\'s Hospitals!'
  });
});

export default router;
