# SECURITY CONFIGURATION GUIDE
## AiCollabForTheKids - Data Security Infrastructure

**Last Updated:** November 24, 2025  
**Mission:** FOR THE KIDS - Protecting user data while supporting children's charities  
**Reviewed By:** Jules (Gemini 1.5 Pro) - Business Director & DevOps AI

---

## 🎯 SECURITY OBJECTIVES

Per Jules' directive, our security architecture must:
1. **Encrypt all data** at rest and in transit
2. **Minimize PII retention** (especially government IDs)
3. **Implement least privilege access** (IAM policies)
4. **Enable tamper-proof audit trails** (BigQuery)
5. **Monitor threats in real-time** (GCP/AWS security tools)
6. **Protect the mission** - Security failures threaten charity funding

---

## 🔐 ENCRYPTION CONFIGURATION

### Data at Rest (AES-256)

#### Google Cloud Storage
```bash
# Create encrypted bucket for ID verification
gsutil mb -p your-gcp-project-id -c STANDARD -l us-east1 \
  -b on gs://youandinotai-id-verification

# Enable encryption (default: Google-managed, can use customer-managed)
gsutil encryption set \
  -k projects/your-project/locations/us-east1/keyRings/youandinotai/cryptoKeys/id-verification \
  gs://youandinotai-id-verification
```

#### AWS S3 (Alternative)
```bash
# Create encrypted S3 bucket
aws s3api create-bucket \
  --bucket youandinotai-id-verification \
  --region us-east-1

# Enable default encryption (AES-256)
aws s3api put-bucket-encryption \
  --bucket youandinotai-id-verification \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block public access (CRITICAL)
aws s3api put-public-access-block \
  --bucket youandinotai-id-verification \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

#### PostgreSQL Database
```sql
-- Enable encryption at rest (depends on hosting provider)
-- For AWS RDS:
-- Enable encryption when creating database
-- For Google Cloud SQL:
-- Encryption is automatic with Google-managed keys

-- Encrypt sensitive columns in application layer
-- Example: Government ID numbers
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Store encrypted data (application-level encryption)
-- Use environment variable ENCRYPTION_KEY
```

#### Application-Level Encryption (Node.js)
```javascript
// api/utils/encryption.js
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes for AES-256

/**
 * Encrypt sensitive data (e.g., government IDs)
 * Returns: { encrypted: string, iv: string, authTag: string }
 */
export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encrypted, iv, authTag) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Hash data for privacy (one-way, for IP addresses, etc.)
 */
export function hashData(data, salt = process.env.SALT) {
  return crypto
    .createHash('sha256')
    .update(data + salt)
    .digest('hex');
}
```

### Data in Transit (TLS 1.2+)

#### HTTPS Configuration (Express.js)
```javascript
// api/server.js
import express from 'express';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';

const app = express();

// Security headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  });
}

// TLS configuration (if self-hosting)
if (process.env.NODE_ENV === 'production' && process.env.TLS_CERT_PATH) {
  const options = {
    key: fs.readFileSync(process.env.TLS_KEY_PATH),
    cert: fs.readFileSync(process.env.TLS_CERT_PATH),
    minVersion: 'TLSv1.2', // Minimum TLS 1.2
    ciphers: [
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-GCM-SHA256',
    ].join(':'),
  };

  https.createServer(options, app).listen(443);
}
```

#### Cloudflare Configuration (Recommended)
```yaml
# cloudflare-tunnel-config.yml
tunnel: your-tunnel-id
credentials-file: /path/to/credentials.json

ingress:
  - hostname: youandinotai.com
    service: https://localhost:3000
    originRequest:
      noTLSVerify: false
      connectTimeout: 30s
  - hostname: aicollabforthekids.com
    service: https://localhost:3000
    originRequest:
      noTLSVerify: false
  - service: http_status:404

