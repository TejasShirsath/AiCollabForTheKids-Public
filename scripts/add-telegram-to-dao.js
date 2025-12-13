/**
 * Script to add Telegram alerting to dao-logic.js
 * Run on T5500: node add-telegram-to-dao.js
 */

const fs = require('fs');
const path = require('path');

const DAO_FILE = 'C:\\AiSolutions-DAO\\backend\\dao-logic.js';
const BACKUP_FILE = 'C:\\AiSolutions-DAO\\backend\\dao-logic.js.backup';

// Telegram code to insert
const TELEGRAM_CODE = `
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TELEGRAM ALERTS (Task #059 - Dec 8, 2025)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(\`https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
    });
  } catch (e) { console.error('Telegram alert failed:', e); }
}
`;

console.log('📝 Reading dao-logic.js...');
const content = fs.readFileSync(DAO_FILE, 'utf8');

// Check if already added
if (content.includes('sendTelegramAlert')) {
    console.log('✅ Telegram code already exists in dao-logic.js');
    process.exit(0);
}

// Backup original
console.log('💾 Creating backup...');
fs.writeFileSync(BACKUP_FILE, content);

// Find insertion point (after atomicWriteSync function)
const insertionMarker = '// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n// SECURITY FIX: Rate Limiting';
const insertionIndex = content.indexOf(insertionMarker);

if (insertionIndex === -1) {
    console.error('❌ Could not find insertion point!');
    process.exit(1);
}

// Insert Telegram code
const newContent = content.slice(0, insertionIndex) + TELEGRAM_CODE + '\n' + content.slice(insertionIndex);

console.log('✍️  Writing updated dao-logic.js...');
fs.writeFileSync(DAO_FILE, newContent);

console.log('✅ Telegram code added successfully!');
console.log('📍 Next: Add alerts to webhook handlers');
