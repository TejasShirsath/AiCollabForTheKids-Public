/**
 * Add Square HMAC signature verification to dao-logic.js
 * Task #062 - Security enhancement
 */

const fs = require('fs');
const file = 'C:\\AiSolutions-DAO\\backend\\dao-logic.js';

console.log('Reading dao-logic.js...');
let content = fs.readFileSync(file, 'utf8');

// Check if already added
if (content.includes('verifySquareSignature')) {
    console.log('✅ verifySquareSignature already exists');
    process.exit(0);
}

// Function to add
const verifyFunction = `
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SQUARE HMAC SIGNATURE VERIFICATION (Task #062 - Dec 8, 2025)
// Prevents webhook spoofing attacks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function verifySquareSignature(req, secret) {
  const signature = req.headers['x-square-hmacsha256-signature'];
  if (!signature) return false;
  const body = JSON.stringify(req.body);
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const hmac = crypto.createHmac('sha256', secret)
    .update(url + body)
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hmac));
}
`;

// Find insertion point (before Telegram section)
const marker = '// Telegram';
const insertionIndex = content.indexOf(marker);

if (insertionIndex === -1) {
    console.error('❌ Could not find insertion point (Telegram marker)');
    process.exit(1);
}

// Insert the function
content = content.slice(0, insertionIndex) + verifyFunction + '\n' + content.slice(insertionIndex);

// Write back
console.log('✍️  Writing updated dao-logic.js...');
fs.writeFileSync(file, content);

console.log('✅ verifySquareSignature function added!');
console.log('📍 Next: Add signature checks to webhook handlers');
