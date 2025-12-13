# 🖥️ 9020 FAILOVER NODE SETUP GUIDE
# Gospel v2.1 - Database Redundancy
# FOR THE KIDS - 100% Uptime Guarantee

---

## 🎯 MISSION

Configure Dell 9020 (32GB RAM) as PostgreSQL failover replica to ensure database never goes down.

**Gospel Compliance:** Rule #11 (Backup & Disaster Recovery)

---

## 📊 HARDWARE CLUSTER

- **Sabertooth (192.168.0.100):** Command Center ✅
- **T5500 (192.168.0.101):** Docker Master + Primary PostgreSQL ✅
- **9020 (192.168.0.103):** Failover + PostgreSQL Replica ← **THIS GUIDE**
- **i3 Sentry:** Monitoring (future)

---

## 🚀 STEP-BY-STEP SETUP

### Step 1: Get the Setup Script on 9020

**Option A: Clone from GitHub (Recommended)**
```bash
# On 9020
cd ~
git clone https://github.com/Ai-Solutions-Store/AiCollabForTheKids.git
cd AiCollabForTheKids
git checkout claude/consolidate-historical-data-01R829J28WuxnzkuujThex8t

# Make script executable
chmod +x scripts/9020-failover-setup.sh
```

**Option B: Manual Download**
```bash
# On 9020
wget https://raw.githubusercontent.com/Ai-Solutions-Store/AiCollabForTheKids/claude/consolidate-historical-data-01R829J28WuxnzkuujThex8t/scripts/9020-failover-setup.sh
chmod +x 9020-failover-setup.sh
```

---

### Step 2: Run the Setup Script

```bash
# On 9020
sudo ./scripts/9020-failover-setup.sh
```

**This will:**
- ✅ Configure static IP (192.168.0.103)
- ✅ Install PostgreSQL
- ✅ Create failover monitor script
- ✅ Set up systemd service

---

### Step 3: Apply Network Configuration

```bash
# On 9020
sudo netplan apply

# Verify IP
ip addr show | grep "192.168.0.103"
```

---

### Step 4: Configure T5500 as Replication Master

**SSH to T5500:**
```bash
ssh user@192.168.0.101
```

**Find PostgreSQL config:**
```bash
sudo find /etc/postgresql -name postgresql.conf
# Note the path (e.g., /etc/postgresql/15/main/postgresql.conf)
```

**Edit postgresql.conf:**
```bash
sudo nano /etc/postgresql/15/main/postgresql.conf
```

**Add/modify these lines:**
```
listen_addresses = '*'
wal_level = replica
max_wal_senders = 3
wal_keep_size = 64
```

**Edit pg_hba.conf:**
```bash
sudo nano /etc/postgresql/15/main/pg_hba.conf
```

**Add at bottom:**
```
# Gospel v2.1 - 9020 Replication
host    replication     replicator      192.168.0.103/32        md5
```

**Restart PostgreSQL:**
```bash
sudo systemctl restart postgresql
```

**Create replication user:**
```bash
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'gospel-replica-for-the-kids';"
```

**Verify:**
```bash
sudo -u postgres psql -c "\du" | grep replicator
```

---

### Step 5: Clone Database to 9020

**Back on 9020:**

```bash
# Stop PostgreSQL
sudo systemctl stop postgresql

# Find PostgreSQL data directory
PGDATA=$(sudo -u postgres psql -t -c "SHOW data_directory;" 2>/dev/null | xargs)
echo "Data directory: $PGDATA"

# Clear existing data
sudo rm -rf $PGDATA/*

# Clone from T5500
sudo -u postgres pg_basebackup \
  -h 192.168.0.101 \
  -U replicator \
  -D $PGDATA \
  -Fp -Xs -P -R

# Password when prompted: gospel-replica-for-the-kids

# Start PostgreSQL
sudo systemctl start postgresql
```

**Verify replication:**

On T5500:
```bash
sudo -u postgres psql -c "SELECT client_addr, state, sync_state FROM pg_stat_replication;"
# Should show: 192.168.0.103 | streaming | async
```

On 9020:
```bash
sudo -u postgres psql -c "SELECT pg_is_in_recovery();"
# Should return: t (true = replica mode)
```

---

### Step 6: Start Failover Monitor

**On 9020:**

```bash
# Start monitor
sudo systemctl start gospel-failover

# Enable on boot
sudo systemctl enable gospel-failover

# Check status
sudo systemctl status gospel-failover

# View logs
sudo tail -f /var/log/failover/failover-$(date '+%Y-%m-%d').log
```

**Expected logs:**
```
[timestamp] ═══════════════════════════════════════════════════════════════════
[timestamp] 9020 Failover Monitor Started - Gospel v2.1
[timestamp] Mission: FOR THE KIDS - 50% to charity
[timestamp] Monitoring T5500 at 192.168.0.101
[timestamp] ═══════════════════════════════════════════════════════════════════
[timestamp] T5500: HEALTHY
```

---

## ✅ VERIFICATION

**On 9020:**
```bash
# 1. Check IP
ip addr show | grep "192.168.0.103"

# 2. Check PostgreSQL
systemctl status postgresql

# 3. Check replica mode
sudo -u postgres psql -c "SELECT pg_is_in_recovery();"

# 4. Check failover monitor
systemctl status gospel-failover

# 5. Check logs
sudo tail -20 /var/log/failover/failover-$(date '+%Y-%m-%d').log
```

**On T5500:**
```bash
# Check replication
sudo -u postgres psql -c "SELECT client_addr, state FROM pg_stat_replication;"
```

---

## 🚨 FAILOVER TEST

**To verify failover works:**

```bash
# On T5500 - simulate failure
sudo systemctl stop postgresql

# On 9020 - watch logs (failover triggers in ~90 seconds)
sudo tail -f /var/log/failover/failover-$(date '+%Y-%m-%d').log

# Expected sequence:
# T5500: UNHEALTHY (1/3)
# T5500: UNHEALTHY (2/3)
# T5500: UNHEALTHY (3/3)
# ⚠️ INITIATING FAILOVER - T5500 UNRESPONSIVE
# ✅ 9020 PROMOTED TO PRIMARY

# Restart T5500
sudo systemctl start postgresql
```

---

## 🎯 GOSPEL COMPLIANCE

**This setup ensures:**
- ✅ Gospel Rule #11: Backup & Disaster Recovery
- ✅ 100% Uptime (operational law)
- ✅ Database redundancy (T5500 fails → 9020 takes over)
- ✅ Automatic promotion (no human intervention)
- ✅ Revenue continuity (database never down = payments never stop)
- ✅ Mission protection (kids always helped)

---

## 📞 TROUBLESHOOTING

### Replication not working?

**On T5500:**
```bash
# Check logs
sudo tail -50 /var/log/postgresql/postgresql-15-main.log

# Verify replicator user
sudo -u postgres psql -c "\du" | grep replicator

# Check pg_hba.conf
sudo cat /etc/postgresql/15/main/pg_hba.conf | grep replication
```

**On 9020:**
```bash
# Check PostgreSQL logs
sudo tail -50 /var/log/postgresql/postgresql-15-main.log

# Check connection
psql -h 192.168.0.101 -U replicator -d postgres
```

### Failover monitor not starting?

```bash
# Check service
sudo systemctl status gospel-failover

# View errors
sudo journalctl -u gospel-failover -n 50

# Restart
sudo systemctl restart gospel-failover
```

---

**FOR THE KIDS - 100% uptime guaranteed.** 💚

**Gospel v2.1 Compliant | Database Failover Active**
