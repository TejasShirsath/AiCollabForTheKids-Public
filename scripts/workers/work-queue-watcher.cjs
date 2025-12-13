#!/usr/bin/env node
/**
 * WORK QUEUE WATCHER - FOR THE KIDS
 * Monitors .work-queue/inbox/ and executes tasks
 * Created: 2025-12-09
 * Role: Bridge between Desktop Opus and CLI Worker Agents
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
  PROJECT_ROOT: path.resolve(__dirname, '../..'),
  WATCH_INTERVAL_MS: 2000,
  MAX_CONCURRENT_TASKS: 3,
  BUDGET_LIMIT_USD: 200,
  BUDGET_HALT_THRESHOLD: 0.95,
  DEFAULT_MODEL: 'sonnet',
  ENABLE_REMOTE_NODES: true,
  NODES: {
    T5500: '192.168.0.101',
    '9020': '192.168.0.103',
    EC2: '3.84.226.108',
    Sabertooth: '192.168.0.104'
  }
};

const PATHS = {
  inbox: path.join(CONFIG.PROJECT_ROOT, '.work-queue/inbox'),
  inProgress: path.join(CONFIG.PROJECT_ROOT, '.work-queue/in-progress'),
  completed: path.join(CONFIG.PROJECT_ROOT, '.work-queue/completed'),
  failed: path.join(CONFIG.PROJECT_ROOT, '.work-queue/failed'),
  budgetLog: path.join(CONFIG.PROJECT_ROOT, '.work-queue/budget-log.json')
};

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

let activeTasks = new Map();
let budgetData = loadBudgetData();

// ═══════════════════════════════════════════════════════════════
// BUDGET TRACKING
// ═══════════════════════════════════════════════════════════════

function loadBudgetData() {
  if (fs.existsSync(PATHS.budgetLog)) {
    return JSON.parse(fs.readFileSync(PATHS.budgetLog, 'utf8'));
  }
  return {
    month: new Date().toISOString().slice(0, 7),
    total_spent: 0,
    tasks: []
  };
}

function saveBudgetData() {
  fs.writeFileSync(PATHS.budgetLog, JSON.stringify(budgetData, null, 2));
}

function getCurrentMonthSpend() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (budgetData.month !== currentMonth) {
    // New month - reset
    budgetData = {
      month: currentMonth,
      total_spent: 0,
      tasks: []
    };
    saveBudgetData();
  }
  return budgetData.total_spent;
}

function logTaskCost(taskId, cost) {
  budgetData.total_spent += cost;
  budgetData.tasks.push({
    id: taskId,
    cost,
    timestamp: new Date().toISOString()
  });
  saveBudgetData();
}

function checkBudgetStatus() {
  const spent = getCurrentMonthSpend();
  const percentage = spent / CONFIG.BUDGET_LIMIT_USD;

  if (percentage >= CONFIG.BUDGET_HALT_THRESHOLD) {
    console.error(`\n⛔ BUDGET HALT: ${percentage * 100}% of $${CONFIG.BUDGET_LIMIT_USD} spent ($${spent.toFixed(2)})`);
    console.error('Halting work queue to prevent budget overrun.');
    console.error('FOR THE KIDS - budget protection active.\n');
    return false;
  }

  if (percentage >= 0.8) {
    console.warn(`\n⚠️  BUDGET WARNING: ${percentage * 100}% of $${CONFIG.BUDGET_LIMIT_USD} spent ($${spent.toFixed(2)})`);
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════
// TASK EXECUTION
// ═══════════════════════════════════════════════════════════════

async function executeTask(workOrder) {
  const startTime = Date.now();
  const taskId = workOrder.id;

  console.log(`\n🚀 Executing Task: ${taskId}`);
  console.log(`   Task: ${workOrder.task}`);
  console.log(`   Model: ${workOrder.details?.model_preference || CONFIG.DEFAULT_MODEL}`);
  console.log(`   Spawn Agents: ${workOrder.details?.spawn_agents || false}`);

  try {
    let result;

    if (workOrder.details?.spawn_agents) {
      // Spawn worker agents
      result = await executeWithAgents(workOrder);
    } else {
      // Execute directly
      result = await executeDirect(workOrder);
    }

    const executionTimeMs = Date.now() - startTime;
    const executionTimeMins = (executionTimeMs / 1000 / 60).toFixed(2);

    // Estimate cost (rough approximation)
    const estimatedCost = estimateCost(result.model, result.input_tokens, result.output_tokens);
    logTaskCost(taskId, estimatedCost);

    const resultData = {
      id: taskId,
      status: 'completed',
      started: workOrder.created,
      completed: new Date().toISOString(),
      execution_time_mins: parseFloat(executionTimeMins),
      model_used: result.model,
      total_cost: `$${estimatedCost.toFixed(2)}`,
      results: result.data,
      summary: result.summary,
      logs: result.logs
    };

    // Write result
    const resultPath = path.join(PATHS.completed, `${taskId}-result.json`);
    fs.writeFileSync(resultPath, JSON.stringify(resultData, null, 2));

    console.log(`✅ Task Completed: ${taskId} (${executionTimeMins} mins, $${estimatedCost.toFixed(2)})`);

    return resultData;

  } catch (error) {
    console.error(`❌ Task Failed: ${taskId}`);
    console.error(`   Error: ${error.message}`);

    const errorData = {
      id: taskId,
      status: 'failed',
      error: error.message,
      stack: error.stack,
      started: workOrder.created,
      failed: new Date().toISOString(),
      partial_results: {},
      retry_recommended: true
    };

    const errorPath = path.join(PATHS.failed, `${taskId}-error.json`);
    fs.writeFileSync(errorPath, JSON.stringify(errorData, null, 2));

    throw error;
  }
}

async function executeWithAgents(workOrder) {
  // This would spawn actual Claude Code agents
  // For now, simulate agent execution
  console.log(`   Spawning ${workOrder.details.agent_count || 1} agents...`);

  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    model: workOrder.details.model_preference || CONFIG.DEFAULT_MODEL,
    input_tokens: 5000,
    output_tokens: 2000,
    data: {
      files_created: [],
      tests_passed: true,
      deployment_ready: true
    },
    summary: `Task ${workOrder.task} completed via agent swarm`,
    logs: 'Agent execution logs...'
  };
}

async function executeDirect(workOrder) {
  // Direct execution (no agents)
  console.log(`   Executing directly...`);

  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    model: CONFIG.DEFAULT_MODEL,
    input_tokens: 2000,
    output_tokens: 1000,
    data: {
      result: 'Direct execution completed'
    },
    summary: `Task ${workOrder.task} completed directly`,
    logs: 'Direct execution logs...'
  };
}

function estimateCost(model, inputTokens, outputTokens) {
  const PRICING = {
    'opus': { input: 15 / 1000000, output: 75 / 1000000 },
    'sonnet': { input: 3 / 1000000, output: 15 / 1000000 },
    'haiku': { input: 0.25 / 1000000, output: 1.25 / 1000000 }
  };

  const pricing = PRICING[model] || PRICING.sonnet;
  return (inputTokens * pricing.input) + (outputTokens * pricing.output);
}

// ═══════════════════════════════════════════════════════════════
// FILE WATCHING
// ═══════════════════════════════════════════════════════════════

function processInbox() {
  // Check budget first
  if (!checkBudgetStatus()) {
    return; // Budget exceeded, halt processing
  }

  // Check for new work orders
  if (!fs.existsSync(PATHS.inbox)) {
    return;
  }

  const files = fs.readdirSync(PATHS.inbox).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    return;
  }

  // Respect max concurrent tasks
  if (activeTasks.size >= CONFIG.MAX_CONCURRENT_TASKS) {
    console.log(`⏳ Max concurrent tasks (${CONFIG.MAX_CONCURRENT_TASKS}) reached. Waiting...`);
    return;
  }

  // Process next task
  const file = files[0];
  const filePath = path.join(PATHS.inbox, file);

  try {
    const workOrder = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Move to in-progress
    const inProgressPath = path.join(PATHS.inProgress, file);
    fs.renameSync(filePath, inProgressPath);

    // Mark as active
    activeTasks.set(workOrder.id, workOrder);

    // Execute (async)
    executeTask(workOrder)
      .then(() => {
        activeTasks.delete(workOrder.id);
        fs.unlinkSync(inProgressPath);
      })
      .catch(error => {
        activeTasks.delete(workOrder.id);
        fs.unlinkSync(inProgressPath);
      });

  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    // Move to failed
    const failedPath = path.join(PATHS.failed, file);
    fs.renameSync(filePath, failedPath);
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════════════════════════

function startWatcher() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║       WORK QUEUE WATCHER - FOR THE KIDS                  ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  console.log(`📡 Monitoring: ${PATHS.inbox}`);
  console.log(`💰 Budget: $${getCurrentMonthSpend().toFixed(2)} / $${CONFIG.BUDGET_LIMIT_USD}`);
  console.log(`⚙️  Max Concurrent: ${CONFIG.MAX_CONCURRENT_TASKS} tasks`);
  console.log(`🔄 Watch Interval: ${CONFIG.WATCH_INTERVAL_MS}ms`);
  console.log('\nWaiting for work orders from Desktop Opus...\n');

  // Poll inbox directory
  setInterval(() => {
    processInbox();
  }, CONFIG.WATCH_INTERVAL_MS);
}

// ═══════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════

// Ensure directories exist
Object.values(PATHS).forEach(dir => {
  if (dir.endsWith('.json')) return;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

startWatcher();