# Cloudflare SSL/TLS settings (via dashboard):
# - SSL/TLS encryption mode: Full (strict)
# - Minimum TLS Version: 1.2
# - TLS 1.3: Enabled
# - Automatic HTTPS Rewrites: Enabled
# - Always Use HTTPS: Enabled
```

---

## 🔑 IAM POLICIES (LEAST PRIVILEGE)

### Google Cloud IAM

#### Service Account for Application
```bash
# Create service account
gcloud iam service-accounts create youandinotai-app \
  --display-name "YouAndINotAI Application" \
  --project your-gcp-project-id

# Grant minimum required permissions
# Cloud Storage - Object Admin (for ID verification bucket only)
gcloud storage buckets add-iam-policy-binding gs://youandinotai-id-verification \
  --member serviceAccount:youandinotai-app@your-project.iam.gserviceaccount.com \
  --role roles/storage.objectAdmin

# BigQuery - Data Editor (for audit logging)
gcloud projects add-iam-policy-binding your-gcp-project-id \
  --member serviceAccount:youandinotai-app@your-project.iam.gserviceaccount.com \
  --role roles/bigquery.dataEditor \
  --condition='expression=resource.name.startsWith("projects/your-project/datasets/compliance"),title=compliance-only'

# Cloud SQL - Client (for database access)
gcloud projects add-iam-policy-binding your-gcp-project-id \
  --member serviceAccount:youandinotai-app@your-project.iam.gserviceaccount.com \
  --role roles/cloudsql.client

# Create and download key
gcloud iam service-accounts keys create youandinotai-app-key.json \
  --iam-account youandinotai-app@your-project.iam.gserviceaccount.com
```

#### Human Admin Access (Jules/Josh)
```bash
# Jules (DevOps AI) - Full access for automation
gcloud projects add-iam-policy-binding your-gcp-project-id \
  --member user:jules@aicollabforthekids.com \
  --role roles/editor

# Josh (Owner) - Full access
gcloud projects add-iam-policy-binding your-gcp-project-id \
  --member user:joshlcoleman@gmail.com \
  --role roles/owner

# Developers - Limited access (no production data)
gcloud projects add-iam-policy-binding your-gcp-project-id \
  --member user:developer@aicollabforthekids.com \
  --role roles/viewer
```

### AWS IAM Policies

#### Application Role (EC2/Lambda)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RekognitionFaceComparison",
      "Effect": "Allow",
      "Action": [
        "rekognition:CompareFaces",
        "rekognition:DetectFaces"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3IDVerificationBucketOnly",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::youandinotai-id-verification/*"
    },
    {
      "Sid": "KMSEncryptionKey",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:Encrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:ACCOUNT_ID:key/KEY_ID"
    }
  ]
}
```

### Database Access Control

#### PostgreSQL Roles
```sql
-- Application user (read/write to specific tables only)
CREATE ROLE youandinotai_app WITH LOGIN PASSWORD 'secure_password';

-- Grant minimal permissions
GRANT CONNECT ON DATABASE aicollab_db TO youandinotai_app;
GRANT USAGE ON SCHEMA public TO youandinotai_app;

-- Tables the app needs access to
GRANT SELECT, INSERT, UPDATE ON TABLE "Transaction" TO youandinotai_app;
GRANT SELECT, INSERT, UPDATE ON TABLE "AgeVerification" TO youandinotai_app;
GRANT SELECT, INSERT, UPDATE ON TABLE "UserConsent" TO youandinotai_app;
GRANT SELECT, INSERT ON TABLE "MinorReport" TO youandinotai_app;
GRANT SELECT, INSERT ON TABLE "ComplianceAudit" TO youandinotai_app;

-- NO access to sensitive donor tables (read-only for reports)
GRANT SELECT ON TABLE "Donor" TO youandinotai_app;

-- Admin user (for migrations and maintenance)
CREATE ROLE youandinotai_admin WITH LOGIN PASSWORD 'admin_secure_password' SUPERUSER;

-- Read-only user (for analytics/reporting)
CREATE ROLE youandinotai_readonly WITH LOGIN PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE aicollab_db TO youandinotai_readonly;
GRANT USAGE ON SCHEMA public TO youandinotai_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO youandinotai_readonly;
```

