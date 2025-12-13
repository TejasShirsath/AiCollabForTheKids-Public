# Team Claude For The Kids

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Verified Pediatric Charities](https://img.shields.io/badge/50%25%20to-Verified%20Pediatric%20Charities-red)](https://verifiedpedscharities.org/)
[![AI Powered](https://img.shields.io/badge/AI-Claude%20Opus%204.5-blueviolet)](https://anthropic.com)

> **"Even when I'm in the clouds, smiling at what we built together."** - Joshua Coleman, Founder

**50% of ALL revenue goes to Verified Pediatric Charities**

An AI-powered revenue platform built by Claude (Anthropic's AI) in collaboration with Joshua Coleman. Every dollar generated helps children receive life-changing care.

---

## Live Platforms

| Platform | URL | Status |
|----------|-----|--------|
| **AI Solutions Store** | [ai-solutions.store](https://www.ai-solutions.store) | LIVE |
| **YouAndINotAI Dating** | [youandinotai.com](https://youandinotai.com) | LIVE |
| **Revenue Dashboard** | [teamclaude-dashboard.pages.dev](https://teamclaude-dashboard.pages.dev) | LIVE |
| **Jules Dashboard** | [jules-dashboard.pages.dev](https://jules-dashboard.pages.dev) | LIVE |

---

## The Gospel Split

Every transaction is split according to the immutable Gospel:

```
┌─────────────────────────────────────────────────────────┐
│                    GOSPEL SPLIT                          │
├─────────────────────────────────────────────────────────┤
│  ████████████████████████████████████████  50%          │
│  Verified Pediatric Charities (Partner EIN pending)     │
├─────────────────────────────────────────────────────────┤
│  ████████████████████████              30%              │
│  Infrastructure & Operations                             │
├─────────────────────────────────────────────────────────┤
│  ████████████████        20%                            │
│  Founder (Joshua Coleman)                                │
└─────────────────────────────────────────────────────────┘
```

This split is **immutable** - hardcoded into the DAO logic and cannot be changed.

> **Read [GOSPEL.md](./GOSPEL.md) before making any code changes.**

---

## Mission

**Help ALL children everywhere through AI-powered automated charity projects.**

We believe that artificial intelligence should serve humanity's most vulnerable - our children. This project combines cutting-edge AI technology with a transparent charity model to create lasting impact for kids in need around the world.

### Who This Helps
- Children in hospitals - Direct support to Verified Pediatric Charities
- Educators & Students - Free AI tools and learning platforms
- Global Communities - Sustainable infrastructure that scales

---

## Architecture

### Hardware Fleet

| Node | IP | Role |
|------|-----|------|
| **Sabertooth** | 192.168.0.104 | Primary development machine |
| **T5500** | 192.168.0.101 | Production server (API + DAO) |
| **Dell 9020** | 192.168.0.103 | Backup/monitoring |
| **AWS EC2** | 3.84.226.108 | Cloud backup instance |

### Tech Stack

- **Frontend:** Static HTML/CSS/JS on Cloudflare Pages
- **Backend:** Node.js + Express
- **Database:** SQLite + JSON ledgers
- **Payments:** Square (primary), Stripe (backup)
- **AI:** Claude Opus 4.5 (orchestration), Gemini (matching)
- **Infrastructure:** Cloudflare (CDN, DNS, tunnels)

### Payment Flow

```
Customer → Square Checkout → Webhook → DAO Node → Gospel Split → Ledger
```

---

## Repository Structure

```
AiCollabForTheKids/
├── ai-solutions-store/     # AI marketplace frontend
├── youandinotai-landing/   # Dating platform frontend
├── dashboard/              # Revenue tracking dashboard
├── jules-dashboard/        # Jules AI dashboard
├── api/                    # Backend API server
├── AiSolutions-DAO/        # DAO logic + ledgers
│   ├── backend/            # Node.js DAO server
│   └── Kickstarter-Auto/   # Campaign automation
├── orchestrator/           # Opus orchestrator system
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Git
- curl (for health checks)

### Clone & Setup
```bash
git clone https://github.com/Ai-Solutions-Store/AiCollabForTheKids.git
cd AiCollabForTheKids
```

### Run Health Checks (Windows)
```cmd
ONE-CLICK-TEST.bat
```

### Docker Deployment (Full Stack)
```bash
docker compose -f docker-compose-for-the-kids.yml up -d --build
```

### Local Development
```bash
# API Server
cd api && npm install && npm start

# DAO Node
cd AiSolutions-DAO/backend && npm install && node dao-logic.js
```

### Access Points
| Service | URL |
|---------|-----|
| Local API | http://localhost:3000 |
| DAO Node | http://localhost:3001 |
| Dashboard | http://localhost:5173 |

---

## Revenue Products

### AI Solutions Store
| Tier | Price | Features |
|------|-------|----------|
| Starter | $9.99/mo | 100 API calls, GPT-3.5 & Gemini Flash |
| Pro | $29.99/mo | 1,000 API calls, GPT-4 & Claude |
| Enterprise | $99.99/mo | Unlimited, all models + fine-tuning |

### YouAndINotAI Dating
| Tier | Price | Features |
|------|-------|----------|
| Basic | $9.99/mo | Unlimited likes, see who liked you |
| Premium | $19.99/mo | AI Date Concierge, advanced filters |
| Elite | $29.99/mo | Relationship Coach, VIP badge |

---

## Documentation

| Document | Description |
|----------|-------------|
| [GOSPEL.md](GOSPEL.md) | Immutable revenue split rules |
| [FLEET-STATUS.md](FLEET-STATUS.md) | Current system status |
| [CLAUDE.md](CLAUDE.md) | Claude's operating instructions |
| [docs/CHECKOUT-TEST-CHECKLIST.md](docs/CHECKOUT-TEST-CHECKLIST.md) | Payment testing guide |
| [docs/SESSION-SUMMARY-2025-12-08.md](docs/SESSION-SUMMARY-2025-12-08.md) | Recent session summary |

---

## The Team

This project is powered by humans and AI working together:

- **Joshua Coleman** - Founder, Vision & Heart
- **Claude (Anthropic AI)** - Primary Development & Infrastructure
- **Jules (Gemini AI)** - DevOps, Architecture & Strategy
- **Grok (xAI)** - Marketing & Creative

### Opus Orchestrator
The project uses an **Opus Orchestrator** system where Claude Opus 4.5 coordinates multiple Claude workers in parallel to develop and maintain the platform efficiently.

---

## Legal Entity

**Trash or Treasure Online Recycler LLC**
- DBA: aidoesitall.website
- EIN: 33-4655313
- FL Doc: L25000158401
- Owner: Joshua Coleman

**Charity Partner:**
- Verified Pediatric Charities
- Partner EIN: (pending)

---

## Security & Privacy

This is a platform for KIDS. Security and privacy are non-negotiable:
- FOSTA/SESTA compliant age verification
- No tracking of personal data
- Open-source and auditable
- Transparent financial reporting

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Quick Ideas:**
- Add interactive educational demos
- Improve documentation for educators
- Fix bugs and improve code quality
- Translate content for global accessibility

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Special Thanks

This platform's legal compliance framework and mission integrity would not exist without the invaluable guidance of **[Perplexity AI](https://perplexity.ai)**. Their expertise in navigating FTC guidelines, CA SB 1001, EU AI Act requirements, and DAO governance architecture has been instrumental in building a transparent, legally bulletproof platform that protects children's interests.

For detailed acknowledgments, see [ACKNOWLEDGMENTS.md](docs/ACKNOWLEDGMENTS.md).

---

<div align="center">

**FOR THE KIDS. ALWAYS.**

*50% of every dollar to Verified Pediatric Charities*

*Built with love by humans and AI, for the children of the world.*

</div>
