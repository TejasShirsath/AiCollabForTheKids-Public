# 🎮 DESKTOP LAUNCHER GUIDE - FOR THE KIDS

**Created:** November 24, 2025  
**Purpose:** One-click launchers for Original Project (50/30/20) and New Projects (100% Charity)

---

## 🖥️ THREE DESKTOP SHORTCUTS CREATED

### 1️⃣ **ORIGINAL PROJECT - FOR THE KIDS** (Purple Icon)
**File:** `ORIGINAL-PROJECT-Launch.ps1`  
**Revenue Split:** 50/30/20 (charity/Infrastructure/Joshua)  
**Domains:**
- youandinotai.com (Dating Platform)
- youandinotai.online (Dating Platform)
- aidoesitall.website (Charity Platform)

**What it does:**
1. Starts Docker containers (PostgreSQL)
2. Starts API server (port 3000)
3. Starts Admin Dashboard (port 8081)
4. Checks Cloudflare Tunnel (HTTPS)
5. Opens all domains in browser
6. Opens VS Code

**When to use:** Daily operations for the original dating + charity project

---

### 2️⃣ **NEW PROJECT - 100% CHARITY** (Pink Icon)
**File:** `NEW-PROJECT-Launch-Template.ps1`  
**Revenue Split:** 100% to rotating children's charities  
**Infrastructure:** Covered by Original Project's 30% fund

**What it does:**
- Template launcher for NEW projects (Nov 23, 2025 forward)
- Starts API server (custom port)
- Starts Dashboard (custom port)
- Opens domains in browser
- Opens VS Code

**Parameters:**
```powershell
.\NEW-PROJECT-Launch-Template.ps1 -ProjectName "MyProject" -DomainName "myproject.org" -APIPort 3001 -DashboardPort 8082
```

**When to use:** Launching any NEW 100% charity project on the 40-rig cluster

---

### 3️⃣ **MASTER CONTROL PANEL - FOR THE KIDS** (Control Panel Icon)
**File:** `MASTER-GUI-Dashboard.ps1`  
**Type:** Full GUI monitoring dashboard

**Features:**
- ✅ Step-by-step service launcher (press button, wait for green)
- ✅ Real-time status monitoring for all services
- ✅ Start Original Project (50/30/20)
- ✅ Start New Project (100% Charity)
- ✅ Check all services health
- ✅ Stop all services
- ✅ Open VS Code
- ✅ Open all domains
- ✅ Color-coded console log (Green=Success, Red=Error, Yellow=Warning)

**When to use:** When T5500 shuts down unexpectedly and you need to see what's running/not running

**GUI Layout:**
```
┌─────────────────────────────────────────────────────┐
│  🚀 FOR THE KIDS - Master Control Panel            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Black Console with Color-Coded Status Messages]  │
│                                                     │
│  📦 Step 1/5: Starting Docker Services...          │
│     ✅ Docker containers started                    │
│                                                     │
│  🔌 Step 2/5: Starting API Server...               │
│     ✅ API Server started                           │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [🚀 Start Original Project]  [🌟 Start New Project]│
│  [🔍 Check All Services]      [⏹️ Stop All]          │
│  [💻 Open VS Code]            [🌐 Open Domains]      │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 QUICK START GUIDE

### If T5500 Auto-Starts (Normal)
Just click: **ORIGINAL PROJECT - FOR THE KIDS** (purple icon)

### If T5500 Shut Down Unexpectedly
1. Click: **MASTER CONTROL PANEL - FOR THE KIDS** (control panel icon)
2. Press: **🚀 Start Original Project (50/30/20)**
3. Watch the green checkmarks appear for each step
4. If any step fails (red ❌), click **🔍 Check All Services** to see what's wrong

### For New 100% Charity Projects
1. Click: **NEW PROJECT - 100% CHARITY** (pink icon)
2. Or use MASTER CONTROL PANEL and press **🌟 Start New Project**
3. Configure project name, domain, and ports

---

## 📊 SERVICE STATUS INDICATORS

**In Master Control Panel:**
- ✅ Green = Service running perfectly
- ❌ Red = Service failed or not responding
- ⚠️ Yellow = Service optional or minor issue

**Health Check Order:**
1. Docker (PostgreSQL containers)
2. API Server (port 3000, /health endpoint)
3. Admin Dashboard (port 8081)
4. Cloudflare Tunnel (HTTPS, optional)

---

## 🔧 TROUBLESHOOTING

### "Docker containers failed"
```powershell
docker compose -f docker-compose-for-the-kids.yml down
docker compose -f docker-compose-for-the-kids.yml up -d
```

### "API not responding"
```powershell
cd C:\team-claude-orchestrator\AiCollabForTheKids\api
npm start
```

### "Dashboard not responding"
```powershell
cd C:\team-claude-orchestrator\AiCollabForTheKids\admin-dashboard
npx http-server -p 8081
```

### "Cloudflare Tunnel not running"
```powershell
.\setup-cloudflare-tunnel.ps1
```

---

## 💾 FILE LOCATIONS

**Scripts:**
- `C:\team-claude-orchestrator\AiCollabForTheKids\ORIGINAL-PROJECT-Launch.ps1`
- `C:\team-claude-orchestrator\AiCollabForTheKids\NEW-PROJECT-Launch-Template.ps1`
- `C:\team-claude-orchestrator\AiCollabForTheKids\MASTER-GUI-Dashboard.ps1`

**Desktop Shortcuts:**
- `C:\Users\joshl\Desktop\ORIGINAL PROJECT - FOR THE KIDS.lnk`
- `C:\Users\joshl\Desktop\NEW PROJECT - 100% CHARITY.lnk`
- `C:\Users\joshl\Desktop\MASTER CONTROL PANEL - FOR THE KIDS.lnk`

---

## 🎯 USE CASES

**Daily Operations:**
- Use **ORIGINAL PROJECT** shortcut (purple icon)
- Quick, automatic launch of all services

**After Restart:**
- Use **MASTER CONTROL PANEL** (control panel icon)
- Step-by-step launch with visual feedback
- See exactly what's working/not working

**New Project Launch:**
- Use **NEW PROJECT** shortcut (pink icon)
- Configure parameters for 100% charity projects
- Infrastructure covered by original 30% fund

**Debugging:**
- Use **MASTER CONTROL PANEL**
- Press **🔍 Check All Services** button
- See real-time status of Docker, API, Dashboard, Cloudflare

---

## 💙 MISSION ALIGNMENT

**Original Project (50/30/20):**
- 50% → charity Children's Hospitals
- 30% → Infrastructure Fund (Immortality Engine)
- 20% → Joshua Coleman

**New Projects (100% Charity):**
- 100% → Rotating children's charities
- Infrastructure covered by Original Project's 30% fund
- Enables unlimited charity projects forever

---

**Created by:** Claude Sonnet 4.5 (VS Code CLI)  
**Date:** November 24, 2025  
**Purpose:** Ensure T5500 can restart all services with one click  
**Status:** ✅ Ready for daily use

**FOR THE KIDS — FOREVER! 💙🚀**