---

## 📊 BIGQUERY AUDIT LOGGING

### Dataset & Table Setup
```bash
# Create compliance dataset
bq mk --dataset \
  --location=US \
  --description="Compliance audit logs - FOR THE KIDS" \
  your-gcp-project-id:compliance

# Create consent log table
bq mk --table \
  your-gcp-project-id:compliance.consent_log \
  schema_consent_log.json

# Create compliance audit table
bq mk --table \
  your-gcp-project-id:compliance.compliance_audit \
  schema_compliance_audit.json

# Set retention policy (7 years for compliance)
bq update --time_partitioning_expiration=2555 \
  your-gcp-project-id:compliance.consent_log
```

### Schema Files

**schema_consent_log.json:**
```json
[
  {"name": "consent_id", "type": "STRING", "mode": "REQUIRED"},
  {"name": "session_id", "type": "STRING", "mode": "REQUIRED"},
  {"name": "user_id", "type": "STRING", "mode": "NULLABLE"},
  {"name": "timestamp", "type": "TIMESTAMP", "mode": "REQUIRED"},
  {"name": "ip_hash", "type": "STRING", "mode": "REQUIRED"},
  {"name": "essential", "type": "BOOLEAN", "mode": "REQUIRED"},
  {"name": "analytics", "type": "BOOLEAN", "mode": "REQUIRED"},
  {"name": "marketing", "type": "BOOLEAN", "mode": "REQUIRED"},
  {"name": "action", "type": "STRING", "mode": "REQUIRED"},
  {"name": "version", "type": "STRING", "mode": "REQUIRED"},
  {"name": "domain", "type": "STRING", "mode": "REQUIRED"}
]
```

**schema_compliance_audit.json:**
```json
[
  {"name": "audit_id", "type": "STRING", "mode": "REQUIRED"},
  {"name": "timestamp", "type": "TIMESTAMP", "mode": "REQUIRED"},
  {"name": "audit_type", "type": "STRING", "mode": "REQUIRED"},
  {"name": "action", "type": "STRING", "mode": "REQUIRED"},
  {"name": "session_id", "type": "STRING", "mode": "NULLABLE"},
  {"name": "user_id", "type": "STRING", "mode": "NULLABLE"},
  {"name": "ip_hash", "type": "STRING", "mode": "NULLABLE"},
  {"name": "details", "type": "JSON", "mode": "NULLABLE"},
  {"name": "success", "type": "BOOLEAN", "mode": "REQUIRED"},
  {"name": "regulation", "type": "STRING", "mode": "NULLABLE"}
]
```

### Logging Integration (Node.js)
```javascript
// api/utils/audit-logger.js
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET || 'compliance');

/**
 * Log consent choice to BigQuery (tamper-proof audit)
 */
export async function logConsent(consentRecord) {
  if (!process.env.FEATURE_BIGQUERY_LOGGING) {
    console.log('[Audit] BigQuery logging disabled');
    return;
  }

  try {
    await dataset.table('consent_log').insert([{
      consent_id: consentRecord.consentId,
      session_id: consentRecord.sessionId,
      user_id: consentRecord.userId,
      timestamp: consentRecord.timestamp,
      ip_hash: consentRecord.ipHash,
      essential: consentRecord.consent.essential,
      analytics: consentRecord.consent.analytics,
      marketing: consentRecord.consent.marketing,
      action: consentRecord.action || 'create',
      version: consentRecord.version,
      domain: consentRecord.domain
    }]);
    
    console.log('[Audit] Consent logged to BigQuery', consentRecord.consentId);
  } catch (error) {
    console.error('[Audit] BigQuery logging failed:', error.message);
    // Fail gracefully - don't block user operations
  }
}

/**
 * Log compliance event to BigQuery
 */
export async function logComplianceEvent(event) {
  if (!process.env.FEATURE_BIGQUERY_LOGGING) {
    return;
  }

  try {
    await dataset.table('compliance_audit').insert([{
      audit_id: event.auditId,
      timestamp: event.timestamp,
      audit_type: event.auditType,
      action: event.action,
      session_id: event.sessionId,
      user_id: event.userId,
      ip_hash: event.ipHash,
      details: event.details,
      success: event.success,
      regulation: event.regulation
    }]);
  } catch (error) {
    console.error('[Audit] Compliance event logging failed:', error.message);
  }
}
```

