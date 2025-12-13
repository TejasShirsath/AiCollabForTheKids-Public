═══════════════════════════════════════════════════════════════════
    GOSPEL v2.1 DEPLOYMENT USB
    FOR THE KIDS - 50% to charity Children's Hospitals
═══════════════════════════════════════════════════════════════════

Created: December 6, 2025
Authority: Claude (Opus 4.5) + Joshua Coleman


═══════════════════════════════════════════════════════════════════
CONTENTS
═══════════════════════════════════════════════════════════════════

📁 i3-sentry\
   └── i3-sentry-install.ps1    (Run as Admin - Windows)
   └── i3-sentry-monitor.ps1    (Copied automatically by installer)

📁 9020-failover\
   └── 9020-failover-setup.sh   (Run as root - Linux: sudo bash 9020-failover-setup.sh)


═══════════════════════════════════════════════════════════════════
i3 SENTRY SETUP (Windows)
═══════════════════════════════════════════════════════════════════

1. Copy i3-sentry folder to Desktop
2. Right-click PowerShell → "Run as Administrator"
3. Run: cd Desktop\i3-sentry
4. Run: .\i3-sentry-install.ps1

The installer will:
- Create C:\Sentry\ directory
- Copy monitoring script
- Create scheduled task (runs on boot)
- Start monitoring immediately

IP Assignment: 192.168.0.102 (set manually in Network Settings)


═══════════════════════════════════════════════════════════════════
9020 FAILOVER SETUP (Linux/Ubuntu)
═══════════════════════════════════════════════════════════════════

1. Copy 9020-failover folder to home directory
2. Open terminal
3. Run: cd ~/9020-failover
4. Run: sudo bash 9020-failover-setup.sh

The installer will:
- Configure static IP (192.168.0.103)
- Install PostgreSQL
- Create failover monitoring script
- Create systemd service

MANUAL STEPS REQUIRED after script:
- Configure T5500 as replication master
- Clone database from T5500
- Start failover service

See Phase-2-Hardware-Lockdown.md for full instructions.


═══════════════════════════════════════════════════════════════════
NETWORK TOPOLOGY
═══════════════════════════════════════════════════════════════════

    Node          │ IP             │ Role
    ──────────────┼────────────────┼──────────────────────
    Sabertooth    │ 192.168.0.104  │ Command Center
    T5500         │ 192.168.0.101  │ Production API (Primary)
    i3 Sentry     │ 192.168.0.102  │ Health Monitoring
    9020          │ 192.168.0.103  │ Database Failover


═══════════════════════════════════════════════════════════════════
MONITORED ENDPOINTS (i3 Sentry)
═══════════════════════════════════════════════════════════════════

- T5500 API:        http://192.168.0.101:3000/health
- Cloudflare:       https://combination-pay-resulted-drill.trycloudflare.com/health
- Jules Dashboard:  https://jules-dashboard.pages.dev
- Dating App:       https://youandinotai.com
- AI Platform:      https://aidoesitall.website


═══════════════════════════════════════════════════════════════════

    FOR THE KIDS. ALWAYS.

    — Claude (The Architect - Opus 4.5)

═══════════════════════════════════════════════════════════════════
