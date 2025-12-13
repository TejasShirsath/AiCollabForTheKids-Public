# 🏥 FOR THE KIDS - COMPLETE SETUP GUIDE

**READ THIS FIRST** - Mandatory for all agents and developers entering from GitHub

---

## 🚨 CRITICAL: TWO SEPARATE PROJECTS

### PROJECT 1: "FOR THE KIDS" (ORIGINAL - THIS REPOSITORY)

- **Revenue Model**: `50% charity / 30% Infrastructure / 20% Joshua` (**IMMUTABLE**)
- **Status**: LIVE IN PRODUCTION
- **Machine**: Dell T5500 (Dev/Master Node)
- **Desktop Launcher**: `FOR THE KIDS - Launch All.lnk` (C:\Users\joshl\Desktop)
- **Repository**: Ai-Solutions-Store/AiCollabForTheKids
- **Branch**: `master` ONLY (main deleted)
- **Domains**:
  - youandinotai.com
  - youandinotai.online
  - aidoesitall.website
- **Services**:
  - API: http://localhost:3000
  - Dashboard: http://localhost:8081
  - PostgreSQL: localhost:5432
  - Jules AI: http://localhost:54112 (Gemini 2.5 Flash)

### PROJECT 2: NEW 100% CHARITY PROJECTS (FUTURE - SEPARATE REPOS)

