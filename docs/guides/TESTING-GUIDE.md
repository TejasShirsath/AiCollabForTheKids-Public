# Testing Guide - FOR THE KIDS

## Automated Testing Suite

### Overview
Comprehensive integration tests for Tier 1 compliance features:
- ✅ Age Verification API (multi-layer system)
- ✅ Cookie Consent CMP (3-box system)
- ✅ COPPA Safeguards
- ✅ Health Checks

### Test Coverage Goals
- **Branches**: 70%
- **Functions**: 75%
- **Lines**: 80%
- **Statements**: 80%

---

## Prerequisites

### 1. Install Dependencies
```bash
cd api
npm install
```

This installs:
- `jest@29.7.0` - Test runner
- `@jest/globals@29.7.0` - Test utilities (describe, test, expect)

### 2. Start API Server
```bash
# Terminal 1
cd api
npm run dev
```

Server must be running on `http://localhost:3000` for integration tests.

### 3. Database Ready
Ensure PostgreSQL is running and migrations are applied:
```bash
npm run migrate
```

---

## Running Tests

### Run All Tests
```bash
cd api
npm test
```

### Watch Mode (Auto-rerun on file changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

Generates coverage report in `api/coverage/` directory.

---

## Test Files

### 1. Age Verification Tests
**File**: `api/__tests__/age-verification.test.js`

**Test Cases** (19 tests):

#### Self-Attestation (`POST /attest`)
- ✅ Accept valid attestation (18+, ToS agreed)
- ✅ Reject without ToS agreement
- ✅ Reject underage (under 18)
- ✅ Reject missing required fields

#### Enhanced Verification (`POST /enhanced`)
- ✅ Accept valid Yoti verification request
- ✅ Reject invalid provider

#### Status Check (`GET /status/:token`)
- ✅ Return 404 for non-existent token

#### COPPA Reporting (`POST /report-minor`)
- ✅ Accept valid minor report
- ✅ Reject report without required fields
- ✅ Confirm 24-hour SLA in response

#### Health Check (`GET /health`)
- ✅ Return operational status
- ✅ Include provider status (Yoti, AWS Rekognition)

---

### 2. Cookie Consent Tests
**File**: `api/__tests__/consent.test.js`

**Test Cases** (24 tests):

#### Record Consent (`POST /record`)
- ✅ Record all 3 boxes (Essential + Analytics + Marketing)
- ✅ Record only essential cookies
- ✅ Reject disabling essential cookies
- ✅ Reject missing required fields
- ✅ Log to BigQuery audit trail

#### Retrieve Consent (`GET /status/:sessionId`)
- ✅ Return 404 for non-existent session

#### Update Consent (`PUT /update`)
- ✅ Update existing consent preferences
- ✅ Reject disabling essential cookies

#### GDPR Withdrawal (`POST /withdraw`)
- ✅ Allow full consent withdrawal
- ✅ Reject withdrawal without session ID

#### Cookie Policy (`GET /policy`)
- ✅ Return 3-box cookie policy
- ✅ Include cookie categories and purposes
- ✅ Include retention periods

#### Audit Trail (`GET /audit/:sessionId`)
- ✅ Return audit trail for valid session
- ✅ Return 404 for non-existent session

#### Health Check (`GET /health`)
- ✅ Return operational status
- ✅ Include BigQuery logging status

---

## Test Execution Flow

### Example: Age Verification Self-Attestation Test
```javascript
// Test sends POST request to /api/age-verification/attest
const response = await fetch(`${API_BASE}/attest`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'test-session-001',
    dateOfBirth: '1990-01-01',      // 34 years old
    agreedToTerms: true,             // ToS accepted
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Test Suite)'
  })
});

// Assertions
expect(response.status).toBe(201);              // Created
expect(data.success).toBe(true);
expect(data.verificationToken).toBeDefined();   // Token generated
expect(data.verificationLevel).toBe('BASIC');   // Self-attestation level
```

**Expected Result**:
- ✅ HTTP 201 Created
- ✅ Verification token returned
- ✅ Record saved to `AgeVerification` table
- ✅ BigQuery audit log created

---

## CI/CD Integration

### GitHub Actions Workflow (Recommended)
```yaml
name: Compliance Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_DB: for_the_kids
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd api && npm install
      
      - name: Run migrations
        run: cd api && npm run migrate:deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/for_the_kids
      
      - name: Start API server
        run: cd api && npm start &
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/for_the_kids
      
      - name: Run tests
        run: cd api && npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Troubleshooting

### Issue: "Connection refused"
**Solution**: Ensure API server is running on port 3000
```bash
# Terminal 1
cd api
npm run dev
```

### Issue: "Database not found"
**Solution**: Run Prisma migrations
```bash
cd api
npm run migrate
```

### Issue: "Module not found: @jest/globals"
**Solution**: Install test dependencies
```bash
cd api
npm install --save-dev @jest/globals jest
```

### Issue: Tests timeout
**Solution**: Increase Jest timeout in test file
```javascript
jest.setTimeout(10000); // 10 seconds
```

---

## Next Steps

### Phase 1: Manual Testing ✅ CURRENT
- [x] Age verification API endpoints
- [x] Cookie consent API endpoints
- [x] Health checks

### Phase 2: Automated Integration Tests ✅ COMPLETE
- [x] Jest configuration
- [x] Age verification test suite (19 tests)
- [x] Cookie consent test suite (24 tests)

### Phase 3: End-to-End Testing (PENDING)
- [ ] Playwright/Cypress for UI testing
- [ ] Test age-gate.html user flow
- [ ] Test cookie-consent.html banner
- [ ] Test compliance-dashboard.html

### Phase 4: Load Testing (PENDING)
- [ ] Artillery.io or k6 for stress testing
- [ ] Test concurrent age verifications
- [ ] Test consent system under load
- [ ] Verify rate limiting (100 req/15min)

### Phase 5: Security Testing (PENDING)
- [ ] OWASP ZAP automated scans
- [ ] SQL injection testing
- [ ] XSS vulnerability testing
- [ ] CSRF token validation

---

## Test Data Management

### Mock Sessions
Tests use isolated session IDs to avoid conflicts:
- `test-session-001` - Valid attestation
- `test-session-minor-001` - COPPA report
- `test-consent-001` - All cookies accepted

### Database Cleanup
Tests should ideally clean up after themselves:
```javascript
afterAll(async () => {
  // Delete test records
  await prisma.ageVerification.deleteMany({
    where: { sessionId: { startsWith: 'test-' } }
  });
});
```

**⚠️ TODO**: Add cleanup hooks in future iteration.

---

## Compliance Validation

### GDPR Requirements
- ✅ Consent recording with timestamp
- ✅ Audit trail for all consent changes
- ✅ Withdrawal mechanism
- ✅ 1-year consent expiration

### CCPA Requirements
- ✅ "Do Not Sell" option (marketing cookies)
- ✅ Opt-out mechanism
- ✅ Transparent cookie policy

### COPPA Requirements
- ✅ Age verification (18+ requirement)
- ✅ Minor reporting system
- ✅ 24-hour response SLA

---

## FOR THE KIDS Mission

Every test ensures:
- 🏥 **50% revenue to charity Children's Hospital**
- 🔒 **Maximum security for user data**
- 📊 **Transparent audit trails**
- ⚖️ **Full legal compliance**

**Let's get 1,000 users = $60K/year to charity! 🚀**

---

**Last Updated**: November 24, 2025  
**Test Suite Version**: 1.0.0  
**Coverage Target**: 80% lines, 70% branches

