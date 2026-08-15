# Changelog

All notable changes to PurgeTSS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [7.13.2] - 2026-08-14

### Fixed
- **`purgetss brand --help` advertised padding defaults the command does not use.** It printed `default: 19` for `--android-adaptive-padding` and `default: 20` for `--android-splash-padding` and `--ios-splash-padding`; the pipeline applies `18`, `26` and `26`. The numbers live as data in `src/core/branding/pieces.js`, and `bin/purgetss` carried a second hand-typed copy in each option description with nothing linking them. The adaptive string dates to 2026-04-25 and was never revisited when 7.13.0 moved the value; the two splash strings were introduced by 7.13.0 itself already carrying the wrong figure, which is why its changelog entry stated `20` in one paragraph and `26` in another. All seven padding descriptions are now interpolated from the piece table, so the drift is no longer expressible. A new unit test parses the real `--help` output and compares every advertised default against the table.
- **The 7.13.0 entry in this changelog said the splash paddings default to `20%`, "leaving the logo at 60%".** Corrected to `26%` and 48%, matching the code and the rest of that entry.

## [7.13.1] - 2026-08-14

### Fixed
- **Four vulnerable transitive dependencies patched.** They shipped inside 7.13.0: `postcss` ≤8.5.22 → 8.5.26 (high — XSS via unescaped `</style>` in the stringify output, plus three path-traversal advisories around `sourceMappingURL`), `nanoid` 3.3.11 → 3.3.18 (high — non-secure generators can loop indefinitely on a negative size), `brace-expansion` 2.1.0 → 2.1.4 and 5.0.5 → 5.0.9 (high — a large numeric range defeats the documented `max` DoS protection), and `uuid` → 11.1.1 (moderate — missing buffer bounds check in v3/v5/v6 when `buf` is provided). All patch bumps within the same major; `package.json` is untouched and only the lockfile moves. `npm audit` reports zero vulnerabilities afterwards.

## [7.13.0] - 2026-08-14

