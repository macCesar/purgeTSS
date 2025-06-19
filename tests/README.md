# 🧪 PurgeTSS Testing Suite

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Fast validation (recommended for development)
npm run test:unit

# Integration workflows
npm run test:integration

# End-to-end real project testing
npm run test:e2e
```

## � Test Structure

```
tests/
├── 📁 unit/           ⚡ Fast isolated component tests
├── 📁 integration/    🔄 Component interaction tests  
├── 📁 e2e/           🎯 Real-world workflow tests
└── 🚀 run-tests.js   Centralized test runner
```

---

## ⚡ Unit Tests (`tests/unit/`)
**Purpose**: Fast, isolated tests for individual components  
**Runtime**: ~5-10 seconds  
**Command**: `node tests/run-tests.js unit`

### 📂 `unit/shared/` - Shared Modules
| File                       | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `helpers.test.js`          | ✅ Validates all **381 helper functions** across 14 modules |
| `function-counter.test.js` | 📊 Counts functions per module for validation               |
| `test-helpers-modules.js`  | 🔗 Tests module imports work correctly                      |
| `test-shared-imports.js`   | 📦 Tests core shared modules (logger, config, utils)        |

### 📂 `unit/cli/` - CLI Commands
| File               | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `commands.test.js` | 🔧 Tests CLI command modules (build, init, purge, etc.) |

### 📂 `unit/core/` - Core Functionality
| File                | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `analyzers.test.js` | 🔍 Tests class extraction and file scanning |
| `builders.test.js`  | 🏗️ Tests CSS building and purging           |

### 📂 `unit/` - Other
| File             | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `test-fonts.mjs` | 🔤 Tests font processing and icon libraries |

---

## 🔄 Integration Tests (`tests/integration/`)
**Purpose**: Test component interactions and workflows  
**Runtime**: ~30-60 seconds  
**Command**: `node tests/run-tests.js integration`

| File                    | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `test-timing.js`        | ⏱️ Performance timing of core operations  |
| `test-timing-direct.js` | ⏱️ Direct performance measurements        |
| `test-purge.js`         | 🧹 Complete purging workflow              |
| `test-tailwind.js`      | 🎨 Tailwind CSS generation and processing |

---

## 🎯 E2E Tests (`tests/e2e/`)
**Purpose**: Real-world workflow testing with actual projects  
**Runtime**: ~2-5 minutes  
**Command**: `node tests/run-tests.js e2e`

| File                            | Purpose                             |
| ------------------------------- | ----------------------------------- |
| `cli-commands.test.js`          | 🚀 Real CLI commands on test-project |
| `configuration-options.test.js` | ⚙️ Different configuration scenarios |
| `test-real-usage.js`            | 🌍 Real-world usage scenarios        |

---

## 📊 Current Status

### ✅ Helper Migration Complete
- **381 functions** migrated across **14 modules**
- **0 duplicates** (cleaned during migration)
- **100% test coverage** for helper functions
- All imports working correctly

### 📈 Test Results
- **Unit Tests**: 8/8 ✅ passing
- **Integration Tests**: 4/4 ✅ passing  
- **E2E Tests**: 3/3 ✅ passing
- **Total**: 15/15 ✅ **All tests passing**
---

## 🔧 Useful Commands for Development

### Quick Validation (During development):
```bash
npm run test:unit
```

### Test Specific Helper Functions:
```bash
npm run test:helpers
```

### Count Functions by Module:
```bash
npm run test:count
```

### Run Individual Test Categories:
```bash
# Fast unit tests only
npm run test:unit

# Integration workflows
npm run test:integration

# Complete E2E testing
npm run test:e2e

# All tests
npm test
```

---

## 💡 Development Tips

1. **Daily development**: Use `npm run test:unit` (fastest)
2. **Before commits**: Run `npm test` (all tests)
3. **Debugging**: Run individual test files with `node tests/path/to/test.js`
4. **Performance**: Check `npm run test:integration` for timing
5. **Real testing**: Use `npm run test:e2e` with actual projects

---

## 🆘 Troubleshooting

### Common Issues:

**"Cannot find module" errors:**
```bash
# Ensure you're in project root
npm run test:unit
```

**Tests hang or don't complete:**
```bash
# Run specific test file directly
node tests/unit/shared/helpers.test.js
```

**Need full output:**
```bash
npm run test:unit 2>&1 | tee test-output.log
```

---

## 📋 Test Documentation

- 📖 **TESTING-GUIDE.md**: Comprehensive technical documentation
- 📖 **README-ES.md**: Spanish version of this guide
- 🚀 **run-tests.js**: Main test runner with help options

---

*📅 Last updated: December 2024*  
*🎯 Status: All tests passing and well-organized*  
*📊 Coverage: 381 helper functions + core functionality validated*

```bash
# Run specific test categories
node tests/run-tests.js unit         # Fast unit tests only
node tests/run-tests.js integration  # Integration tests only
node tests/run-tests.js e2e         # End-to-end tests only
node tests/run-tests.js all         # All tests (default)
```

### 📊 Validation Results

- ✅ **Helpers Migration**: 100% complete, 381 functions across 14 modules
- ✅ **No Duplicates**: Successfully removed duplicate `addNegativeValues`
- ✅ **All Imports**: Working correctly with proper relative paths
- ✅ **Test Coverage**: Unit, integration, and E2E tests organized

### 🎯 Next Steps Available

## 📋 Future Test Expansion

1. **Performance Benchmarking**: Add timing benchmarks for large projects
2. **Cross-platform Testing**: Test on different operating systems
3. **Memory Usage Validation**: Monitor memory consumption
4. **Error Handling**: Test edge cases and error scenarios

---

*� Last updated: June 2025*  
*🎯 Status: All tests passing and well-organized*  
*📊 Coverage: 381 helper functions + core functionality validated*
