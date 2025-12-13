#!/bin/bash
# 🔱 OMEGA AUDIT - API Health Verification
# Tests all critical endpoints for 200 OK status

set -e

echo "🔱 OMEGA AUDIT - API Health Check"
echo "════════════════════════════════════════════════════════"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test endpoint function
test_endpoint() {
    local url=$1
    local name=$2

    echo -n "Testing $name... "

    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ OK (200)${NC}"
        return 0
    elif [ "$status_code" = "404" ]; then
        echo -e "${RED}❌ NOT FOUND (404)${NC}"
        return 1
    elif [ "$status_code" = "502" ]; then
        echo -e "${RED}❌ BAD GATEWAY (502)${NC}"
        return 1
    elif [ "$status_code" = "000" ]; then
        echo -e "${RED}❌ CONNECTION FAILED${NC}"
        return 1
    else
        echo -e "${YELLOW}⚠️  UNEXPECTED ($status_code)${NC}"
        return 1
    fi
}

# Test all critical endpoints
echo ""
echo "📊 Gospel Revenue Endpoints:"
test_endpoint "https://dao.youandinotai.com/api/transparency/stats" "Transparency Stats"

echo ""
echo "📊 Infrastructure Endpoints:"
test_endpoint "https://dao.youandinotai.com/api/infra/ledger" "Infrastructure Ledger"
test_endpoint "https://dao.youandinotai.com/api/infra/stats" "Infrastructure Stats"

echo ""
echo "🤖 Droid Orchestrator:"
test_endpoint "https://dao.youandinotai.com/api/droid-orchestrator/status" "Droid Status"

echo ""
echo "🎯 Kickstarter:"
test_endpoint "https://dao.youandinotai.com/api/transparency/kickstarter" "Kickstarter Stats"

echo ""
echo "════════════════════════════════════════════════════════"
echo "Health Check Complete"
echo "════════════════════════════════════════════════════════"
echo ""
echo "If any endpoints failed, check:"
echo "1. T5500 PM2 status: ssh t55o@192.168.0.101 'pm2 list'"
echo "2. Cloudflare Tunnel status"
echo "3. API server logs: ssh t55o@192.168.0.101 'pm2 logs api'"
echo ""
echo "FOR THE KIDS 💚"