### Added
- **`config.cjs` is kept up to date with the `brand:` structure, on disk.** When a project's `brand:` block uses an older shape, the next run rewrites it to the current one and carries over every value that had been customized — paddings, colors, logo paths, enabled flags — printing each one it moved. It happens on `purgetss brand`, and on any command that goes through `ensureConfig()` or rebuilds `utilities.tss`, the same way `config.js` → `config.cjs` was handled. Values already matching a default are not written, so a config that was never customized comes out clean.
- **`purgetss brand` now covers every image the Titanium template ships.** A run on a fresh Alloy project used to leave 28 files still wearing the grey Alloy logo: the 16 `assets/iphone/Default*.png` launch images, the 11 `assets/android/images/res-*/default.png` splashes, and `assets/android/appicon.png`. Three new generators (`gen-ios-splashes.js`, `gen-appicon.js`, `gen-launch-logo.js`) close that gap, and the per-qualifier Android splashes moved from the opt-in `--legacy-splash` flag (now removed) into the default set. The rule is now explicit: if the template ships the file, `brand` updates it — whether or not current iOS/Android versions still read it is not the user's problem to track. Verified against a project created with `purgetss create` on SDK 14: every tracked template image is regenerated, none left over.
- **`LaunchLogo.png` (1024×1024) as the iOS launch screen source.** Titanium already resizes `LaunchLogo.imageset` on every build, preferring `LaunchLogo.png` over `DefaultIcon.png`. Dropping `purgetss/brand/logo-launch.{svg,png}` into the project makes the launch screen show the logotype instead of the app icon with its safe-zone padding. Activated by convention (the file's presence) or with `--only launch-logo`; `--launch-logo <path>` and `--launch-logo-padding <n>` set the source and the framing, matching what `--<piece>-logo` means everywhere else in the command. The size is exact because the SDK discards the file with a warning when it is not 1024×1024.
- **`--only <pieces>` filter.** `purgetss brand --only icon` regenerates just the `DefaultIcon` pair, `--only ios,notification-icon` mixes a group and a piece. Groups: `ios` (icon, dark, tinted, ios-splash), `store` (marketplace, feature-graphic), `android` (adaptive, legacy-icon, appicon, android-splash). Naming a piece generates it even when its opt-in flag is absent; an unknown name aborts before writing anything, listing the valid pieces and groups. `--dry-run` honors the same filter.
- **`--nine-patch` flag** — declared and documented, generator not implemented yet. Selecting it prints a warning and writes nothing.

- **`brand.optimize` / `--optimize`: quantize the generated PNGs to a palette.** Off by default because it is lossy. On the reference project the full set of 56 files goes from 1.6 MB to 476 KB — 71% smaller. Measured on visible pixels the difference against truecolor averages 0.08–0.19 out of 255 with no channel over 16/255, and transparency survives intact; flat marks are safe, wide gradients are the case to check. Runs as a post-pass over what the pipeline wrote, so every piece is covered from one place, and a file is left alone when the palette version is not actually smaller. For context: iOS already runs `pngcrush -iphone` over the bundle at package time, but that is lossless — this saving is not something the SDK would have done anyway; on Android nothing in Titanium touches these files.

### Fixed
- **`shades` and `semantic` no longer strip every comment from `config.cjs`.** Both serialized the entire config object with `util.inspect` and wrote it back, which reformatted the file and dropped all of its comments — including the ones `init` generates for `purge:`, `brand:` and `images:`, sections the color commands never look at. They now rewrite only the `theme:` section through the new `setConfigSection()`, leaving every other byte untouched. Comments inside `theme:` still go, since that is the section being rewritten. Pre-existing bug, unrelated to the brand work.

### Changed
- **The `brand:` section of `config.cjs` is organized by piece, not by kind of setting.** Each of the 14 pieces gets one block accepting the same four keys where they apply — `logo`, `padding`, `background`, `enabled` — instead of a single piece being split across `brand.logos`, `brand.padding` and `brand.android`. `background` cascades from the top-level `brand.background`; `padding` deliberately does not, because 19% is Android's safe-zone floor while 4% is an iOS aesthetic choice, and one inherited number would break the launcher mask silently. Existing configs are **rewritten in place** to the new structure on the next run, carrying over every value that had been customized away from the defaults, and reporting each one it moved.
- **Every piece has a `--<piece>-logo` flag.** `--ios-splash-logo`, `--marketplace-logo`, `--legacy-icon-logo`, `--appicon-logo`, `--android-splash-logo` and `--notification-icon-logo` were missing, so six pieces could only be overridden through the file convention or config. The rule `--<piece>-logo` now has no exceptions.
- **BREAKING — one name per thing across config, flags, `--only` and the `purgetss/brand/` files.** `--splash` → `--splash-icon`, `--notification` → `--notification-icon`, `--icon-logo` now feeds the `icon` piece (the Android launcher source is `--adaptive-logo`), `--splash-logo` → `--splash-icon-logo`, `--feature-logo` → `--feature-graphic-logo`. `--legacy-splash` is gone: its output is part of the `android-splash` piece and always generated. Logo basenames follow `logo-<piece>` with no exceptions — `logo-icon` is the `icon` piece, the Android launcher mark is `logo-adaptive`, and `logo-splash` / `logo-feature` become `logo-splash-icon` / `logo-feature-graphic`. No aliases are kept; the command has exactly one spelling per thing.
- **Unknown keys inside `brand:` are rejected instead of ignored**, at both levels — `brand.foo` and `brand.adaptive.paddig` both abort before a single file is written, listing the valid keys. A typo is deliberately *not* treated as an old structure: rewriting the block would drop it silently, and ignoring a misspelled padding key would render the whole icon set at the wrong size and still look plausible.
- **The intermediate masters are sized to what the run needs, instead of a fixed 1024 px.** Every piece scales down from those masters, so their resolution was a hard ceiling on output sharpness: a splash at `--splash-padding 14` or lower asked for more than 1024 px on three canvases and got an upscaled raster. `brand` now measures the largest request across the selected pieces and rasterizes to exactly that (a default run reports `Masters at 942 px`), so every destination is a reduction and never an upscale. It also made runs faster — 6.8 s → 2.2 s on the reference project — because the master is no longer larger than needed.
- **Adaptive icon padding default is now `18%`** (was 19%). Android's adaptive canvas is 108 dp with a 66 dp guaranteed safe circle inside a ~72 dp visible area; 18% puts the logo at 69.1 dp — past the circle's corners but inside what the mask shows, which suits marks that carry their own margin. Round number, and slightly more presence than the old 19%.
- **Splash padding default is `26%`**, calibrated against the Titanium template rather than picked: the Alloy logo in the stock `default.png` measures 665×488 px on a 1440×2560 canvas, and 26% lands within 4% of it. The previous hardcoded values put it at 46% (default.png, by arithmetic accident) and 60% (the res-* set, never seen because it sat behind a flag).
- **The 28 splash images now share one sizing rule, and it is configurable.** `default.png` used a hardcoded box of 72%×26% of its own canvas while the 11 `res-*` used a separate hardcoded 60% of the shorter side — two rules for the same piece, neither adjustable. All of them (plus the 16 iPhone launch images) now fit the logo into a square sized as a share of the canvas's shorter side, exposed as `brand.androidSplash.padding` / `brand.iosSplash.padding` (default `26%`, leaving the logo at 48%) with `--android-splash-padding`, `--ios-splash-padding` and the `--splash-padding` shortcut. Measured against the shorter side so one number holds in portrait and landscape alike; verified across five canvases from 320×480 to 2048×1536.
- **The Android and iOS splash artwork is scaled from the tight master** (the logo at its own aspect ratio) instead of the padded square one, so a wide wordmark fills the canvas the same way on both platforms. Only `default.png` changes visually from previous releases; the icon pieces still use the square master.
- **The pipeline is driven by a single piece → generator map** (`src/core/branding/pieces.js` + the `PIPELINE` table in `src/core/branding/index.js`). The `--dry-run` listing, the run itself and the post-run summary all read from it, so they cannot drift apart. Per-piece CLI flags, opt-out flags and background overrides are declared as data in that table rather than as `if (piece.name === …)` branches. The `--notes` block numbering is counted rather than hand-computed, and the copy instructions now include `assets/iphone/` alongside `assets/android/` and `platform/android/res/`.
- **`brand --help` no longer claims `background.png` / `background.9.png` are out of scope.** With `android-splash` in the default set and `--nine-patch` declared, that was no longer true.

### Removed
- **In-memory `brand:` translation on every config read.** `normalizeLegacyBrand()` in `src/shared/config-manager.js` translated older shapes on every `getConfigFile()` call — that is, on every purge, watch and build, not just on `brand`, and forever. The old key names now live in `src/core/branding/migrate-brand-section.js`, which runs **on the file**, once: `config.cjs` is brought to the current structure and from then on every command reads exactly one shape. Deleting that module and its two call sites is all it takes to drop the migration in a future version. `getConfigFile()` no longer injects `brand` defaults either; the piece table owns them.
- **All backwards compatibility in the command itself.** No flag aliases, no legacy logo basenames, no fallbacks — `brand` speaks one vocabulary.

### Other
- Unit tests for the brand config resolver (`tests/unit/core/brand-config.test.js`): CLI > config > convention > default precedence, `background` inheritance, `padding` non-inheritance, `--only` parsing (pieces, groups, mixes, invalid names), and rejection of unknown keys.
- Unit tests for the config migration (`tests/unit/core/brand-config-migration.test.js`): which shapes are migratable and which must not be, values surviving the rewrite, the rendered block parsing back to the piece table's defaults, brace balancing on a nested section, and a guard that the shipped template stays in sync with the generator.
- `tests/unit/core/post-gen-notes.test.js` updated for the piece-driven output, including the compact summary's copy lines.
- `purge.js` imported `ensureConfig` without ever calling it. The dead import is gone; the file now calls `ensureBrandSection()` at the start of a run instead.

## [7.12.1] - 2026-08-05

### Fixed
- **`purgetss brand --notes` now targets Titanium's launcher Activity instead of only the app theme.** Titanium applies `Theme.Titanium` directly to the generated launcher Activity, so adding splash items only to the `<application>` theme could still leave Android 12+ using the SDK's default background. The notes now print a complete `splashscreen.xml` at the correct Alloy or Classic resource path, define a launcher-only `Theme.SplashScreen` derived from `Theme.Titanium`, and show how to merge that theme into the existing launcher Activity declaration without changing the app's current theme. `windowSplashScreenBackground`, `windowBackground`, and `colorBackground` reference one `splashscreen_background` resource, so the launch color is changed in one place. When `--splash` is enabled, the same copy-ready style also includes `windowSplashScreenAnimatedIcon`.

### Changed
- **Font Awesome Free updated to 7.3.1.** 23 new icon classes (`.fa-lotus`, `.fa-codeberg`, `.fa-copilot`, `.fa-substack`, `.fa-tesla`, `.fa-storybook`, `.fa-matrix`, `.fa-nextcloud`, `.fa-visual-studio`, …), none removed. Regenerated across `dist/fontawesome.tss`, `dist/fontawesome.js`, the bundled TTF/OTF font files, the `lib/templates/fontawesome` templates and the `test-project/` baseline.
- **`sharp` updated to 0.35.3 and `glob` to 13.0.6.**

## [7.12.0] - 2026-08-05

### Added
- **Android launch background snippets in `purgetss brand --notes`.** The full notes covered the iOS launch image and the Android launcher icon, but never the color Android draws before Titanium creates the first Window — so a run that set a brand background still flashed the default theme color at launch. `--notes` now prints a step with both items to merge into the existing app theme: `android:windowSplashScreenBackground` (Android 12+ system splash) and `android:windowBackground` (native window), plus the reminder that `tiapp.xml` `<application>` must reference that theme with `android:theme="@style/YourExistingTheme"`. The Android 12+ artwork step (`splash_icon.png`) and the ones after it shift down one number.

### Changed
- **`--notes` wording no longer names only `tiapp.xml`.** The command edits neither `tiapp.xml` nor the Android theme resources, so the `--notes` help text and the compact summary now read "platform launch/theme snippets" instead of "tiapp.xml snippets".
- **`completions-v3.json` reports SDK 13.4.0.GA.** Metadata label only — the properties map is unchanged.

### Other
- Unit tests added for `printPostGenNotes()` (`tests/unit/core/post-gen-notes.test.js`) — the module had no coverage before. They assert the brand color reaches the iOS `<default-background-color>` snippet and both Android theme items, and that the Android 12+ artwork block appears only when `withSplash` is set.

---

## [7.11.2] - 2026-07-29

### Fixed
- **`images.files` sync silently gave up on any config with comments — including the one `purgetss init` generates.** `matchBracket()` in `sync-images.js` tracked quotes but not comments, so the apostrophe in the template's own comment (`// false = SVG pipeline computes dims but doesn't write to images.files`) opened a string that never closed. From there the scanner missed the section's closing brace, `matchImagesSection()` returned `null`, and every run printed `Could not insert <file> into images.files (section missing or unreadable)` while `files` stayed `[]`. The SVG pipeline still generated PNGs and updated its cache, which is why the breakage went unnoticed: only the write-back to `config.cjs` was lost. `matchBracket()` now skips `//` and `/* */` comments and honors backslash escapes inside strings. Existing unit tests missed this because every fixture config was comment-free.
- **`parseTssMap()` dropped every property following an escaped quote.** The three hand-written scanners in `tss-reader.js` tracked string state without honoring backslash escapes, so a single `\'` in a value flipped the scanner into "inside a string" permanently: `'.card': { title: 'it\'s here', width: 200 }` yielded no `width` at all, and the SVG pipeline resolved dimensions from an incomplete map. All scanners now share one `codeChars()` walker that skips string literals and escape sequences.
- **Classes carrying a nested object never entered the TSS map.** `CLASS_LINE` delimited the body with `[^}]*`, which cannot see past an inner `}` — so `'.text-xs': { font: { fontSize: 12 } }`, and any custom class combining `font: { ... }` with `width`/`height`, was skipped entirely by the SVG pipeline. The body is now delimited by brace balancing.
- **`fast-cli` E2E suite reported PASSED without checking anything.** It counted found files into `filesFound` and then hard-coded `success: true`, so a command that produced no output still passed. It now fails when an expected file is missing.
- **Android `theme` values keep their quotes in custom rules.** A custom class such as `'.welcome-window': { android: { theme: 'Theme.AppDerived.NoTitleBar' } }` emitted `theme: Theme.AppDerived.NoTitleBar` (unquoted), which Alloy cannot compile. `checkTitanium()` matched `Alloy`, `Ti.`, `Theme`, `Titanium` and `L(` anywhere inside a value, so any Android theme name — including every `Theme.Titanium.*` name, via the `Titanium` substring — was treated as a JavaScript expression. Detection is now anchored to the start of the value (`Alloy.`, `Ti.`, `Titanium.`, `L(`, plus array literals like `[ Ti.UI.PORTRAIT ]`), so theme names stay strings while real expressions are still emitted raw. The built-in `theme` template no longer adds its own quotes, since `parseValue()` supplies them; generated `dist/utilities.tss` is byte-identical to the previous release.

### Removed
- **`version` lifecycle hook in `package.json`.** Added in 7.11.1 to regenerate `dist/` and `assets/fonts/` on `npm version`, but npm 11.13.0 does not fire the hook when `--no-git-tag-version` is supplied (which is the mode `/release` uses). The hook never executed in practice; removed to avoid the misleading config.

### Changed
- **E2E suites run against a disposable copy of `test-project/`.** `cli-commands`, `configuration-options`, `fast-cli` and `simple-cli` executed the real CLI inside the versioned `test-project/`, so every `npm test` left the working tree dirty — and the first two `rm -f purgetss/config.cjs` as cleanup, which brought the file back as the bare template and dropped the `images.files` entries the SVG pipeline had synced. New `tests/helpers/sandbox-project.js` copies the project into a tmpdir per suite and removes it afterwards; the versioned baseline is now read-only during tests.
- **`n/no-process-exit` disabled under `tests/**` in `eslint.config.js`.** The suite runner reads each script's exit code, so `process.exit()` there is the interface rather than a smell.

### Other
- Unit tests added for theme value quoting (`tests/unit/shared/theme-quoting.test.js`, 20 cases covering `checkTitanium()`, `parseValue()` and `customRules()` across theme names, Titanium/Alloy expressions, `L()` and constant array literals).
- Unit tests added to `sync-images.test.js` for comment-bearing configs (the literal `purgetss init` template, plus an unbalanced apostrophe in a comment with a non-empty `files` array).
- Unit tests added for `tss-reader.js` (`tests/unit/core/tss-reader.test.js`, 12 cases covering escapes, template literals, comment stripping and nested objects) — the module had no coverage before.

## [7.11.1] - 2026-05-14

### Fixed
- **Symmetric width/height cascade in the SVG image pipeline.** `deriveDimensions` now accepts width-only, height-only, or both; the unpinned side stays `null` in `images.files` and `gen-scales` derives it from the SVG viewBox on every run (no more stale auto-derived heights cemented in config). `gen-scales` resolves height-only sources by computing width from the inverse aspect.
- **`syncConfigImages` mirrors the current run instead of taking `max()` across runs.** Shrinking a class (e.g. `h-52` → `h-16`) now propagates to `config.cjs` instead of freezing the entry at the larger past size. Manual pinning still available via `images.autoSync: false`.
- **Bracket-balanced `matchImagesSection` in `sync-images.js`.** The previous lazy regex mis-detected the closing brace when `images: { ... }` was written on a single line, dropping `files: []` into the first nested block to close (e.g. `theme.extend.colors.wheel`). Replaced with bracket counting.
- **`syncConfigImages` no longer bumps `config.cjs` mtime on untouched runs.** Skips the file write when `inserted === 0 && updated === 0`, preventing gratuitous `utilities.tss` rebuilds triggered by mtime changes.
- **`purgetss images` respects `--yes` for overwrite confirmations.** The prompt no longer reappears when `--yes` is supplied on the CLI.
- **SVGs listed in `images.files` always emit PNG.** Titanium's `.svg → .png`-only runtime fallback means other formats wouldn't load; the standalone `purgetss images` command now forces `.png` for SVG sources in `images.files` regardless of `images.format`. Raster files and SVGs not in `images.files` still honor `format`.
- **Per-file bullet log surfaces width source and output format.** `purgetss images` prints `<relPath> → <Ndp> (CLI --width | files | viewBox | source 4×) · <format>` so the active resolution and any forced format are visible per file.
- **Restore `src/dev/builders/tailwind-builder.js` wrapper.** The file deleted as "orphan" in commit 0208a18 was actually the entry point for the `npm run build:tailwind` script. Restored and re-pointed at `src/core/builders/auto-utilities-builder.js` (the new home of `autoBuildUtilitiesTSS`).

### Changed
- **`npm version` runs `npm run build` and stages `dist/` + `assets/fonts/` via the `version` lifecycle script** so version-bearing build artifacts stay in sync with the bumped version. (Caveat: in npm 11.13.0, `--no-git-tag-version` does not fire this hook automatically; `/release` works around it by invoking the build manually.)

### Other
- autoSync ordering aligned between config template and `ensure-images-section.js` so the generated `images:` block matches the literal template.
- Unit tests added for `sync-images.js` (11 cases covering bracket-balanced section detection, cascade policy, and symmetric width/height handling).

## [7.11.0] - 2026-05-14

### Added
- **SVG-aware compile-time image pipeline as a post-step of `purgetss`.** When views or controllers reference `image="/images/<sub>/<name>.svg"` (or `backgroundImage="..."`) alongside utility classes that resolve to numeric width/height (`w-32`, `w-(300)`, `h-auto`, …), purge now compiles those SVGs into the 8 Titanium density variants (5 Android + 3 iPhone PNGs) using dimensions resolved from `app.tss` after the regular purge finishes. Titanium loads the generated `.png` automatically at runtime when the XML/Controller references `.svg`. Cache lives at `purgetss/.cache/svg-images.json` (add to `.gitignore`). The SVG attribute stays untouched in your source — never rewritten.
- **`images.files` array in `config.cjs` as per-file override.** Pin width/height for individual files in `purgetss/images/`: `[{ filename: 'images/logos/logo.png', width: 128, height: 52 }, ...]`. When `purgetss images` runs, entries override the source's natural dimensions; CLI `--width` still wins over both. For SVGs detected by the purge SVG pipeline, entries populate automatically (subject to `images.autoSync`). Raster entries you add by hand survive subsequent runs untouched.
- **`images.autoSync` boolean (default `true`).** Opt-out for devs who manage `images.files` by hand — when `false`, purge still computes dimensions and generates PNGs, but never writes back to `config.cjs`.
- **Quality warning when a raster source is too small for its declared width.** Sources smaller than `width × 4` (the xxxhdpi/@4x requirement) trigger a non-blocking warning with exact numbers. SVGs are exempt (vector, no upscale penalty).
- **`config.cjs` syntax validator with formatted error block.** Type mismatches in known fields (currently `theme.fontFamily.*` and `theme.extend.fontFamily.*`) print a `Config Syntax Error` block with file, JSON path, context, issue, and a fix snippet — replacing cryptic downstream crashes like `rule.startsWith is not a function`. Validator runs at config load time in `getConfigFile()` and is wired into `auto-utilities-builder.js` so the formatted error survives module-import-time throws. Extend by adding entries to `FIELD_RULES` in `src/shared/validation/config-validator.js`.

### Changed
- **Debug logging inlines timing with section labels.** In `--debug` runs, `Purging utilities.tss styles… 0s 42ms` now renders as a single line instead of label + separate timing on the next line; non-debug output is unchanged. Driven by a new `''` mode on `localFinish` that prints timing-only when the caller already emitted the section label.

### Other
- `bin/purgetss` now prints the full stack trace under `PURGETSS_DEBUG=1` for unhandled command errors (no behavior change without the env var).
- Internal proposals added under `docs/`: error-reporting consolidation and JIT class resolution refactor (drafts, no functional impact).

## [7.10.2] - 2026-05-11

### Fixed
- **Legacy flat `brand:` config schema auto-migrates to the grouped layout.** Configs written before the 7cb5890 regroup used flat keys (`brand.padding: 15`, `brand.iosPadding`, `brand.bgColor`, `brand.darkBgColor`, top-level `brand.notification`/`brand.splash`) and crashed auto-purge with `TypeError: Cannot create property 'ios' on number '15'`. `getConfigFile()` now normalizes them in memory to the grouped schema (`brand.padding.{ios, androidLegacy, androidAdaptive}`, `brand.android.{notification, splash}`, `brand.ios.darkBackground`, `brand.colors.background`) before applying defaults. When both legacy and new keys coexist, the new key wins. A single deprecation warning prints per config path per session — useful when running `purgetss` standalone; Alloy auto-purge will keep working silently either way.
- **`logger.success` and `logger.warning` now exist.** ~30 callsites of `logger.warning` and ~10 of `logger.success` across `brand`, `images`, `cleanup-legacy`, and `svg-utils` referenced methods that were never defined on the logger object — only `warn`/`info`/`error`/`file`/`block`/`item` existed. Any opt-in command that hit one of those calls would throw `TypeError: logger.warning is not a function` (or `.success`). The auto-purge entry point that most users invoke does not reach those callsites, so the bug stayed latent until commands like `purgetss brand` or `purgetss images` were run. `success` emits in green via `chalk.green` and routes through `_emit()` so section-mode indentation works; `warning` is aliased by reference to `warn` so both names stay in sync if the impl ever changes.

## [7.10.1] - 2026-05-10

### Changed
- **User-visible "Tailwind" comparative references dropped from copy that did not document functional integration.** The Class Syntax Error block printed by `unsupported-class-reporter.js` now reports `'Square brackets "[ ]" are not supported'` instead of `'Tailwind-style brackets "[ ]" are not supported'`; the matching detector was renamed `detectTailwindBrackets` → `detectSquareBrackets` (single internal call site, no API impact); the v7.8.0 entry in `README.md` was updated to use `square brackets` to match. The promotional `<Label>` injected into new projects by `purgetss create` (`lib/templates/create/index.xml`) changed from `"Tailwind-inspired utility classes for Titanium/Alloy"` to `"Utility-first styling for Titanium/Alloy"`. Companion comment updated in `src/cli/commands/purge.js`. All functional references stay: the `tailwindcss@3` dependency installed by `install-dependencies` (drives both the `defaultColors`/`defaultTheme` palette base AND the VSCode IntelliSense extension), the `--tailwind` flag on `purgetss shades` (emits a `tailwind.config.js`-compatible color object), and the recommended `Tailwind CSS IntelliSense` / `Tailwind Raw Reorder (v4)` VSCode extensions.

## [7.10.0] - 2026-05-10

### Added
- **`--opacity <n>`, `--padding <n>`, and `--output <relpath>` flags for `purgetss images`.** Three CLI-only flags that fill specific gaps in the multi-density image pipeline without breaking its plural-output convention. `--opacity` is an integer `0-100` that multiplies the alpha channel of every generated density by `n/100` via a `dest-in` composite pass against a uniform-alpha tile (`sharp().ensureAlpha().composite([{ input: rawTile, blend: 'dest-in' }])`); applied to all 8 outputs (5 Android + 3 iPhone) so they inherit the same proportional transparency, validated against integer bounds, and skipped at `100` (no compositing pass) — primary use case is a semi-transparent placeholder for ImageView's `defaultImage` while remote images load. `--padding` is an integer `0-40` that shrinks the rendered image inside the same canvas by symmetric percentage borders: each density resizes the source to `(1 − 2p/100) × canvas` with `fit: 'inside'`, then `sharp.extend()` adds transparent borders so the final canvas size stays exactly equal to what the density would have produced without padding (preserves layout math); applied per-density so the visual ratio is identical across mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi and @1x/@2x/@3x. Combines naturally with `--opacity` for placeholders that need both reduced opacity and breathing room around an unpadded logo. `--output` overrides the basename + subpath relative to the per-platform `images/` root: when set, the orchestrator replaces the computed `relPath` with `outputRelpath + path.extname(source)` so downstream `path.parse` / `renameWithFormat` produce the user's basename in every density slot (`images/<relpath>.<ext>` for iPhone, `images/res-<density>/<relpath>.<ext>` for Android). Three guard rails enforce correct semantics for `--output`: extensions are stripped (so `--format` always decides the actual extension), absolute paths and `..` segments are rejected at the CLI handler (path stays inside the project), and a directory source combined with `--output` errors out (one basename can't apply to multiple files). All three flags are CLI-only — per-asset transformations like `--width`, not project-wide defaults — so no `images:` config keys were added. Resolves the friction case "I want my brand logo from `purgetss/brand/` regenerated as a transparent ImageView placeholder with breathing room under `images/logos/loading.png` at all densities" in a single command, without manual file copies, image-editor passes, or post-processing.
- **`MarketplaceArtworkFeature.png` (Google Play Feature Graphic) auto-generated by `purgetss brand`.** Every brand run now writes a 1024×500 banner to the project root alongside the existing `iTunesConnect.png` (1024²) and `MarketplaceArtwork.png` (512²) submission assets. The Feature Graphic is the artwork Google Play renders at the top of the store listing — previously, devs had to compose it manually in an image editor each time the brand evolved (a 2.05:1 aspect ratio has no obvious match among the square outputs `brand` was already producing). The generator (`src/core/branding/gen-feature-graphic.js`) places the master logo as a square block (side = `500 - 2 × verticalPadding`) centered both horizontally and vertically inside the rectangular canvas, scales it with `fit: 'inside'` so wide or tall logos preserve aspect ratio inside that square, and always flattens onto `brand.colors.background` (Google Play rejects transparency on Feature Graphics). Default vertical padding is **12%** (60 px top + 60 px bottom → 380×380 logo block on 1024×500), tuned to stay safe against the smaller crops Google renders on phones and tablets. Override paths: CLI `--feature-graphic-padding <n>` (range 0-40), config `brand.padding.featureGraphic` (`'12%'` string or `12` number, parsed by `parsePadding` like the other paddings). A dedicated logo source is opt-in via auto-discovery of `purgetss/brand/logo-feature.{svg,png}`, override config `brand.logos.featureGraphic`, or CLI `--feature-logo <path>`; when omitted, the master logo is reused so existing projects automatically get a sensible Feature Graphic without any new files. The default config injected by `ensureBrandSection` now lists `featureGraphic: '12%'` alongside the existing padding keys; pre-existing configs without that key fall through to the same 12% default in the resolver. Submission artwork only — like its `MarketplaceArtwork` sibling, the file is written to the project root for upload to the Play Console and is NOT bundled into the APK (Titanium SDK has zero references to either filename).
- **Arbitrary nesting depth in `config.cjs` theme objects.** Property emission across `processProperties`, `generateCombinedClasses`, `backgroundGradient`, and `backgroundSelectedGradient` now walks `theme` / `theme.extend` values recursively instead of stopping at the second level. Nested categories beyond 1–2 levels (e.g. `theme.extend.colors.brand.primary.500` or `theme.extend.backgroundGradient.brand.primary.warm`) flatten into kebab-case class suffixes (`brand-primary-500`, `brand-primary-warm`) instead of being silently dropped or producing malformed selectors. Default modifier keys (`default`, `global`, `DEFAULT`) collapse without contributing to the suffix, matching how `apply:` already handles them at the `theme.extend.X.default` level. Behavior for flat 1–2 level configs is unchanged.

### Fixed
- **`brand --padding <n>` shortcut now applies to BOTH Android paddings, as the help text always promised.** Pre-existing bug in the CLI flag resolver: the help text and docs both described `--padding` as a shortcut that "sets BOTH Android paddings to the same value", but `src/core/branding/brand-config.js` only fed `cliOptions.padding` into the `androidAdaptivePadding` fallback chain — `androidLegacyPadding` skipped the shortcut entirely and resolved to `padding.androidLegacy ?? 10`. Net effect: `purgetss brand --padding 17` actually produced `androidAdaptive=17, androidLegacy=10` (whatever the legacy default was), making the shortcut silently dishonest about half its scope. The fix adds `?? cliOptions.padding` to the `androidLegacyPadding` fallback chain (between the explicit `--android-legacy-padding` flag and the config value), so a single `--padding 15` now sets both Android paddings to 15% as documented. Adaptive-only and legacy-only behavior via `--android-adaptive-padding` / `--android-legacy-padding` is unchanged. iOS aesthetic padding and Feature Graphic vertical padding stay scoped to their own flags — `--padding` was always Android-only by design.
- **`apply:` now resolves default icon font classes from `dist/`.** When a custom rule in `config.cjs` referenced a built-in icon font class — `fas`, `fab`, `fa-times-circle`, `mi-*`, `ms-*`, `f7-*`, etc. — `compileApplyDirectives` only looked in `purgetss/styles/utilities.tss` and the user-built `purgetss/styles/fonts.tss`. Since most projects don't run `build-fonts` (the icon fonts ship with PurgeTSS and are auto-purged from `dist/*.tss` when used in XML), those classes were silently dropped from the generated rule — `apply: 'fas fa-times-circle wh-12 ...'` produced everything except the FontAwesome family and the icon glyph. The directive now falls back to `dist/fontawesome.tss`, `dist/materialicons.tss`, `dist/materialsymbols.tss`, and `dist/framework7icons.tss` after the existing lookups, with project-level `purgetss/styles/fontawesome.tss` for Pro/Beta taking precedence over the bundled default (matching `purgeFontAwesome` precedence). Icon classes now resolve in `apply:` exactly as they do in XML.
- **`borderRadius` arrays no longer get truncated when combined with other utilities in an `apply:` string.** `deduplicateLineProperties` (the post-merge step added in 7.9.0 that drops duplicate keys from the joined property string) tracked depth on `{}` only, so a value like `borderRadius: [0, 0, 0, 16]` (emitted by `rounded-bl-2xl` and the other directional `rounded-{t,b,l,r,tl,tr,bl,br}-*` utilities) was split on its internal commas. The first fragment kept the key but with a truncated value (`borderRadius: [0`), the rest were discarded as keyless, and the open bracket let the following properties leak inside the array — producing malformed output like `borderRadius: [0, color: '#ffffff', textColor: '#ffffff', right: 0, ... }`. The depth tracker now respects `[]` alongside `{}`, so arrays stay intact through deduplication. Only `apply:` rules combining a directional `rounded-*` utility with at least one other utility were affected.

## [7.9.0] - 2026-05-05

### Added
- **Auto-derived alpha keys for opacity modifier on semantic colors.** Writing `bg-surface/65` (or any other opacity modifier on a class that resolves to a semantic name) now produces a working rule instead of a warning or error. PurgeTSS detects that the underlying value is a semantic name from `semantic.colors.json`, derives a new key `<originalKey>_<alphaPercent>` with the original `light`/`dark` hex values and the requested alpha applied to both modes, writes the derived key back to `semantic.colors.json`, and emits the rule against it (e.g. `'.bg-surface/65': { backgroundColor: 'surfaceColor_65' }`). The Light/Dark switching that semantic colors give you is preserved end-to-end. Works from both direct XML usage (handled in `tailwind-purger.js`) and `apply:` strings inside `config.cjs` (handled in `compileApplyDirectives`). Idempotent: re-running build/purge reuses the existing key without duplicating; if a key with the same name exists with different values (e.g. a manual edit), the build halts with a `Conflict` error so user edits are not silently overwritten. Constraints match the existing opacity modifier — integer 0–100 alpha, base key must already exist in `semantic.colors.json`. The fail-safe warning/throw added earlier this release still fires when the base key is missing.

### Changed
- **`experimental/completions2.js` → `src/core/builders/auto-utilities-builder.js`.** The file that owns `autoBuildUtilitiesTSS` — the active production path that emits `utilities.tss` from `config.cjs` — was originally placed under `experimental/` while the v6→v7 ESM refactor was in flight, then promoted to production without the rename happening. Two practical hazards came from leaving it there: (1) the name "experimental" misled humans and AI agents into reading `src/core/builders/tailwind-helpers.js` as the source of truth (it isn't — `combineAllValues` and friends are dead code from an earlier draft), so bug fixes landed in the wrong file and silently no-op'd; (2) the duplicated Ti Element preset-merge block lived in both files, so a fix in one didn't apply to the other. The file is now under `src/core/builders/` next to `tailwind-builder.js` (its only consumer), with a name that matches its single export. Internal relative imports were re-anchored from `../src/shared/*` → `../../shared/*` and `../lib/*` → `../../../lib/*`; `__dirname`-based paths went from `'../dist/...'` → `'../../../dist/...'`. The two consumers (`src/core/builders/tailwind-builder.js`, `src/dev/builders/tailwind-builder.js`) and the `package.json` `files` array were updated to the new path. `experimental/leftOversOnly.json` was removed (no consumers) and the now-empty `experimental/` directory deleted.
- **User-facing glossary output path renamed: `purgetss/experimental/tailwind-classes/` → `purgetss/glossary/tailwind-classes/`.** When `--glossary` is passed and a project's `config.cjs` exists, `auto-utilities-builder.js` writes per-class debug TSS files under this path. The "experimental" label was the last echo of the v6→v7 ESM refactor (when the source file lived in `experimental/completions2.js`); now that the source has been promoted to `src/core/builders/auto-utilities-builder.js`, the user-facing path is aligned with the `--glossary` flag name and with the existing `purgetss/glossary/` baseline used elsewhere in the same file. **Breaking** for any tooling or CI that reads from the old path — no transition shim was added on purpose; users with such tooling should update the path on upgrade.

### Removed
- **Dead helpers in `src/core/builders/tailwind-helpers.js`: `combineAllValues`, `getBaseValues`, `removeFitMaxMin`.** Leftovers from the v6→v7 ESM refactor that were never on the production build path (active path is `autoBuildUtilitiesTSS` in `auto-utilities-builder.js`). The Ti Element preset-merge block that lived in `combineAllValues` was duplicated in `auto-utilities-builder.js`, and only the duplicate ever ran — which is exactly how the May 2026 preset-leak fix had to be re-applied in the active file after the first attempt no-op'd in the dead one. `combineKeys` is preserved (still actively used in `auto-utilities-builder.js`). Tautology asserts in `tests/unit/core/builders.test.js` were removed alongside.
- **Dead `resetStyles()` in `src/shared/helpers/core.js`.** Function was only referenced by tests; not on the active build path (the equivalent reset logic lives in `auto-utilities-builder.js` via the preset-merge block). `globalOptions` is preserved (read/written by `auto-utilities-builder.js`). Tautology asserts in `tests/unit/shared/helpers.test.js` and `tests/unit/shared/test-helpers-modules.js` were removed alongside.
- **Orphan wrapper `src/dev/builders/tailwind-builder.js`.** Zero consumers anywhere in `src/`, `bin/`, `lib/`, or `tests/`. The production build uses `src/core/builders/tailwind-builder.js` (`buildTailwindBasedOnConfigOptions`); the deleted file exported a separate `buildTailwind()` shim that nothing imported.

### Fixed
- **`semantic` tonal palette: Light/Dark mapping was inverted.** `buildSemanticPalette` was assigning the mirrored hex to `light` and the original hex to `dark`, so generated tonal palettes rendered the dark-mode color in light mode and vice-versa. The two values are now in their natural slots (`light = shade.hexcode`, `dark = mirror.hexcode`).
- **Opacity modifier on semantic colors no longer crashes or silently disappears.** Applying `/N` to a class whose generated TSS uses a semantic name (e.g. `bg-surface/65`) used to either crash `apply` directives with `Cannot read properties of null (reading 'pop')` or be dropped without any feedback in direct XML usage:
  - `tailwind-purger.js` (direct usage in XML) now skips the opacity blend and prints a yellow warning naming the offending class plus three concrete next steps — switch to a built-in color, use an arbitrary `bg-(#AARRGGBB)` value, or generate the alpha variant via `purgetss semantic --single ... --alpha N`.
  - `compileApplyDirectives` (opacity inside an `apply:` string in `config.cjs`) now throws a descriptive `Error` with the same three suggestions instead of dereferencing a null regex match.
- **Background gradient color order was position-dependent and could swap `from`/`to` after `sort()`.** `fixDuplicateKeys` assumed `backgroundGradientObject[0]` was always the `from-X` entry (2 colors) and `[1]` the `to-X` entry (1 color), but the upstream `sort()` reorders by string content, so for some color name pairs the slots swapped and the produced `backgroundGradient: { colors: [...] }` came out reversed. The two entries are now identified by array length (the 2-element one is `from`, the 1-element one is `to`) instead of by index. The `compileApplyDirectives` merge call is also now wrapped in a `try/catch` that names the offending parent class and its child classes when an unsupported combination (e.g. `bg-gradient-to-X` + `from-X to-Y` in the same apply) bubbles up from `fixDuplicateKeys`, instead of an unattributed `TypeError`.
- **`theme.Window` / `theme.View` / `theme.ImageView` no longer leak framework presets when defined at the top level (replace mode).** PurgeTSS unconditionally merged the framework defaults (`Window` → `backgroundColor: '#FFFFFF'`, `View` → `width/height: Ti.UI.SIZE`, `ImageView` → `ios: { hires: true }`) into the user's Ti Element config, regardless of whether the user wrote them under `theme.X` (replace) or `theme.extend.X` (extend). This violated the Tailwind convention these keys mirror — a Window declared at `theme.Window` to fully customize its styling still got the white `backgroundColor` re-injected, which then surfaced as a ghost property in `app.tss` (e.g. covering up an apply-supplied `backgroundGradient`). The merge now tracks `userReplaced[comp]` BEFORE folding `extend` into `theme` and skips the preset injection when the element was defined at the replace level. `theme.extend.Window` continues to merge with the defaults as before. Applied symmetrically in both code paths that perform this merge: `src/core/builders/tailwind-helpers.js` and `experimental/completions2.js`.
- **Gradient direction (`bg-gradient-to-X`) was silently dropped when combined with gradient colors (`from-X to-Y`) in the same `apply` string.** `fixDuplicateKeys` only routed entries to the gradient-merge bucket when their inner content started with `colors:`. The `bg-gradient-to-X` classes generate `backgroundGradient: { type: 'linear', backfillStart: true, startPoint: ..., endPoint: ... }` (no `colors:` yet), so they fell through to `cleanedStyles` as a sibling property — which was then overwritten in the emitted JS object literal by the merged `backgroundGradient: { colors: [...] }`. End result: `apply: 'bg-gradient-to-b from-X to-Y'` produced `backgroundGradient: { colors: [...] }` only, with the direction lost. The filter is now `value.includes('backgroundGradient:')` (any gradient entry), and an inner `startsWith('colors')` check splits the matches into a colors bucket and a direction bucket. Both are folded into a single `backgroundGradient: { ...direction..., colors: [...] }` at emit time, so direction and colors coexist in one object. The fix is shape-agnostic: future gradient sub-properties (`startRadius`, `endRadius`, `backfillEnd`, etc.) are merged the same way without further changes. Removes the previous workaround of declaring `backgroundGradient: { type, startPoint, endPoint, colors }` as a sibling property of `apply` in `config.cjs`.

## [7.8.0] - 2026-04-28

### Added
- **`--width <n>` flag for `images`.** Pins Android `mdpi` (= iPhone `@1x`) to a specific width in pixels; the larger scales derive deterministically as ×1.5, ×2, ×3, ×4, with height staying proportional to the source's aspect ratio. Recommended for SVG sources from vector editors with disproportionate viewBoxes (e.g. an Affinity Designer export with a 29559×13542 viewBox), where the legacy 4× master convention produces unpredictable output sizes. When the source is an SVG and `--width` is omitted, the command now prints a one-time hint pointing at the new flag — no abort, the legacy behavior still runs. Validated to integers in `[1, 8192]`; out-of-range or non-integer values exit with `Invalid --width '...'`. CLI-only by design — there is no matching `images:` config property because the right width is per-asset, not a project-wide default.
- **Class syntax pre-validation.** `purgetss` now scans every class name pulled from XML views and JS controllers for known authoring mistakes BEFORE running the purge. When it spots one it halts with a structured `Class Syntax Error` block — file, line, the offending line content, and a concrete `Fix:` suggestion — mirroring the existing `XML Syntax Error` block emitted by `preValidateXML`. If multiple offenders exist, all of them are reported in a single run so the dev can fix them in one pass instead of re-running per error. Five patterns are detected today:
  - **Inverted negative sign** — `top-(-10)` → `-top-(10)`. PurgeTSS expects the `-` prefix BEFORE the rule, not inside the value.
  - **Tailwind-style brackets** — `top-[10px]` → `top-(10px)`. PurgeTSS uses parentheses for arbitrary values.
  - **Empty parentheses** — `wh-()` → add a value, e.g. `wh-(10)`.
  - **Whitespace inside parentheses** — `wh-( 200 )` → `wh-(200)`.
  - **Redundant `px` unit** — `top-(10px)` → `top-(10)`. PurgeTSS treats unit-less arbitrary values as pixels.

  Generic unknown classes (typos, custom utilities not yet declared, vendor classes not enabled in `config.cjs`) are intentionally NOT flagged by this validator — they continue to flow silently into the `// Unused or unsupported classes` comment block in `app.tss` exactly as before. The validator is reserved for narrowly defined, actionable mistakes; it does not add noise to projects with in-progress class names.

### Fixed
- **`utilities.tss file created!` no longer breaks the grouped console output.** When `config.cjs` is touched and PurgeTSS rebuilds `utilities.tss`, the "file created!" line used to print its own `::PurgeTSS::` header in the middle of the section instead of indenting as a continuation line. The cause was a stray local `logger` definition in `experimental/completions2.js` that bypassed the shared section-mode logger. The local logger was removed in favor of `src/shared/logger.js`, so all rebuild-related output now stays under a single `::PurgeTSS:: Purging …` header alongside the rest of the per-step lines.
- **Arbitrary-value parser no longer crashes on negative values inside parentheses.** Classes like `top-(-10)`, `mt-(-5)`, `rotate-(-45)`, or `origin-(-10,-20)` previously triggered an unhandled `Cannot read properties of null (reading 'pop')` exception in `formatArbitraryValues` because the parser split the class name by hyphen — and a hyphen inside the value broke the split. The parser was rewritten to extract the `(...)` portion first via an anchored regex and only then split the rule prefix, so the value can contain any characters (including a leading `-`) without affecting rule detection. As a side effect, classes with empty values (`wh-()`) or unbalanced parentheses (`wh-(`) now return a "not yet supported" comment instead of producing invalid TSS — and any class that matches the new validator's patterns is caught at the pre-validation step instead of leaking through.

## [7.7.0] - 2026-04-25

### Added
- **Separate Android logo inputs for `brand`.** You can now keep one master logo for iOS, marketplace artwork, and general branding, while using a different source for Android launcher icons or the Android 12+ splash icon:
  - `brand.logos.androidLauncher` or `--icon-logo <path>` for Android launcher icons
  - `brand.logos.androidSplash` or `--splash-logo <path>` for `splash_icon.png`
  - auto-discovery from `purgetss/brand/logo-icon.{svg,png}` and `purgetss/brand/logo-splash.{svg,png}`

  This covers the common case where a horizontal wordmark looks fine in `DefaultIcon.png` but feels cramped once Android turns it into an adaptive launcher icon.
- **Legacy Android splash fallback generation.** `purgetss brand` now regenerates `app/assets/android/default.png` (Alloy) or `Resources/android/default.png` (Classic) as a fallback splash asset for older Titanium Android paths.
- **Aspect-ratio warning for launcher sources.** When the logo used for Android launcher assets is too wide or too tall, `brand` now prints a warning that explains why the result may look awkward on Android launchers and splash screens.

### Changed
- **`brand` config was reorganized before it had time to settle into the wrong shape.** The command now uses grouped sections:
  - `brand.logos.*`
  - `brand.padding.*`
  - `brand.android.*`
  - `brand.ios.*`
  - `brand.colors.*`
- **Android adaptive and legacy padding are now separate settings.**
  - `brand.padding.androidAdaptive` controls adaptive icons
  - `brand.padding.androidLegacy` controls legacy `ic_launcher.png`
  - `--padding` remains as a CLI shortcut when you want both Android paddings to match for a single run
- **`brand --help` and post-run notes are clearer about Android behavior.** The command now distinguishes:
  - Android launcher icons (`ic_launcher*`)
  - Android 12+ `splash_icon.png`
  - Android legacy `default.png`

  The notes also explain that `splash_icon.png` is only generated by PurgeTSS. Titanium still needs a custom Android splash theme if you want the system splash to use it instead of `ic_launcher`.
- **Config templates and auto-injected `brand:` blocks now use the grouped structure.** New projects and older projects that get backfilled on first run now see the new layout directly in `purgetss/config.cjs`.

### Fixed
- **`cleanup-legacy` no longer removes `app/assets/android/default.png`.** That file can still matter for legacy Titanium Android splash behavior, so treating it as safe to delete was too aggressive.
- **`brand` no longer leaves a documentation gap between modern Android and legacy Android.** The generated assets and the docs now line up with what the command actually covers.

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
