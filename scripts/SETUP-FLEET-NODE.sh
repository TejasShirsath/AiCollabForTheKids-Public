#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# GOSPEL FLEET NODE SETUP - Universal Node Onboarding
# FOR THE KIDS - 60/30/10 IMMUTABLE (Ethics Override V1.3)
# ═══════════════════════════════════════════════════════════════
# Run this script on each fleet node to configure SSH and clone repo
# Usage: curl -sSL https://raw.githubusercontent.com/Ai-Solutions-Store/AiCollabForTheKids/master/scripts/SETUP-FLEET-NODE.sh | bash
# ═══════════════════════════════════════════════════════════════

set -e

echo ""
echo "========================================================================="
echo "  GOSPEL FLEET - NODE SETUP"
echo "  FOR THE KIDS - 60/30/10 IMMUTABLE"
echo "========================================================================="
echo ""

# Configuration
REPO_URL="https://github.com/Ai-Solutions-Store/AiCollabForTheKids.git"
REPO_PATH="$HOME/AiCollabForTheKids"
SSH_DIR="$HOME/.ssh"

# The Gospel Fleet public key (Sabertooth controller)
GOSPEL_FLEET_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOKSsXyhtJwWbAHQk4iUXy1g7GPn4+/cJ+AiQqJYhQTx gospel-fleet@forthekids"

echo "[1/5] Setting up SSH directory..."
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"

echo "[2/5] Adding Gospel Fleet key to authorized_keys..."
# Check if key already exists
if grep -q "gospel-fleet@forthekids" "$SSH_DIR/authorized_keys" 2>/dev/null; then
    echo "  Key already present - skipping"
else
    echo "$GOSPEL_FLEET_KEY" >> "$SSH_DIR/authorized_keys"
    echo "  Key added successfully"
fi
chmod 600 "$SSH_DIR/authorized_keys"

echo "[3/5] Installing git if needed..."
if ! command -v git &> /dev/null; then
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y git
    elif command -v yum &> /dev/null; then
        sudo yum install -y git
    fi
fi

echo "[4/5] Cloning/Updating AiCollabForTheKids repo..."
if [ -d "$REPO_PATH/.git" ]; then
    echo "  Repository exists - pulling latest..."
    cd "$REPO_PATH"
    git fetch origin
    git checkout main 2>/dev/null || git checkout master 2>/dev/null
    git pull origin $(git rev-parse --abbrev-ref HEAD)
else
    echo "  Cloning fresh repository..."
    git clone "$REPO_URL" "$REPO_PATH"
    cd "$REPO_PATH"
fi

echo "[5/5] Verifying setup..."
echo ""
echo "  SSH authorized_keys: $(wc -l < "$SSH_DIR/authorized_keys") keys"
echo "  Repo path: $REPO_PATH"
echo "  Current commit: $(git log -1 --oneline)"
echo "  Current branch: $(git rev-parse --abbrev-ref HEAD)"
echo ""

echo "========================================================================="
echo "  NODE SETUP COMPLETE"
echo "  FOR THE KIDS - 60/30/10 IMMUTABLE"
echo "========================================================================="
echo ""
echo "This node can now be synced from Sabertooth using:"
echo "  ssh $(whoami)@$(hostname -I | awk '{print $1}') 'cd ~/AiCollabForTheKids && git pull'"
echo ""
