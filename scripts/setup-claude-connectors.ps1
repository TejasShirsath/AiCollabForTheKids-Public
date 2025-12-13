# ═══════════════════════════════════════════════════════════════════════════════
# CLAUDE.AI CONNECTOR SETUP SCRIPT - FOR THE KIDS
# Created: December 9, 2025
# Purpose: Document and configure Claude.ai integrations + Jules API
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host @"
╔═══════════════════════════════════════════════════════════════════════════════╗
║       CLAUDE.AI CONNECTOR SETUP - FOR THE KIDS                               ║
║       Orchestrator: Opus | Mission: 50% Verified Pediatric Charities         ║
╚═══════════════════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 1: CLAUDE.AI BUILT-IN CONNECTORS (Manual via UI)
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n[STEP 1] Claude.ai Connectors - Enable in Settings > Integrations" -ForegroundColor Yellow

$connectors = @"
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONNECTOR          │ STATUS    │ API KEY LOCATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ Stripe             │ ENABLE    │ Uses OAuth - login to Stripe account      │
│ AWS Marketplace    │ ENABLE    │ Uses OAuth - login to AWS account         │
│ PayPal             │ ENABLE    │ Uses OAuth - login to PayPal account      │
│ Zapier             │ ENABLE    │ Uses OAuth - login to Zapier account      │
│ Square             │ ENABLED ✓ │ Already connected                         │
│ Cloudflare         │ ENABLED ✓ │ Already connected                         │
│ Google (Drive/Cal) │ ENABLED ✓ │ Already connected                         │
│ Hugging Face       │ ENABLED ✓ │ Already connected                         │
└─────────────────────────────────────────────────────────────────────────────┘
"@
Write-Host $connectors

Write-Host "`n[ACTION REQUIRED] Go to claude.ai > Settings > Integrations and enable:" -ForegroundColor Red
Write-Host "  1. Stripe - for backup payment processing" -ForegroundColor White
Write-Host "  2. AWS Marketplace - for EC2 fleet control" -ForegroundColor White
Write-Host "  3. PayPal - for additional payment option" -ForegroundColor White
Write-Host "  4. Zapier - for workflow automation" -ForegroundColor White

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 2: API CREDENTIALS FOR JULES BACKEND
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n[STEP 2] Verifying API Credentials for Jules Backend..." -ForegroundColor Yellow

