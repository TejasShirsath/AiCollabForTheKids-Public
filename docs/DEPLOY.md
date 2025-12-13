# Deployment Guide - FOR THE KIDS

## ⚠️ Pre-Deployment Safety Checks

Before deploying, ensure your repository is clean with no uncommitted changes:

```bash
git status
```

All deployment scripts and workflows now include automatic checks for uncommitted changes. If uncommitted changes are detected, the deployment will fail with an error message.

### Why This Matters
- Ensures all changes are tracked in version control
- Prevents accidental deployment of untested code
- Maintains deployment audit trail
- Supports rollback capability

### If Deployment Fails Due to Uncommitted Changes

**Option 1: Commit your changes**
```bash
git add -A
git commit -m "Your descriptive commit message"
git push
```

**Option 2: Stash your changes (temporary storage)**
```bash
git stash
# Deploy...
git stash pop  # Restore changes after deployment
```

---

## Quick Deploy

### Dashboard (Cloudflare Pages)
```bash
cd jules-dashboard
npm run build
npx wrangler pages deploy dist --project-name=jules-dashboard
```

### API (Cloudflare Workers)
```bash
cd api
npx wrangler deploy
```

---

## Full Production Deployment (Release The Kraken)

For complete production deployments, use the `release-the-kraken.sh` script:

```bash
cd /home/runner/work/AiCollabForTheKids/AiCollabForTheKids
./scripts/release-the-kraken.sh
```

### What It Does
1. **Pre-flight Checks**
   - Verifies Node.js, npm, and git are installed
   - Checks for uncommitted changes (FAILS if detected)
   - Validates project directories exist
   - Ensures .env files are present

2. **Gospel Compliance Verification**
   - Scans for forbidden terminology (escrow, donation)
   - Checks for mock data references
   - Validates Gospel v2.0 compliance

3. **Build Process**
   - Installs API dependencies
   - Generates Prisma client
   - Builds dashboard for production
   - Runs tests

4. **Deployment**
   - Runs database migrations
   - Deploys to Cloudflare Pages
   - Starts API services

### Script Options
```bash
# Skip deployment (build and test only)
./scripts/release-the-kraken.sh --skip-deploy

# Skip build (deploy existing build)
./scripts/release-the-kraken.sh --skip-build

# View help
./scripts/release-the-kraken.sh --help
```

### Safety Features
- **Uncommitted Changes Guard**: Automatically fails if there are uncommitted changes
- **Gospel Compliance**: Enforces terminology and data standards
- **Environment Validation**: Ensures all required configuration is present
- **Build Verification**: Tests code before deployment

---

## Full Setup

### 1. Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Set Secrets (API)
```bash
cd api
wrangler secret put SQUARE_ACCESS_TOKEN
wrangler secret put SQUARE_LOCATION_ID
wrangler secret put JWT_SECRET
wrangler secret put DATABASE_URL
```

### 4. Deploy Dashboard
```bash
cd jules-dashboard
npm install
npm run build
npx wrangler pages deploy dist --project-name=jules-dashboard
```

Dashboard will be at: `https://jules-dashboard.pages.dev`

### 5. Deploy API
```bash
cd api
npx wrangler deploy
```

API will be at: `https://jules-api.<account>.workers.dev`

---

## Custom Domains

### Dashboard
1. Go to Cloudflare Pages > jules-dashboard > Custom domains
2. Add: `dashboard.forthekids.org`

### API
1. Go to Workers > jules-api > Triggers > Custom Domains
2. Add: `api.forthekids.org`

---

## Environment Variables

### Dashboard (set in Cloudflare Pages settings)
```
VITE_API_URL=https://api.forthekids.org
VITE_APP_NAME=Jules Dashboard
```

### API (set via wrangler secret)
```
SQUARE_ACCESS_TOKEN=<your-token>
SQUARE_LOCATION_ID=<your-location>
JWT_SECRET=<random-64-char-string>
DATABASE_URL=<postgresql-url>
```

---

## Database (Cloudflare D1)

### Create D1 Database
```bash
wrangler d1 create forthekids-db
```

### Run Migrations
```bash
wrangler d1 execute forthekids-db --file=./prisma/migrations/init.sql
```

---

## Monitoring

- Dashboard: Cloudflare Analytics
- API: Workers Analytics
- Errors: Cloudflare Logpush

---

## Rollback

### Dashboard
```bash
npx wrangler pages deployment list --project-name=jules-dashboard
npx wrangler pages deployment rollback --project-name=jules-dashboard --deployment-id=<id>
```

### API
```bash
wrangler rollback
```

---

## Gospel Verification

After deployment, verify the Gospel split:
```bash
curl https://api.forthekids.org/api/gospel
```

Should return:
```json
{
  "gospel": {
    "CHARITY_PERCENTAGE": 50,
    "INFRASTRUCTURE_PERCENTAGE": 30,
    "FOUNDER_PERCENTAGE": 20
  }
}
```

---

💙 FOR THE KIDS - Every deployment helps children