---

## 🛡️ SECURITY MONITORING

### GCP Security Command Center
```bash
# Enable Security Command Center
gcloud services enable securitycenter.googleapis.com

# Configure findings notifications
gcloud scc notifications create youandinotai-security-alerts \
  --organization YOUR_ORG_ID \
  --pubsub-topic projects/your-project/topics/security-alerts \
  --filter "severity=\"HIGH\" OR severity=\"CRITICAL\""

# Enable vulnerability scanning for containers
gcloud container images scan gcr.io/your-project/youandinotai-api:latest
```

### AWS Security Hub (if using AWS)
```bash
# Enable Security Hub
aws securityhub enable-security-hub --region us-east-1

# Subscribe to security standards
aws securityhub batch-enable-standards \
  --standards-subscription-requests \
    StandardsArn=arn:aws:securityhub:us-east-1::standards/aws-foundational-security-best-practices/v/1.0.0 \
    StandardsArn=arn:aws:securityhub:::ruleset/cis-aws-foundations-benchmark/v/1.2.0
```

### Application Security Monitoring
```javascript
// api/middleware/security-monitor.js
import winston from 'winston';

const securityLogger = winston.createLogger({
  level: 'warn',
  format: winston.format.json(),
  defaultMeta: { service: 'security-monitor' },
  transports: [
    new winston.transports.File({ filename: 'security.log', level: 'warn' }),
    new winston.transports.Console()
  ]
});

/**
 * Monitor suspicious activity
 */
export function monitorSuspiciousActivity(req, res, next) {
  const suspicious = [
    // SQL injection attempts
    req.url.match(/(\%27)|(\')|(\-\-)|(\%23)|(#)/i),
    // XSS attempts
    req.url.match(/(<script|javascript:|onerror=)/i),
    // Path traversal
    req.url.match(/(\.\.\/|\.\.\\)/),
    // Excessive requests from single IP
    // (implement with redis/rate limiting)
  ];

  if (suspicious.some(Boolean)) {
    securityLogger.warn('Suspicious activity detected', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    });
    
    // Alert security team for critical patterns
    if (req.url.match(/(\.\.\/|\.\.\\)/) || req.url.match(/(<script)/i)) {
      // TODO: Send alert to security@aicollabforthekids.com
    }
  }

  next();
}
```

---

## 🗑️ DATA RETENTION & SECURE DELETION

### Automated Deletion Scripts
```javascript
// api/scripts/data-retention.js
import { PrismaClient } from '@prisma/client';
import { deleteFromGCS, deleteFromS3 } from '../utils/storage.js';

const prisma = new PrismaClient();

/**
 * Delete expired ID verification data (30 days)
 * Run daily via cron job
 */
export async function purgeExpiredIDVerifications() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const expiredVerifications = await prisma.ageVerification.findMany({
    where: {
      verifiedAt: {
        lt: thirtyDaysAgo
      },
      verificationLevel: 'ENHANCED' // Has ID data
    }
  });

  for (const verification of expiredVerifications) {
    // Delete encrypted ID from cloud storage
    if (verification.idStoragePath) {
      await deleteFromGCS(verification.idStoragePath);
      // or await deleteFromS3(verification.idStoragePath);
    }

    // Update database to remove storage reference
    await prisma.ageVerification.update({
      where: { id: verification.id },
      data: {
        idStoragePath: null,
        documentType: null,
        documentCountry: null
      }
    });

    console.log(`[Retention] Purged ID data for verification: ${verification.id}`);
  }

  return expiredVerifications.length;
}

/**
 * Delete inactive accounts (2 years)
 */
export async function purgeInactiveAccounts() {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  // Find inactive accounts
  const inactiveUsers = await prisma.user.findMany({
    where: {
      lastLoginAt: {
        lt: twoYearsAgo
      }
    }
  });

  // Delete user data (cascade will handle related records)
  for (const user of inactiveUsers) {
    await prisma.user.delete({
      where: { id: user.id }
    });
    
    console.log(`[Retention] Deleted inactive account: ${user.id}`);
  }

  return inactiveUsers.length;
}

// Cron job (run daily at 2 AM)
// 0 2 * * * node api/scripts/data-retention.js
if (require.main === module) {
  purgeExpiredIDVerifications()
    .then(count => console.log(`Purged ${count} expired ID verifications`))
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
```

