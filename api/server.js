import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

// Routes
import julesRoutes from './routes/jules.js';
import campaignRoutes from './routes/campaign.js';
import adminRoutes from './routes/admin.js';
import webhookRoutes from './routes/webhooks.js';
import paymentsRoutes from './routes/payments.js';
import ageVerificationRoutes from './routes/age-verification.js';
import consentRoutes from './routes/consent.js';
import transparencyRoutes from './routes/transparency.js';
import squareSubscriptionRoutes from './routes/square-subscriptions.js';
import communityRoutes from './routes/community.js';
import freeDaoRoutes from './routes/free-dao.js';
import datingRoutes from './routes/dating.js';
import kickstarterRoutes from './routes/kickstarter.js';
import humanVerificationRoutes from './routes/human-verification.js';
import droidRoutes from './routes/droid.js';
import stripeSubscriptionRoutes from './routes/stripe-subscriptions.js';
import merchRoutes from './routes/merch.js';

// Services
import { verifyGospelSplit, GOSPEL_SPLIT } from './services/gospel-revenue.js';

dotenv.config();

// Verify Gospel split on startup
try {
  verifyGospelSplit();
  console.log('✅ GOSPEL SPLIT VERIFIED: 50% charity | 30% Infra | 20% Founder');
} catch (error) {
  console.error('🚨 GOSPEL SPLIT VERIFICATION FAILED - SHUTTING DOWN');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://192.168.0.101:8080',
    'http://192.168.0.104:8080',
    'http://192.168.0.104:5173',
    'https://jules-dashboard.pages.dev',
    'https://theoretical-bras-difference-kirk.trycloudflare.com',
    'https://api.aidoesitall.website',
    'https://aidoesitall.website',
    'https://www.aidoesitall.website',
    'https://dashboard.aidoesitall.website',
    'https://youandinotai.com',
    'https://www.youandinotai.com',
    'https://youandinotai.online',
    'https://youandinotai.pages.dev'
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
app.use(express.json());
app.use(express.static('../public'));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Root endpoint - API welcome page
app.get('/', (req, res) => {
  res.json({
    message: 'AiCollabForTheKids API - FOR THE KIDS!',
    status: 'LIVE IN PRODUCTION',
    mission: '50% revenue → charity Children\'s Hospitals',
    endpoints: {
      health: '/health',
      campaign: '/api/campaign/metrics',
      admin: '/api/admin/status',
      jules: '/api/jules/*',
      ageVerification: '/api/age-verification/*',
      consent: '/api/consent/*'
    },
    compliance: {
      ageVerification: 'Multi-layer (Self-attestation + Third-party)',
      cookieConsent: '3-Box System (Essential/Analytics/Marketing)',
      coppa: 'Safeguards active',
      reviewedBy: 'Jules (Gemini 1.5 Pro)'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AiCollabForTheKids API',
    timestamp: new Date().toISOString(),
    mission: 'FOR THE KIDS!'
  });
});

// API Routes
app.use('/api/jules', julesRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/age-verification', ageVerificationRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/transparency', transparencyRoutes);
app.use('/api/subscriptions', squareSubscriptionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/free-dao', freeDaoRoutes);
app.use('/api/dating', datingRoutes);
app.use('/api/kickstarter', kickstarterRoutes);
app.use('/api/verify-human', humanVerificationRoutes);
app.use('/api/droid', droidRoutes);
app.use('/api/stripe', stripeSubscriptionRoutes);
app.use('/api/merch', merchRoutes);

// Gospel Revenue endpoint
app.get('/api/gospel', (req, res) => {
  res.json({
    success: true,
    gospel: GOSPEL_SPLIT,
    message: 'GOSPEL SPLIT IS IMMUTABLE',
    verified: true,
    note: '50% to charity | 30% Infrastructure | 20% Founder'
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    mission: 'FOR THE KIDS - We will fix this!'
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 Jules API Server running on port ${PORT}`);
  logger.info(`Mission: FOR THE KIDS!`);
  logger.info(`Revenue: 50% → charity Children's Hospitals`);
});

export default app;
