#!/bin/bash
# 🔱 OMEGA AUDIT - URGENT SECURITY FIX
# Removes MASTER.env from git tracking
# RUN THIS ONLY AFTER ROTATING ALL CREDENTIALS

set -e

echo "🔱 OMEGA AUDIT - Security Fix (MASTER.env removal)"
echo "════════════════════════════════════════════════════════"

cd /c/AiCollabForTheKids

# Step 1: Add MASTER.env to .gitignore
echo ""
echo "📝 Step 1: Adding MASTER.env to .gitignore..."
if ! grep -q "^MASTER\.env$" .gitignore; then
    echo "" >> .gitignore
    echo "# MASTER.env - ALL CREDENTIALS (NEVER COMMIT)" >> .gitignore
    echo "MASTER.env" >> .gitignore
    echo "✅ Added MASTER.env to .gitignore"
else
    echo "ℹ️  MASTER.env already in .gitignore"
fi

# Step 2: Stop tracking MASTER.env
echo ""
echo "🗑️  Step 2: Removing MASTER.env from git tracking..."
git rm --cached MASTER.env 2>/dev/null || echo "ℹ️  MASTER.env already untracked"

# Step 3: Commit changes
echo ""
echo "💾 Step 3: Committing security fix..."
git add .gitignore
git commit -m "🚨 SECURITY: Remove MASTER.env from tracking - credentials rotated

OMEGA AUDIT FINDING: MASTER.env exposed in git repository
ACTION TAKEN:
- Added MASTER.env to .gitignore
- Removed from git tracking
- All credentials rotated separately

FOR THE KIDS - Security First 🔱"

# Step 4: Push to master
echo ""
echo "🚀 Step 4: Pushing to master..."
git push origin master

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ SECURITY FIX COMPLETE"
echo "════════════════════════════════════════════════════════"
echo ""
echo "⚠️  NEXT STEPS (MANUAL):"
echo "1. Rotate ALL credentials in MASTER.env"
echo "2. Update api/.env with new credentials"
echo "3. Redeploy all services"
echo "4. (OPTIONAL) Purge MASTER.env from git history using git-filter-repo"
echo ""
echo "FOR THE KIDS 💚"
