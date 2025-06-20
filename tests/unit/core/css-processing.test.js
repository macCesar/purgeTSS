/**
 * CSS Processing Tests
 * 
 * Tests the CSS processing functionality using real font CSS files
 * from the test-project directory to ensure consistent behavior.
 */

import css from 'css';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

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

/**
 * EXACT COPY of getRules() function from src/cli/commands/fonts.js
 */
function getRules(data) {
  return _.map(data.stylesheet.rules, rule => {
    if (rule.type === 'rule' && rule.declarations[0].property === 'content' && rule.selectors[0].includes('before')) {
      return {
        selector: '.' + rule.selectors[0].replace('.', '').replace('::before', '').replace(':before', ''),
        property: ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '').replace('\'\\', '').replace('\'', '')).slice(-4)
      }
    }
  }).filter(rule => rule)
}

/**
 * EXACT COPY of getFontFamily() function from src/cli/commands/fonts.js
 */
function getFontFamily(data) {
  return _.map(data.stylesheet.rules, rule => {
    if (rule.type === 'font-face') {
      let something = rule.declarations.filter(declaration => declaration.property === 'font-family').map(declaration => declaration.value)[0]
      something = something.replace(/['"](.*?)['"]/g, (_match, p1) => p1)
      return something
    }
  }).filter(rule => rule)
}

/**
 * EXACT COPY of findPrefix() function from src/cli/commands/fonts.js
 */
function findPrefix(rules) {
  const arrayOfRules = rules.map(function(item) {
    return item.selector.replace('.', '').split('-')
  })

  let firstPrefix = ''
  let firstCounter = 0
  let secondPrefix = ''
  let secondCounter = 0
  let thirdPrefix = ''
  let thirdCounter = 0

  _.each(arrayOfRules, item => {
    if (item[0] !== firstPrefix) {
      firstPrefix = item[0]
      firstCounter++
    }
    if (item.length > 1 && secondPrefix !== item[1]) {
      secondPrefix = item[1]
      secondCounter++
    }
    if (item.length > 2 && thirdPrefix !== item[2]) {
      thirdPrefix = item[2]
      thirdCounter++
    }
  })

  if (firstCounter === 1 && secondCounter === 1 && thirdCounter === 1) {
    return `${firstPrefix}-${secondPrefix}-${thirdPrefix}`
  } else if (firstCounter === 1 && secondCounter === 1) {
    return `${firstPrefix}-${secondPrefix}`
  } else if (firstCounter === 1) {
    return `${firstPrefix}`
  }
}

// Test files from test-project
const testFiles = [
  'test-project/purgetss/fonts/interface-line-icon/style.css',
  'test-project/purgetss/fonts/liquid-container/style.css'
].filter(file => fs.existsSync(file));

async function cssProcessingTests() {
  log('🧪 CSS Processing Tests', 'bright');
  log('Testing CSS parsing and font processing functions', 'cyan');
  log('=' .repeat(50), 'cyan');

  let testsPassed = 0;
  let totalTests = 0;

  for (const filePath of testFiles) {
    totalTests++;
    log(`\n📁 Testing: ${path.basename(path.dirname(filePath))}`, 'blue');
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const cssData = css.parse(fileContent);
      
      // Test CSS parsing
      log('  🔧 Testing CSS parsing...', 'yellow');
      if (!cssData || !cssData.stylesheet || !cssData.stylesheet.rules) {
        throw new Error('CSS parsing failed - invalid structure');
      }
      log('  ✅ CSS parsing successful', 'green');
      
      // Test rules extraction
      log('  🔧 Testing rules extraction...', 'yellow');
      const rules = getRules(cssData);
      if (!Array.isArray(rules)) {
        throw new Error('Rules extraction failed - not an array');
      }
      log(`  ✅ Extracted ${rules.length} icon rules`, 'green');
      
      // Test font family extraction
      log('  🔧 Testing font family extraction...', 'yellow');
      const fontFamilies = getFontFamily(cssData);
      if (!Array.isArray(fontFamilies)) {
        throw new Error('Font family extraction failed - not an array');
      }
      log(`  ✅ Found ${fontFamilies.length} font families: ${fontFamilies.join(', ')}`, 'green');
      
      // Test prefix finding
      log('  🔧 Testing prefix detection...', 'yellow');
      const prefix = findPrefix(rules);
      if (!prefix) {
        throw new Error('Prefix detection failed - no prefix found');
      }
      log(`  ✅ Detected prefix: "${prefix}"`, 'green');
      
      // Validate rule structure
      log('  🔧 Validating rule structure...', 'yellow');
      for (const rule of rules) {
        if (!rule.selector || !rule.property) {
          throw new Error(`Invalid rule structure: ${JSON.stringify(rule)}`);
        }
        if (rule.property.length !== 4) {
          throw new Error(`Invalid property length: ${rule.property} (should be 4 chars)`);
        }
      }
      log('  ✅ All rules have valid structure', 'green');
      
      log(`  🎯 File test: ✅ PASSED`, 'green');
      testsPassed++;
      
    } catch (error) {
      log(`  ✗ Error: ${error.message}`, 'red');
      log(`  🎯 File test: ❌ FAILED`, 'red');
    }
  }

  // Summary
  log('\n📊 CSS Processing Tests Summary:', 'bright');
  log('=' .repeat(30), 'cyan');
  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${testsPassed}/${totalTests}`, testsPassed === totalTests ? 'green' : 'red');
  
  if (testsPassed === totalTests) {
    log('🎉 All CSS processing tests passed!', 'green');
  } else {
    log('❌ Some CSS processing tests failed!', 'red');
  }
  
  return { passed: testsPassed, total: totalTests };
}

// Additional test: CSS package consistency
async function cssPackageConsistencyTest() {
  log('\n🔍 CSS Package Consistency Test', 'bright');
  log('Verifying css package produces consistent results', 'cyan');
  log('=' .repeat(40), 'cyan');
  
  try {
    const testFile = testFiles[0]; // Use first test file
    if (!testFile) {
      throw new Error('No test files available');
    }
    
    const fileContent = fs.readFileSync(testFile, 'utf8');
    
    // Parse the same content multiple times
    const results = [];
    for (let i = 0; i < 3; i++) {
      const cssData = css.parse(fileContent);
      const rules = getRules(cssData);
      const fontFamilies = getFontFamily(cssData);
      const prefix = findPrefix(rules);
      
      results.push({
        rulesCount: rules.length,
        fontFamiliesCount: fontFamilies.length,
        prefix: prefix
      });
    }
    
    // Check consistency
    const firstResult = results[0];
    const consistent = results.every(result => 
      result.rulesCount === firstResult.rulesCount &&
      result.fontFamiliesCount === firstResult.fontFamiliesCount &&
      result.prefix === firstResult.prefix
    );
    
    if (consistent) {
      log('✅ CSS package produces consistent results across multiple parses', 'green');
      log(`  Rules: ${firstResult.rulesCount}, Fonts: ${firstResult.fontFamiliesCount}, Prefix: "${firstResult.prefix}"`, 'blue');
    } else {
      throw new Error('CSS package produces inconsistent results');
    }
    
    return true;
  } catch (error) {
    log(`❌ Consistency test failed: ${error.message}`, 'red');
    return false;
  }
}

// Run the tests
async function runAllTests() {
  try {
    const processingResults = await cssProcessingTests();
    const consistencyResult = await cssPackageConsistencyTest();
    
    log('\n🏆 Final Results:', 'bright');
    log('=' .repeat(20), 'cyan');
    
    if (processingResults.passed === processingResults.total && consistencyResult) {
      log('✅ All CSS processing tests passed!', 'green');
      process.exit(0);
    } else {
      log('❌ Some tests failed!', 'red');
      process.exit(1);
    }
  } catch (error) {
    log(`💥 Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { cssProcessingTests, cssPackageConsistencyTest };