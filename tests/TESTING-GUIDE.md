# PurgeTSS Testing Guide - Technical Reference

## 📋 Detailed Technical Information

This is the complete technical documentation. For daily use, see **README.md**.

## 🎨 Improved Output Format

Tests now have a much better visual format:

### Main Headers:
```
════════════════════════════════════════════════════════════════════
🚀 End-to-End Tests
📋 Full workflow tests with real projects
════════════════════════════════════════════════════════════════════
```

### Test Files:
```
  ═════════════════════════════════════════════════════════════════
  🧪 Running cli-commands.test.js
  ═════════════════════════════════════════════════════════════════
```

### Individual Tests:
```
     ══════════════════════════════════════════════════════════════
     🧪 Testing: Basic purgetss command (build)
     💻 Command: ../bin/purgetss
     ══════════════════════════════════════════════════════════════
     ⏳ Executing...

     ::PurgeTSS:: ./purgetss/config.cjs file created!
     # ... correctly indented output
```

### 4 Indentation Levels:
1. **Main category** (no indentation)
2. **Test file** (2 spaces)
3. **Individual test** (5 spaces)
4. **Test details** (8+ spaces)

## 🔧 Technical Improvements Implemented

### ✅ EPIPE Error Handling:
- Global handling of stdout/stderr errors
- Don't crash with errors when pipe closes
- Tests now work correctly with `| head -80`

### ✅ Visual Format:
- Visual separators for better reading
- Headers with open format (more readable)
- Clear hierarchy with progressive indentation

### ✅ Compatibility:
- Works in all terminals
- Compatible with output redirection
- Doesn't require problematic special characters

## 📁 Complete Technical Structure

```
tests/
├── run-tests.js              # 🚀 Main script with improved EPIPE handling
├── unit/                     # ⚡ Unit tests (8 files)
│   ├── shared/               # Shared modules (4 files)
│   ├── cli/                  # CLI commands (1 file)
│   ├── core/                 # Core functionality (2 files)
│   └── test-fonts.mjs        # Font processing
├── integration/              # 🔄 Integration tests (5 files)
└── e2e/                      # 🎯 End-to-end tests (5 files)
```

---

## ⚡ Unit Tests - Technical Details

**Files**: 8 tests  
**Total time**: ~5-10 seconds  
**Coverage**: 381 functions + core functionality

### Validated modules:

#### `tests/unit/shared/` (4 files):
- **`helpers.test.js`** → 381 functions across 14 modules
- **`function-counter.test.js`** → Exact count per module
- **`test-helpers-modules.js`** → Module imports
- **`test-shared-imports.js`** → Logger, config, utils, constants

#### `tests/unit/cli/` (1 file):
- **`commands.test.js`** → Build, init, purge, create, update, etc.

#### `tests/unit/core/` (2 files):
- **`analyzers.test.js`** → Class extraction, scanning
- **`builders.test.js`** → CSS building, purging, helpers

#### `tests/unit/` (1 file):
- **`test-fonts.mjs`** → Font building, icon libraries

---

## 🎯 E2E Tests - Technical Details

**Files**: 5 tests  
**Total time**: ~2-5 minutes  
**Project**: Uses `test-project/` with real Alloy project

### Implemented tests:

#### `cli-commands.test.js`:
- Real commands: `purgetss`, `purgetss build`, `purgetss build-fonts`
- Validation of created files
- Real-time output with indentation
- Error handling and timeouts

#### `configuration-options.test.js`:
- Configurations: default, custom paths, fonts, colors, modules
- File generation validation
- Safelist and content paths tests

#### `test-real-usage.js`:
- Real execution of helpers with complex values
- Dependency validation in real context
- Tests of functions with responsive, arbitrary values, etc.

#### `fast-cli.test.js`:
- Essential CLI commands testing
- Quick validation for development

#### `simple-cli.test.js`:
- Basic CLI functionality verification
- Minimal testing for core commands

---

## 📊 Technical Metrics

### Helper Migration:
- ✅ **381 functions** validated individually
- ✅ **14 modules** reorganized correctly  
- ✅ **0 duplicates** (removed during migration)
- ✅ **100% imports** working correctly

### Performance:
- ⚡ **Unit Tests**: 5-10 seconds (quick validation)
- 🔄 **Integration**: 30-60 seconds (workflows)  
- 🎯 **E2E Tests**: 2-5 minutes (real project)

### Compatibility:
- ✅ **macOS, Linux, Windows** (correct relative paths)
- ✅ **Node.js v16+** (ESM modules)
- ✅ **Terminal pipes** (head, tee, redirection)

---

## 🔧 Advanced Technical Commands

### Individual execution:
```bash
# Specific test
node tests/unit/shared/helpers.test.js

# With custom timeout  
timeout 30s node tests/e2e/cli-commands.test.js

# With complete redirection
node tests/run-tests.js e2e 2>&1 | tee full-output.log

# Only first lines
node tests/run-tests.js e2e | head -100
```

### Advanced debugging:
```bash
# With complete stack traces
NODE_OPTIONS="--trace-warnings" node tests/run-tests.js unit

# With memory profiling
node --inspect tests/run-tests.js unit

# With performance timing
time node tests/run-tests.js all
```

---

## 🚀 Test Runner Architecture

### `run-tests.js` - Technical features:

#### EPIPE error handling:
```javascript
// Global EPIPE handling for pipes
process.stdout.on('error', (err) => {
  if (err.code === 'EPIPE') process.exit(0)
})
```

#### Smart indentation:
```javascript
// 4 levels of automatic indentation
const indentedOutput = stdout.split('\n').map(line => 
  line.trim() ? `     ${line}` : line
).join('\n')
```

#### Improved visual format:
- Separators per category
- Headers with box characters (`═══`)
- Colors and emojis for better readability

---

*📅 Updated: June 2025*  
*🔧 Includes format improvements and EPIPE handling*  
*📊 Coverage: 18 tests, 381 functions, improved visual format*
