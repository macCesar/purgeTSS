# Changelog

All notable changes to PurgeTSS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

## [7.1.10] - 2025-01-XX

### Fixed
- Update tailwindCSS experimental config file path from config.js to config.cjs

## [7.1.9] - Previous Release

### Added
- Enhanced playView and applyView functions to support index and total parameters
- Enhanced formatArbitraryValues to handle multiple rounded corner values

### Changed
- Version update to 7.1.9

---

## Migration Guide for FontAwesome 7

If you're upgrading from FontAwesome 6 to FontAwesome 7:

1. **No action required** - PurgeTSS now automatically detects and handles both formats
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
