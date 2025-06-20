/**
 * CSS Package Comparison Test
 * 
 * Compares results between read-css and css packages using EXACT functions
 * from the real codebase to ensure they produce identical results.
 * 
 * This test ensures we can safely use 'css' as a drop-in replacement for 'read-css'.
 */

import readCSS from 'read-css';
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

async function cssComparisonTest() {
  log('🔬 CSS Package Comparison Test', 'bright');
  log('Comparing read-css vs css package using EXACT real functions', 'cyan');
  log('=' .repeat(60), 'cyan');

  const results = {
    tests: [],
    summary: {
      totalTests: 0,
      identicalResults: 0,
      errors: []
    }
  };

  for (const filePath of testFiles) {
    log(`\n📁 Testing: ${path.basename(path.dirname(filePath))}`, 'blue');
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Test with read-css (legacy method)
      log('  🔧 Processing with read-css...', 'yellow');
      const readCSSData = readCSS(filePath);
      
      // Test with css package (new method)
      log('  🔧 Processing with css package...', 'yellow');
      const cssData = css.parse(fileContent);
      
      // Apply EXACT same processing functions
      log('  🔧 Extracting rules with getRules()...', 'yellow');
      const readCSSRules = getRules(readCSSData);
      const cssRules = getRules(cssData);
      
      log('  🔧 Extracting fonts with getFontFamily()...', 'yellow');
      const readCSSFonts = getFontFamily(readCSSData);
      const cssFonts = getFontFamily(cssData);
      
      log('  🔧 Finding prefix with findPrefix()...', 'yellow');
      const readCSSPrefix = findPrefix(readCSSRules);
      const cssPrefix = findPrefix(cssRules);
      
      // Compare results
      const rulesMatch = JSON.stringify(readCSSRules) === JSON.stringify(cssRules);
      const fontsMatch = JSON.stringify(readCSSFonts) === JSON.stringify(cssFonts);
      const prefixMatch = readCSSPrefix === cssPrefix;
      
      const allMatch = rulesMatch && fontsMatch && prefixMatch;
      
      const testResult = {
        file: path.basename(path.dirname(filePath)),
        readCSSResults: {
          rules: readCSSRules.length,
          fonts: readCSSFonts,
          prefix: readCSSPrefix
        },
        cssResults: {
          rules: cssRules.length,
          fonts: cssFonts,
          prefix: cssPrefix
        },
        comparisons: {
          rulesMatch,
          fontsMatch,
          prefixMatch,
          allMatch
        }
      };
      
      results.tests.push(testResult);
      
      if (allMatch) {
        results.summary.identicalResults++;
      }
      
      // Log detailed results
      log(`  📊 Rules: ${testResult.readCSSResults.rules} vs ${testResult.cssResults.rules}`, 
          rulesMatch ? 'green' : 'red');
      log(`  📊 Fonts: ${JSON.stringify(testResult.readCSSResults.fonts)} vs ${JSON.stringify(testResult.cssResults.fonts)}`, 
          fontsMatch ? 'green' : 'red');
      log(`  📊 Prefix: "${readCSSPrefix}" vs "${cssPrefix}"`, 
          prefixMatch ? 'green' : 'red');
      
      log(`  🎯 Overall match: ${allMatch ? '✅ IDENTICAL' : '❌ DIFFERENT'}`, 
          allMatch ? 'green' : 'red');
      
      if (!allMatch) {
        if (!rulesMatch) {
          log(`    • Rules differ: ${readCSSRules.length} vs ${cssRules.length}`, 'red');
        }
        if (!fontsMatch) {
          log(`    • Fonts differ: ${JSON.stringify(readCSSFonts)} vs ${JSON.stringify(cssFonts)}`, 'red');
        }
        if (!prefixMatch) {
          log(`    • Prefix differs: "${readCSSPrefix}" vs "${cssPrefix}"`, 'red');
        }
      }

    } catch (error) {
      results.summary.errors.push(`${filePath}: ${error.message}`);
      log(`  ✗ Error: ${error.message}`, 'red');
    }
    
    results.summary.totalTests++;
  }

  // Print final summary
  log('\n📊 Comparison Test Summary:', 'bright');
  log('=' .repeat(30), 'cyan');
  log(`Total Files Tested: ${results.summary.totalTests}`, 'blue');
  log(`Identical Results: ${results.summary.identicalResults}/${results.summary.totalTests}`, 
      results.summary.identicalResults === results.summary.totalTests ? 'green' : 'red');
  
  if (results.summary.errors.length > 0) {
    log(`\nErrors: ${results.summary.errors.length}`, 'red');
    results.summary.errors.forEach(error => log(`  • ${error}`, 'red'));
  }
  
  // Final verdict
  log('\n🏆 Comparison Verdict:', 'bright');
  log('=' .repeat(25), 'cyan');
  
  if (results.summary.identicalResults === results.summary.totalTests && results.summary.errors.length === 0) {
    log('✅ css package is a PERFECT drop-in replacement!', 'green');
    log('✅ All functions produce IDENTICAL results!', 'green');
    log('✅ Migration is safe and complete!', 'green');
  } else {
    log('❌ css package produces different results', 'red');
    log('❌ Migration may cause issues', 'red');
    log('⚠️  Check differences above', 'yellow');
  }
  
  return results;
}

// Run the test
async function runComparisonTest() {
  try {
    const results = await cssComparisonTest();
    
    if (results.summary.identicalResults === results.summary.totalTests && results.summary.errors.length === 0) {
      log('\n✅ CSS comparison test passed!', 'green');
      process.exit(0);
    } else {
      log('\n❌ CSS comparison test failed!', 'red');
      process.exit(1);
    }
  } catch (error) {
    log(`\n💥 Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComparisonTest();
}

export { cssComparisonTest };