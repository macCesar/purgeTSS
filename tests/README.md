# 🧪 PurgeTSS Testing Guide

## 🚀 Quick Commands

```bash
# All tests
npm test

# Fast tests (recommended for development)
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests (real projects)
npm run test:e2e
```

## 📁 Structure

```
tests/
├── 📁 unit/          ⚡ Fast independent tests (5-10 sec)
├── 📁 integration/   🔄 Workflow tests (30-60 sec)
├── 📁 e2e/           🎯 Real project tests (2-5 min)
└── 🚀 run-tests.js   Main script
```

---

## ⚡ Unit Tests - Most used for development

**Time**: ~5-10 seconds  
**Command**: `npm run test:unit`  
**Purpose**: Validate individual functions

### Main tests:
- **`builders.test.js`** → Tests CSS building
- **`commands.test.js`** → Tests CLI commands
- **`analyzers.test.js`** → Tests class extraction
- **`function-counter.test.js`** → Counts functions per module
- **`helpers.test.js`** → Validates the **381 helper functions** migrated

---

## 🎯 E2E Tests - For complete validation

**Time**: ~2-5 minutes  
**Command**: `npm run test:e2e`  
**Purpose**: Test real commands on real projects

### Main tests:
- **`test-real-usage.js`** → Real usage scenarios
- **`cli-commands.test.js`** → Executes real CLI commands
- **`configuration-options.test.js`** → Tests different configurations

---

## 📊 Current Status - Everything Working ✅

### ✅ Complete Migration:
- **14 modules** organized
- **0 duplicates** (cleaned up)
- **100% coverage** of functions
- **381 functions** migrated correctly

### ✅ Tests Passing:
- **E2E Tests**: 5/5 ✅
- **Unit Tests**: 8/8 ✅
- **Integration Tests**: 5/5 ✅
- **Total**: **18/18 tests passing**

### ✅ Improved Format:
- Much easier to read output
- Headers with clear visual format
- 4 indentation levels to show hierarchy
- No EPIPE errors when used with `| head`

---

## 🔧 For Daily Development

### Quick validation:
```bash
npm run test:unit        # Most used - fast tests
npm run test:count       # Count functions
npm run test:helpers     # Only specific helpers
```

### Complete validation:
```bash
npm test                 # All tests
npm run test:e2e         # Real tests
```

---

## 💡 Tips

1. **Before commit**: `npm test` (all tests)
2. **Daily development**: `npm run test:unit` (super fast)
3. **See all output**: Add `| head -100` if there's too much output
4. **Debugging**: Run individual files with `node tests/path/file.js`

---

## 🆘 Common Issues

### Error "Cannot find module":
```bash
# Make sure you're in the project root
cd /Users/cesar/Developer/openSource/purgeTSS
npm run test:unit
```

### Tests that don't finish:
```bash
# Run a specific file
node tests/unit/shared/helpers.test.js
```

### See complete output:
```bash
npm run test:unit 2>&1 | tee test-output.log
```

---

*📅 Updated: June 2025*  
*📊 Validated: 381 functions + core functionality*  
*🎯 Status: All tests working with improved format*
