#!/bin/bash
# 🔱 OMEGA AUDIT - Code Cleanup
# Removes old URLs and adds Gospel warnings

set -e

echo "🔱 OMEGA AUDIT - Code Cleanup"
echo "════════════════════════════════════════════════════════"

cd /c/AiCollabForTheKids

# Step 1: Remove old Cloudflare tunnel URL from CORS
echo ""
echo "🧹 Step 1: Removing old Cloudflare tunnel URL..."
if grep -q "theoretical-bras-difference-kirk.trycloudflare.com" api/server.js; then
    sed -i "/theoretical-bras-difference-kirk.trycloudflare.com/d" api/server.js
    echo "✅ Removed old tunnel URL from api/server.js"
else
    echo "ℹ️  Old tunnel URL not found (may already be removed)"
fi

# Step 2: Add Gospel warnings to GitHub docs
echo ""
echo "📚 Step 2: Adding Gospel warnings to .github documentation..."

GOSPEL_WARNING="## ⚠️ DEVELOPERS: READ [GOSPEL.md](../GOSPEL.md) BEFORE CONTRIBUTING

This project operates under the Gospel Rules - 50% of net profit goes to Verified Pediatric Charities.
All code changes must maintain Gospel compliance.

---

"

cd .github
for file in *.md; do
  if [ -f "$file" ]; then
    if ! grep -q "GOSPEL.md" "$file"; then
      echo "$GOSPEL_WARNING" | cat - "$file" > temp && mv temp "$file"
      echo "  ✅ Added warning to $file"
    else
      echo "  ℹ️  $file already has Gospel warning"
    fi
  fi
done
cd ..

# Step 3: Commit changes
echo ""
echo "💾 Step 3: Committing code cleanup..."
git add api/server.js .github/
git commit -m "OMEGA AUDIT: Code cleanup - Remove old URLs + Gospel warnings

Changes:
- Removed old Cloudflare tunnel URL from CORS
- Added Gospel warnings to all .github documentation
- Ensures contributors understand Gospel compliance requirements

FOR THE KIDS 🔱"

# Step 4: Push to master
echo ""
echo "🚀 Step 4: Pushing to master..."
git push origin master

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ CODE CLEANUP COMPLETE"
echo "════════════════════════════════════════════════════════"
echo ""
echo "FOR THE KIDS 💚"
