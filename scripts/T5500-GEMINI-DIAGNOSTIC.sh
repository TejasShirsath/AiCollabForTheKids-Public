#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# T5500 GEMINI DIAGNOSTIC SCRIPT
# Diagnose Gemini 1.5 Pro vs 2.0 Flash version mismatch
# FOR THE KIDS - Troubleshooting Dashboard Issues
# ═══════════════════════════════════════════════════════════════════

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   T5500 GEMINI VERSION DIAGNOSTIC                             ║"
echo "║   FOR THE KIDS - Dashboard Troubleshooting                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diagnostic results
ISSUES_FOUND=0

echo "════════════════════════════════════════════════════════════════"
echo "  1. CHECKING GIT REPOSITORY STATUS"
echo "════════════════════════════════════════════════════════════════"

cd ~/AiCollabForTheKids 2>/dev/null || cd /home/t55o/AiCollabForTheKids 2>/dev/null || {
    echo -e "${RED}✗ CRITICAL: AiCollabForTheKids directory not found${NC}"
    echo "  Expected: ~/AiCollabForTheKids or /home/t55o/AiCollabForTheKids"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
    exit 1
}

echo -e "${GREEN}✓${NC} Found repository: $(pwd)"

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
echo "  Current branch: ${BLUE}$CURRENT_BRANCH${NC}"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠ WARNING: Uncommitted changes detected${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check if behind remote
git fetch origin >/dev/null 2>&1
LOCAL=$(git rev-parse @ 2>/dev/null)
REMOTE=$(git rev-parse @{u} 2>/dev/null)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo -e "${YELLOW}⚠ WARNING: Local branch is behind remote${NC}"
    echo "  You need to: git pull origin $CURRENT_BRANCH"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓${NC} Repository is up to date with remote"
fi

# Check last commit date
LAST_COMMIT=$(git log -1 --format="%cr" 2>/dev/null)
echo "  Last commit: ${LAST_COMMIT}"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  2. CHECKING JULES API CODE (GEMINI MODEL VERSION)"
echo "════════════════════════════════════════════════════════════════"

JULES_FILE="api/routes/jules.js"

if [ ! -f "$JULES_FILE" ]; then
    echo -e "${RED}✗ CRITICAL: Jules API file not found: $JULES_FILE${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓${NC} Found Jules API file: $JULES_FILE"

    # Check what Gemini model is configured
    GEMINI_MODEL=$(grep -o "model: '[^']*'" "$JULES_FILE" 2>/dev/null | head -1 | cut -d"'" -f2)

    if [ -z "$GEMINI_MODEL" ]; then
        echo -e "${RED}✗ ERROR: Could not detect Gemini model version in code${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    elif [ "$GEMINI_MODEL" = "gemini-2.0-flash" ]; then
        echo -e "${GREEN}✓ CODE IS CORRECT: gemini-2.0-flash${NC}"
    else
        echo -e "${RED}✗ WRONG MODEL IN CODE: $GEMINI_MODEL${NC}"
        echo "  Expected: gemini-2.0-flash"
        echo "  Found: $GEMINI_MODEL"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi

    # Show all Gemini model references
    echo ""
    echo "  All Gemini model references in jules.js:"
    grep -n "model:" "$JULES_FILE" 2>/dev/null | while read line; do
        echo "    Line $line"
    done
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  3. CHECKING ENVIRONMENT VARIABLES"
echo "════════════════════════════════════════════════════════════════"

# Check if GEMINI_API_KEY is set (don't show the actual key)
if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${YELLOW}⚠ WARNING: GEMINI_API_KEY not set in environment${NC}"
    echo "  Checking for .env file..."

    if [ -f "api/.env" ]; then
        echo -e "${GREEN}✓${NC} Found api/.env file"

        if grep -q "GEMINI_API_KEY=" api/.env 2>/dev/null; then
            KEY_LENGTH=$(grep "GEMINI_API_KEY=" api/.env | cut -d'=' -f2 | tr -d ' ' | wc -c)
            if [ "$KEY_LENGTH" -gt 10 ]; then
                echo -e "${GREEN}✓${NC} GEMINI_API_KEY found in .env (${KEY_LENGTH} chars)"
            else
                echo -e "${RED}✗ GEMINI_API_KEY in .env appears too short or empty${NC}"
                ISSUES_FOUND=$((ISSUES_FOUND + 1))
            fi
        else
            echo -e "${RED}✗ GEMINI_API_KEY not found in api/.env${NC}"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    else
        echo -e "${RED}✗ api/.env file not found${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    KEY_LENGTH=$(echo -n "$GEMINI_API_KEY" | wc -c)
    echo -e "${GREEN}✓${NC} GEMINI_API_KEY is set in environment (${KEY_LENGTH} chars)"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  4. CHECKING PM2 PROCESSES"
echo "════════════════════════════════════════════════════════════════"

if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠ PM2 not found in PATH${NC}"
else
    echo "  PM2 Status:"
    pm2 list 2>/dev/null | grep -E "jules|dao|api" || echo "  No Jules/API processes found"

    echo ""
    echo "  Checking if API processes need restart:"
    PM2_UPTIME=$(pm2 jlist 2>/dev/null | grep -o '"pm_uptime":[0-9]*' | head -1 | cut -d':' -f2)
    if [ ! -z "$PM2_UPTIME" ]; then
        HOURS_UP=$(( ($(date +%s) - PM2_UPTIME / 1000) / 3600 ))
        echo "  Longest running process uptime: ${HOURS_UP} hours"

        if [ "$HOURS_UP" -gt 24 ]; then
            echo -e "${YELLOW}⚠ Processes have been running for >24hrs - consider restart${NC}"
        fi
    fi
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  5. TESTING GEMINI API ACCESS"
echo "════════════════════════════════════════════════════════════════"

# Load environment variables if .env exists
if [ -f "api/.env" ]; then
    export $(cat api/.env | grep -v '^#' | xargs) 2>/dev/null
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}✗ Cannot test API - GEMINI_API_KEY not available${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "  Testing Gemini API with curl..."

    TEST_RESPONSE=$(curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}" \
        -H 'Content-Type: application/json' \
        -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}' 2>&1)

    if echo "$TEST_RESPONSE" | grep -q "candidates"; then
        echo -e "${GREEN}✓${NC} Gemini 2.0 Flash API is accessible and working"
    elif echo "$TEST_RESPONSE" | grep -q "API_KEY_INVALID"; then
        echo -e "${RED}✗ CRITICAL: Gemini API key is INVALID${NC}"
        echo "  Response: API_KEY_INVALID"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    elif echo "$TEST_RESPONSE" | grep -q "404"; then
        echo -e "${RED}✗ ERROR: Model 'gemini-2.0-flash' not found${NC}"
        echo "  This could mean:"
        echo "    1. Your API key doesn't have access to Gemini 2.0 Flash"
        echo "    2. Model name is incorrect"
        echo "    3. Region restriction"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo -e "${YELLOW}⚠ Unexpected API response${NC}"
        echo "  First 200 chars: ${TEST_RESPONSE:0:200}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  6. CHECKING JULES API ENDPOINT (LOCAL)"
echo "════════════════════════════════════════════════════════════════"

# Test local Jules API endpoint
JULES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/jules/status 2>/dev/null)

