<p align="center">
  <img src="https://codigomovil.mx/images/logotipo-purgetss-gris.svg" height="230" width="230" alt="PurgeCSS logo"/>
</p>

<div align="center">

![npm](https://img.shields.io/npm/dm/purgetss)
![npm](https://img.shields.io/npm/v/purgetss)
![NPM](https://img.shields.io/npm/l/purgetss)

</div>

**PurgeTSS** is a toolkit for building mobile apps with the [Titanium framework](https://titaniumsdk.com). It includes utility classes, icon fonts, an animation module and a grid system. Use its color commands to generate tonal palettes (`shades`) or Light/Dark mode semantic colors (`semantic`).

---

- 23,400+ utility classes for styling Titanium views
- Parses XML files to generate a clean `app.tss` with only the classes your project uses
- Customizable defaults via `config.cjs`, with JIT classes for arbitrary values
- `brand` generates Titanium icons, store artwork and splash assets for the iOS/Android deployment targets in `tiapp.xml`. It works as a standalone command in Alloy or Classic; use `--only` to select a specific piece or platform
- Icon font support: Font Awesome, Material Icons, Material Symbols, Framework7-Icons in Alloy and Classic projects
- `build-fonts` installs custom fonts in Alloy or Classic; `--module` exports every processed PostScript family, while TSS class definitions remain Alloy-only
- `shades` command generates color shades from any hex color
- `semantic` generates Titanium semantic colors for Light/Dark mode: tonal palettes with mirror inversion, or single purpose-based colors with optional alpha
- Animation module for 2D matrix animations on views or arrays of views
- Grid system for aligning and distributing elements within views

---

## Alloy and Classic compatibility

Utility classes and the purge/build lifecycle require Alloy. Classic apps can use the asset and module commands without an `alloy.jmk` hook or a compile-time dependency on PurgeTSS.

When Alloy auto-purging fails, the build log forwards PurgeTSS diagnostics before Alloy's generic compiler error. It also tells you to run `purgetss` from the project root when you need the full cause.

| Command | Alloy | Classic | Classic behavior |
| --- | :---: | :---: | --- |
| `brand` | ✅ | ✅ | Writes only assets for platforms enabled in `tiapp.xml`; `--only` is an explicit override. |
| `images` | ✅ | ✅ | Writes to `Resources/{android,iphone}/images/` and follows `tiapp.xml` unless `--android` or `--ios` is passed. An external source does not create `purgetss/`. |
| `semantic` | ✅ | ✅ | Writes only `Resources/semantic.colors.json`; it does not create `config.cjs`, utility mappings, or TSS. |
| `shades` | ✅ | ✅ | Console modes work anywhere. Saving a palette creates/updates `purgetss/config.cjs`. |
| `color-module` | ✅ | ✅ | Writes `purgetss.colors.js` to `app/lib/` or `Resources/lib/`; Classic creates no unrelated empty source folders. |
| `module` | ✅ | ✅ | Writes `purgetss.ui.js` to the project-specific `lib` folder. |
| `icon-library` | ✅ | ✅ | Fonts go to `Resources/fonts/`; `--module` uses `Resources/lib/`; `--styles` is skipped because TSS is Alloy-only. |
| `build-fonts` | ✅ | ✅ | Fonts go to `Resources/fonts/`; `--module` exports every family through `Resources/lib/purgetss.fonts.js`; no TSS or definitions file is generated. |
| `purgetss`, `--all`, `init`, `create`, `install-dependencies`, `build`, `watch` | ✅ | — | Alloy/PurgeTSS lifecycle only. |
| `update`, `sudo-update` | ✅ | ✅ | Global CLI maintenance; no project layout required. |

The generated CommonJS modules and assets are ordinary Titanium files that Classic apps load directly from `Resources/`. Commands use source folders under `purgetss/` as development inputs.

In Classic, saving with `shades` creates or updates only `purgetss/config.cjs`. Running `color-module` reads `theme.colors` and `theme.extend.colors`, then writes `Resources/lib/purgetss.colors.js`; neither command scaffolds empty `purgetss/brand/`, `purgetss/fonts/`, or `purgetss/images/` folders.

Official icon modules expose Unicode values in `icons` and their Titanium font families in `families`. In Classic, load Font Awesome with `require('lib/fontawesome')`, then combine a lookup such as `fontAwesome.icons.home` with `fontAwesome.solid`, `fontAwesome.regular`, or `fontAwesome.brands`.

---

## Animation module (`purgetss.ui.js`)

Install with `purgetss module` (or `purgetss m`). This places `purgetss.ui.js` in your project's `lib` folder.

### Declaring an Animation object

```xml
<Animation id="myAnimation" module="purgetss.ui" class="opacity-0 duration-300 ease-in" />
```

You can use any position, size, color, opacity, or transformation class from `utilities.tss`.

### Available methods

| Method                                    | Description                                                                                                                                                                                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `play(views, cb)` / `toggle(views, cb)`   | Animate views from current state to the animation state. Toggles `open`/`close` on each call.                                                                                                                                                   |
| `open(views, cb)`                         | Explicitly run the `open` state animation.                                                                                                                                                                                                      |
| `close(views, cb)`                        | Explicitly run the `close` state animation.                                                                                                                                                                                                     |
| `apply(views, cb)`                        | Apply properties instantly without animation.                                                                                                                                                                                                   |
| `draggable(views)`                        | Make a view or array of views draggable inside their parent.                                                                                                                                                                                    |
| `undraggable(views)`                      | Remove draggable behavior and clean up all listeners.                                                                                                                                                                                           |
| `detectCollisions(views, dragCB, dropCB)` | Enable collision detection on draggable views with hover and drop callbacks.                                                                                                                                                                    |
| `swap(view1, view2)`                      | Animate two views exchanging positions. Auto-normalizes position from margins/right/center via `view.rect`. Inherits `duration`, `delay`, `curve`; fallback: 200ms.                                                                             |
| `sequence(views, cb)`                     | Animate views one after another. Callback fires after the last view.                                                                                                                                                                            |
| `shake(view, intensity)`                  | Bidirectional shake animation for error feedback. Inherits `duration`, `delay`; fallback: 400ms. Default intensity: 10px.                                                                                                                       |
| `pulse(view, count)`                      | Scale-up-and-back pulse animation. Scale from Animation object (default 1.2x). Count: number of pulses (default 1).                                                                                                                             |
| `snapTo(view, targets)`                   | Snap a view to the nearest target by center distance. Auto-normalizes target position. Inherits `duration`, `delay`, `curve`; fallback: 200ms.                                                                                                  |
| `reorder(views, newOrder)`                | Animate views to new positions based on index mapping. Auto-normalizes positions. Inherits `duration`, `delay`, `curve`; fallback: 200ms.                                                                                                       |
| `transition(views, layouts)`              | Multi-view layout transitions using `Matrix2D.translate().rotate().scale()`. Layout properties: `translation`, `rotate`, `scale`, `zIndex`. Compatible with TiDesigner presets. Views without a layout entry fade out; returning views fade in. |

### Callback event object

All callbacks (`play`, `open`, `close`, `apply`) receive an event object with these fields:

```js
{
  type: String,         // event type ('complete' or 'applied')
  bubbles: Boolean,
  cancelBubble: Boolean,
  action: String,       // 'play' or 'apply'
  state: String,        // 'open' or 'close'
  id: String,           // Animation object ID
  targetId: String,     // ID of the animated view
  index: Number,        // position in array (0-based)
  total: Number,        // total views in array
  getTarget: Function   // returns the animated view object
}
```

When animating an array of views, the callback runs once per view with its `index` and the array's `total` count.

```js
$.myAnimation.play([$.card1, $.card2, $.card3], (e) => {
  console.log(`Animated ${e.index + 1} of ${e.total}`) // "Animated 1 of 3", etc.
  if (e.index === e.total - 1) {
    console.log('All done!')
  }
})
```

### Multi-state animations

Use `open`, `close`, and `complete` modifiers inside `animationProperties` to define different states:

```xml
<Animation id="fadeToggle" module="purgetss.ui" class="duration-300"
  animationProperties="{
    open: { opacity: 1 },
    close: { opacity: 0 }
  }"
/>
```

### Draggable views

```js
$.myAnimation.draggable($.myView)
// or with constraints:
$.myAnimation.draggable([$.card1, $.card2])
```

Use `bounds` to restrict movement, and `drag`/`drop` modifiers for drag-state animations. Use `vertical-constraint` or `horizontal-constraint` classes to limit the drag axis.

### Collision detection

After calling `draggable()`, you can enable collision detection to know when a dragged view overlaps another:

```js
$.myAnimation.draggable(views)
$.myAnimation.detectCollisions(views, onHover, onDrop)
```

`dragCB(source, target)` is called during drag:
- `target` is the view under the drag center, or `null` when leaving all targets
- Use this to show visual feedback (highlights, borders, scaling)

`dropCB(source, target)` is called on drop:
- `target` is the view where the source was released
- If no target is found, the source automatically snaps back to its original position with a 200ms animation

### Swap animation

Animate two views exchanging positions:

```js
$.myAnimation.swap(view1, view2)
```

- Inherits `duration`, `delay`, and `curve` from the Animation object's classes
- Falls back to 200ms duration, 0ms delay, and ease-in-out curve if not set
- Handles iOS transform reset automatically
- Temporarily raises z-index so views animate above siblings
- Updates internal `_originLeft`/`_originTop` for subsequent drag operations

### Sequence animation

Animate views one after another (unlike `play(array)` which runs them in parallel):

```js
$.fadeIn.sequence([$.title, $.subtitle, $.button], () => {
  console.log('All views animated')
})
```

- Each view finishes animating before the next starts
- Callback fires once after the last view
- Respects `open`/`close` state (set once for the entire sequence)

### Shake animation

Quick horizontal shake for error feedback, using native `autoreverse` + `repeat` for smooth performance:

```js
$.myAnimation.shake($.loginButton)        // default intensity: 10px
$.myAnimation.shake($.input, 6)           // subtle: 6px
$.myAnimation.shake($.errorLabel, 20)     // strong: 20px
```

### Snap to nearest target

After dragging, snap a view to the closest target by center-to-center distance:

```js
const matched = $.myAnimation.snapTo(draggedView, slotViews)
if (matched) {
  console.log('Snapped to:', matched.id)
}
```

### Reorder animation

Animate an array of views to new positions based on index mapping:

```js
// Reverse order: view[0] goes to position of view[2], view[2] to position of view[0]
$.myAnimation.reorder(cardViews, [2, 1, 0])
```

- All views animate simultaneously
- Captures positions before animating to avoid conflicts

### Removing draggable behavior

Remove draggable behavior and clean up all event listeners:

```js
$.myAnimation.undraggable(cardViews)
```

### Property inheritance

The `swap`, `reorder`, `snapTo`, and `shake` methods inherit animation properties from the `<Animation>` object's classes. Configure them in XML:

```xml
<Animation id="myAnim" module="purgetss.ui" class="curve-animation-ease-out delay-100 duration-150" />
```

| Property      | `play`/`toggle`/`open`/`close`/`sequence` | `swap`/`reorder`/`snapTo` |       `shake`       |
| ------------- | :---------------------------------------: | :-----------------------: | :-----------------: |
| `duration`    |                     ✅                     |             ✅             |       ✅ (÷6)        |
| `delay`       |                     ✅                     |             ✅             |          ✅          |
| `curve`       |                     ✅                     |             ✅             | fixed `EASE_IN_OUT` |
| `autoreverse` |                     ✅                     |             —             |    fixed `true`     |
| `repeat`      |                     ✅                     |             —             |      fixed `3`      |

If no duration is set, `swap`/`reorder`/`snapTo` default to 200ms and `shake` defaults to 400ms. Set animation timing through the `<Animation>` object's classes.

- Removes touch and orientation listeners
- Removes views from collision detection registry
- Cleans up internal tracking properties

### Utility classes for animations

| Class pattern                                       | Description                   |
| --------------------------------------------------- | ----------------------------- |
| `duration-{n}`                                      | Animation duration in ms      |
| `delay-{n}`                                         | Delay before animation starts |
| `rotate-{n}`                                        | 2D rotation in degrees        |
| `scale-{n}`                                         | Scale factor                  |
| `repeat-{n}`                                        | Number of repeats             |
| `ease-in`, `ease-out`, `ease-linear`, `ease-in-out` | Timing curve                  |
| `zoom-in-{n}`, `zoom-out-{n}`                       | Zoom animations               |
| `drag-apply`, `drag-animate`                        | Drag interaction style        |
| `vertical-constraint`, `horizontal-constraint`      | Constrain drag axis           |

### Utility functions

| Function                               | Description                                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `deviceInfo()`                         | Logs detailed platform and display information to the console. Works in both Alloy and Classic projects. |
| `saveComponent({ source, directory })` | Saves a view snapshot as PNG to the photo gallery.                                                       |

See the full documentation at [purgetss.com/docs/animation-module/introduction](https://purgetss.com/docs/animation-module/introduction).

### Appearance management

Switch between Light, Dark, and System modes with automatic persistence:

```js
const { Appearance } = require('purgetss.ui')

// Call once at app startup (e.g., in index.js before opening the first window)
Appearance.init()
```

| Method      | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `init()`    | Restore the saved mode from `Ti.App.Properties`              |
| `get()`     | Returns the current mode string                              |
| `set(mode)` | Apply and persist a mode: `'system'`, `'light'`, or `'dark'` |
| `toggle()`  | Switch between `'light'` and `'dark'`                        |

Use it from any controller to respond to user actions:

```js
const { Appearance } = require('purgetss.ui')

function selectDark() { Appearance.set('dark') }
function selectLight() { Appearance.set('light') }
function selectSystem() { Appearance.set('system') }
```

Requires `semantic.colors.json` in `app/assets/` (Alloy) or `Resources/` (Classic) for views to respond to mode changes. Generate it with the `semantic` command instead of writing it by hand:

```bash
# Tonal palette (11 shades with mirror-by-index Light/Dark inversion)
purgetss semantic '#15803d' amazon

# Purpose-based single colors (auto-mapped in Alloy; native JSON only in Classic)
purgetss semantic --single '#F9FAFB' surfaceColor --dark '#0f172a'
purgetss semantic --single '#111827' textColor    --dark '#f1f5f9'
purgetss semantic --single '#000000' overlayColor --alpha 50
```

See the [Semantic Colors guide](https://purgetss.com/docs/best-practices/semantic-colors) for the full workflow.

### Default font families

PurgeTSS generates `font-sans`, `font-serif`, and `font-mono` classes automatically with platform-appropriate values:

| Class        | iOS              | Android      |
| ------------ | ---------------- | ------------ |
| `font-sans`  | `Helvetica Neue` | `sans-serif` |
| `font-serif` | `Georgia`        | `serif`      |
| `font-mono`  | `monospace`      | `monospace`  |

Override or add families in `config.cjs`:

```js
// theme.extend.fontFamily → adds to defaults
extend: {
  fontFamily: {
    display: 'AlfaSlabOne-Regular',
    body: 'BarlowSemiCondensed-Regular'
  }
}

// theme.fontFamily → replaces defaults entirely
theme: {
  fontFamily: {
    sans: 'System',
    mono: 'Courier',
    display: 'AlfaSlabOne-Regular'
  }
}
```

---

## Customizing default components

PurgeTSS sets defaults for three components:

| Component   | Default                                 |
| ----------- | --------------------------------------- |
| `Window`    | `backgroundColor: '#FFFFFF'`            |
| `View`      | `width: Ti.UI.SIZE, height: Ti.UI.SIZE` |
| `ImageView` | `hires: true` (iOS only)                |

Override or extend them in `config.cjs` with `theme.extend`:

```js
module.exports = {
  theme: {
    extend: {
      Window: {
        apply: 'exit-on-close-false bg-surface'
      }
    }
  }
}
```

If an applied class sets a property that already exists in the defaults (e.g., `bg-surface` vs `backgroundColor: '#FFFFFF'`), the applied value wins. Array-type properties like `extendEdges` and `orientationModes` use bracket notation (`[ ]`) in the generated output.

### Shorthand and explicit forms

Both are equivalent:

```js
// Shorthand
Window: { apply: 'exit-on-close-false' }

// Explicit
Window: { default: { apply: 'exit-on-close-false' } }
```

Use the explicit form when you need platform-specific variants:

```js
Button: {
  default: { apply: 'text-xl' },
  ios: { apply: 'font-bold' },
  android: { apply: 'text-2xl font-semibold', color: 'red' }
}
```

---

The official documentation is at [purgetss.com](https://purgetss.com).

## Maintaining the bundled Font Awesome Free fonts

This workflow is for contributors building PurgeTSS itself, not for Titanium app projects. App projects receive the bundled fonts through `purgetss icon-library --vendor=fa`.

1. Update/install `@fortawesome/fontawesome-free` in this repository. The npm package supplies the CSS used to generate icon classes; its webfonts do not supply the desktop OTFs used here.
2. Download the matching Font Awesome Free desktop fonts and replace the previous set in `src/fonts/` with the Solid, Regular and Brands OTFs. Keep exactly one of each face. Filenames need not contain a fixed major version; the build reads their internal PostScript names.
3. Run `npm run build:fa`, `npm run build:fa-js` and `npm run build:fonts`, or the normal full distribution build when preparing a release.

The generators validate that all three fonts match the **installed** npm package version before writing their Free outputs. Missing faces, duplicate faces, unknown versions and mismatches stop those builders with an error. TSS families, JavaScript aliases and copied font filenames come from the OTF metadata. Both Free header templates receive the installed package version automatically, so do not update their version text manually. As before, distributed font copies use `.ttf` filenames; the OTF bytes are copied without format conversion. The font-folder builder removes only obsolete generated Free font filenames when the family names change.

## Maintaining other bundled icon libraries

The Framework7 TSS and JavaScript header version comes from the installed `framework7-icons/package.json`. Update that dependency and run its builders; do not edit the header templates manually.

Material Icons and Material Symbols continue to generate classes from the `.codepoints` files in `lib/templates/materialicons/` and `lib/templates/materialsymbols/`. Keep each codepoint file and its corresponding desktop font in `assets/fonts/` from the same upstream revision when updating them manually. Their TSS and JavaScript headers list the version metadata of each bundled font variant, including timestamp-shaped values when that is what the font contains. The codepoint files have no package release version, so the headers do not claim one. They no longer contain a manually maintained update date. Header metadata alone does not verify that a font and its codepoints correspond.

Run `build:framework7` / `build:framework7-js`, `build:material` / `build:material-js`, or `build:symbols` / `build:symbols-js` after updating the relevant inputs. The full distribution build also runs these stages. Missing package versions or missing/unreadable font version metadata stop the affected builders; they do not guess a version or use the current date. The class-generation inputs and public family aliases are unchanged.

## Unreleased generator corrections

The source checkout after 7.20.0 uses SDK Completions regenerated through the corrected v3 extractor, retaining all recovered descriptions. Utility generation reads `readOnly: true` and excludes those properties rather than relying on a new list of SDK state names. A name shared by writable and read-only types stays eligible, so check the owning SDK type before assigning it. Generated Completions are refreshed through the extractor, not hand-edited. SplitWindow ratios use numeric fractions (`primary-col-w-fraction-1/2` sets `0.5`); minimum/maximum column widths use numeric points, and these classes carry iOS conditions. Custom ratio values must be finite Numbers from 0 to 1; column bounds must be finite nonnegative Numbers.

Pro/Beta icon generation resolves font families from installed TTF PostScript names for TSS, module aliases and copied filenames, including the alternate Pro installation path. The arbitrary-value formatter rejects `top-(-10)`; use `-top-(10)`. These corrections are not included in the published 7.20.0 package yet. Dependency major-version updates remain separate work.

## Requirements

- Titanium SDK (Compatible with all versions; 14.0.0.GA recommended for full property support)
- Alloy Framework (for most commands)
- Node.js 20.12+ (20.x), 22.13+ (22.x), or 23.5+ (required by the CLI dependencies; the supported range is `^20.12.0 || ^22.13.0 || >=23.5.0`)

## Recent changes

### v7.20.0

- Update Titanium Completions to SDK 14.0.0.GA: 63 new property entries and 356 recovered property descriptions.
- Regenerate utility classes and the glossary, including 18 new property pages for boolean, color, split-view and layout settings.

### v7.19.0

- Global `--profile <file.json>` saves timings, CPU, memory, phases and counters for commands, aliases and `--all`, including controlled failures and LiveView skips.
- Purges reuse XML/controller analysis within each run. Class and `apply` lookups use indexes, commands load on demand, and font/image generators reuse inputs while preserving output contracts and image quality. See the [measured results](#measured-optimization-results).
- Configuration is evaluated per invocation. Generator signatures detect changes within the same second, and logs distinguish created, updated and unchanged files. The two-second LiveView guard and completed `app.tss` writes remain intact.
- Supported Node versions are `^20.12.0 || ^22.13.0 || >=23.5.0`. Compatible dependency fixes include Sharp 0.35.5; test runners now propagate failures.

### v7.18.0

- Platform and device modifiers stack. `ios:tablet:bg-red-500` (in either order) now generates `[platform=ios formFactor=tablet]`. Alloy reads only the last bracket of a selector, so `tablet:` on an iOS-only class used to lose its platform condition. A modifier that contradicts the class, such as `android:status-bar-dark`, now leaves a comment in `app.tss` instead of a selector that never applies.
- Font Awesome Pro and Beta work again. `purgetss build` no longer stops with `ENOENT`, and `icon-library --module` / `--styles` generate `fontawesome.js` and `fontawesome.tss` instead of printing a placeholder.
- `icon-library --vendor` accepts `materialsymbols` and rejects unknown values before copying anything. `images --width` accepts 1 to 1024, the largest value whose `xxxhdpi` output fits the 4096px cap.
- Removed: the `*-keyboard-type-appearance*` classes (they assigned an appearance constant to `keyboardType`; use `keyboard-appearance-*`), `snap-magnet` (never read by the animation module), and `init --all` (never implemented). `(Npx)` arbitrary values are accepted again: `w-(100px)` means explicit pixels, not a redundant unit.

See the full release notes in [CHANGELOG.md](./CHANGELOG.md).

## The 4× source convention

Both `purgetss images` and `purgetss brand` treat each source file as the xxxhdpi/@4x master. The file's pixel dimensions define the largest density; smaller densities use 1/4, 1.5/4, 2/4 and 3/4 of that size. A 256 px PNG produces a 64 px `@1x/mdpi`. For 64 dp at `@1x`, use a 256 px source.

Override per file via `images.files` in `config.cjs` (or, for `brand`, the `padding` key of the piece you want to reframe: `brand.adaptive.padding`, `brand.icon.padding`, …). The convention is the default fallback; entries override it on a per-file basis. CLI flags like `--width` always win over both.

## Table of contents

- [Installation](https://purgetss.com/docs/installation)
- [Commands](https://purgetss.com/docs/commands)
- App Assets
  - [App icons and branding](https://purgetss.com/docs/app-assets/app-icons-and-branding)
  - [Multi-density images](https://purgetss.com/docs/app-assets/multi-density-images)
- Customization
  - [The Config File](https://purgetss.com/docs/customization/the-config-file)
  - [Custom Rules](https://purgetss.com/docs/customization/custom-rules)
  - [The `apply` Directive](https://purgetss.com/docs/customization/the-apply-directive)
  - [The `opacity` Modifier](https://purgetss.com/docs/customization/the-opacity-modifier)
  - [Arbitrary Values](https://purgetss.com/docs/customization/arbitrary-values)
  - [Platform and Device Modifiers](https://purgetss.com/docs/customization/platform-and-device-modifiers)
  - [Icon Fonts Libraries](https://purgetss.com/docs/customization/icon-fonts-libraries)
- The UI Module
  - [Introduction](https://purgetss.com/docs/purgetss-ui/introduction)
  - [The `play` Method](https://purgetss.com/docs/purgetss-ui/the-play-method)
  - [The `apply` Method](https://purgetss.com/docs/purgetss-ui/the-apply-method)
  - [The `open` and `close` Methods](https://purgetss.com/docs/purgetss-ui/the-open-and-close-methods)
  - [The `draggable` Method](https://purgetss.com/docs/purgetss-ui/the-draggable-method)
  - [Complex UI Elements](https://purgetss.com/docs/purgetss-ui/complex-ui-elements)
  - [Additional Methods](https://purgetss.com/docs/purgetss-ui/additional-methods)
  - [Available Utilities](https://purgetss.com/docs/purgetss-ui/available-utilities)
  - [Implementation Rules](https://purgetss.com/docs/purgetss-ui/implementation-rules)
  - [Appearance](https://purgetss.com/docs/purgetss-ui/appearance)
- Best Practices
  - [Appearance Setup](https://purgetss.com/docs/best-practices/appearance-setup)
  - [Semantic Colors](https://purgetss.com/docs/best-practices/semantic-colors)
  - [Large Titles on iOS](https://purgetss.com/docs/best-practices/large-titles-on-ios)
- [Grid System](https://purgetss.com/docs/grid-system)


## Execution profiles and incremental generation

Add `--profile <file.json>` to any command or alias to save execution metrics as JSON:

```sh
purgetss --profile purge-profile.json
purgetss build --profile build-profile.json
purgetss bf --module --profile fonts-profile.json
purgetss --all --profile all-profile.json
```

Profiles use `schemaVersion: 1`. They record the canonical command, its status (`completed`, `skipped`, or `failed`), `durationMs`, CPU time (`user`/`system`, in microseconds), memory in bytes, phases and counters. `memory.peakRssBytes` records the process peak.

File-operation counters count attempted reads, writes and copies during command execution. The shared source analyzer reports its work through `sourceReads`, `xmlParses`, and `jsParses`. LiveView skips have `skipReason: "liveview-2s"`.

PurgeTSS also saves profiles for controlled failures. If it cannot write the profile, it reports the problem to stderr and keeps the command's original exit code. You can still use `--debug` and the normal progress messages.

Within one invocation, PurgeTSS reuses XML and controller text, XML parse results, controller ASTs and extractions. Each invocation reads the sources again; XML/JavaScript/AST data is never cached between runs.

PurgeTSS stores a signature of the evaluated configuration and generator inputs in `purgetss/.cache/generator-signature.json`, using less than 4 KiB of metadata. It evaluates calculated configurations on each invocation and detects changes made within the same second. If a value cannot be signed reliably, it rebuilds the utilities.

Generated text is written when its bytes change. Each completed purge writes `app.tss` to renew its modification time, which enforces LiveView's two-second guard.

Generation messages report `file created!`, `file updated!`, or `unchanged (not written)`. An unchanged file keeps its modification time even when you run `build` or `build-fonts` explicitly. Rebuild messages explain whether the signature is missing or unreadable, or the generator inputs changed. A rebuild can happen without an edit to the configuration file.

The distribution build runs its generators in the existing order within one process. They share CSS/codepoint inputs, and the build waits for font copies to finish. Image generation reuses source metadata and identical renders for each image, with at most two renders running at once. It preserves output order, codecs, sizing, alpha, supersampling, compression and optional quantization.

### Measured optimization results

Both versions were measured on the same Mac with Node 22.23.2, directly in three real projects and a minimal fixture. Each variant had a separate initial run, followed by five samples in alternating order. The table shows median process times for completed purges. LiveView skips were measured separately.

| Project | XML parses | JS parses | Before | After | Reduction |
| --- | ---: | ---: | ---: | ---: | ---: |
| Real project A | 70 | 54 | 1140.2 ms | 471.9 ms | 58.6% |
| Real project B | 10 | 10 | 680.5 ms | 448.8 ms | 34.1% |
| Real project C | 198 | 36 | 1591.3 ms | 547.1 ms | 65.6% |
| Minimal fixture | 1 | 0 | 480.3 ms | 388.4 ms | 19.1% |

XML and JS counts are parse operations per completed purge after optimization, included to give a reference for each workload. They do not measure class counts or overall application complexity.

Generated project outputs matched byte for byte. The new signature metadata was checked separately. All 43 unit test files, 7 integration files and 6 e2e files passed.

Across image codecs, all 56 outputs had identical bytes, pixels, dimensions and alpha, including after the Sharp 0.35.3 to 0.35.5 update. Compatible dependency fixes reduced npm audit's affected-package count from 12 to 5. The report documents the remaining incompatible upgrades.

An existing project without signature metadata rebuilds its utility catalog once. In the minimal fixture, that first call increased from 398.3 to 481.2 ms; the table shows the median for subsequent runs. These measurements apply to the tested fixtures and machine. Other projects may see different results. The two-second LiveView guard and `app.tss` mtime renewal remain unchanged.

For the differential benchmark procedure and measured limits, see [the optimization implementation report](docs/project/optimization.md).
