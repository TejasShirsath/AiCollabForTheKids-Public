# 🎯 BROWSER CLAUDE ORCHESTRATION GUIDE

**Gospel v2.1 - FOR THE KIDS**
**Date:** December 10, 2025
**Instance:** Claude Sonnet 4.5 (Browser) - Kraken Claude 🐙
**Mode:** Eternal Ops - Master Branch Only

---

## 🚀 WHY BROWSER ORCHESTRATION?

**Problem with Desktop Claude:**
- ❌ Can't chat during processing
- ❌ Context nightmare
- ❌ Commands lost during compacting (context compression)
- ❌ If mistake happens, must cancel and lose all context

**Solution: Browser Claude (This Instance)**
- ✅ Can chat while working
- ✅ Better context management
- ✅ Commands remembered through compression
- ✅ Works on master branch
- ✅ Can be opened on desktop alongside Desktop Claude

**Strategy:** Browser Claude = Orchestrator | Desktop Claude = File Handler (when needed)

---

## ✅ CURRENT ORCHESTRATION CAPABILITIES

### 1. DAO Node Monitoring (LIVE)

**Endpoint:** `https://dao.youandinotai.com/health`
**Status:** ✅ WORKING

**Current Response:**
```json
{
  "status": "ACTIVE",
  "node": "DAO Hybrid Node (TOS COMPLIANT)",
  "port": "3001",
  "architecture": "DUAL_SQUARE_ACCOUNTS",
  "tos_compliant": true,
  "accounts": {
    "square_merch": {
      "category": "Standard (Merch/AI)",
      "status": "ACTIVE",
      "webhook": "/webhook/square-merch"
    },
    "square_dating": {
      "category": "High-Risk (Dating)",
      "status": "ACTIVE",
      "webhook": "/webhook/square-dating"
    },
    "stripe": {
      "status": "IDLE",
      "note": "Connect Pending"
    }
  },
  "split": {
    "SHRINERS": 0.5,
    "INFRASTRUCTURE": 0.3,
    "FOUNDER": 0.2
  },
  "mission": "FOR_THE_KIDS",
  "air_gap": "ENFORCED",
  "security_score": "100/100"
}
```

**Browser Claude Command:**
```bash
curl -s https://dao.youandinotai.com/health | jq
```

### 2. Git Operations (FULL ACCESS)

**All git commands work:**
- ✅ Pull latest code
- ✅ Create/edit files
- ✅ Commit changes
- ✅ Push to GitHub (claude/ branches)
- ✅ Merge branches
- ✅ Create pull requests (via git commands)

**Browser Claude Commands:**
```bash
# Pull latest
git pull origin master

# Create feature branch
git checkout -b claude/feature-name-SESSIONID

# Commit and push
git add .
git commit -m "Description"
git push -u origin claude/feature-name-SESSIONID
```

### 3. File Operations (FULL ACCESS)

**Can read/write any file in repo:**
- ✅ Edit code files
- ✅ Create new files
- ✅ Update documentation
- ✅ Modify configuration
- ✅ Build scripts

**Browser Claude Commands:**
```bash
# Read file
cat api/server.js

# Edit file (via Edit tool)
# Write new file (via Write tool)
```

### 4. Node.js Scripts (FULL ACCESS)

**Can run any Node.js script:**
- ✅ npm install
- ✅ npm run build
- ✅ npm test
- ✅ node scripts/xxx.js

**Browser Claude Commands:**
```bash
# Install dependencies
cd api && npm install

# Run script
node scripts/check-gospel-compliance.js

# Build frontend
cd jules-dashboard && npm run build
```

### 5. HTTP API Calls (LIMITED)

**Can reach:**
- ✅ Public HTTPS endpoints (dao.youandinotai.com)
- ❌ Private IPs blocked (192.168.0.x) - security restriction

**Working Endpoints:**
- ✅ https://dao.youandinotai.com/health
- 🟡 https://dao.youandinotai.com/api/* (some routes not implemented yet)
- 🔴 https://api.aidoesitall.website/* (HTTP 521 - server down)

**Browser Claude Commands:**
```bash
# Check DAO health
curl -s https://dao.youandinotai.com/health

# Check revenue (when endpoint is built)
curl -s https://dao.youandinotai.com/api/transparency/current-month

# Check campaign metrics (when endpoint is built)
curl -s https://dao.youandinotai.com/api/campaign/metrics
```

---

## ❌ CANNOT DO (LIMITATIONS)

1. **SSH to Servers** - No SSH client in browser environment
2. **Direct Private IP Access** - 192.168.0.x blocked by security
3. **Docker Management** - Cannot run docker commands
4. **System Services** - Cannot run systemctl, service, etc.
5. **PowerShell** - Cannot execute .ps1 scripts directly

