# Cloud Infrastructure Setup Guide - FOR THE KIDS
## Google Cloud Platform & AWS Configuration

**Last Updated:** November 24, 2025  
**Status:** Ready for deployment  
**Prerequisites:** GCP/AWS accounts, billing enabled, domain verification

---

## 🎯 DEPLOYMENT OVERVIEW

This guide provides step-by-step instructions for deploying:
1. **Google Cloud Platform** - BigQuery audit logging, Cloud Storage, IAM
2. **AWS** - S3 for ID verification images, Rekognition for face comparison
3. **Environment Variables** - Production configuration
4. **Database** - PostgreSQL production setup
5. **Security Keys** - Encryption key generation

---

## 📋 PREREQUISITES CHECKLIST

### Required Accounts
- [ ] Google Cloud Platform account (free tier available)
- [ ] AWS account (free tier available)
- [ ] GitHub account (for CI/CD)
- [ ] Domain registrar access (for DNS)
- [ ] PostgreSQL hosting (or local setup)

### Required Tools
- [ ] `gcloud` CLI installed
- [ ] `aws` CLI installed
- [ ] `node` v18+ installed
- [ ] `git` installed
- [ ] `psql` (PostgreSQL client) installed

### Required Knowledge
- [ ] Basic terminal/command line usage
- [ ] Git basics (clone, commit, push)
- [ ] Environment variables concept
- [ ] DNS record management

---

## 🔐 STEP 1: GENERATE ENCRYPTION KEYS

### 1.1 Generate Application Encryption Keys

```bash
# Navigate to project root
cd c:\Users\joshl\Trollz1004\AiCollabForTheKids\api

# Generate ENCRYPTION_KEY (AES-256 requires 32 bytes = 64 hex chars)
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate SALT (for hashing)
node -e "console.log('SALT=' + require('crypto').randomBytes(16).toString('hex'))"

# Generate JWT_SECRET (for authentication tokens)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Generate SESSION_SECRET (for session management)
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

**⚠️ CRITICAL:** Save these keys securely! Store in:
1. Local `.env` file (for development)
2. Production secrets manager (GCP Secret Manager or AWS Secrets Manager)
3. Secure password manager (1Password, LastPass, etc.)

**DO NOT COMMIT THESE TO GIT!**

### 1.2 Update .env File

```bash
# Copy example to .env
cd c:\Users\joshl\Trollz1004\AiCollabForTheKids\api
Copy-Item .env.example .env

# Edit .env and paste the generated keys
notepad .env
```

Paste the generated values:
```env
ENCRYPTION_KEY=<paste 64-character hex string>
SALT=<paste 32-character hex string>
JWT_SECRET=<paste 128-character hex string>
SESSION_SECRET=<paste 128-character hex string>
```

---

## ☁️ STEP 2: GOOGLE CLOUD PLATFORM SETUP

### 2.1 Create GCP Project

```bash
# Install gcloud CLI if not already installed
# Download from: https://cloud.google.com/sdk/docs/install

# Login to GCP
gcloud auth login

# Create new project
gcloud projects create aicollab-for-the-kids --name="AiCollabForTheKids"

# Set as active project
gcloud config set project aicollab-for-the-kids

# Enable billing (required for APIs)
# Go to: https://console.cloud.google.com/billing
# Link billing account to project
```

### 2.2 Enable Required APIs

```bash
# Enable BigQuery API (for audit logging)
gcloud services enable bigquery.googleapis.com

# Enable Cloud Storage API (for encrypted ID storage)
gcloud services enable storage.googleapis.com

# Enable IAM API (for service accounts)
gcloud services enable iam.googleapis.com

# Enable Cloud Build (for CI/CD - optional)
gcloud services enable cloudbuild.googleapis.com

# Verify enabled services
gcloud services list --enabled
```

### 2.3 Create BigQuery Dataset for Audit Logs

```bash
# Create dataset
bq mk --dataset --location=US aicollab-for-the-kids:compliance_audit_logs

# Create audit table
bq mk --table \
  aicollab-for-the-kids:compliance_audit_logs.audit_trail \
  timestamp:TIMESTAMP,event_type:STRING,user_id:STRING,session_id:STRING,ip_address:STRING,user_agent:STRING,action:STRING,metadata:JSON,compliance_flags:JSON

