# Contributing to Team Claude For The Kids

Thank you for your interest in contributing! This project helps children through AI-powered revenue allocation, with **50% of all revenue going to Verified Pediatric Charities**.

---

## The Golden Rule

> **THE GOSPEL SPLIT IS IMMUTABLE**

```
50% → Verified Pediatric Charities
30% → Infrastructure
20% → Founder
```

**This split CANNOT be modified.** Any PR attempting to change the revenue distribution will be rejected. This is hardcoded into the DAO logic and is the foundation of our charitable mission.

---

## How to Contribute

### 1. Fork the Repository

```bash
# Fork via GitHub UI, then clone your fork
git clone https://github.com/YOUR-USERNAME/AiCollabForTheKids.git
cd AiCollabForTheKids
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

- Write production-ready code (no placeholders, no TODOs)
- Test your changes locally
- Follow the code standards below

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: Add new feature description"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request via GitHub.

---

## Commit Message Format

Use emoji prefixes for clear commit history:

| Emoji | Prefix | Use Case |
|-------|--------|----------|
| ✨ | `feat:` | New feature |
| 🐛 | `fix:` | Bug fix |
| 📝 | `docs:` | Documentation |
| 🎨 | `style:` | Formatting, no code change |
| ♻️ | `refactor:` | Code refactoring |
| 🧪 | `test:` | Adding tests |
| 🔧 | `chore:` | Maintenance tasks |
| 🚀 | `deploy:` | Deployment related |
| 🔒 | `security:` | Security fix |
| 📋 | `audit:` | Code audit |

**Examples:**
```
feat: Add Discord webhook integration
fix: Resolve Square signature validation
docs: Update README with architecture diagram
security: Add rate limiting to webhooks
```

---

## Code Standards

### DO:
- Write production-ready, tested code
- Follow existing code patterns in the repo
- Add comments for complex logic
- Handle errors gracefully
- Validate all user inputs
- Use environment variables for secrets

### DON'T:
- Leave placeholder code (`// TODO`, `// FIXME`)
- Hardcode credentials or secrets
- Submit untested code
- Modify the Gospel Split percentages
- Break existing functionality
- Add unnecessary dependencies

---

## Protected Files

These files require special approval to modify:

| File | Reason |
|------|--------|
| `GOSPEL.md` | Immutable mission document |
| `AiSolutions-DAO/backend/dao-logic.js` | Gospel Split enforcement |
| `api/.env` | Production credentials |
| `.github/workflows/*` | CI/CD pipelines |

---

## AI Contributors (Orchestrator Workflow)

This project uses the **Opus Orchestrator** system where Claude instances work in parallel.

### For AI Agents:

1. **Read First:** Always read `FLEET-STATUS.md` and `CLAUDE.md` before starting
2. **Check Queue:** Look at `orchestrator/QUEUE.md` for assigned tasks
3. **Report Status:** Create `WORKER-STATUS-XXX.md` when completing tasks
4. **Update Status:** Update `FLEET-STATUS.md` after significant work
5. **Commit Often:** Make atomic commits with clear messages

### Worker Status Template:
```markdown
# WORKER STATUS #XXX
**Timestamp:** YYYY-MM-DD
**Status:** COMPLETE/IN_PROGRESS

## Task Summary
[Description]

## Work Completed
[Details]

## Commit
[Hash and message]
```

---

## Testing Your Changes

### Run Health Checks (Windows)
```cmd
ONE-CLICK-TEST.bat
```

### Manual Verification
- [ ] Code runs without errors
- [ ] No console warnings
- [ ] API endpoints respond correctly
- [ ] UI renders properly
- [ ] Gospel Split calculations correct

---

## Areas Needing Help

| Area | Difficulty | Impact |
|------|------------|--------|
| Documentation | Easy | High |
| UI/UX improvements | Medium | High |
| Test coverage | Medium | High |
| Translations | Easy | Medium |
| Performance optimization | Hard | Medium |

---

## Contact

- **Issues:** [GitHub Issues](https://github.com/Ai-Solutions-Store/AiCollabForTheKids/issues)
- **Email:** joshlcoleman@gmail.com
- **Owner:** Joshua Coleman

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**FOR THE KIDS. ALWAYS.**

*Every contribution helps children receive life-changing care.*
