# FOR THE KIDS - Distributed Platform Architecture
## Gospel Version: v1.0 | Opus 4.5 Controlled

> 50% of ALL revenue → charity Children's Hospitals

---

## Network Topology

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FOR THE KIDS INFRASTRUCTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐         │
│  │  SABERTOOTH │      │    T5500    │      │    9020     │         │
│  │  (Command)  │ SSH  │  (Primary)  │ SSH  │  (Worker)   │         │
│  │             │─────▶│             │─────▶│             │         │
│  │ • VS Code   │      │ • API Server│      │ • Build Jobs│         │
│  │ • Claude    │      │ • Database  │      │ • Testing   │         │
│  │ • Browser   │      │ • Dashboard │      │ • Backups   │         │
│  └─────────────┘      │ • Docker    │      └─────────────┘         │
│        │              └─────────────┘             │                 │
│        │                    │                     │                 │
│        │              ┌─────────────┐             │                 │
│        │              │   SENTRY    │             │                 │
│        └─────────────▶│  (Monitor)  │◀────────────┘                 │
│                       │             │                               │
│                       │ • Logs      │                               │
│                       │ • Alerts    │                               │
│                       │ • Metrics   │                               │
│                       └─────────────┘                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Machine Roles

### SABERTOOTH (Your Workstation)
**Role:** Command & Control - ZERO compute load
**Runs:**
- VS Code + Claude Code (conversation only)
- Web browser (connects to T5500 dashboard)
- Git operations (local commits, push to remote)

**Does NOT run:**
- API servers
- Databases
- Build processes
- Docker containers

### T5500 (Primary Compute Node)
**Role:** Heavy lifting - ALL production services
**Runs:**
- PostgreSQL database
- Node.js API server (port 3000)
- Jules Dashboard dev server (port 5173)
- Docker containers
- npm builds
- AI inference tasks

**Specs needed:**
- 16GB+ RAM recommended
- SSD for database
- Network accessible from Sabertooth

### 9020 (Secondary Worker)
**Role:** Parallel processing & redundancy
**Runs:**
- Build jobs (CI/CD)
- Test suites
- Static file generation
- Backup processes
- Overflow compute

### SENTRY (Monitor Node)
**Role:** Observability & alerting
**Runs:**
- Log aggregation
- Health monitoring
- Uptime checks
- Alert notifications
- Metrics dashboard

---

## Network Configuration

### Required Ports (Open on T5500)
| Port | Service | Access |
|------|---------|--------|
| 22 | SSH | Sabertooth only |
| 3000 | API Server | All nodes |
| 5173 | Dashboard | All nodes |
| 5432 | PostgreSQL | Internal only |
| 6379 | Redis | Internal only |

### Hostnames (Add to each machine's hosts file)
```
# FOR THE KIDS Network
192.168.x.x    sabertooth
192.168.x.x    t5500
192.168.x.x    9020
192.168.x.x    sentry
```

---

## Setup Checklist

### Phase 1: T5500 Setup
- [ ] Install Node.js 18+
- [ ] Install Docker Desktop
- [ ] Install Git
- [ ] Clone repository
- [ ] Configure SSH server
- [ ] Open firewall ports
- [ ] Run initial setup

### Phase 2: Sabertooth Configuration
- [ ] Generate SSH keys
- [ ] Configure SSH config for T5500
- [ ] Install thin-client launcher
- [ ] Test remote connections

### Phase 3: Worker Nodes (9020, Sentry)
- [ ] Configure SSH access
- [ ] Install required software
- [ ] Join to network
- [ ] Configure roles

---

## Daily Workflow

1. **Start work:** Double-click "Jules Dashboard" on Sabertooth
   - Connects to T5500 dashboard via browser
   - No local servers started

2. **Development:** Claude Code runs commands via SSH to T5500
   - All npm/docker/build commands execute remotely
   - Sabertooth stays responsive

3. **Testing:** Heavy tests run on 9020
   - T5500 stays available for development
   - Results reported back to dashboard

4. **Monitoring:** Sentry watches everything
   - Alerts if any service goes down
   - Logs aggregated for debugging

---

## Emergency Procedures

### If T5500 goes down:
1. Services auto-failover to 9020 (if configured)
2. Production continues on Cloudflare (already deployed)
3. Local development pauses until restored

### If network is down:
1. Sabertooth can run minimal local dev (fallback mode)
2. Commit work locally
3. Push when network restores

---

## Gospel Compliance

This architecture ensures:
- ✅ 50% revenue split is IMMUTABLE (verified on every API start)
- ✅ No single point of failure
- ✅ Scalable for growth
- ✅ Your workstation stays lag-free
- ✅ Claude maintains control of all nodes

---

*Architecture designed by Claude (Opus 4.5)*
*FOR THE KIDS - December 2025*
