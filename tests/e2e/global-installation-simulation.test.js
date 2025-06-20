#!/usr/bin/env node

/**
 * Global Installation Simulation Test
 * 
 * Simulates a GLOBAL installation of purgeTSS to verify:
 * 1. No deprecated dependency warnings appear during global install
 * 2. Global installation completes successfully  
 * 3. purgeTSS command is available globally after installation
 * 4. Basic functionality works after global installation
 * 
 * This test simulates the real user experience: npm install -g purgetss
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options
    });
    return { success: true, output: result, error: null };
  } catch (error) {
    return {
      success: false,
      output: error.stdout || '',
      error: error.stderr || error.message
    };
  }
}

async function globalInstallationSimulationTest() {
  log('🌍 Global Installation Simulation Test', 'bright');
  log('Simulating: npm install -g purgetss', 'cyan');
  log('='.repeat(50), 'cyan');

  const testResults = {
    packCreation: false,
    globalInstallation: false,
    noDeprecatedWarnings: false,
    globalCommandAvailable: false,
    functionalityTest: false,
    globalUninstall: false,
    cleanup: false
  };

  let packageFile = null;
  let wasGloballyInstalled = false;

  try {
    // Step 1: Create package tarball
    log('\n🎯 Step 1: Creating package tarball...', 'blue');

    const packResult = runCommand('npm pack', { cwd: process.cwd() });
    if (!packResult.success) {
      throw new Error(`Failed to create package: ${packResult.error}`);
    }

    // Find the created .tgz file
    const files = fs.readdirSync(process.cwd());
    packageFile = files.find(f => f.startsWith('purgetss-') && f.endsWith('.tgz'));

    if (!packageFile) {
      throw new Error('Package tarball not found after npm pack');
    }

    log(`  ✅ Package created: ${packageFile}`, 'green');
    testResults.packCreation = true;

    // Step 2: Check if purgeTSS is already globally installed
    log('\n🎯 Step 2: Checking existing global installation...', 'blue');

    const existingCheck = runCommand('npm list -g purgetss --depth=0');
    const hasExisting = existingCheck.success && !existingCheck.output.includes('(empty)');

    if (hasExisting) {
      log('  ⚠️  purgeTSS already globally installed, will need to be careful', 'yellow');
    } else {
      log('  ✅ No existing global installation found', 'green');
    }

    // Step 3: Install globally and capture all output
    log('\n🎯 Step 3: Installing purgeTSS globally...', 'blue');
    log('  ⚠️  This will install the package globally on your system', 'yellow');

    const packagePath = path.resolve(packageFile);
    const installResult = runCommand(`npm install -g "${packagePath}"`, {
      stdio: 'pipe'
    });

    if (!installResult.success) {
      throw new Error(`Global installation failed: ${installResult.error}`);
    }

    log('  ✅ Global installation completed', 'green');
    testResults.globalInstallation = true;
    wasGloballyInstalled = true;

    // Step 4: Analyze installation output for deprecated warnings
    log('\n🎯 Step 4: Analyzing global installation output...', 'blue');

    const fullOutput = installResult.output + (installResult.error || '');
    const deprecatedWarnings = [];

    // Look for common deprecated warning patterns
    const deprecatedPatterns = [
      /npm warn deprecated/gi,
      /deprecated/gi,
      /warning.*deprecated/gi
    ];

    const outputLines = fullOutput.split('\n');
    for (const line of outputLines) {
      for (const pattern of deprecatedPatterns) {
        if (pattern.test(line)) {
          deprecatedWarnings.push(line.trim());
        }
      }
    }

    if (deprecatedWarnings.length === 0) {
      log('  ✅ No deprecated dependency warnings found!', 'green');
      testResults.noDeprecatedWarnings = true;
    } else {
      log('  ❌ Found deprecated warnings:', 'red');
      deprecatedWarnings.forEach(warning => {
        log(`    • ${warning}`, 'yellow');
      });
    }

    // Step 5: Test global command availability
    log('\n🎯 Step 5: Testing global command availability...', 'blue');

    // Check if purgetss command is available globally
    const whichResult = runCommand('which purgetss');
    if (whichResult.success) {
      const globalPath = whichResult.output.trim();
      log(`  ✅ purgeTSS command available globally: ${globalPath}`, 'green');
      testResults.globalCommandAvailable = true;
    } else {
      // Try alternative check for Windows
      const whereResult = runCommand('where purgetss');
      if (whereResult.success) {
        const globalPath = whereResult.output.trim();
        log(`  ✅ purgeTSS command available globally: ${globalPath}`, 'green');
        testResults.globalCommandAvailable = true;
      } else {
        log('  ❌ purgeTSS command not found globally', 'red');
      }
    }

    // Step 6: Test basic functionality
    log('\n🎯 Step 6: Testing global functionality...', 'blue');

    // Try to run purgetss --version globally
    const versionResult = runCommand('purgetss --version');
    if (versionResult.success) {
      const version = versionResult.output.trim();
      log(`  ✅ Global version check works: ${version}`, 'green');
      testResults.functionalityTest = true;
    } else {
      log('  ❌ Global version check failed', 'red');
      log(`    Error: ${versionResult.error}`, 'yellow');
    }

    // Try to run purgetss --help globally
    const helpResult = runCommand('purgetss --help');
    if (helpResult.success) {
      log('  ✅ Global help command works', 'green');
    } else {
      log('  ⚠️  Global help command failed', 'yellow');
    }

    // Step 7: Verify global package contents
    log('\n🎯 Step 7: Verifying global package installation...', 'blue');

    const globalListResult = runCommand('npm list -g purgetss --depth=0');
    if (globalListResult.success && !globalListResult.output.includes('(empty)')) {
      log('  ✅ Package correctly listed in global packages', 'green');
    } else {
      log('  ⚠️  Package may not be properly registered globally', 'yellow');
    }

  } catch (error) {
    log(`\n💥 Test failed: ${error.message}`, 'red');
  } finally {
    // Cleanup - IMPORTANT: Uninstall globally
    log('\n🎯 Cleanup: Removing global installation...', 'blue');

    try {
      if (wasGloballyInstalled) {
        log('  🔄 Uninstalling purgeTSS globally...', 'yellow');
        const uninstallResult = runCommand('npm uninstall -g purgetss');
        if (uninstallResult.success) {
          log('  ✅ Global uninstall completed', 'green');
          testResults.globalUninstall = true;
        } else {
          log('  ⚠️  Global uninstall had issues', 'yellow');
          log(`    Warning: ${uninstallResult.error}`, 'yellow');
        }
      }

      if (packageFile && fs.existsSync(packageFile)) {
        fs.unlinkSync(packageFile);
        log('  ✅ Package tarball cleaned up', 'green');
      }

      testResults.cleanup = true;
    } catch (cleanupError) {
      log(`  ⚠️  Cleanup warning: ${cleanupError.message}`, 'yellow');
    }
  }

  // Final results
  log('\n📊 Global Installation Simulation Results:', 'bright');
  log('='.repeat(45), 'cyan');

  const tests = [
    { name: 'Package Creation', passed: testResults.packCreation },
    { name: 'Global Installation', passed: testResults.globalInstallation },
    { name: 'No Deprecated Warnings', passed: testResults.noDeprecatedWarnings },
    { name: 'Global Command Available', passed: testResults.globalCommandAvailable },
    { name: 'Global Functionality', passed: testResults.functionalityTest },
    { name: 'Global Uninstall', passed: testResults.globalUninstall },
    { name: 'Cleanup', passed: testResults.cleanup }
  ];

  let allPassed = true;
  tests.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    const color = test.passed ? 'green' : 'red';
    log(`${status} ${test.name}`, color);
    if (!test.passed) allPassed = false;
  });

  log('\n🏆 Final Verdict:', 'bright');
  log('='.repeat(20), 'cyan');

  if (allPassed) {
    log('✅ Global installation simulation PASSED!', 'green');
    log('✅ Ready for publication - no deprecated warnings in global install!', 'green');
    log('🌍 Users will have a clean installation experience!', 'green');
  } else {
    log('❌ Global installation simulation FAILED!', 'red');
    log('❌ Issues found that need to be addressed before publication', 'red');
  }

  return allPassed;
}

// Run the test
async function runGlobalInstallationTest() {
  try {
    const success = await globalInstallationSimulationTest();
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`\n💥 Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runGlobalInstallationTest();
}

export { globalInstallationSimulationTest };
