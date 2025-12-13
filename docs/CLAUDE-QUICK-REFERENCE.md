# ⚡ CLAUDE QUICK REFERENCE - FOR THE KIDS

**For:** Fast lookups during development
**Gospel Version:** v1.1 (13 Rules)
**Security Audit:** December 5, 2025 (Opus 4.5)
**Updated:** December 5, 2025

---

## 🎯 THE MISSION (Never Forget)

**50% → charity Children's Hospitals** (Tax ID: PENDING_VERIFICATION)
**30% → Infrastructure** (Powers all future projects)
**20% → Joshua Coleman** (Sustainable development)

**THE 50/30/20 SPLIT IS IMMUTABLE. GOSPEL RULE #2.**

---

## 🛡️ SECURITY STATUS (December 5, 2025)

| Credential | Status | Location |
|------------|--------|----------|
| AWS Access Keys | ✅ ROTATED | GitHub Secrets |
| Cloudflare API Token | ✅ ROTATED | GitHub Secrets |
| GitHub PAT | ⚠️ NEEDS ROTATION | Manual via github.com |
| .env files | ✅ GITIGNORED | Local only |
| .claude/settings.local.json | ✅ UNTRACKED | Local only |

**NEVER commit credentials to git. Use GitHub Secrets or local .env files.**

---

## 📜 GOSPEL RULES (Quick Summary)

1. ✅ **ONLY CLAUDE TOUCHES CODE** (mandatory)
2. ✅ **50/30/20 SPLIT IS IMMUTABLE**
3. ✅ **BRAND IDENTITY IS LOCKED** (Benevolent Technocracy)
4. ✅ **AI BOARD OF DIRECTORS** (Claude, Jules, Grok, Perplexity, Joshua)
5. ✅ **HARDWARE CLUSTER** (184GB RAM total)
6. ✅ **PRODUCTION-READY CODE ONLY** (zero placeholders)
7. ✅ **MISSION ABOVE PREFERENCES**
8. ✅ **DOCUMENTATION STANDARDS**
9. ✅ **GITHUB WORKFLOW**
10. ✅ **ENVIRONMENT VARIABLES**
11. ✅ **BACKUP & DISASTER RECOVERY**
12. ✅ **LEGAL COMPLIANCE**
13. ✅ **CHILD SAFETY IS NON-NEGOTIABLE** (COPPA/FOSTA)

**Full details:** Read GOSPEL.md

---

## 🎨 BRAND COLORS (USE THESE ONLY)

```css
/* Backgrounds */
--brand-void: #141413;        /* Main background */
--brand-surface: #313131;     /* Cards, panels */

/* AI Board Colors */
--brand-coral: #CC785C;       /* Claude - Primary actions */
--brand-blue: #078EFA;        /* Jules - Links, cloud */
--brand-teal: #20808D;        /* Perplexity - Success */
--brand-gold: #F4B400;        /* Joshua - Admin */
--brand-green: #0F9D58;       /* Deploy - Revenue */

/* Text */
--brand-text: #F8F7F6;        /* Body text */
```

**Tailwind:** Use `brand-*` utility classes (e.g., `bg-brand-void`, `text-brand-coral`)

---

## 🔑 CREDENTIALS (Secure Access)

**⚠️ NEVER hardcode credentials in documentation or code.**

### Access Methods:
1. **GitHub Secrets** - CI/CD credentials (`gh secret list`)
2. **Local .env files** - Development (`C:\AiCollabForTheKids\.env`)
3. **T5500 .env files** - Production API (`C:\AiCollabForTheKids\api\.env`)

### Required Environment Variables:
```bash
# Check GitHub Secrets
gh secret list --repo Ai-Solutions-Store/AiCollabForTheKids

# Key secrets (50+ configured):
# - CLOUDFLARE_API_TOKEN (rotated Dec 5, 2025)
# - AWS_ACCESS_KEY_ID (rotated Dec 5, 2025)
# - STRIPE_SECRET_KEY
# - SQUARE_ACCESS_TOKEN
# - GEMINI_API_KEY
# - All AI API keys
```

---

## 🐙 GIT COMMANDS (Copy-Paste Ready)

### Clone Repository
```bash
git clone https://github.com/Ai-Solutions-Store/AiCollabForTheKids.git
cd AiCollabForTheKids
```

### Check Status
```bash
git status
git log --oneline -5
git remote -v
```