# Verify table created
bq show aicollab-for-the-kids:compliance_audit_logs.audit_trail
```

### 2.4 Create GCS Bucket for Encrypted IDs

```bash
# Create bucket with encryption
gsutil mb -l US -b on gs://aicollab-encrypted-ids-production

# Enable versioning (for audit trail)
gsutil versioning set on gs://aicollab-encrypted-ids-production

# Set lifecycle policy (auto-delete after 30 days per GDPR)
echo '{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 30}
      }
    ]
  }
}' > lifecycle.json

gsutil lifecycle set lifecycle.json gs://aicollab-encrypted-ids-production

# Verify bucket configuration
gsutil ls -L -b gs://aicollab-encrypted-ids-production
```

### 2.5 Create Service Account & Credentials

```bash
# Create service account
gcloud iam service-accounts create aicollab-api \
  --display-name="AiCollabForTheKids API Service Account"

# Grant BigQuery permissions
gcloud projects add-iam-policy-binding aicollab-for-the-kids \
  --member="serviceAccount:aicollab-api@aicollab-for-the-kids.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding aicollab-for-the-kids \
  --member="serviceAccount:aicollab-api@aicollab-for-the-kids.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser"

# Grant Cloud Storage permissions
gcloud projects add-iam-policy-binding aicollab-for-the-kids \
  --member="serviceAccount:aicollab-api@aicollab-for-the-kids.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Create and download service account key
gcloud iam service-accounts keys create ~/gcp-service-account-key.json \
  --iam-account=aicollab-api@aicollab-for-the-kids.iam.gserviceaccount.com

# ⚠️ MOVE KEY TO SECURE LOCATION
Move-Item ~/gcp-service-account-key.json c:\Users\joshl\Trollz1004\AiCollabForTheKids\api\secrets\
```

**⚠️ CRITICAL:** The JSON key file grants full access to your GCP resources. Treat it like a password!

### 2.6 Update .env with GCP Credentials

```env
# Add to api/.env
GOOGLE_CLOUD_PROJECT=aicollab-for-the-kids
BIGQUERY_DATASET=compliance_audit_logs
BIGQUERY_TABLE=audit_trail
GCS_BUCKET=aicollab-encrypted-ids-production
GOOGLE_APPLICATION_CREDENTIALS=./secrets/gcp-service-account-key.json
```

---

## 🌩️ STEP 3: AWS SETUP

### 3.1 Create IAM User for API

```bash
# Install AWS CLI if not already installed
# Download from: https://aws.amazon.com/cli/

# Configure AWS CLI
aws configure
# Enter:
#   AWS Access Key ID: <from AWS IAM console>
#   AWS Secret Access Key: <from AWS IAM console>
#   Default region: us-east-1
#   Default output format: json

# Create IAM user for API
aws iam create-user --user-name aicollab-api

# Create access key
aws iam create-access-key --user-name aicollab-api
# ⚠️ SAVE THE OUTPUT! Access key and secret only shown once.
```

### 3.2 Create S3 Bucket for ID Verification

```bash
# Create bucket
aws s3 mb s3://aicollab-id-verification-production --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket aicollab-id-verification-production \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket aicollab-id-verification-production \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'

# Set lifecycle policy (30-day deletion)
aws s3api put-bucket-lifecycle-configuration \
  --bucket aicollab-id-verification-production \
  --lifecycle-configuration '{
    "Rules": [
      {
        "Id": "Delete-After-30-Days",
        "Status": "Enabled",
        "Expiration": {"Days": 30}
      }
    ]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket aicollab-id-verification-production \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 3.3 Attach IAM Policies

```bash
# Create custom policy for S3 bucket access
cat > s3-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::aicollab-id-verification-production/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::aicollab-id-verification-production"
    }
  ]
}
EOF

aws iam put-user-policy \
  --user-name aicollab-api \
  --policy-name S3AccessPolicy \
  --policy-document file://s3-policy.json

# Attach Rekognition policy (for face verification)
aws iam attach-user-policy \
  --user-name aicollab-api \
  --policy-arn arn:aws:iam::aws:policy/AmazonRekognitionReadOnlyAccess
```

### 3.4 Update .env with AWS Credentials

```env
# Add to api/.env
AWS_ACCESS_KEY_ID=<access key from create-access-key output>
AWS_SECRET_ACCESS_KEY=<secret key from create-access-key output>
AWS_REGION=us-east-1
AWS_S3_BUCKET=aicollab-id-verification-production
```

