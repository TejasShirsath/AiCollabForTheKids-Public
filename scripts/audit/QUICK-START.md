# Gospel Split Audit Tool - Quick Start

## One-Line Commands

### Run Basic Audit
```bash
node scripts/audit/gospel-audit.cjs
```

### Run Detailed Audit (Show All Transactions)
```bash
node scripts/audit/gospel-audit.cjs --detailed
```

### Run Test Suite
```bash
node scripts/audit/test-audit.cjs
```

## What It Does

Verifies the **IMMUTABLE** Gospel Split across all transactions:
- **50%** → charity Children's Hospitals
- **30%** → Infrastructure & Reinvestment
- **20%** → Founder (Joshua Coleman)

## Exit Codes

- **0** = ✅ All checks passed, Gospel intact
- **1** = ❌ Violations detected, IMMEDIATE ALERT

## Quick Integration

### Add to Deployment Pipeline
```powershell
# In DEPLOY-EVERYTHING-ONE-CLICK.ps1
node scripts\audit\gospel-audit.cjs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Gospel violation - deployment blocked"
    exit 1
}
```

### Schedule Daily Audit (Windows)
```powershell
$action = New-ScheduledTaskAction -Execute "node" -Argument "C:\AiCollabForTheKids\scripts\audit\gospel-audit.cjs"
$trigger = New-ScheduledTaskTrigger -Daily -At 6am
Register-ScheduledTask -TaskName "GospelAudit" -Action $action -Trigger $trigger
```

### Call After Payment Webhook
```javascript
// In dao-logic.js
const { execSync } = require('child_process');
execSync('node C:\\AiCollabForTheKids\\scripts\\audit\\gospel-audit.cjs');
```

## Files

| File | Purpose |
|------|---------|
| `gospel-audit.cjs` | Main audit script |
| `test-audit.cjs` | Test suite runner |
| `test-ledger.json` | Sample test data |
| `README.md` | Full documentation |

## What Gets Checked

✅ Each transaction's charity split = 50% (±$0.01)
✅ Each transaction's Infrastructure split = 30% (±$0.01)
✅ Each transaction's Founder split = 20% (±$0.01)
✅ Total allocated = Net Revenue (±$0.01)
✅ Global percentages = 50/30/20 (±0.5%)
✅ No duplicate transaction IDs
✅ .env Gospel percentages correct

## Example Output (Clean)

```
╔═══════════════════════════════════════════════════════════╗
║          GOSPEL SPLIT AUDIT REPORT                       ║
║       50% charity | 30% Infra | 20% Founder             ║
╚═══════════════════════════════════════════════════════════╝

STATUS: ✅ GOSPEL INTACT - ALL CHECKS PASSED

FOR THE KIDS. ALWAYS. 💚
```

## Example Output (Violations)

```
STATUS: ❌ VIOLATIONS DETECTED - IMMEDIATE ALERT REQUIRED

VIOLATION DETAILS:
[Transaction 5] ID: sq_pay_12345
  ❌ charity split: $45.00 (expected $50.00)
  ❌ Founder split: $25.00 (expected $20.00)
```

## Troubleshooting

**"Ledger not found"**
→ Check path: `C:\AiCollabForTheKids\AiSolutions-DAO\backend\safe_harbor_ledger.json`

**"Failed to read ledger"**
→ JSON is malformed, validate with `node -e "JSON.parse(...)"`

**".env percentages wrong"**
→ Edit `api\.env`: Set CHARITY=50, INFRASTRUCTURE=30, FOUNDER=20

## Support

Emergency: joshlcoleman@gmail.com

Full docs: `scripts/audit/README.md`

---

**FOR THE KIDS. ALWAYS.** 💚
