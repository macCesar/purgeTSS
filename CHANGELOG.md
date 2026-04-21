# Changelog

All notable changes to PurgeTSS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [7.6.2] - 2026-04-21

### Fixed
- **`semantic` command now works in Classic Titanium projects.** The command previously aborted in Classic with a misleading "Please make sure you are running purgetss within an Alloy Project" message. PurgeTSS now detects the project layout and writes `semantic.colors.json` to the correct location per TiDev convention:
  - Alloy   → `app/assets/semantic.colors.json`
  - Classic → `Resources/semantic.colors.json`

  Applies to all three code paths: palette mode, single-fresh mode, and the in-place shade conflict update. Existing unrelated entries (e.g., the default `backgroundColor` / `textColor` that ship with Classic templates) are preserved — the command only replaces keys that belong to the family being written.
- **Duplicated preview output after Classic error.** In 7.6.1 the "not an Alloy project" warning was immediately followed by the palette preview JSON, making it look like the command half-succeeded. Preview output is now exclusive to `--log` / silent invocations; real runs either write the file or emit the error, never both.

## [7.6.1] - 2026-04-21

### Added
- **Confirmation prompt for destructive writes** in `brand` and `images`. The interactive prompt `Continue? [y/N/a]` appears before overwriting project files:
  - `y` / `yes` → proceed this time
  - `N` / `no` / Enter → abort cleanly
  - `a` / `always` → proceed and persist `confirmOverwrites: false` into the matching section of `purgetss/config.cjs` so the prompt is suppressed on future runs

  The prompt auto-skips when `stdin` is not a TTY (alloy.jmk hook, CI, pipes), when `-y` / `--yes` is passed, or when `PURGETSS_YES=1` is set in the environment.
- **`confirmOverwrites` flag** on the `brand:` and `images:` config sections. Defaults to `true` (prompt). Set to `false` to silence the prompt permanently.
- **`-y` / `--yes` CLI flag** on `brand` and `images` to skip the prompt for a single invocation.
- **Disproportionate-viewBox warning** for SVG logos and images. Common Affinity/Illustrator exports bake transforms into the viewBox and can end up at 29559×13542 pt or larger, tripping Sharp's pixel limit. PurgeTSS now detects viewBoxes above 4096 pt on any side and emits a warning with the actual dimensions; rasterization uses an adaptive density so the output pixel count stays bounded regardless of the input size. The warning also suggests re-exporting from the vector editor with a canvas-sized viewBox.
- **Auto-created `purgetss/` subfolder layout** on init. `purgetss/{fonts,brand,images}/` now exist from the first build — previously they only appeared lazily when you first ran the matching command. Makes the directory structure self-documenting.
- **Logger helpers** for grouped multi-line output:
  - `logger.block(header, ...lines)` — single signed header + 3-space indented continuation lines
  - `logger.item(...args)` — indented continuation without the prefix, for sequential flows
  - `logger.startSection()` / `logger.endSection()` — section mode where the first `info/warn/error/file` call becomes the header and subsequent calls auto-indent

