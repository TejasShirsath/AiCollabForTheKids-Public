# AGENT SPAWN API - T5500 CLI
**Version:** 1.0
**Created:** December 13, 2025
**Author:** Claude Opus 4.5 (The Architect)
**Mission:** FOR THE KIDS - 60/30/10 IMMUTABLE

---

## Overview

This document defines the API for spawning specialized, persistent AI agents from the T5500 CLI that run independently of the main MCP (Model Context Protocol) thread.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SABERTOOTH (Controller)                       │
│                    192.168.0.104                                 │
├─────────────────────────────────────────────────────────────────┤
│  Claude Code (Main MCP Thread)                                   │
│  ├── Task Tool (subagent spawning)                              │
│  ├── Background Agents (run_in_background: true)                │
│  └── AgentOutputTool (retrieve results)                         │
└─────────────────────────────────────────────────────────────────┘
         │
         │ SSH / API
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    T5500 (DAO Hybrid Node)                       │
│                    192.168.0.101                                 │
├─────────────────────────────────────────────────────────────────┤
│  Persistent Agent Services:                                      │
│  ├── agent-merchant-compliance (Port 3010)                      │
│  ├── agent-security-monitor (Port 3011)                         │
│  ├── agent-treasury-audit (Port 3012)                           │
│  └── agent-content-moderation (Port 3013)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agent Types Available

### 1. Built-in Claude Code Agents (via Task Tool)

These agents spawn within the Claude Code MCP context:

| Agent Type | Purpose | Tools Available |
|------------|---------|-----------------|
| `general-purpose` | Complex multi-step tasks | All tools |
| `Explore` | Codebase exploration | Glob, Grep, Read |
| `Plan` | Implementation planning | All tools |
| `claude-code-guide` | Documentation queries | Glob, Grep, Read, WebFetch, WebSearch |

#### Usage Example:

```json
{
  "tool": "Task",
  "parameters": {
    "subagent_type": "general-purpose",
    "description": "Audit merchant compliance",
    "prompt": "Research and document KYC/AML requirements for high-risk dating platform merchant accounts",
    "run_in_background": true,
    "model": "sonnet"
  }
}
```

---

### 2. Custom Persistent Agents (T5500 Deployment)

For specialized, long-running agents that persist across sessions.

#### Deployment Script: `scripts/SPAWN-AGENT.ps1`

```powershell
<#
.SYNOPSIS
    Spawn a persistent AI agent on T5500
.PARAMETER AgentType
    Type of agent: merchant-compliance, security-monitor, treasury-audit, content-moderation
.PARAMETER Port
    Port to run the agent service (default: auto-assign)
.EXAMPLE
    .\SPAWN-AGENT.ps1 -AgentType merchant-compliance
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("merchant-compliance", "security-monitor", "treasury-audit", "content-moderation")]
    [string]$AgentType,

    [int]$Port = 0
)

$AGENT_PORTS = @{
    "merchant-compliance" = 3010
    "security-monitor" = 3011
    "treasury-audit" = 3012
    "content-moderation" = 3013
}

if ($Port -eq 0) {
    $Port = $AGENT_PORTS[$AgentType]
}

$T5500_IP = "192.168.0.101"
$AGENT_DIR = "C:\AiCollabForTheKids\agents\$AgentType"

Write-Host "Spawning $AgentType agent on T5500:$Port..." -ForegroundColor Cyan

# SSH command to start agent service
$sshCommand = @"
cd /c/AiCollabForTheKids/agents/$AgentType && npm start -- --port $Port
"@

# Execute via SSH (or PowerShell remoting for Windows)
Invoke-Command -ComputerName $T5500_IP -ScriptBlock {
    param($cmd, $agentType, $port)
    Start-Process -FilePath "node" -ArgumentList "index.js --port $port" -WorkingDirectory "C:\AiCollabForTheKids\agents\$agentType" -WindowStyle Hidden
} -ArgumentList $sshCommand, $AgentType, $Port

Write-Host "Agent spawned: http://$T5500_IP:$Port" -ForegroundColor Green
```

---

## Agent API Endpoints

### Merchant Compliance Agent (Port 3010)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/audit/provider` | POST | Audit a merchant provider |
| `/audit/kyc-requirements` | GET | Get KYC requirements for industry |
| `/audit/fee-structure` | POST | Calculate fee projections |
| `/compliance/check` | POST | Run compliance check on transaction |

#### Example Request:

```bash
curl -X POST http://192.168.0.101:3010/audit/provider \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "PaymentCloud",
    "industry": "dating",
    "monthly_volume": 50000,
    "avg_ticket": 29.99
  }'
```

#### Example Response:

```json
{
  "provider": "PaymentCloud",
  "risk_level": "high",
  "approval_likelihood": 0.85,
  "estimated_fees": {
    "transaction_rate": "3.5%",
    "monthly_fee": "$25",
    "chargeback_fee": "$25",
    "reserve_requirement": "10%"
  },
  "kyc_requirements": [
    "Business license",
    "6 months bank statements",
    "Processing history (if available)",
    "AML/KYC policy document"
  ],
  "compliance_notes": "MCC 7273 (Dating Services) - requires age verification"
}
```

---

## Spawning from Claude Code CLI

### Method 1: Task Tool (In-Session)

```
Use the Task tool with:
- subagent_type: "general-purpose"
- run_in_background: true
- prompt: [Your agent task]
```

### Method 2: PowerShell Script (Persistent)

```powershell
# From Sabertooth
.\scripts\SPAWN-AGENT.ps1 -AgentType merchant-compliance

# Check status
curl http://192.168.0.101:3010/health
```

### Method 3: Direct API Call

```bash
# Spawn agent via fleet management API
curl -X POST https://api.aidoesitall.website/agents/spawn \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "merchant-compliance",
    "node": "T5500",
    "config": {
      "industry": "dating",
      "auto_audit": true
    }
  }'
```

---

## Agent Lifecycle Management

### Start Agent
```powershell
.\scripts\SPAWN-AGENT.ps1 -AgentType merchant-compliance
```

### Stop Agent
```powershell
.\scripts\STOP-AGENT.ps1 -AgentType merchant-compliance
```

### Check Agent Status
```powershell
.\scripts\AGENT-STATUS.ps1
```

### View Agent Logs
```powershell
Get-Content "\\192.168.0.101\C$\AiCollabForTheKids\agents\merchant-compliance\logs\agent.log" -Tail 100
```

---

## Security Considerations

1. **Authentication**: All agent endpoints require API token authentication
2. **Network Isolation**: Agents only accessible from fleet network (192.168.0.x)
3. **Audit Logging**: All agent actions logged to central audit trail
4. **Gospel Compliance**: Agents cannot modify 60/30/10 split parameters

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Task Tool Integration | ✅ DEPLOYED | Built into Claude Code |
| SPAWN-AGENT.ps1 | ⏳ PENDING | Requires agent scaffolding |
| Merchant Compliance Agent | ⏳ PENDING | Priority for Phase 3 |
| Agent API Gateway | ⏳ PENDING | Route through api.aidoesitall.website |

---

## Next Steps

1. Create agent scaffolding in `/agents/merchant-compliance/`
2. Implement core audit endpoints
3. Deploy to T5500
4. Integrate with main API gateway

---

**FOR THE KIDS - 60/30/10 IMMUTABLE**