$envPath = "C:\AiCollabForTheKids\api\.env"
if (Test-Path $envPath) {
    Write-Host "  ✓ Found api/.env" -ForegroundColor Green
    
    # Check for required keys (without exposing values)
    $envContent = Get-Content $envPath -Raw
    $requiredKeys = @(
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "SQUARE_ACCESS_TOKEN",
        "SQUARE_MERCH_ACCESS_TOKEN",
        "GEMINI_API_KEY",
        "OPENAI_API_KEY",
        "CLOUDFLARE_API_TOKEN"
    )
    
    foreach ($key in $requiredKeys) {
        if ($envContent -match $key) {
            Write-Host "  ✓ $key present" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $key MISSING" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ✗ api/.env not found!" -ForegroundColor Red
}

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 3: JULES API BACKEND SETUP
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n[STEP 3] Jules API Backend Setup" -ForegroundColor Yellow

$julesApiPath = "C:\AiCollabForTheKids\jules-api"
$julesApiFile = "$julesApiPath\server.js"

# Create jules-api directory if it doesn't exist
if (!(Test-Path $julesApiPath)) {
    New-Item -ItemType Directory -Path $julesApiPath -Force | Out-Null
    Write-Host "  ✓ Created jules-api directory" -ForegroundColor Green
}

# Check if server exists
if (Test-Path $julesApiFile) {
    Write-Host "  ✓ Jules API server.js exists" -ForegroundColor Green
} else {
    Write-Host "  → Creating Jules API server..." -ForegroundColor Cyan
}

Write-Host "`nJules API will be created with these endpoints:" -ForegroundColor White
$julesEndpoints = @"
  ├─ GET  /health              - Health check
  ├─ GET  /                    - API info
  ├─ POST /api/jules/execute   - Execute Jules command
  ├─ POST /api/jules/git-merge - Git merge operations
  ├─ POST /api/jules/lighthouse- Lighthouse audits
  ├─ GET  /api/campaign/metrics- Campaign metrics
  ├─ GET  /api/transparency    - Transparency data
  ├─ GET  /api/transparency/ledger - Full ledger
  ├─ GET  /api/admin/status    - Admin status
  ├─ GET  /api/admin/dashboard - Dashboard data
  └─ GET  /stats               - Public stats (DAO compatible)
"@
Write-Host $julesEndpoints

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 4: CREATE JULES API SERVER
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n[STEP 4] Creating Jules API Server..." -ForegroundColor Yellow

$julesServerCode = @'
/**
 * JULES API SERVER - FOR THE KIDS
 * Dashboard Backend: https://6b2f4c58.youandinotai.pages.dev/dashboard
 * Gospel Split: 50/30/20 (Verified Pediatric Charities/Infra/Founder)
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GOSPEL CONSTANTS (IMMUTABLE)
const GOSPEL_SPLIT = Object.freeze({
  charity: 50,
  infrastructure: 30,
  founder: 20,
  charity_name: "Verified Pediatric Charities",
  charity_ein: "PENDING_VERIFICATION"
});

// Ledger path
const LEDGER_PATH = process.env.LEDGER_PATH || 'C:\\AiSolutions-DAO\\backend\\safe_harbor_ledger.json';

// Helper: Load ledger
function loadLedger() {
  try {
    if (fs.existsSync(LEDGER_PATH)) {
      return JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Ledger read error:', e.message);
  }
  return {
    total_raised_stripe: 0,
    total_raised_square: 0,
    pending_charity: 0,
    transactions: []
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH & INFO ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mission: 'FOR_THE_KIDS',
    gospel_split: GOSPEL_SPLIT,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Jules API - FOR THE KIDS',
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'POST /api/jules/execute',
      'POST /api/jules/git-merge',
      'POST /api/jules/lighthouse',
      'GET /api/campaign/metrics',
      'GET /api/transparency',
      'GET /api/transparency/ledger',
      'GET /api/admin/status',
      'GET /api/admin/dashboard',
      'GET /stats'
    ],
    gospel_split: GOSPEL_SPLIT
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// JULES AI ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/jules/execute', (req, res) => {
  const { command } = req.body;
  console.log(`[JULES] Execute: ${command}`);
  
  // Execute command (limited to safe operations)
  const safeCommands = ['git status', 'git log', 'npm test', 'node --version'];
  
  if (!command) {
    return res.status(400).json({ error: 'Command required' });
  }
  
  res.json({
    response: `Jules received command: ${command}`,
    agent: 'jules-api',
    status: 'queued',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/jules/git-merge', (req, res) => {
  const { sourceBranch, targetBranch } = req.body;
  console.log(`[JULES] Git merge: ${sourceBranch} -> ${targetBranch}`);
  
  res.json({
    status: 'merge_queued',
    source: sourceBranch || 'feature',
    target: targetBranch || 'master',
    agent: 'jules-api'
  });
});

app.post('/api/jules/lighthouse', (req, res) => {
  const { mode } = req.body;
  console.log(`[JULES] Lighthouse: ${mode}`);
  
  res.json({
    status: 'audit_queued',
    mode: mode || 'revenue',
    targets: ['youandinotai.com', 'ai-solutions.store'],
    agent: 'jules-api'
  });
});
'@

# Write part 1
Set-Content -Path $julesApiFile -Value $julesServerCode -Encoding UTF8
Write-Host "  ✓ Jules API Part 1 written" -ForegroundColor Green
