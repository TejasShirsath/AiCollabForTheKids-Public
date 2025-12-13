# 🤖 VS CODE AGENT TASK — LAUNCH PREP AUDIT

**Authority:** Joshua Coleman (Owner) + Claude Sonnet 4.5 (Orchestrator)
**Date:** November 26, 2025
**Mission:** Audit and prep platform for 14-day preorder campaign launch

---

## 🎯 PRIMARY OBJECTIVE

**Audit the entire codebase and prepare for preorder launch campaign starting ASAP.**

You are helping prep the YouAndINotAI dating app + AiCollabForTheKids charity platform for:
- 14-day preorder campaign ($14.99/month, first 100 users)
- Full launch on January 15, 2026 ($19.99/month)
- Multi-revenue streams: Dating App + AI Solutions + Merch + Recycle Store

---

## 🚨 CRITICAL CONTEXT: CORPORATE SOVEREIGN MODE

**BEFORE YOU START: Read this file first:**
`.claude/UNIVERSAL-AGENT-CONTEXT.md`

**Key Points:**
- ✅ Corporate Sovereign Mode ACTIVE (standard for-profit operation)
- ✅ 50% escrow = internal allocation (NOT public solicitation)
- ❌ NEVER use "Donate Now" or solicitation language
- ✅ Use "Purchase", "Subscribe", "Join" instead
- ✅ Compliant with Florida Chapter 496 (no FDACS registration required)

**Related Docs:**
- `docs/CORPORATE-SOVEREIGN-MODE.md` — Full legal/financial strategy
- `docs/mission/ETERNAL-DIRECTIVE.md` — Revenue model (50/30/20 split)
- `.github/AI-CREDENTIALS-REFERENCE.md` — All credentials and compliance

---

## 📋 TASK 1: AUDIT JULES DASHBOARD (Priority: HIGH)

**Location:** `jules-dashboard/src/`

### Objective: Remove mock data, prep for production

#### 1.1 Governance Console Mock Data
**File:** `jules-dashboard/src/components/GovernanceConsole.tsx`