---

## 🔑 STEP 4: YOTI AGE VERIFICATION SETUP

### 4.1 Create Yoti Developer Account

1. Go to: https://hub.yoti.com/
2. Sign up for Developer account (free tier available)
3. Create new application: "AiCollabForTheKids Age Verification"
4. Select "Age Verification" use case
5. Add callback URL: `https://youandinotai.com/api/age-verification/yoti/callback`

### 4.2 Download Yoti SDK Key

1. In Yoti Hub, go to "Keys & Credentials"
2. Download `.pem` key file
3. Save to `api/secrets/yoti-key.pem`
4. Copy Client SDK ID

### 4.3 Update .env with Yoti Credentials

```env
# Add to api/.env
YOTI_CLIENT_SDK_ID=<your-client-sdk-id>
YOTI_KEY_FILE_PATH=./secrets/yoti-key.pem
FEATURE_AGE_VERIFICATION_ENHANCED=true
```

---

## 🗄️ STEP 5: PRODUCTION DATABASE SETUP

### 5.1 PostgreSQL Cloud Hosting Options

**Option A: Google Cloud SQL (Recommended)**
```bash
# Create Cloud SQL instance
gcloud sql instances create aicollab-postgres \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=<generate-secure-password>

# Create database
gcloud sql databases create for_the_kids --instance=aicollab-postgres

# Get connection name
gcloud sql instances describe aicollab-postgres --format="value(connectionName)"
```

**Option B: AWS RDS**
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier aicollab-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.7 \
  --master-username postgres \
  --master-user-password <generate-secure-password> \
  --allocated-storage 20
```

**Option C: Heroku Postgres (Easy Setup)**
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create aicollab-for-the-kids

# Add Postgres addon (free tier)
heroku addons:create heroku-postgresql:mini

# Get DATABASE_URL
heroku config:get DATABASE_URL
```

### 5.2 Update .env with Production Database

```env
# Add to api/.env
DATABASE_URL=postgresql://username:password@host:5432/for_the_kids
```

### 5.3 Run Production Migrations

```bash
# Navigate to api directory
cd c:\Users\joshl\Trollz1004\AiCollabForTheKids\api

# Run migrations
npm run migrate:deploy

# Verify tables created
npx prisma studio
```

---

## 🚀 STEP 6: DEPLOY APPLICATION

### 6.1 Test Locally with Production Config

```bash
# Ensure all .env variables are set
cd c:\Users\joshl\Trollz1004\AiCollabForTheKids\api

# Test database connection
npx prisma db pull

# Run development server
npm run dev

# Test endpoints
# Age verification health: http://localhost:3000/api/age-verification/health
# Consent health: http://localhost:3000/api/consent/health
```

### 6.2 Deploy to Production (Heroku Example)

```bash
# Ensure Heroku CLI installed
heroku login

# Create Heroku app if not exists
heroku create aicollab-for-the-kids

# Set environment variables
heroku config:set ENCRYPTION_KEY=<your-key>
heroku config:set JWT_SECRET=<your-secret>
# ... set all other .env variables

# Deploy
git push heroku master

# Run migrations
heroku run npm run migrate:deploy

# Open app
heroku open
```

### 6.3 Deploy to Google Cloud Run (Advanced)

```bash
# Build container
gcloud builds submit --tag gcr.io/aicollab-for-the-kids/api

# Deploy to Cloud Run
gcloud run deploy aicollab-api \
  --image gcr.io/aicollab-for-the-kids/api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=<your-db-url>,ENCRYPTION_KEY=<your-key>"

# Get service URL
gcloud run services describe aicollab-api --region us-central1 --format="value(status.url)"
```

---

## 🔍 STEP 7: VERIFY DEPLOYMENT

### 7.1 Health Checks

```bash
# Replace with your production URL
$API_URL = "https://youandinotai.com/api"

# Test API health
curl "$API_URL/health"

# Test age verification health
curl "$API_URL/age-verification/health"

# Test consent health
curl "$API_URL/consent/health"
```

Expected responses:
```json
{
  "status": "operational",
  "service": "age-verification",
  "providers": {
    "yoti": "ready",
    "aws_rekognition": "ready"
  }
}
```

### 7.2 Test Age Verification Flow

```bash
# Test self-attestation
curl -X POST "$API_URL/age-verification/attest" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-prod-001",
    "dateOfBirth": "1990-01-01",
    "agreedToTerms": true,
    "ipAddress": "1.2.3.4",
    "userAgent": "Production Test"
  }'
```