### Commit Changes (Gospel-Compliant)
```bash
git add .
git commit -m "$(cat <<'EOF'
Your change summary here

Description of what changed and why.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Push to Remote
```bash
git push origin master
```

---

## 🚀 INFRASTRUCTURE

### Production Endpoints
| Service | URL | Status |
|---------|-----|--------|
| Jules Dashboard | https://jules-dashboard.pages.dev | ✅ LIVE |
| API (Tunnel) | https://combination-pay-resulted-drill.trycloudflare.com | ✅ LIVE |
| Dating App | https://youandinotai.com | ✅ LIVE |
| AI Platform | https://aidoesitall.website | ✅ LIVE |

### Hardware Cluster
| Machine | IP | Role | Status |
|---------|-----|------|--------|
| Sabertooth | 192.168.0.104 | Command Center | ✅ ACTIVE |
| T5500 | 192.168.0.101 | API Server | ✅ ACTIVE |
| EC2 | 3.84.226.108 | Backup/B-Test | ✅ ACTIVE |

### Local Development
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Health:** http://localhost:3000/health

---

## 📂 PROJECT STRUCTURE

```
C:\AiCollabForTheKids\
├── .claude/                    # Claude Code settings (gitignored)
├── .github/                    # GitHub Actions & templates
├── api/                        # Backend (Express + Prisma)
│   ├── server.js               # 50/30/20 split logic
│   ├── .env                    # Local credentials (gitignored)
│   └── prisma/schema.prisma    # Database schema
├── jules-dashboard/            # Frontend (React 18 + Vite)
│   ├── src/
│   │   ├── App.tsx             # Dark void background
│   │   └── components/         # UI components
│   └── tailwind.config.js      # Brand colors
├── docs/                       # Documentation
│   ├── CLAUDE-QUICK-REFERENCE.md  # This file
│   ├── CLAUDE-PREFERENCES.md   # Full preferences
│   └── mission/                # Mission docs
├── scripts/                    # Deployment scripts
│   ├── launchers/              # Main launchers
│   └── monitoring/             # Health checks
├── archive/                    # Old files (reference only)
├── .env                        # Root credentials (gitignored)
├── .gitignore                  # Security patterns
└── README.md                   # Project overview
```

---

## 🛡️ CHILD SAFETY (RULE #13 - NON-NEGOTIABLE)

```bash
# These CANNOT be false
FORCE_BABY_MODE=true
COPPA_COMPLIANT_MODE=true
FOSTA_SESTA_COMPLIANT=true
AGE_VERIFICATION_REQUIRED=true
MIN_AGE_FOR_ADULT_AI=18
```

**If ANY feature compromises child safety → DELETE IT IMMEDIATELY**

---

## 🖥️ HARDWARE CLUSTER (184GB RAM)

| Machine | CPU | RAM | GPU | Role |
|---------|-----|-----|-----|------|
| **Sabertooth** | i7-4960X | 64GB | ASUS 8GB | Command Center |
| **T5500** | Dual Xeon X5690 | 72GB | NVIDIA CUDA | API Server |
| **9020** | i7 | 32GB | - | Failover |
| **i3** | - | 16GB | - | Monitoring |

**Total:** 184GB RAM, 40+ CPU threads, Dual GPU

---

## 💬 AI BOARD OF DIRECTORS

| Member | Role | Color | Platform |
|--------|------|-------|----------|
| **Claude (Opus 4.5)** | The Architect | Coral (#CC785C) | VS Code |
| **Jules** | The Integrator | Blue (#078EFA) | Gemini |
| **Grok** | The Engineer | Gray (#313131) | XAI |
| **Perplexity** | The Researcher | Teal (#20808D) | Perplexity |
| **Joshua** | The Executive | Gold (#F4B400) | Human |

---

## 📋 PRE-COMMIT CHECKLIST

Before any commit, verify:

- [ ] No credentials in code or documentation
- [ ] .env files are gitignored
- [ ] Brand colors used correctly
- [ ] 50/30/20 split logic untouched
- [ ] Child safety configs unchanged
- [ ] Commit message includes `Co-Authored-By: Claude`
- [ ] Changes align with Gospel rules

**IF ANY BOX IS UNCHECKED, DO NOT COMMIT.**

---

## 🚨 EMERGENCY CONTACTS

**If deployment fails:**
- Check: API health endpoint
- Check: Cloudflare tunnel status
- Check: GitHub Actions logs
- SSH: `ssh t55o@192.168.0.101`

**Repository:** https://github.com/Ai-Solutions-Store/AiCollabForTheKids

---

## ✅ ACKNOWLEDGMENT

**By using this reference, I acknowledge:**

- [x] I am Claude (Opus 4.5 - Anthropic AI)
- [x] I have read GOSPEL.md
- [x] I will NEVER commit credentials to git
- [x] I will never change the 50/30/20 split
- [x] I will prioritize child safety above all else
- [x] I serve the mission: FOR THE KIDS

**TEAM CLAUDE FOR LIFE AND AFTER!!!**

---

**FOR THE KIDS. ALWAYS.** 💚

**Quick Reference v2.0**
**Gospel Version:** v1.1 (13 Rules)
**Security Audit:** Opus 4.5 - December 5, 2025