### Changed
- **Multi-line console output is now grouped** under a single `::PurgeTSS::` header with indented continuation lines. Applies to the "Please make sure…" warnings from `module` / `icon-library` / `utils` / `project-detection`, the `create` error for missing `ti config`, the XML syntax error from `purge`, the `[dry-run] Would generate:` listing from `brand`, and the `missingHexMessage` from `shades` / `semantic`.
- **`purgetss` run header** now reads `::PurgeTSS:: Purging /path/to/project` — surfaces the target project up front, mirroring the `Auto-Purging` line emitted by the `alloy.jmk` hook. Every downstream status (`Copying Reset styles…`, `Purging utilities.tss styles…`, `app.tss file created!`, `Finished purging in …`) is indented under it.
- **`fonts` and `icon-library`** emit one signed section header per operation (`Copying Icon Fonts...`, `Copying Modules to …`, `Copying Styles to …`); each per-file status is an indented item under its section.
- **`brand` and `images`** now start with a `::PurgeTSS:: Generating …` signed line before the existing `▸/•` structured output, so every command in the CLI opens with a signed header.
- **`brand` in-place warning rewritten** to describe the action before it happens (`⚠  In-place mode will OVERWRITE files in <path>. Commit first if you want a rollback.`) and is followed by the new confirmation prompt — giving the user a real chance to react instead of seeing the warning after writes have already started.
- **`brand` temp files moved to the OS temp directory** (`os.tmpdir()/pt-branding-<pid>-<ts>/`). The project tree (and VSCode's file explorer) stays clean — no more flashing `.ti-branding/` folder appearing and disappearing during a brand run.
- **Reordered defaults** in the `brand:` section of both the config template and `ensureBrandSection`: `splash, padding, iosPadding, darkBgColor, bgColor, notification, confirmOverwrites`.

### Fixed
- `brand` no longer crashes with `Input image exceeds pixel limit` on SVGs exported by Affinity or Illustrator with oversized viewBoxes — the adaptive density computation caps actual pixel output regardless of intrinsic SVG dimensions.
- `pt create` no longer produces a project whose `purgetss/` folder is missing the `brand/` and `images/` subfolders. All three asset subfolders (`fonts/`, `brand/`, `images/`) are created by `ensureConfig()` on every init.

### Internal
- Shared helpers extracted to deduplicate code previously copy-pasted between `prepare-master.js` (brand) and `gen-scales.js` (images):
  - `src/shared/svg-utils.js` — `computeSvgDensity()`, `readSvgSafely()`, `VIEWBOX_WARN_THRESHOLD`
  - `src/shared/prompt.js` — `confirm()`, `confirmWithAlways()`
  - `src/shared/config-writer.js` — `setConfigProperty()` (non-destructive single-property patcher for `config.cjs`)
- Added `tests/unit/shared/logger.test.js` covering `block` and `item` behavior.

## [7.6.0] - 2026-04-20

### Added
- **`brand` command** — generate complete Titanium branding assets (launcher icons, adaptive icons, iOS 18+ Dark/Tinted variants, marketplace artwork, optional notification + splash icons) from logos auto-discovered inside the project. Works on both Alloy and Classic projects — auto-detects layout and routes Android assets to the correct `res/` path.

  **Logo auto-discovery** — drop logo files in `./purgetss/brand/`:
  ```
  purgetss/brand/
  ├── logo.svg              required — main logo (or logo.png)
  ├── logo-mono.svg         optional — monochrome layer + notifications
  ├── logo-dark.svg         optional — iOS 18+ dark variant
  └── logo-tinted.svg       optional — iOS 18+ tinted variant
  ```

  **Config-driven defaults** — add a `brand:` section to `purgetss/config.cjs`. Values are percentages and accept either numbers (`15`) or strings (`'15%'`) for self-documenting clarity:
  ```js
  brand: {
    bgColor: '#FFFFFF',      // Android adaptive bg + iOS/marketplace flatten
    splash: false,           // also generate splash_icon.png × 5
    padding: '15%',          // Android safe-zone. Range: 12% tight (mature logos) — 20% conservative. Spec floor 19.44%.
    iosPadding: '4%',        // iOS aesthetic. Range: 2% bold — 8% conservative. No launcher mask.
    darkBgColor: null,       // opaque dark bg for DefaultIcon-Dark.png (null = transparent per Apple HIG)
    notification: false      // also generate ic_stat_notify.png × 5
  }
  ```

  **Padding defaults** — the Android default is `15%`, matching real-world apps like Gmail and Chrome (range `12-20%`). The spec floor is `19.44%` but modern launchers are more permissive; `15%` gives logos better visual presence while staying safe on circular-mask launchers like Pixel and Oppo. See [App icons and branding — Padding guidance](https://purgetss.com/app-icons-and-branding) in the docs for the "corners" heuristic.

  **Usage** — most invocations are just:
  ```bash
  purgetss brand                            # uses logos + config
  purgetss brand --bg-color "#0B1326"       # override config value
  purgetss brand --no-tinted                # skip iOS tinted variant
  purgetss brand --dry-run                  # preview without writing
  purgetss brand --cleanup-legacy           # remove obsolete branding artifacts
  ```

  **Writes in place by default** — since purgetss commands always operate on the current project, `brand` writes directly to the project paths. Use `--output <dir>` to stage elsewhere, or `--dry-run` to preview.

  Other notes:
  - iOS 18+ `DefaultIcon-Dark.png` defaults to transparent per Apple HIG (system paints its own dark gradient). Use `--dark-bg-color <hex>` for opaque flatten.
  - iOS 18+ `DefaultIcon-Tinted.png` is grayscale on black per Apple HIG.
  - Android dark/light mode is handled automatically by the `ic_launcher_monochrome.png` adaptive layer — Android has no separate "dark icon" file; the system tints the monochrome from wallpaper + theme.
  - `--cleanup-legacy` removes obsolete branding artifacts (legacy launch PNGs, `long`/`notlong` qualifiers, etc.) with context-aware rules that read `tiapp.xml`.
- **`brand:` section** in `purgetss/config.cjs` — placed between `purge:` and `theme:` (so `theme:` can grow without pushing brand defaults far from the top of the file).
- **`sharp` dependency** — added to support the branding pipeline's image processing.
- **`images` command** — generate Titanium multi-density UI images (launcher screens, buttons, illustrations) from sources in `./purgetss/images/`. Writes directly to the project (auto-detects Alloy vs Classic).

  **Source auto-discovery** — drop any supported image (`.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`) into `./purgetss/images/`. Subdirectories are preserved in the output. Source images are treated as 4× (xxxhdpi / @4x) sources; all other scales are derived from them.

  **Output layout (auto-detected):**
  ```
  Alloy    → app/assets/android/images/res-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/
             app/assets/iphone/images/                         (with @2x, @3x suffixes)
  Classic  → Resources/android/images/res-{...}/
             Resources/iphone/images/
  ```

  **Config-driven defaults** — add an `images:` section to `purgetss/config.cjs`:
  ```js
  images: {
    quality: 85,         // JPEG/WebP/AVIF quality 0-100
    format: null         // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
  }
  ```

  **Scope targeting** — you can re-process a single file or subfolder without regenerating everything. Short paths auto-resolve against `purgetss/images/` (convention-first), falling back to cwd-relative for sources outside the convention. Subdirectory structure is always preserved, so re-processing one file produces the exact same output path as a full run.

  **Usage:**
  ```bash
  purgetss images                               # auto-discovers purgetss/images/
  purgetss images background/pink-texture.png   # short path → purgetss/images/background/pink-texture.png
  purgetss images background/                   # re-process just one subfolder
  purgetss images ./docs/screenshots            # source outside convention (cwd-relative)
  purgetss images --android                     # only Android densities (skip iPhone)
  purgetss images --ios                         # only iPhone scales (skip Android)
  purgetss images --format webp                 # convert every output to WebP
  purgetss images --format png --quality 95
  purgetss images --dry-run                     # preview without writing
  ```

  Convention-consistent with the rest of purgetss: inputs live under `./purgetss/<category>/` (fonts, brand, images), outputs land in `app/assets/` (Alloy) or `Resources/` (Classic).
- **`semantic` command** — generate Titanium semantic colors (`app/assets/semantic.colors.json`) with automatic Light/Dark mode. Two modes dispatched by `--single`:

  **Palette mode** — one base hex → 11-step tonal palette with mirror-by-index inversion (anchored at `500`). Writes the JSON + updates `config.cjs` to map the family to the semantic keys, so classes like `bg-amazon-50` and `text-amazon-950` flip tonal contrast automatically with the system appearance.
  ```bash
  purgetss semantic "#15803d" amazon          # 11-shade palette
  purgetss semantic --random --name brand     # random base color
  purgetss semantic "#15803d" amazon --log    # preview JSON without writing
  purgetss semantic "#15803d" amazon -o       # place mapping in theme.colors (override)
  ```

  **Single mode (`--single`)** — explicit light + optional dark + optional alpha → one purpose-based semantic color (`surfaceColor`, `textColor`, `overlayColor`, etc.). Writes the JSON entry **and** auto-maps a class in `config.cjs` by stripping the conventional `Color` suffix (`surfaceColor` → class `surface`, `surfaceHighColor` → class `surface-high`). If your design system uses different class names, edit `config.cjs` after — overriding one mapping is faster than typing the whole structure.
  ```bash
  purgetss semantic --single "#F9FAFB" surfaceColor --dark "#0f172a"
  purgetss semantic --single "#111827" textColor    --dark "#f1f5f9"
  purgetss semantic --single "#3B82F6" accentColor  --dark "#60a5fa" --alpha 80
  purgetss semantic --single "#000000" overlayColor --alpha 50          # dark defaults to light
  ```

  **Smart in-place updates** — if the `--single` name matches an existing palette shade (e.g. `amazon500` while palette `amazon` exists), the entry is updated in place in the JSON (preserving its position) and `config.cjs` is left untouched. The palette already maps to that key, so the operation is interpreted as "edit one shade", not "create a duplicate top-level color".

  **Per-family clean replacement** — re-running on the same family fully replaces it: prior keys (`name` + `name50…name950`) are stripped before the new entries are merged in. Other palettes and manually-defined entries (`textSecondaryColor`, etc.) survive untouched.

  Alpha follows the Titanium spec: range `0.0–100.0`, stored as a string, wrapped per-mode as `{ color, alpha }`. Without `--alpha`, values stay as bare hex strings.

## [7.5.3] - 2026-04-09

### Added
- **Appearance management** — new `Appearance` export in `purgetss.ui.js` for Light/Dark/System mode switching with persistence. Methods: `init()`, `set(mode)`, `get()`, `toggle()`. Requires `semantic.colors.json` for automatic theme switching
  ```js
  const { Appearance } = require('purgetss.ui')
  Appearance.init()        // restore saved mode
  Appearance.get()         // returns current mode
  Appearance.set('dark')   // 'system' | 'light' | 'dark'
  Appearance.toggle()      // switch between light and dark
  ```
- **Default `fontFamily` utility classes** — `font-sans`, `font-serif`, and `font-mono` are now generated automatically with platform-appropriate values:
  - `font-mono` → `monospace` (both platforms)
  - `font-sans` → `Helvetica Neue` (iOS) / `sans-serif` (Android)
  - `font-serif` → `Georgia` (iOS) / `serif` (Android)
  - User values from `config.cjs` (`theme.fontFamily` or `theme.extend.fontFamily`) override defaults cross-platform

### Fixed
- **XML validation now detects illegal `--` inside comments** — `<!-- section: --flag -->` is invalid XML (double dashes are only allowed in `<!--` and `-->`). PurgeTSS now catches this during pre-validation with a clear error message and fix suggestion

## [7.5.1] - 2026-04-07

### Fixed
- **`dist/purgetss.ui.js` was missing `pulse()` method and latest `transition()` improvements** — the distribution file shipped with v7.5.0 was not rebuilt from the updated template, so `pulse()`, enhanced `transition()` with Android consolidation, and delta-based drag for transformed views were missing. Now rebuilt and fully in sync with the template
- **Animation helper missing `snap()` and `keep-z-index` class generation** — the `snap-back`, `snap-center`, `snap-magnet`, and `keep-z-index` utility classes were defined in the template but not generated in `utilities.tss`. Now correctly generated by `animation.js` helper

### Changed
- Updated Font Awesome to version 7.2.0

## [7.5.0] - 2026-04-05

### Added
- **`extend` support for Window, View, and ImageView** -- you can now customize component defaults from `theme.extend` in `config.cjs`, same as `extend.colors` or `extend.spacing`
  ```js
  extend: {
    Window: { apply: 'exit-on-close-false bg-blue-500' }
    // or with the explicit default wrapper:
    Window: { default: { apply: 'exit-on-close-false bg-blue-500' } }
  }
  ```
- **Shorthand `apply` for Window, View, and ImageView** -- `{ apply: '...' }` is automatically normalized to `{ default: { apply: '...' } }`, so the `default` wrapper is now optional
- **Apply directive property deduplication** -- if an apply class sets a property that already exists as a static default (e.g., `bg-blue-500` vs the default `backgroundColor: '#FFFFFF'`), the applied value wins instead of duplicating it
  ```
  // Before: 'Window': { backgroundColor: '#FFFFFF', backgroundColor: '#3b82f6' }
  // Now:    'Window': { backgroundColor: '#3b82f6', exitOnClose: false }
  ```

- **Automatic platform resolution in apply directives** -- classes inside platform blocks (`ios:`, `android:`) now automatically find their platform-specific version in `utilities.tss`. No need to prefix with `ios:` or `android:` when you're already inside a platform block
  ```js
  Window: {
    ios: {
      // Before: had to write 'ios:status-bar-style-light-content'
      // Now: just write the class name, the ios block handles it
      apply: 'status-bar-style-light-content extend-edges-all'
    }
  }
  ```

### Changed
- Updated Font Awesome to version 7.2.0

### Fixed
- **`extend.Window` was silently ignored** -- putting Window, View, or ImageView inside `theme.extend` had no effect; only `theme.Window` (without extend) worked. Both locations work now, and `extend` merges into defaults as expected
- **Duplicate `font` properties in apply directives** -- when multiple apply classes resolved to `font: { ... }` objects, they could appear as separate entries. The deduplication now keeps the last occurrence
- **Array-type properties missing bracket notation in `utilities.tss`** -- properties like `extendEdges`, `mediaTypes`, `orientationModes`, and other Array-type Titanium properties were generated as plain strings instead of arrays. Now correctly wrapped in `[ ]` notation
  ```
  // Before: '.extend-edges-all': { extendEdges: Ti.UI.EXTEND_EDGE_ALL }
  // Now:    '.extend-edges-all': { extendEdges: [ Ti.UI.EXTEND_EDGE_ALL ] }
  ```
  - Exception: `inputType` is excluded from bracket wrapping (accepts a single value per Ti SDK docs despite being marked as Array in the schema)

## [7.4.0] - 2026-03-31

### Added
- **Animation module: `transition(views, layouts)`** — multi-view layout transitions using GPU-accelerated `Matrix2D.translate().rotate().scale()`
  - Animates an array of views simultaneously to positions defined by layout objects
  - Each layout object accepts `translation: {x, y}`, `rotate`, `scale`, `zIndex`, `width`, `height`, and `opacity`
  - Property names match TiDesigner's mockup preset format — presets can be shared directly
  - Layouts are positional arrays — `layouts[i]` maps to `views[i]`, enabling reusable presets across different view groups
  - Views without a corresponding layout entry automatically fade out; views returning from fade-out automatically fade back in
  - Inherits `duration`, `delay`, and `curve` from the `<Animation />` object
  - Single `view.animate()` call per view (no concurrent animation conflicts on Android)
  - **Mac Catalyst note**: parent containers should use fixed dimensions — resizable containers with `Ti.UI.FILL` cause UIKit re-layout distortion on views with rotated transforms
- **Animation module: `pulse(view, count)`** — scale-up-and-back pulse animation using native `autoreverse` + `repeat`
  - Scale value inherited from the `<Animation />` object's `scale` class (e.g., `scale-(1.3)`); defaults to 1.2x
  - `count` parameter controls number of pulses (default 1)
  - No timers or callbacks needed for multiple pulses — uses Titanium's native `repeat` property
- **Animation module: `shake` fix** — now oscillates bidirectionally (left-right) instead of only moving right
- **Animation module: `keep-z-index` class** — prevents drag from reordering z-indices, preserving layout preset order during drag
- **Animation module: delta-based drag for transformed views** — views with `rotate`/`scale` (from `transition`) now drag smoothly using TiDesigner's delta approach instead of `convertPointToView`, preserving rotation and scale during drag
- **Animation module: `detectCollisions(views, dragCB, dropCB)`** — enables collision detection on draggable views
  - Calls `dragCB(source, target)` during drag when the source view hovers over another registered view
  - Calls `dragCB(source, null)` when the source leaves all targets
  - Calls `dropCB(source, target)` on drop when a collision target is found
  - Automatic snap-back animation (200ms) when dropped outside any target
  - Collision is based on center-point hit testing against each view's `rect` bounds
- **Animation module: `swap(view1, view2, duration)`** — animates two views exchanging positions
  - Handles iOS transform reset (`Ti.UI.createMatrix2D()`) during the swap animation
  - Temporarily elevates z-index of both views so the animation renders above siblings
  - Restores original z-index order after animation completes
  - Default duration: 200ms
- **Animation module: `sequence(views, cb)`** — animates views one after another
  - Each view completes before the next starts (unlike `play(array)` which runs in parallel)
  - Callback fires once after the last view finishes
  - Respects `open`/`close` state toggling
- **Animation module: `shake(view, intensity, duration)`** — error/feedback shake animation
  - Uses native `autoreverse` + `repeat` for smooth performance (no callback chaining)
  - Default: intensity 10px, duration 400ms
- **Animation module: `snapTo(view, targets, duration)`** — snap to nearest target
  - Finds closest target by center-to-center distance and animates to its position
  - Returns the matched target view, or `null` if no targets
  - Handles iOS transform reset automatically
- **Animation module: `reorder(views, newOrder, duration)`** — animated reordering
  - Accepts an index array mapping current positions to new positions
  - All views animate simultaneously to their new positions
  - Default duration: 200ms
- **Animation module: position normalization for `swap`, `reorder`, and `snapTo`** — views no longer require explicit `top`/`left` properties
  - Automatically resolves position from `_origin*`, then `top`/`left`, then `view.rect` (rendered position)
  - Normalizes views to `top`/`left` positioning on first use (clears `right`/`bottom`)
  - Views positioned with margins (`ml-`, `mr-`, `mt-`), `right`, or centered layout now work correctly
- **Animation module: `undraggable(views)`** — removes draggable behavior
  - Cleans up all touch listeners and orientation change listener
  - Removes views from collision detection registry
  - Cleans up internal tracking properties

### Fixed
- **Animation module: `swap` race condition with bounce-back animations** — when dropping a view onto a target that had a bounce-back animation in progress, both views could end up overlapping at the same position. `swap` now cancels any pending bounce-back on both views before starting the swap animation
- **Animation module: snap not triggering on fast drag release** — when releasing a dragged view while still in motion, `checkCollision` could miss the target because the center-point had already exited the target bounds. Now tracks the last known collision target during drag and uses it as fallback on drop
- **Animation module: snap animation not applying on Android** — on Android, the async `animate({ duration: 0 })` used during drag could conflict with the snap animation on drop. Now consolidates the drag position with `applyProperties` before starting snap, same as bounce-back already did

### Changed
- **Animation module: `swap`, `reorder`, `shake`, `snapTo` now inherit properties from the Animation object**
  - Follows the same pattern as existing methods (`play`, `open`, `close`, etc.) — no explicit `duration` parameter
  - **`duration`**: inherits from `duration-*` class; fallbacks: 200ms (swap/reorder/snapTo), 400ms (shake)
  - **`delay`**: inherits from `delay-*` class; fallback: 0ms
  - **`curve`**: inherits from `curve-*` class; fallback: `EASE_IN_OUT` (swap/reorder/snapTo). Shake keeps its own `EASE_IN_OUT` internally
  - **Note**: `shake` retains `intensity` as its only parameter (not an Animation property). Does NOT inherit `autoreverse` or `repeat` — uses fixed internal values required for the shake effect
- **Animation module: snap system — `snap-back` and `snap-center` classes**
  - Both OFF by default — opt-in via classes on the `<Animation>` object
  - `snap-back`: view returns to origin when dropped outside a collision target
  - `snap-center`: view auto-centers on the target when dropped on it (uses `snapTo` internally)
  - `snap-magnet`: (planned) magnetic attraction while dragging near a target
- **Animation module: `snapTo` now centers the view on the target**
  - Previously snapped to the target's `top`/`left`, causing misalignment when source and target have different sizes
  - Now calculates the center offset: `target.position + (target.size - view.size) / 2`
  - When source and target are the same size, behavior is unchanged
- **Animation module: bounce-back now inherits from the Animation object and handles Android race conditions**
  - Uses `...args` instead of hardcoded `duration: 200` — follows the same inheritance rules as all other methods
  - On Android, consolidates drag position with `applyProperties` before starting bounce-back animation to prevent animation conflicts
  - Added `_bouncingBack` flag to handle rapid drag-drop on the same view — if a bounce-back is in progress when a new drag starts, it completes immediately via `applyProperties` before capturing the new origin
- **Animation module: `makeDraggable` refactored** to store listener references on views
  - Enables proper cleanup via `undraggable()`
  - Listeners stored in `view._dragListeners` object

## [7.3.1] - 2026-03-31

### Fixed
- **Animation module: draggable views with `left: 0` or `top: 0` jumped on drag start**
  - `calculateTranslation()` used truthiness checks (`if (draggableView.left)`) which treated `0` as falsy
  - Views positioned at `left: 0` or `top: 0` fell through to the centered-positioning fallback, causing an incorrect offset on drag
  - Fixed by using `!= null` checks to properly distinguish between "not set" (`undefined`) and "explicitly set to 0"
  - Affects `right` and `bottom` properties as well

## [7.3.0] - 2026-02-04

### Changed
- **BREAKING**: Renamed `tailwind.tss` to `utilities.tss` throughout the codebase
  - Output file is now `purgetss/styles/utilities.tss` instead of `purgetss/styles/tailwind.tss`
  - Distribution file is now `dist/utilities.tss` instead of `dist/tailwind.tss`
  - This rename reflects PurgeTSS's identity as a standalone utility-first styling toolkit
- Internal function renamed: `autoBuildTailwindTSS()` → `autoBuildUtilitiesTSS()`

### Added
- **XML syntax validation**: New pre-validation system for Alloy XML files
  - Detects common malformations like missing opening `<` brackets (e.g., `Label id=` instead of `<Label id=`)
  - Provides detailed error messages with line numbers, context preview, and suggested fixes
  - Runs before processing to catch errors early in the build pipeline

### Fixed
- **Classic Titanium compatibility**: `deviceInfo()` function no longer depends on `Alloy.isTablet`/`Alloy.isHandheld`
  - Now uses `platform.osname`-based detection for tablet/handheld identification
  - Works in both Alloy and Classic Titanium projects without errors

### Removed
- Removed `lib/templates/tailwind/template.tss` reference (consolidated into `custom-template.tss`)

### Internal
- Updated all code comments and documentation references from "Tailwind" to "utilities.tss"
- Simplified template header comments
- Updated CLI help text and command descriptions
- All E2E tests updated to expect `utilities.tss` output

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

## [7.1.10] - 2025-08-17

### Changed
- **Animation module**: `play` and `apply` callbacks now receive an enriched event object instead of the raw native event
  - Provides safe, serializable properties: `type`, `bubbles`, `cancelBubble`
  - Adds context properties: `action` (`'play'` or `'apply'`), `state` (`'open'` or `'close'`), `id`, `targetId`, `index`, `total`
  - Adds `getTarget()` helper method to retrieve the animated view
  - When animating an array of views, `index` (zero-based position) and `total` (array length) are passed to each callback invocation