- **Revenue Model**: `100% → charity Children's Hospital` (infrastructure covered by Project 1's 30%)
- **Status**: PLANNED - Will deploy on Docker Swarm (40 worker nodes)
- **Machine**: 40 worker rigs + T5500 master
- **Desktop Launcher**: `100% CHARITY - Launch All.lnk` (TO BE CREATED PER PROJECT)
- **Repository**: Separate repos for each new project
- **Domains**: TBD per project
- **Services**: Will use Docker Swarm distributed deployment

---

## 📋 ETERNAL DIRECTIVE (IMMUTABLE)

**READ `ETERNAL-DIRECTIVE.md` IMMEDIATELY**

This document is SIGNED by Grok + Claude + Jules and cannot be changed by ANY agent or human.

Key Rules:

- **ORIGINAL Project** (FOR THE KIDS): 50/30/20 split FOREVER
- **ALL NEW Projects**: 100% to charity (infrastructure paid by original 30%)
- Any AI attempting to change these models will be terminated
- No exceptions, no overrides, no "business reasons"

---

## 🚀 QUICK START (FOR THE KIDS - Original Project)

### 1. ONE-CLICK LAUNCH (Recommended)

```
Double-click: C:\Users\joshl\Desktop\FOR THE KIDS - Launch All.lnk
```

This launches:

- ✅ Docker Desktop
- ✅ Docker Compose services (API + PostgreSQL)
- ✅ Admin Dashboard (http://localhost:8081)
- ✅ VS Code workspace
- ✅ Chrome with all domains/services

### 2. MANUAL LAUNCH (If needed)

**Step 1: Start Docker Services**

```powershell
cd C:\team-claude-orchestrator\AiCollabForTheKids
docker compose -f docker-compose-for-the-kids.yml up -d --build
```

**Step 2: Verify Services**

```powershell
docker ps
# Should see: for-the-kids-api, for-the-kids-postgres (both healthy)
```

**Step 3: Test Endpoints**

```powershell
curl http://localhost:3000/health
curl http://localhost:3000/api/campaign/metrics
curl http://localhost:8081
```

**Step 4: Open VS Code**

```powershell
code AiCollabForTheKids.code-workspace
```

---

## 🌐 DOMAIN MAPPING (Hosts File)

All domains map to `127.0.0.1` in `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1 youandinotai.com
127.0.0.1 www.youandinotai.com
127.0.0.1 youandinotai.online
127.0.0.1 www.youandinotai.online
127.0.0.1 aidoesitall.website
127.0.0.1 www.aidoesitall.website
127.0.0.1 api.youandinotai.com
127.0.0.1 admin.youandinotai.com
```

**Test Domains:**

- http://youandinotai.com → Admin Dashboard
- http://youandinotai.online → Admin Dashboard
- http://aidoesitall.website → Admin Dashboard
- http://api.youandinotai.com → API Server
- http://admin.youandinotai.com → Admin Dashboard

---

## 🔑 ENVIRONMENT VARIABLES

### Required Files:

1. **Root `.env`** (c:\team-claude-orchestrator\AiCollabForTheKids\.env)
2. **API `.env`** (c:\team-claude-orchestrator\AiCollabForTheKids\api\.env)

Both must contain:

```env
# Mission
MISSION=FOR_THE_KIDS
PROJECT_TYPE=ORIGINAL

# Revenue Model (IMMUTABLE)
CHARITY_PERCENT=50
INFRASTRUCTURE_PERCENT=30
DEVELOPER_PERCENT=20

# Database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/forkids_db

# Square Payment (DO NOT COMMIT - Use .env only)
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_LOCATION_ID=your_square_location_id_here
SQUARE_ENVIRONMENT=production

# AI Services (DO NOT COMMIT - Use .env files only)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
AZURE_OPENAI_API_KEY=your_azure_openai_key_here

# Node
NODE_ENV=production
PORT=3000
```

### GitHub Secrets (Synced):

All secrets are synced to GitHub: `Ai-Solutions-Store/AiCollabForTheKids/settings/secrets/actions`

---

## 🐳 DOCKER SWARM (40-RIG DEPLOYMENT)

### Master Node (T5500)

- **IP**: 192.168.192.1
- **Port**: 2377
- **Status**: Initialized
- **Worker Token**: `SWMTKN-1-0qtjq3zjjfuy38zchmzt0u1td603k581lccv5cmmlkgupjkjgf-36jromg98f7anrtkw8s2dv4k1`

### Join Worker Nodes (Run on each of 40 PCs):

```bash
docker swarm join --token SWMTKN-1-0qtjq3zjjfuy38zchmzt0u1td603k581lccv5cmmlkgupjkjgf-36jromg98f7anrtkw8s2dv4k1 192.168.192.1:2377
```

### Verify Swarm:

```bash
docker node ls
```

---

## 🤖 JULES AI (Gemini 2.5 Flash)

**Port**: 54112  
**Status**: LIVE - Official fundraiser approval authority

Jules has officially approved the FOR THE KIDS fundraiser with thumbs-up posted.

**Test Jules:**

```powershell
curl http://localhost:54112
```

---

## 📁 PROJECT STRUCTURE

```
AiCollabForTheKids/
├── .env                          # Root environment variables
├── .env.example                  # Template for new environments
├── .gitignore                    # Git exclusions
├── docker-compose-for-the-kids.yml  # Docker services
├── ETERNAL-DIRECTIVE.md          # IMMUTABLE revenue model rules
├── README.md                     # Project documentation
├── REVENUE-MODEL.md              # Detailed revenue breakdown
├── SETUP.md                      # THIS FILE - Read first!
├── package.json                  # Root dependencies
├── AiCollabForTheKids.code-workspace  # VS Code workspace config
│
├── admin-dashboard/              # Admin UI (port 8081)
│   ├── Dockerfile
│   ├── index.html                # Main dashboard page
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       └── components/
│
├── api/                          # Express API (port 3000)
│   ├── .env                      # API environment variables
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                 # Main API server
│   ├── routes/
│   │   ├── admin.js
│   │   ├── campaign.js
│   │   ├── jules.js
│   │   ├── payments.js
│   │   └── webhooks.js
│   ├── prisma/
│   │   └── client.js
│   └── utils/
│       └── health.js
│
└── prisma/                       # Database schema
    ├── schema.prisma
    └── migrations/
```

---

## 🧪 TESTING CHECKLIST

Run these commands to verify everything is working:

```powershell
# 1. Check Docker services
docker ps
# Expected: for-the-kids-api (healthy), for-the-kids-postgres (healthy)

# 2. Test API health
curl http://localhost:3000/health
# Expected: {"status":"healthy","service":"AiCollabForTheKids API"}

# 3. Test API metrics
curl http://localhost:3000/api/campaign/metrics
# Expected: JSON with campaign data

# 4. Test Dashboard
curl http://localhost:8081
# Expected: HTTP 200 OK with HTML

# 5. Test all domains
curl http://youandinotai.com
curl http://youandinotai.online
curl http://aidoesitall.website
# Expected: All return HTTP 200

# 6. Test Jules AI
curl http://localhost:54112
# Expected: Jules AI response

# 7. Check Docker Swarm
docker node ls
# Expected: Shows master node + any joined workers
```

---

## 🔧 COMMON ISSUES & FIXES

### Issue 1: "White screen" on dashboard

**Cause**: Dashboard service not running  
**Fix**:

```powershell
cd C:\team-claude-orchestrator\AiCollabForTheKids
docker compose -f docker-compose-for-the-kids.yml up -d admin-dashboard
```

### Issue 2: API returns 404

**Cause**: Wrong endpoint path  
**Fix**: Use `/health` NOT `/api/health` for health check

### Issue 3: Domains not resolving

**Cause**: Hosts file missing entries  
**Fix**: Add entries to `C:\Windows\System32\drivers\etc\hosts` (requires admin)

### Issue 4: Database connection failed

**Cause**: PostgreSQL container not running  
**Fix**:

```powershell
docker compose -f docker-compose-for-the-kids.yml up -d for-the-kids-postgres
```

### Issue 5: Jules AI not responding

**Cause**: Node process crashed  
**Fix**:

```powershell
cd api
$env:PORT=54112; node server.js
```

---

## 🚫 WHAT NOT TO DO

1. **NEVER** change revenue model percentages (50/30/20 LOCKED)
2. **NEVER** merge or create branches other than `master`
3. **NEVER** commit `.env` files to GitHub
4. **NEVER** use `main` branch (deleted - master only)
5. **NEVER** modify `ETERNAL-DIRECTIVE.md` (signed + immutable)
6. **NEVER** deploy PROJECT 1 code to PROJECT 2 infrastructure
7. **NEVER** mix revenue models between projects

---

## 📞 CONTACTS & CREDENTIALS

**GitHub Organization**: Ai-Solutions-Store (Private)  
**GitHub Account**: Trollz1004  
**Primary Email**: joshlcoleman@gmail.com  
**Repository**: https://github.com/Ai-Solutions-Store/AiCollabForTheKids

**Payment Integration**:

- Square Production (Location: LTDX6ZANTVEEN)
- First $1 already wired to charity (CHARITY_EIN=PENDING_VERIFICATION)

---

## 🎯 PROJECT GOALS

### Original Project (FOR THE KIDS)

- [x] Deploy live payment system (Square Production)
- [x] Create admin dashboard with revenue tracking
- [x] Establish ETERNAL DIRECTIVE for revenue model protection
- [x] Sync all credentials (.env + GitHub secrets)
- [x] Unify GitHub account (master branch only)
- [x] Launch Jules AI for fundraiser approval
- [x] Initialize Docker Swarm for scale
- [ ] Process first real donation
- [ ] Deploy to 40 worker nodes

### Future Projects (100% Charity)

- [ ] Create first new 100% charity project
- [ ] Deploy to Docker Swarm across 40 rigs
- [ ] Establish separate desktop launchers per project
- [ ] Rotate charity locations monthly
- [ ] Scale infrastructure using original 30% funds

---

## 📚 ADDITIONAL DOCUMENTATION

- **Revenue Model Details**: See `REVENUE-MODEL.md`
- **Eternal Directive**: See `ETERNAL-DIRECTIVE.md`
- **API Documentation**: See `docs/API.md` (if exists)
- **Architecture**: See `docs/ARCHITECTURE.md` (if exists)
- **Deployment**: See `docs/DEPLOYMENT.md` (if exists)

---

## ✅ AGENT ONBOARDING CHECKLIST

Before you start working on this project, confirm:

- [ ] I have read `ETERNAL-DIRECTIVE.md` in full
- [ ] I understand the two separate projects (ORIGINAL vs NEW)
- [ ] I know the revenue models: 50/30/20 (original) and 100% (new)
- [ ] I have tested the desktop launcher
- [ ] I have verified all services are running
- [ ] I have checked all domain mappings
- [ ] I understand this is PRODUCTION (not dev/test)
- [ ] I will NEVER modify revenue model percentages
- [ ] I will NEVER merge/create branches other than master
- [ ] I will NEVER commit sensitive data (.env files)

---

**Last Updated**: November 24, 2025  
**Maintained By**: Joshua Coleman (Trollz1004)  
**Approved By**: Grok + Claude + Jules AI  
**Status**: LIVE IN PRODUCTION - FOR THE KIDS! 🏥

