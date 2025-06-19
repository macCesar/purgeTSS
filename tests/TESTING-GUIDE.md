# PurgeTSS Testing Guide

## Overview

This document provides a comprehensive guide to all tests in the PurgeTSS project. The testing suite is organized into three main categories: **Unit Tests**, **Integration Tests**, and **End-to-End Tests**.

## 📁 Test Structure

```
tests/
├── run-tests.js              # 🚀 Main test runner (run all categories)
├── unit/                     # ⚡ Fast isolated component tests
├── integration/              # 🔄 Component interaction tests
├── e2e/                      # 🎯 Real-world workflow tests
└── README.md                 # 📖 This documentation
```

---

## ⚡ Unit Tests (`tests/unit/`)

**Purpose**: Fast, isolated tests for individual components and modules.
**Run with**: `npm run test:unit`

### 📂 `tests/unit/shared/`

Tests for shared modules and helpers migration:

| File                       | Purpose                                | What it tests                                                                         |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| `helpers.test.js`          | 🧪 **Comprehensive helpers validation** | Validates all 381 functions across 14 helper modules. Ensures migration completeness. |
| `function-counter.test.js` | 📊 **Function counter**                 | Counts exported functions in each helper module for validation                        |
| `test-helpers-modules.js`  | 🔗 **Module imports**                   | Tests that all helper modules can be imported and work correctly                      |
| `test-shared-imports.js`   | 📦 **Shared modules**                   | Tests core shared modules (logger, config, utils, constants)                          |

### 📂 `tests/unit/cli/`

Tests for CLI commands and utilities:

| File               | Purpose            | What it tests                                                    |
| ------------------ | ------------------ | ---------------------------------------------------------------- |
| `commands.test.js` | 🔧 **CLI commands** | Tests all CLI command modules (build, init, purge, create, etc.) |

### 📂 `tests/unit/core/`

Tests for core PurgeTSS functionality:

| File                | Purpose              | What it tests                                                        |
| ------------------- | -------------------- | -------------------------------------------------------------------- |
| `analyzers.test.js` | 🔍 **Core analyzers** | Tests class extraction, file scanning, and missing classes detection |
| `builders.test.js`  | 🏗️ **Core builders**  | Tests Tailwind CSS building, purging, and helper functions           |

### 📂 `tests/unit/` (root level)

| File             | Purpose               | What it tests                                      |
| ---------------- | --------------------- | -------------------------------------------------- |
| `test-fonts.mjs` | 🔤 **Font processing** | Tests font building and icon library functionality |

---

## 🔄 Integration Tests (`tests/integration/`)

**Purpose**: Tests for component interactions and workflows.
**Run with**: `npm run test:integration`

| File                    | Purpose                   | What it tests                                |
| ----------------------- | ------------------------- | -------------------------------------------- |
| `test-timing.js`        | ⏱️ **Performance timing**  | Tests execution time of core operations      |
| `test-timing-direct.js` | ⏱️ **Direct timing**       | Direct performance measurements              |
| `test-purge.js`         | 🧹 **Purging workflow**    | Tests the complete purging process           |
| `test-tailwind.js`      | 🎨 **Tailwind processing** | Tests Tailwind CSS generation and processing |

---

## 🎯 End-to-End Tests (`tests/e2e/`)

**Purpose**: Real-world workflow tests with actual Alloy projects.
**Run with**: `npm run test:e2e`

| File                            | Purpose                | What it tests                                                                  |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------------ |
| `cli-commands.test.js`          | 🚀 **Real CLI testing** | Tests actual CLI commands on test-project (`purgetss --build`, `--init`, etc.) |
| `configuration-options.test.js` | ⚙️ **Config testing**   | Tests different configuration scenarios and options                            |
| `test-real-usage.js`            | 🌍 **Real usage**       | Tests real-world usage scenarios                                               |

---

## 🚀 Test Runner (`tests/run-tests.js`)

The centralized test runner allows you to run tests by category:

```bash
# Run specific test categories
node tests/run-tests.js unit         # Fast unit tests only
node tests/run-tests.js integration  # Integration tests only  
node tests/run-tests.js e2e          # End-to-end tests only
node tests/run-tests.js all          # All tests (default)
```

### Example output:
```
🚀 Unit Tests
📋 Fast isolated tests for individual components

📊 Unit Tests Results: 8/8 passed
```

---

## 📊 Key Test Metrics

### Helpers Migration Validation:
- ✅ **381 functions** across 14 modules
- ✅ **100% migration coverage**
- ✅ **0 duplicates** (cleaned during migration)
- ✅ **All imports working** correctly

### Test Categories Performance:
- ⚡ **Unit Tests**: ~5-10 seconds (fast validation)
- 🔄 **Integration Tests**: ~30-60 seconds (workflow testing)
- 🎯 **E2E Tests**: ~2-5 minutes (real project testing)

---

## 🧪 Quick Test Commands

### Fast Validation (Recommended for development):
```bash
node tests/run-tests.js unit
```

### Comprehensive Testing:
```bash
node tests/run-tests.js all
```

### Specific Module Testing:
```bash
# Test helpers migration
node tests/unit/shared/helpers.test.js

# Test function counting
node tests/unit/shared/function-counter.test.js

# Test CLI commands on real project
node tests/e2e/cli-commands.test.js
```

---

## 📝 Adding New Tests

When adding new tests, follow this structure:

### For Unit Tests:
1. Create test in appropriate subfolder (`shared/`, `cli/`, `core/`)
2. Test individual functions/modules in isolation
3. Keep tests fast (< 1 second each)

### For Integration Tests:
1. Test interactions between components
2. Focus on workflows and data flow
3. Medium execution time acceptable

### For E2E Tests:
1. Test real commands on actual projects
2. Validate complete user workflows
3. Longer execution time expected

---

## 🎯 Test Development Guidelines

### ✅ Good Test Practices:
- Clear test names describing what's being tested
- Isolated tests that don't depend on external state
- Good error messages for debugging
- Fast execution for unit tests

### 📋 Test Checklist:
- [ ] Test has clear purpose and description
- [ ] Test is in correct category folder
- [ ] Test cleans up after itself
- [ ] Test provides useful output/logging
- [ ] Test handles errors gracefully

---

## 🔧 Troubleshooting

### Common Issues:

1. **Import path errors**: Check relative paths (`../../../src/...`)
2. **Missing dependencies**: Ensure all required modules are available
3. **Test timeouts**: Check for infinite loops or blocking operations
4. **File not found**: Verify test-project exists for E2E tests

### Debug Commands:
```bash
# Run single test file
node tests/unit/shared/helpers.test.js

# Run with verbose output
node tests/run-tests.js unit 2>&1 | tee test-output.log
```

---

## 📈 Future Test Plans

Areas for test expansion:

- [ ] Performance benchmarking tests
- [ ] Cross-platform compatibility tests
- [ ] Memory usage validation
- [ ] Error handling scenarios
- [ ] Configuration edge cases
- [ ] Large project scalability tests

---

*Last updated: June 18, 2025*
*Total test files: 12 across 3 categories*
*Functions validated: 381 helpers + core functionality*
