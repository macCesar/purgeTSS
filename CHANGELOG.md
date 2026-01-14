# Changelog

All notable changes to PurgeTSS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Fixed 2 security vulnerabilities in dependencies
  - `glob` (via tailwindcss/sucrase): 10.2.0-10.4.5 → 10.5.0 (HIGH - command injection)
  - `js-yaml` (via eslint): 4.0.0-4.1.0 → 4.1.1 (MODERATE - prototype pollution)

### Changed
- Updated `glob` from v9 to v13 with ESM compatibility fixes
  - Changed imports from `import glob from 'glob'` to `import { globSync } from 'glob'`
  - Updated all `glob.sync()` calls to `globSync()`
- Updated `inquirer` from v12.6.3 to v13.0.1
  - Node.js 20+ now required
  - ESM-only (CommonJS no longer supported)
  - Compatible with existing code
- Moved `@fortawesome/fontawesome-free`, `framework7-icons`, and `junk` to devDependencies
  - Reduces installation size by ~45MB for end users
  - These packages are only needed for building distribution files (`npm run build:*`)
  - Font files are bundled in `/assets/fonts/` and shipped with the package
  - Users receive pre-built fonts and don't need source packages
  - FontAwesome PRO users install it separately in their own projects
- Recommended VS Code extension for class reordering
  - Now recommending `KevinYouu.tailwind-raw-reorder-tw4` instead of `Trapfether.tailwind-raw-reorder`
  - Trapfether extension has not been updated for Tailwind CSS 4 compatibility
  - New extension works with both TW3 and TW4, and reorders classes in XML views correctly

### Removed
- Removed unused dependency `uuid` (not used in codebase)
- Removed unused dependency `prompts` (replaced by `inquirer`)
- Removed unused devDependency `css-tree` (replaced by `css` package)

### Fixed
- Fixed ESM import syntax for `glob` package in `src/cli/commands/purge.js`

### Technical Details
- Package count reduced from 424 to 420 packages
- All tests passing (10/10 unit tests)
- CLI verified working with updated dependencies

## [7.2.6] - 2025-11-20

### Changed
- Updated Font Awesome to version 7.1.0

### Added
- Added AGENTS.md file for agent documentation

### Fixed
- Removed silent flag from tailwind init command
- Simplified and renamed flag properties in tailwind.tss for consistency
- Fixed flag property name replacement in `removeUneededVariablesFromPropertyName` function

## [7.2.2] - 2025-09-22

### Added
- Added clean-md script for processing markdown files

### Fixed
- Updated projectRoot path resolution to use fileURLToPath for ESM compatibility
- Fixed handling of missing properties in tiCompletionsFile
- Updated sdkVersion to 13.0.0.GA

## [7.2.1] - 2025-09-09

### Changed
- Updated Font Awesome and PurgeTSS versions
- Bumped version in purgetss.ui.js

### Removed
- Removed legacy .eslintrc.cjs (migrated to eslint.config.js)

## [7.2.0] - 2025-09-09

### Changed
- **MAJOR REFACTOR**: Restructured entire codebase for improved readability and maintainability
- Merged FontAwesome 7 support branch into main
- Migrated ESLint configuration from .eslintrc.cjs to modern flat config (eslint.config.js)

### Added
- FontAwesome 7 support for CSS custom properties format
- Shared `extractUnicodeValue()` helper function in `src/shared/utils.js`
- Backward compatibility for FontAwesome 6 `:before` with `content:` format

### Changed
- **BREAKING**: Updated FontAwesome builders to support FontAwesome 7's new CSS custom properties (`--fa:`) format
- Refactored Unicode extraction logic from individual builders into shared utility function
- Enhanced Unicode extraction to handle:
  - Traditional hex codes (e.g., `"\f015"`)
  - ASCII hex codes (e.g., `"\30"` for "0")
  - Direct ASCII symbols (e.g., `"\$"`, `"\!"`, `"\%"`)
  - Single characters without backslash (e.g., `"A"`, `"$"`)

### Fixed
- FontAwesome 7 icons now generate correct Unicode values for TSS and JS output
- Short Unicode values and special symbols now properly converted to 4-digit hex format
- CSS parsing now handles both FontAwesome 6 and 7 formats seamlessly

### Technical Details
- Updated `src/dev/builders/icon-builders/fontawesome-builder.js`
- Updated `src/dev/builders/icon-builders/fontawesome-js-builder.js`
- Updated `src/dev/builders/fontawesome-builder.js` (Pro/Beta versions)
- Created shared helper function `extractUnicodeValue()` in `src/shared/utils.js`
- Enhanced CSS parsing to detect CSS custom properties (`--fa:`) alongside traditional `content:` properties
- Improved Unicode extraction with better error handling and format support

## [7.1.10] - 2025-08-17

### Fixed
- Updated tailwindCSS experimental config file path from config.js to config.cjs

## [7.1.9] - 2025-06-23

### Added
- Enhanced playView and applyView functions to support index and total parameters
- Enhanced formatArbitraryValues to handle multiple rounded corner values
- Added changeToDash parameter to setModifier2 and customRules functions

### Changed
- Version update to 7.1.9

---

## Migration Guides

### Migrating to v7.2.7 (Unreleased)

If you're upgrading from v7.2.6 or earlier:

1. **Node.js version**: Ensure you're using Node.js 20+ (required by inquirer v13)
2. **Clean reinstall recommended**: For best results, reinstall PurgeTSS:
   ```bash
   npm uninstall -g purgetss
   npm install -g purgetss
   ```
3. **Security fixes**: This version includes important security patches for transitive dependencies

### Migrating to v7.2.0+ (FontAwesome 7)

If you're upgrading from v7.1.x to v7.2.0+:

1. **No action required** - PurgeTSS now automatically detects and handles both FontAwesome 6 and 7 formats
2. **FontAwesome 7 features**:
   - CSS custom properties (`--fa:`) are fully supported
   - Short Unicode values (numbers, symbols) work correctly
   - Traditional long hex codes continue to work
3. **Backward compatibility** - FontAwesome 6 projects continue to work without changes

### Examples of supported formats:

```css
/* FontAwesome 7 - CSS Custom Properties */
.fa-0 { --fa: "\30 "; }           /* → \u0030 */
.fa-dollar-sign { --fa: "\$"; }   /* → \u0024 */
.fa-home { --fa: "\f015"; }       /* → \uf015 */

/* FontAwesome 6 - Traditional (still supported) */
.fa-home::before { content: "\f015"; }  /* → \uf015 */
```

All formats generate correct Unicode values for Titanium SDK usage.