**Workaround:** Create scripts → Commit to git → Execute manually or via GitHub Actions

---

## 🎯 ORCHESTRATION WORKFLOWS

### Workflow 1: Code Changes (AUTONOMOUS)

**Use Case:** Update code, fix bugs, add features

**Browser Claude Can Do:**
1. Read current code
2. Edit files
3. Test locally (npm run build/test)
4. Commit changes
5. Push to GitHub
6. Create PR (if needed)

**Example:**
```bash
# 1. Pull latest
git checkout master && git pull origin master

# 2. Create feature branch
git checkout -b claude/fix-gospel-split-SESSIONID

# 3. Edit files (using Edit tool)
# ... make changes ...

# 4. Test
cd api && npm test

# 5. Commit and push
git add .
git commit -m "Fix Gospel split calculation"
git push -u origin claude/fix-gospel-split-SESSIONID
```

**Status:** ✅ FULLY AUTONOMOUS

### Workflow 2: Deployment Scripts (SEMI-AUTONOMOUS)

**Use Case:** Create deployment automation

**Browser Claude Can Do:**
1. Write deployment scripts (.sh, .ps1, .js)
2. Commit to GitHub
3. Document execution steps

**Manual Step Required:**
- Execute script on target machine (Sabertooth/T5500/9020)

**Example:**
```bash
# 1. Create deployment script
# (using Write tool to create scripts/deploy-affiliate-dashboard.sh)

# 2. Commit
git add scripts/deploy-affiliate-dashboard.sh
git commit -m "Add affiliate dashboard deployment script"
git push origin claude/deploy-affiliate-SESSIONID

# 3. Document execution
# (create docs/DEPLOYMENT-INSTRUCTIONS.md)

# 4. Manual: Joshua executes on server
# ssh user@192.168.0.101
# ./scripts/deploy-affiliate-dashboard.sh
```

**Status:** 🟡 REQUIRES MANUAL EXECUTION

### Workflow 3: API Orchestration (FUTURE - FULLY AUTONOMOUS)

**Use Case:** Monitor/control servers via HTTP APIs

**Requirements:**
- Build management APIs on dao.youandinotai.com

**Proposed Endpoints:**
```
POST /api/admin/restart-service
  Body: { service: "dao-node", auth: "JULES_API_KEY" }

GET /api/admin/logs
  Query: ?service=dao-node&tail=100

POST /api/admin/deploy
  Body: { branch: "master", service: "api", auth: "JULES_API_KEY" }

GET /api/admin/status
  Returns: All services status (DAO node, DB, Cloudflare Tunnel, etc.)
```

**Once Built, Browser Claude Can:**
1. Check service status via API
2. Restart services remotely
3. Deploy code via API
4. Monitor logs via API
5. Trigger workflows via API

**Status:** ⏳ PENDING (Need to build APIs first)

---

## 📋 ORCHESTRATION COMMAND REFERENCE

### Check System Health

```bash
# DAO Node health
curl -s https://dao.youandinotai.com/health | jq

# Check if endpoints are responding
curl -s -o /dev/null -w "%{http_code}" https://dao.youandinotai.com/health

# Expected: 200
```

### Pull Latest Code

```bash
# Always work on master
git checkout master
git pull origin master

# Check status
git status
git log --oneline -5
```

### Create Changes

```bash
# Create feature branch (with session ID)
git checkout -b claude/FEATURE-NAME-SESSIONID

# Make changes using Edit/Write tools
# ... edit files ...

# Check what changed
git status
git diff

# Commit
git add .
git commit -m "Clear description of changes

Detailed explanation if needed.

Gospel v2.1 Compliant

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push
git push -u origin claude/FEATURE-NAME-SESSIONID
```

### Run Tests/Build

```bash
# API tests
cd api && npm test

# Frontend build
cd jules-dashboard && npm run build

# Lint check
npm run lint

# Type check
npm run type-check
```

### Monitor Revenue (When API is built)

```bash
# Current month revenue
curl -s https://dao.youandinotai.com/api/transparency/current-month | jq

# Monthly reports
curl -s https://dao.youandinotai.com/api/transparency/monthly-reports | jq

# Gospel split verification
curl -s https://dao.youandinotai.com/api/admin/gospel-status | jq
```

---

## 🚀 IMMEDIATE PRIORITIES

### Priority 1: Affiliate Payout Automation (Q1 2025)