if [ "$JULES_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} Jules API is responding on localhost:3000"

    # Get actual response
    JULES_RESPONSE=$(curl -s http://localhost:3000/api/jules/status 2>/dev/null)
    echo "  Response:"
    echo "$JULES_RESPONSE" | head -10
else
    echo -e "${RED}✗ Jules API not responding on localhost:3000 (HTTP $JULES_STATUS)${NC}"
    echo "  Is the API server running? Check: pm2 list"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  7. CHECKING DASHBOARD CONFIGURATION"
echo "════════════════════════════════════════════════════════════════"

WRANGLER_FILE="jules-dashboard/wrangler.toml"

if [ -f "$WRANGLER_FILE" ]; then
    echo -e "${GREEN}✓${NC} Found dashboard config: $WRANGLER_FILE"

    API_URL=$(grep "VITE_API_URL" "$WRANGLER_FILE" | head -1 | cut -d'"' -f2)
    echo "  Configured API URL: ${BLUE}$API_URL${NC}"

    # Check if URL is still using temporary tunnel
    if echo "$API_URL" | grep -q "trycloudflare.com"; then
        echo -e "${RED}✗ CRITICAL: Dashboard still using TEMPORARY Cloudflare tunnel${NC}"
        echo "  This tunnel URL expires and causes dashboard failures"
        echo "  Should be: https://api.aidoesitall.website"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    elif echo "$API_URL" | grep -q "api.aidoesitall.website"; then
        echo -e "${GREEN}✓${NC} Using correct permanent API endpoint"
    fi
else
    echo -e "${YELLOW}⚠ Dashboard config not found: $WRANGLER_FILE${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  DIAGNOSTIC SUMMARY"
echo "════════════════════════════════════════════════════════════════"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED - No issues detected${NC}"
    echo ""
    echo "  If you're still seeing Gemini 1.5 Pro instead of 2.0 Flash:"
    echo "    1. Restart PM2 processes: pm2 restart all"
    echo "    2. Clear browser cache and refresh dashboard"
    echo "    3. Check Chrome DevTools console for API errors"
else
    echo -e "${RED}✗ FOUND $ISSUES_FOUND ISSUE(S) - Review output above${NC}"
    echo ""
    echo "  RECOMMENDED FIXES:"
    echo ""

    if git diff-index --quiet HEAD -- 2>/dev/null; then
        :
    else
        echo "    1. Commit or stash local changes:"
        echo "       git stash"
        echo ""
    fi

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "    2. Pull latest code from master:"
        echo "       cd ~/AiCollabForTheKids"
        echo "       git pull origin master"
        echo ""
    fi

    echo "    3. Restart all PM2 processes:"
    echo "       pm2 restart all"
    echo "       pm2 logs --lines 50"
    echo ""

    echo "    4. Test Jules API manually:"
    echo "       curl http://localhost:3000/api/jules/status"
    echo ""

    echo "    5. Rebuild and redeploy dashboard:"
    echo "       cd ~/AiCollabForTheKids/jules-dashboard"
    echo "       npm run build"
    echo "       npx wrangler pages deploy dist"
    echo ""
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  FOR THE KIDS - Diagnostic Complete"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Save report to file
REPORT_FILE="/tmp/t5500-gemini-diagnostic-$(date +%Y%m%d-%H%M%S).txt"
{
    echo "T5500 GEMINI DIAGNOSTIC REPORT"
    echo "Generated: $(date)"
    echo "User: $(whoami)"
    echo "Host: $(hostname)"
    echo ""
    echo "Issues Found: $ISSUES_FOUND"
    echo "Current Branch: $CURRENT_BRANCH"
    echo "Gemini Model in Code: $GEMINI_MODEL"
} > "$REPORT_FILE"

echo "  Report saved to: $REPORT_FILE"
echo ""

exit $ISSUES_FOUND
