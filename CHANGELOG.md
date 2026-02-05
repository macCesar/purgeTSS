# Changelog

All notable changes to PurgeTSS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [7.2.7] - 2026-01-13

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

### Added
- Updated definitions to support Titanium SDK 13.1.0.GA properties
- New utility classes for `navBarColor`, `forceBottomPosition`, and `multipleWindows`
- Added AGENTS.md file for agent documentation

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
- Simplified and renamed flag properties in utilities.tss for consistency
- Fixed flag property name replacement in `removeUneededVariablesFromPropertyName` function

## [7.2.2] - 2025-09-22
...
