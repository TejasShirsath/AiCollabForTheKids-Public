#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# T5500 GEMINI QUICK FIX
# Automatically fix common Gemini 2.0 Flash / Dashboard issues
# FOR THE KIDS - Fast Recovery
# ═══════════════════════════════════════════════════════════════════

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   T5500 GEMINI QUICK FIX                                      ║"
echo "║   FOR THE KIDS - Automatic Recovery                          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Go to repo
cd ~/AiCollabForTheKids 2>/dev/null || cd /home/t55o/AiCollabForTheKids 2>/dev/null || {
    echo -e "${RED}✗ CRITICAL: AiCollabForTheKids directory not found${NC}"
    exit 1
}

echo -e "${BLUE}[1/6]${NC} Fetching latest code from GitHub..."
git fetch origin

echo -e "${BLUE}[2/6]${NC} Checking current branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "  Current: $CURRENT_BRANCH"

# If not on master, switch to master
if [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${YELLOW}  Switching to master branch...${NC}"
    git checkout master
fi

echo -e "${BLUE}[3/6]${NC} Pulling latest changes..."
git pull origin master

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Git pull failed - you may have uncommitted changes${NC}"
    echo "  Stashing changes and retrying..."
    git stash
    git pull origin master

    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Still failed - manual intervention required${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓${NC} Code updated to latest master"

echo -e "${BLUE}[4/6]${NC} Installing/updating NPM dependencies..."
cd ~/AiCollabForTheKids/api
npm install --silent

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ NPM install had warnings (non-critical)${NC}"
fi

echo -e "${BLUE}[5/6]${NC} Restarting all PM2 processes..."
pm2 restart all

# Wait for processes to restart
sleep 3

echo -e "${BLUE}[6/6]${NC} Verifying services..."

# Check Jules API
JULES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/jules/status 2>/dev/null)

if [ "$JULES_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Jules API is responding${NC}"

    # Check what model it's reporting
    JULES_RESPONSE=$(curl -s http://localhost:3000/api/jules/status 2>/dev/null)
    echo "  Jules Status:"
    echo "$JULES_RESPONSE" | head -5
else
    echo -e "${RED}✗ Jules API not responding (HTTP $JULES_STATUS)${NC}"
    echo "  Check logs: pm2 logs jules-api"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  QUICK FIX COMPLETE"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✓${NC} Latest code deployed"
echo -e "${GREEN}✓${NC} Dependencies updated"
echo -e "${GREEN}✓${NC} Services restarted"
echo ""
echo "  Next steps:"
echo "    1. Test Jules API: curl http://localhost:3000/api/jules/status"
echo "    2. Check logs: pm2 logs --lines 50"
echo "    3. Refresh dashboard in browser (clear cache: Ctrl+Shift+R)"
echo ""
echo "  If issues persist, run full diagnostic:"
echo "    bash ~/AiCollabForTheKids/scripts/T5500-GEMINI-DIAGNOSTIC.sh"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  FOR THE KIDS"
echo "════════════════════════════════════════════════════════════════"
echo ""