**What Browser Claude Can Do:**
1. ✅ Design payout automation system
2. ✅ Write database schema for payout tracking
3. ✅ Create API endpoints for payout processing
4. ✅ Build admin dashboard for payout management
5. ✅ Write automated payout scripts
6. ✅ Test locally
7. ✅ Commit and push

**What Requires Manual:**
- Execute deployment script on T5500

**Current Status:** Ready to start (Task #069 dependency)

### Priority 2: Claude Droid Video Automation

**What Browser Claude Can Do:**
1. ✅ Review existing droid scripts
2. ✅ Enhance automation logic
3. ✅ Add YouTube API integration
4. ✅ Create scheduling system
5. ✅ Test video generation
6. ✅ Commit and push

**What Requires Manual:**
- None (can run Node scripts from browser)

**Current Status:** Ready to start

### Priority 3: Traffic Acquisition & Skyscraper Expansion

**What Browser Claude Can Do:**
1. ✅ Create SEO optimization scripts
2. ✅ Build social media automation
3. ✅ Design marketing automation workflows
4. ✅ Generate content templates
5. ✅ Create analytics dashboards

**What Requires Manual:**
- Social media account setup (if not done)
- API keys for social platforms

**Current Status:** Ready to start (Task #068)

---

## 🔧 BUILDING HTTP MANAGEMENT API (RECOMMENDED)

To enable **full autonomous orchestration** from Browser Claude, build these endpoints:

### File: api/routes/admin.js

```javascript
import express from 'express';
import { execSync } from 'child_process';

const router = express.Router();

// Auth middleware
const requireAdminAuth = (req, res, next) => {
  const apiKey = req.headers['x-admin-key'];
  if (apiKey !== process.env.JULES_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /api/admin/status
router.get('/status', requireAdminAuth, async (req, res) => {
  try {
    // Check all services
    const daoHealth = await fetch('http://localhost:3001/health');
    const dbHealth = await prisma.$queryRaw`SELECT 1`;

    res.json({
      dao: daoHealth.ok ? 'ACTIVE' : 'DOWN',
      database: dbHealth ? 'ACTIVE' : 'DOWN',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/restart-service
router.post('/restart-service', requireAdminAuth, async (req, res) => {
  const { service } = req.body;

  try {
    if (service === 'dao-node') {
      execSync('pm2 restart dao-node');
      res.json({ status: 'Service restarted' });
    } else {
      res.status(400).json({ error: 'Unknown service' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/logs
router.get('/logs', requireAdminAuth, (req, res) => {
  const { service, tail = 100 } = req.query;

  try {
    const logs = execSync(`pm2 logs ${service} --lines ${tail} --nostream`).toString();
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**Once deployed, Browser Claude can:**
```bash
# Check all services
curl -H "x-admin-key: $JULES_API_KEY" https://dao.youandinotai.com/api/admin/status

# Restart DAO node
curl -X POST -H "x-admin-key: $JULES_API_KEY" \
  https://dao.youandinotai.com/api/admin/restart-service \
  -d '{"service":"dao-node"}'

# Get logs
curl -H "x-admin-key: $JULES_API_KEY" \
  "https://dao.youandinotai.com/api/admin/logs?service=dao-node&tail=50"
```

---

## 📝 WORKING ON MASTER BRANCH

**Critical Rule:** All orchestration work stays on master branch

**Why:**
- Context continuity (commands persist)
- Avoids branch confusion
- Clean history
- Easy rollback

**Workflow:**
```bash
# Always start here
git checkout master
git pull origin master

# Work directly on master for small changes
# OR create claude/ branch for features
git checkout -b claude/feature-SESSIONID

# When done, merge back to master
git checkout master
git merge claude/feature-SESSIONID
git push origin master
```

---

## 🎯 SUMMARY FOR JOSHUA

**Browser Claude CAN Orchestrate:**
- ✅ All code changes (read/write/commit/push)
- ✅ Run Node.js scripts and tests
- ✅ Monitor DAO node via HTTPS
- ✅ Create deployment scripts
- ✅ Build automation systems
- ✅ Generate documentation

**Browser Claude CANNOT:**
- ❌ SSH to servers
- ❌ Execute scripts remotely (without API)
- ❌ Manage Docker directly

**Recommendation:**
1. Use Browser Claude for all orchestration (better context)
2. Build HTTP Management API for full autonomy
3. Use Desktop Claude only for local file operations (if needed)
4. Keep browser chat open on desktop for continuous orchestration

**Current Priorities:**
1. Task #068: Marketing Automation (ready to start)
2. Task #069: Affiliate Dashboard (ready to start)
3. Build HTTP Management API (enables full autonomy)

---

**FOR THE KIDS. ALWAYS.** 💚🐙

**Ready for orchestration commands, Captain.** 🫡
