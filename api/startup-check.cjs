#!/usr/bin/env node
/**
 * FOR THE KIDS - Backend Startup Health Check
 * Verifies all Corporate Sovereign Mode configuration before launch
 * Run this before starting the API server
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 FOR THE KIDS - Backend Startup Health Check\n');
console.log('=' .repeat(60));

let errors = [];
let warnings = [];

// Load .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  errors.push('.env file not found! Copy .env.example to .env');
} else {
  console.log('✅ .env file found');

  // Parse .env manually (don't use dotenv to avoid side effects)
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });

  // Critical Corporate Sovereign Mode Variables
  const requiredVars = {
    'MISSION': 'FOR_THE_KIDS',
    'REVENUE_MODEL': 'CORPORATE_SOVEREIGN',
    'ESCROW_PERCENT': '50',
    'INFRASTRUCTURE_PERCENT': '30',
    'DEVELOPER_PERCENT': '20',
    'PROJECT_TYPE': 'ORIGINAL',
    'CHARITY_NAME': 'Verified Pediatric Charities Children\'s Hospital',
    'CHARITY_EIN': 'PENDING_VERIFICATION'
  };

  console.log('\n📋 Corporate Sovereign Mode Configuration:');
  Object.entries(requiredVars).forEach(([key, expectedValue]) => {
    const actualValue = envVars[key];
    if (!actualValue) {
      errors.push(`Missing required variable: ${key}`);
      console.log(`  ❌ ${key}: NOT SET`);
    } else if (actualValue !== expectedValue) {
      errors.push(`Incorrect value for ${key}: expected "${expectedValue}", got "${actualValue}"`);
      console.log(`  ❌ ${key}: ${actualValue} (WRONG - should be ${expectedValue})`);
    } else {
      console.log(`  ✅ ${key}: ${actualValue}`);
    }
  });

  // Security Keys Check
  console.log('\n🔐 Security Keys:');
  const securityKeys = ['SALT', 'ENCRYPTION_KEY', 'JWT_SECRET', 'SESSION_SECRET', 'JULES_API_KEY'];
  securityKeys.forEach(key => {
    const value = envVars[key];
    if (!value || value.includes('your_') || value.includes('change_this') || value.length < 32) {
      errors.push(`Security key ${key} not generated or too short`);
      console.log(`  ❌ ${key}: NOT GENERATED (run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")`);
    } else {
      console.log(`  ✅ ${key}: ${value.substring(0, 10)}... (${value.length} chars)`);
    }
  });

  // Payment Configuration
  console.log('\n💳 Payment Configuration (Square):');
  const paymentVars = ['SQUARE_ACCESS_TOKEN', 'SQUARE_APP_ID', 'SQUARE_LOCATION_ID', 'SQUARE_ENVIRONMENT'];
  paymentVars.forEach(key => {
    const value = envVars[key];
    if (!value || value.includes('your_')) {
      errors.push(`Payment variable ${key} not configured`);
      console.log(`  ❌ ${key}: NOT CONFIGURED`);
    } else {
      if (key === 'SQUARE_ENVIRONMENT') {
        if (value === 'production') {
          console.log(`  ✅ ${key}: ${value} (PRODUCTION MODE 🚀)`);
        } else {
          warnings.push(`Square is in ${value} mode - not production`);
          console.log(`  ⚠️  ${key}: ${value} (NOT PRODUCTION)`);
        }
      } else {
        console.log(`  ✅ ${key}: ${value.substring(0, 15)}...`);
      }
    }
  });

  // Database Configuration
  console.log('\n🗄️  Database Configuration:');
  const databaseUrl = envVars['DATABASE_URL'];
  if (!databaseUrl || databaseUrl.includes('your_password')) {
    errors.push('DATABASE_URL not configured');
    console.log('  ❌ DATABASE_URL: NOT CONFIGURED');
  } else {
    const dbMatch = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (dbMatch) {
      console.log(`  ✅ DATABASE_URL: postgresql://${dbMatch[1]}:***@${dbMatch[3]}:${dbMatch[4]}/${dbMatch[5]}`);
    } else {
      console.log(`  ✅ DATABASE_URL: ${databaseUrl.substring(0, 30)}...`);
    }
  }

  // Domain Configuration
  console.log('\n🌐 Domain Configuration:');
  const domainVars = ['PRIMARY_DOMAIN', 'SECONDARY_DOMAIN', 'ADMIN_DASHBOARD'];
  const expectedDomains = {
    'PRIMARY_DOMAIN': 'youandinotai.com',
    'SECONDARY_DOMAIN': 'youandinotai.online',
    'ADMIN_DASHBOARD': 'aidoesitall.website'
  };
  domainVars.forEach(key => {
    const value = envVars[key];
    const expected = expectedDomains[key];
    if (!value) {
      warnings.push(`Domain ${key} not set`);
      console.log(`  ⚠️  ${key}: NOT SET`);
    } else if (value !== expected) {
      warnings.push(`Domain ${key} is ${value}, expected ${expected}`);
      console.log(`  ⚠️  ${key}: ${value} (expected ${expected})`);
    } else {
      console.log(`  ✅ ${key}: ${value}`);
    }
  });
}

// Check Prisma Schema
console.log('\n📐 Prisma Schema:');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  errors.push('Prisma schema not found at ../prisma/schema.prisma');
  console.log('  ❌ schema.prisma: NOT FOUND');
} else {
  console.log('  ✅ schema.prisma: FOUND');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  if (schemaContent.includes('Transaction') && schemaContent.includes('CharityDistribution')) {
    console.log('  ✅ Required models: Transaction, CharityDistribution');
  } else {
    errors.push('Prisma schema missing required models');
    console.log('  ❌ Required models: MISSING');
  }
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 HEALTH CHECK SUMMARY:\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✨ ALL CHECKS PASSED! Platform ready for launch! ✨');
  console.log('\n🚀 FOR THE KIDS - READY TO HELP CHILDREN! 💙');
  console.log('\nNext steps:');
  console.log('  1. Run: cd api && npm start');
  console.log('  2. Verify: curl http://localhost:3000/health');
  console.log('  3. Deploy: Follow LAUNCH-BLOCKERS-FIX.md');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`❌ ${errors.length} CRITICAL ERROR(S):\n`);
    errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} WARNING(S):\n`);
    warnings.forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));
  }

  console.log('\n🔧 FIX REQUIRED: Review errors above before starting server');
  console.log('\nFor help, see:');
  console.log('  - docs/DEPLOYMENT-STATUS.md');
  console.log('  - docs/LAUNCH-BLOCKERS-FIX.md');
  process.exit(1);
}