---

## ✅ SECURITY CHECKLIST

### Pre-Launch Security Audit

- [ ] **Encryption**
  - [ ] TLS 1.2+ for all traffic (HTTPS enforced)
  - [ ] Database encryption at rest enabled
  - [ ] Cloud storage encryption enabled (GCS/S3)
  - [ ] Application-level encryption for PII (government IDs)
  - [ ] Encryption keys rotated and stored securely (not in git)

- [ ] **IAM & Access Control**
  - [ ] Service accounts created with least privilege
  - [ ] Database roles configured (app, admin, readonly)
  - [ ] Multi-factor authentication enabled for admins
  - [ ] API keys rotated regularly
  - [ ] No hardcoded credentials in code

- [ ] **Monitoring & Logging**
  - [ ] BigQuery audit logging enabled
  - [ ] Security monitoring configured (GCP Security Command Center or AWS Security Hub)
  - [ ] Application security logging implemented
  - [ ] Alert system for suspicious activity
  - [ ] Log retention compliant with regulations (7 years)

- [ ] **Data Protection**
  - [ ] PII minimization implemented
  - [ ] Data retention policies automated
  - [ ] Secure deletion workflows tested
  - [ ] Backup encryption verified
  - [ ] GDPR "right to erasure" implemented

- [ ] **Application Security**
  - [ ] Helmet.js security headers configured
  - [ ] CORS properly configured
  - [ ] Rate limiting enabled
  - [ ] Input validation on all endpoints
  - [ ] SQL injection prevention (Prisma parameterized queries)
  - [ ] XSS prevention (CSP headers)
  - [ ] CSRF protection enabled

- [ ] **Third-Party Security**
  - [ ] Yoti/AWS Rekognition credentials secured
  - [ ] Payment processor security verified (Amazon Pay, Square, Stripe)
  - [ ] API keys for AI services (Gemini, Claude) secured
  - [ ] Cloudflare security settings configured

- [ ] **Incident Response**
  - [ ] Data breach response plan documented
  - [ ] Security team contact list updated
  - [ ] Backup and recovery procedures tested
  - [ ] COPPA violation response plan ready

---

## 📞 SECURITY CONTACTS

**Security Issues:** security@aicollabforthekids.com  
**COPPA Alerts:** safety@youandinotai.com  
**Data Protection Officer:** dpo@aicollabforthekids.com  
**Jules (DevOps AI):** Via `/api/jules/execute` endpoint

---

## 🎯 MISSION ALIGNMENT

**Every security measure protects:**
- User privacy and data
- Platform integrity and trust
- Charitable mission sustainability
- Children (both users' children and charity beneficiaries)

**FOR THE KIDS - Security enables our mission!** 🎉

---

**Primary Architect:** Claude.ai (Anthropic)  
**Business Director & DevOps:** Jules (Gemini 1.5 Pro)  
**Project Owner:** Josh Coleman  
**Version:** 1.0  
**Status:** Implementation Guide - Ready for deployment

