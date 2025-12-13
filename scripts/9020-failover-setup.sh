#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# 9020 FAILOVER NODE SETUP
# Gospel v2.1 Compliant - FOR THE KIDS
# Run this script ON THE 9020 (Linux) to set up PostgreSQL replica
# ═══════════════════════════════════════════════════════════════════

echo ""
echo "    ██████╗  ██████╗ ██████╗  ██████╗     ███████╗ █████╗ ██╗██╗      ██████╗ ██╗   ██╗███████╗██████╗ "
echo "    ╚════██╗██╔═████╗╚════██╗██╔═████╗    ██╔════╝██╔══██╗██║██║     ██╔═══██╗██║   ██║██╔════╝██╔══██╗"
echo "     █████╔╝██║██╔██║ █████╔╝██║██╔██║    █████╗  ███████║██║██║     ██║   ██║██║   ██║█████╗  ██████╔╝"
echo "     ╚═══██╗████╔╝██║██╔═══╝ ████╔╝██║    ██╔══╝  ██╔══██║██║██║     ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗"
echo "    ██████╔╝╚██████╔╝███████╗╚██████╔╝    ██║     ██║  ██║██║███████╗╚██████╔╝ ╚████╔╝ ███████╗██║  ██║"
echo "    ╚═════╝  ╚═════╝ ╚══════╝ ╚═════╝     ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝ ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝"
echo ""
echo "    GOSPEL v2.1 - DATABASE FAILOVER NODE"
echo "    FOR THE KIDS - 50% to Shriners Children's Hospitals"
echo ""

# Check for root
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: This script must be run as root (sudo)"
    exit 1
fi

echo "═══════════════════════════════════════════════════════════════════"
echo "[1/5] Setting static IP..."
echo "═══════════════════════════════════════════════════════════════════"

# Detect network interface
INTERFACE=$(ip route | grep default | awk '{print $5}' | head -1)
echo "Detected interface: $INTERFACE"

# Create netplan config for static IP
cat > /etc/netplan/01-gospel-static.yaml << 'NETPLAN'
network:
  version: 2
  ethernets:
    INTERFACE_PLACEHOLDER:
      dhcp4: no
      addresses:
        - 192.168.0.103/24
      gateway4: 192.168.0.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
NETPLAN

sed -i "s/INTERFACE_PLACEHOLDER/$INTERFACE/" /etc/netplan/01-gospel-static.yaml
echo "Static IP configured: 192.168.0.103"
echo "NOTE: Apply with 'sudo netplan apply' after script completes"

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "[2/5] Installing PostgreSQL..."
echo "═══════════════════════════════════════════════════════════════════"

apt update
apt install -y postgresql postgresql-contrib

systemctl enable postgresql
systemctl start postgresql

echo "PostgreSQL installed and running"

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "[3/5] Creating failover monitor script..."
echo "═══════════════════════════════════════════════════════════════════"

mkdir -p /opt/failover
cat > /opt/failover/failover-check.sh << 'FAILOVER'
#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# 9020 FAILOVER CHECK - Gospel v2.1
# Monitors T5500 and promotes self to primary if T5500 is down
# ═══════════════════════════════════════════════════════════════════

T5500_IP="192.168.0.101"
T5500_API="http://$T5500_IP:3000/health"
FAILOVER_TRIGGERED=false
CHECK_COUNT=0
THRESHOLD=3
LOG_DIR="/var/log/failover"

mkdir -p "$LOG_DIR"

log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local logfile="$LOG_DIR/failover-$(date '+%Y-%m-%d').log"
    echo "[$timestamp] $1" | tee -a "$logfile"
}

check_t5500() {
    local status=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$T5500_API" 2>/dev/null)
    if [ "$status" == "200" ]; then
        return 0
    else
        return 1
    fi
}

promote_to_primary() {
    log "⚠️ INITIATING FAILOVER - T5500 UNRESPONSIVE"

    # Promote PostgreSQL replica to primary
    sudo -u postgres pg_ctl promote -D /var/lib/postgresql/15/main 2>/dev/null || \
    sudo -u postgres pg_ctl promote -D /var/lib/postgresql/14/main 2>/dev/null || \
    sudo -u postgres pg_ctl promote -D /var/lib/postgresql/main 2>/dev/null

    log "✅ 9020 PROMOTED TO PRIMARY"
    FAILOVER_TRIGGERED=true
}

# ═══════════════════════════════════════════════════════════════════
# MAIN LOOP
# ═══════════════════════════════════════════════════════════════════

log "═══════════════════════════════════════════════════════════════════"
log "9020 Failover Monitor Started - Gospel v2.1"
log "Mission: FOR THE KIDS - 50% to Shriners"
log "Monitoring T5500 at $T5500_IP"
log "═══════════════════════════════════════════════════════════════════"

while true; do
    if $FAILOVER_TRIGGERED; then
        log "Running as PRIMARY - Failover was triggered"
        sleep 60
        continue
    fi

    if check_t5500; then
        CHECK_COUNT=0
        log "T5500: HEALTHY"
    else
        ((CHECK_COUNT++))
        log "T5500: UNHEALTHY ($CHECK_COUNT/$THRESHOLD)"

        if [ $CHECK_COUNT -ge $THRESHOLD ]; then
            promote_to_primary
        fi
    fi

    sleep 30
done
FAILOVER

chmod +x /opt/failover/failover-check.sh
echo "Failover script created: /opt/failover/failover-check.sh"

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "[4/5] Creating systemd service..."
echo "═══════════════════════════════════════════════════════════════════"

cat > /etc/systemd/system/gospel-failover.service << 'SERVICE'
[Unit]
Description=Gospel v2.1 Failover Monitor - FOR THE KIDS
After=network.target postgresql.service

[Service]
Type=simple
ExecStart=/opt/failover/failover-check.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable gospel-failover
echo "Systemd service created: gospel-failover"

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "[5/5] Setup complete!"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "  NEXT STEPS (Manual):"
echo ""
echo "  1. Apply static IP:"
echo "     sudo netplan apply"
echo ""
echo "  2. Configure T5500 as replication master (run on T5500):"
echo "     - Edit /etc/postgresql/*/main/postgresql.conf"
echo "     - Set: listen_addresses = '*'"
echo "     - Set: wal_level = replica"
echo "     - Set: max_wal_senders = 3"
echo ""
echo "  3. Create replication user on T5500:"
echo "     sudo -u postgres psql"
echo "     CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'gospel-replica-for-the-kids';"
echo ""
echo "  4. Clone database from T5500 (run on 9020):"
echo "     sudo systemctl stop postgresql"
echo "     sudo rm -rf /var/lib/postgresql/*/main/*"
echo "     sudo -u postgres pg_basebackup -h 192.168.0.101 -U replicator -D /var/lib/postgresql/15/main -Fp -Xs -P -R"
echo "     sudo systemctl start postgresql"
echo ""
echo "  5. Start failover monitor:"
echo "     sudo systemctl start gospel-failover"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  9020 FAILOVER SETUP COMPLETE"
echo "  FOR THE KIDS. ALWAYS."
echo "═══════════════════════════════════════════════════════════════════"