### 7.3 Test Cookie Consent

```bash
# Test consent recording
curl -X POST "$API_URL/consent/record" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-prod-consent-001",
    "essential": true,
    "analytics": true,
    "marketing": false,
    "ipAddress": "1.2.3.4",
    "userAgent": "Production Test"
  }'
```

---

## 🎯 STEP 8: POST-DEPLOYMENT CHECKLIST

### Security
- [ ] All encryption keys generated and stored securely
- [ ] Service account keys stored in secure location (not in repo)
- [ ] Database uses SSL/TLS connections
- [ ] API uses HTTPS only (no HTTP)
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled (100 req/15min)

### Monitoring
- [ ] GCP monitoring dashboard created
- [ ] AWS CloudWatch alarms set up
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)

### Compliance
- [ ] BigQuery audit logging active
- [ ] 30-day ID retention policy active
- [ ] Privacy Policy published on domain
- [ ] Terms of Service published on domain
- [ ] Cookie consent banner live
- [ ] Age gate UI deployed

### Testing
- [ ] All health checks passing
- [ ] Age verification flow tested end-to-end
- [ ] Cookie consent flow tested end-to-end
- [ ] COPPA reporting tested
- [ ] Integration tests passing (`npm test`)

---

## 📞 TROUBLESHOOTING

### Issue: "GOOGLE_APPLICATION_CREDENTIALS not found"
**Solution:**
```bash
# Check file exists
Test-Path c:\Users\joshl\Trollz1004\AiCollabForTheKids\api\secrets\gcp-service-account-key.json

# If missing, regenerate key
gcloud iam service-accounts keys create api/secrets/gcp-service-account-key.json \
  --iam-account=aicollab-api@aicollab-for-the-kids.iam.gserviceaccount.com
```

### Issue: "AWS access denied"
**Solution:**
```bash
# Verify IAM policies attached
aws iam list-attached-user-policies --user-name aicollab-api
aws iam list-user-policies --user-name aicollab-api

# Re-attach if missing
aws iam attach-user-policy \
  --user-name aicollab-api \
  --policy-arn arn:aws:iam::aws:policy/AmazonRekognitionReadOnlyAccess
```

### Issue: "Prisma connection timeout"
**Solution:**
```bash
# Test database connection manually
psql $DATABASE_URL

# Check if database exists
\l

# Check if tables exist
\dt
```

### Issue: "Yoti callback failing"
**Solution:**
- Verify callback URL in Yoti Hub matches production domain
- Check HTTPS certificate valid
- Ensure YOTI_CLIENT_SDK_ID matches Hub
- Verify `.pem` key file not corrupted

---

## 💰 COST ESTIMATES

### GCP (Monthly at 1,000 users)
- **BigQuery**: $0-5 (queries + storage)
- **Cloud Storage**: $0-10 (ID storage)
- **Cloud Run** (if used): $0-50
- **Total GCP**: ~$15-65/month

### AWS (Monthly at 1,000 users)
- **S3**: $0-5 (ID storage)
- **Rekognition**: $1 per 1,000 face comparisons = $1-10
- **Total AWS**: ~$6-15/month

### Yoti Age Verification
- **Free Tier**: 0-100 verifications/month
- **Paid Tier**: $0.50-2.00 per verification
- **At 1,000 users**: $500-2,000/month

### Database Hosting
- **Heroku Postgres Mini**: $5/month
- **Google Cloud SQL**: $10-50/month
- **AWS RDS**: $15-50/month

### **TOTAL MONTHLY COST (1,000 users): $500-2,100**

---

## 🎉 NEXT STEPS

1. **Legal Review** - Send Privacy Policy & ToS DRAFTS to attorney
2. **Insurance** - Obtain cyber liability, E&O, D&O coverage
3. **Load Testing** - Run Artillery/k6 tests at scale
4. **Security Audit** - Penetration testing by third party
5. **Go Live** - Launch youandinotai.com to production!

---

**FOR THE KIDS! 🚀**

Every secure deployment protects user data while generating sustainable revenue for charity Children's Hospital.

**Target: 1,000 users = $60K/year to charity! 🏥**

---

**Last Updated:** November 24, 2025  
**Deployment Guide Version:** 1.0  
**Next Review:** After production launch