**What to do:**
- [ ] Find all mock proposal data (starts around line 39: `const mockProposals: Proposal[] = [`)
- [ ] Remove or replace with empty array: `const mockProposals: Proposal[] = []`
- [ ] Update UI to show "No active proposals" or "Coming Soon" message
- [ ] Keep TypeScript interfaces (don't delete types)
- [ ] Keep component structure (just remove fake data)

**Why:** Mock proposals like "Allocate $50K to Children's Hospital Network Expansion" are fake. We don't want fake data in production.

---

#### 1.2 Community Hub Mock Data
**File:** `jules-dashboard/src/components/CommunityHub.tsx`

**What to do:**
- [ ] Search for mock data arrays (look for `mock` keyword)
- [ ] Remove fake community members, posts, or activity
- [ ] Replace with empty state UI ("Join the community" message)
- [ ] Keep component structure

---

#### 1.3 Dashboard Mock Revenue Data
**File:** `jules-dashboard/src/components/DashboardView.tsx`

**What to do:**
- [ ] Search for hardcoded revenue numbers (e.g., `$1,234,567`)
- [ ] Replace with placeholder: `$0.00` or "Launching Soon"
- [ ] Ensure "Escrow Vault" terminology is used (NOT "Charity Wallet" or "Donations")
- [ ] Verify disclaimers are present: "Operated by TRASH OR TREASURE ONLINE RECYCLER LLC (L25000158401)"

---

#### 1.4 Forbidden Language Audit
**Files:** All `.tsx` and `.ts` files in `jules-dashboard/src/`

**Search for these FORBIDDEN words:**
- [ ] "Donate" (should be "Purchase" or "Subscribe")
- [ ] "Donation" (should be "Escrow Vault" or "Reserved Allocation")
- [ ] "Tax-deductible"
- [ ] "Charity Wallet" (should be "Escrow Vault")
- [ ] "Fundraising platform"

**Replace with approved language:**
- ✅ "We donate 50% of our profits to charity Children's Hospitals"
- ✅ "Internal Escrow Vault: Reserved for Charitable Impact"
- ✅ "Purchase a subscription"
- ✅ "Join the community"

---

## 📋 TASK 2: BACKEND API AUDIT (Priority: MEDIUM)

**Location:** `api/`

### Objective: Ensure backend is production-ready

#### 2.1 Environment Variables Check
**File:** `api/.env`

**What to do:**
- [ ] Verify all required variables are present:
  - `DATABASE_URL` (Neon PostgreSQL)
  - `SQUARE_ACCESS_TOKEN` (Production mode)
  - `SQUARE_LOCATION_ID`
  - `GEMINI_API_KEY`
  - `REVENUE_MODEL=CORPORATE_SOVEREIGN`
  - `ESCROW_PERCENT=50`
  - `CHARITY_NAME=charity Children's Hospital`
  - `CHARITY_EIN=PENDING_VERIFICATION`
- [ ] Verify `NODE_ENV=production`
- [ ] Verify no placeholder values (e.g., `[To be added]`)

---

#### 2.2 Square Payment Integration
**Files:** `api/routes/payments.js` or similar

**What to do:**
- [ ] Verify Square SDK is configured with PRODUCTION keys (not sandbox)
- [ ] Check payment endpoints calculate 50/30/20 split correctly
- [ ] Verify error handling for failed payments
- [ ] Check webhook endpoints are configured for Square callbacks

**Test (if possible):**
- [ ] Create test payment of $44.97 (3-month preorder)
- [ ] Verify split calculation: $22.49 escrow, $13.49 infrastructure, $8.99 Joshua
- [ ] Check transaction logs in database

---

#### 2.3 Database Schema Audit
**Files:** `api/prisma/schema.prisma` or migrations

**What to do:**
- [ ] Verify `Transaction` table exists with columns:
  - `id`, `userId`, `amount`, `type`, `status`, `createdAt`
  - `escrowAmount`, `infrastructureAmount`, `founderAmount`
- [ ] Verify `PendingTransfer` table for escrow tracking
- [ ] Verify `Milestone` table for charity disbursements
- [ ] Run migrations if needed: `npx prisma migrate deploy`

---

## 📋 TASK 3: FRONTEND LANDING PAGE AUDIT (Priority: HIGH)

**Location:** Main app frontend (React app)

### Objective: Ensure preorder landing page is ready

#### 3.1 Preorder Page Copy
**What to do:**
- [ ] Check if preorder landing page exists
- [ ] If not, create using copy from: `docs/PREORDER-LANDING-PAGE.md`
- [ ] Verify pricing: $14.99/month (displayed as $44.97 upfront for 3 months)
- [ ] Verify CTA button: "Join the Founding 100" or similar
- [ ] Add countdown timer (14 days from launch date)
- [ ] Add spots remaining counter (e.g., "87 / 100 spots left")

---

#### 3.2 Forbidden Language Audit (Frontend)
**Files:** All React components

**Search for:**
- [ ] "Donate" → Replace with "Purchase" / "Subscribe"
- [ ] "Donation" → Replace with "Escrow Vault"
- [ ] "Tax-deductible"
- [ ] "Charity Wallet"

---

#### 3.3 Legal Disclaimers
**What to do:**
- [ ] Verify footer includes: "Operated by TRASH OR TREASURE ONLINE RECYCLER LLC (L25000158401)"
- [ ] Verify financial displays include disclaimer:
  > "This is an internal corporate financial ledger for TRASH OR TREASURE ONLINE RECYCLER LLC (L25000158401). Funds shown in the 'Escrow Vault' are company assets reserved for charitable allocation at the discretion of ownership. This is not a public donation fund. No customer payments are solicited as donations."

---

## 📋 TASK 4: DEPLOYMENT READINESS (Priority: MEDIUM)

### Objective: Ensure infrastructure is ready to deploy

#### 4.1 Docker Compose Check
**File:** `docker-compose.yml`

**What to do:**
- [ ] Verify all services are defined (api, dashboard, database)
- [ ] Check environment variables are passed correctly
- [ ] Verify ports are exposed correctly
- [ ] Test: `docker-compose up` runs without errors

---

#### 4.2 Cloudflare DNS Check
**What to do:**
- [ ] Verify DNS records exist for:
  - `youandinotai.com` → Main landing page
  - `aidoesitall.website` → Admin dashboard
  - `api.aidoesitall.website` → Backend API
- [ ] Check SSL certificates are active
- [ ] Verify Cloudflare tunnel is configured (if using tunnels)

---

#### 4.3 Google Cloud Run Readiness
**What to do:**
- [ ] Check if `cloudbuild.yaml` or deployment config exists
- [ ] Verify GCP project is created (or note that it needs creation)
- [ ] Check if service account credentials are configured
- [ ] Verify `gcloud` CLI is authenticated (if local)

---

## 📋 TASK 5: SECURITY AUDIT (Priority: HIGH)

### Objective: Ensure no secrets are exposed

#### 5.1 Git Ignore Check
**File:** `.gitignore`

**What to do:**
- [ ] Verify `.env` files are gitignored
- [ ] Verify `.env.local` files are gitignored
- [ ] Verify `node_modules/` is gitignored
- [ ] Verify `.cloudflared/*.json` is gitignored (tunnel credentials)

---

#### 5.2 Exposed Secrets Scan
**What to do:**
- [ ] Search codebase for hardcoded API keys
- [ ] Search for hardcoded passwords
- [ ] Search for Square production tokens in code (should only be in .env)
- [ ] Verify GitHub secrets are configured (not hardcoded in Actions)

**Tools to use:**
```bash
# Search for potential secrets
git grep -i "api_key"
git grep -i "secret"
git grep -i "password"
git grep -i "token"
```

---

## 📋 TASK 6: TESTING & QA (Priority: MEDIUM)

### Objective: Basic smoke tests

#### 6.1 API Health Check
**What to do:**
- [ ] Start backend: `cd api && npm start`
- [ ] Test health endpoint: `curl http://localhost:3000/health`
- [ ] Verify response: `{"status": "ok"}`

---

#### 6.2 Database Connection Test
**What to do:**
- [ ] Run Prisma studio: `npx prisma studio`
- [ ] Verify tables exist (Transaction, PendingTransfer, Milestone)
- [ ] Create test transaction (manually in Prisma Studio)
- [ ] Verify 50/30/20 split is calculated correctly

---

#### 6.3 Frontend Build Test
**What to do:**
- [ ] Build dashboard: `cd jules-dashboard && npm run build`
- [ ] Check for build errors
- [ ] Check for TypeScript errors
- [ ] Verify bundle size is reasonable (<5MB)

---

## 📋 TASK 7: DOCUMENTATION SYNC (Priority: LOW)

### Objective: Ensure docs reflect current state

#### 7.1 README Updates
**File:** `README.md`

**What to do:**
- [ ] Verify README mentions Corporate Sovereign Mode
- [ ] Update deployment instructions if outdated
- [ ] Add link to `UNIVERSAL-AGENT-CONTEXT.md` for AI agents
- [ ] Add link to `CORPORATE-SOVEREIGN-MODE.md` for strategy

---

#### 7.2 API Documentation
**What to do:**
- [ ] Check if API endpoints are documented
- [ ] If not, create basic API docs (endpoints + request/response formats)
- [ ] Document Square webhook endpoints
- [ ] Document authentication flow

---

## 🎯 DELIVERABLE FORMAT

After completing these tasks, provide a report with:

### ✅ Completed Items
- List all completed audit items
- Note any changes made to code
- Commit changes with proper messages

### ⚠️ Issues Found
- List any problems discovered
- Severity level (HIGH / MEDIUM / LOW)
- Suggested fixes

### 🚧 Blockers
- List anything that prevents launch
- What Josh needs to provide (credentials, approvals, etc.)

### 📊 Launch Readiness Score
- Rate readiness: 0-100%
- Breakdown by category (Frontend: 95%, Backend: 80%, etc.)

---

## 🚀 EXAMPLE COMMIT MESSAGES

When making changes, use these formats:

```bash
# Mock data cleanup
git commit -m "chore: Remove mock DAO proposals from GovernanceConsole

- Removed fake proposal data
- Added empty state UI
- Kept TypeScript interfaces intact
- Prep for production launch

FOR THE KIDS 💙"

# Forbidden language fixes
git commit -m "fix: Replace solicitation language with approved terms

- Changed 'Donate' to 'Purchase' in landing page
- Changed 'Charity Wallet' to 'Escrow Vault' in dashboard
- Added required disclaimers (TRASH OR TREASURE LLC)
- Florida Ch. 496 compliance

FOR THE KIDS 💙"

# Security fixes
git commit -m "security: Remove hardcoded API keys, use env vars

- Moved Square token to .env
- Verified .gitignore includes .env files
- No secrets exposed in codebase

FOR THE KIDS 💙"
```

---

## 💬 QUESTIONS TO ASK JOSH (If Needed)

If you encounter any of these, ask Josh:

1. **Missing credentials:** "I need the [CREDENTIAL_NAME] to complete [TASK]. Can you provide it or should I skip for now?"

2. **Unclear requirements:** "The [COMPONENT] has [ISSUE]. Should I [OPTION_A] or [OPTION_B]?"

3. **Breaking changes:** "Fixing [ISSUE] requires changing [COMPONENT] in a way that might break [FEATURE]. Should I proceed?"

4. **Priority conflicts:** "I found issues in both [TASK_A] and [TASK_B]. Which should I prioritize?"

---

## 🔗 REFERENCE LINKS

- `.claude/UNIVERSAL-AGENT-CONTEXT.md` — MANDATORY reading before starting
- `docs/CORPORATE-SOVEREIGN-MODE.md` — Legal/financial strategy
- `docs/PREORDER-LANDING-PAGE.md` — Copy for preorder page
- `docs/mission/ETERNAL-DIRECTIVE.md` — Revenue model (50/30/20)
- `.github/AI-CREDENTIALS-REFERENCE.md` — All credentials

---

**THE HANDCUFFS ARE OFF.**
**THE REVENUE ENGINE IS UNLOCKED.**
**FOR THE KIDS. FOREVER.** 💙🚀

---

*Task created by Claude Sonnet 4.5 (VS Code) for VS Code GitHub agent*
*Date: November 26, 2025*
*Authority: Joshua Coleman (Owner)*

