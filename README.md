<p align="center">
  <img src="https://codigomovil.mx/images/logotipo-purgetss-gris.svg" height="230" width="230" alt="PurgeCSS logo"/>
</p>

<div align="center">

![npm](https://img.shields.io/npm/dm/purgetss)
![npm](https://img.shields.io/npm/v/purgetss)
![NPM](https://img.shields.io/npm/l/purgetss)

</div>

**PurgeTSS** is a toolkit for building mobile apps with the [Titanium framework](https://titaniumsdk.com). It gives you utility classes, icon font support, an Animation module, a grid system, and color generation commands (`shades` for tonal palettes, `semantic` for Light/Dark mode semantic colors).

---

- 23,300+ utility classes for styling Titanium views
- Parses XML files to generate a clean `app.tss` with only the classes your project uses
- Customizable defaults via `config.cjs`, with JIT classes for arbitrary values
- `brand` command for Titanium icons and branding assets, focused on the modern Titanium icon pipeline: Android adaptive icons, iOS icon variants, optional Android 12+ splash artwork, and a minimal `default.png` compatibility fallback
- Icon font support: Font Awesome, Material Icons, Material Symbols, Framework7-Icons
- `build-fonts` command generates `fonts.tss` with class definitions and fontFamily selectors
- `shades` command generates color shades from any hex color
- `semantic` command generates Titanium semantic colors (Light/Dark mode) — tonal palettes with mirror inversion, or single purpose-based colors with optional alpha
- Animation module for 2D matrix animations on views or arrays of views
- Grid system for aligning and distributing elements within views

---

## Animation Module (`purgetss.ui.js`)

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

All callbacks (`play`, `open`, `close`, `apply`) receive an enriched event object:

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

When animating an **array of views**, the callback is called once per view with the corresponding `index` and `total` values.

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

**`dragCB(source, target)`** is called during drag:
- `target` is the view under the drag center, or `null` when leaving all targets
- Use this to show visual feedback (highlights, borders, scaling)

**`dropCB(source, target)`** is called on drop:
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

- Each view fully completes before the next starts
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

The `swap`, `reorder`, `snapTo`, and `shake` methods inherit animation properties from the `<Animation>` object's classes. This means you can configure behavior declaratively in XML:

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

Fallback defaults when not set: `swap`/`reorder`/`snapTo` → 200ms; `shake` → 400ms. All animation timing is controlled declaratively via the `<Animation>` object's classes.

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

Requires `semantic.colors.json` in `app/assets/` for views to respond to mode changes. Generate it with the `semantic` command instead of writing it by hand:

```bash
# Tonal palette (11 shades with mirror-by-index Light/Dark inversion)
purgetss semantic '#15803d' amazon

# Purpose-based single colors (auto-mapped to classes in config.cjs)
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

PurgeTSS sets defaults for three components out of the box:

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

### Visit the official documentation site at [purgetss.com](https://purgetss.com) to learn more.

## Requirements

- **Titanium SDK** (Compatible with all versions; 13.1.1.GA recommended for full property support)
- **Alloy Framework** (for most commands)
- **Node.js 20+** (required for the CLI tool)

## Recent changes

### v7.8.0

- **`--width <n>` flag for `images`.** Pin Android `mdpi` / iPhone `@1x` to a specific width in pixels (e.g. `purgetss images logo.svg --width 256`); larger scales derive at ×1.5, ×2, ×3, ×4 with height staying proportional. Recommended when the source is an SVG export from Affinity / Illustrator with a disproportionate viewBox — the legacy 4× master convention produces unpredictable sizes there, and the new flag pins the result exactly. When you pass an SVG without `--width`, `images` now prints a one-time hint suggesting the flag, then falls back to the legacy behavior.
- **Class syntax pre-validation.** `purgetss` now halts with a structured `Class Syntax Error` block (file + line + suggested fix) when it detects known authoring mistakes in your class names: inverted negative sign (`top-(-10)` → `-top-(10)`), Tailwind-style brackets (`top-[10px]` → `top-(10px)`), empty parentheses (`wh-()`), whitespace inside parentheses (`wh-( 200 )`), and redundant `px` unit (`top-(10px)` → `top-(10)`).
- All offenders are reported in a single run, so you can fix them in one pass.
- Generic unknown classes (typos, vendor utilities not enabled, custom classes not yet declared) are NOT flagged by the validator — they continue to flow silently into the `// Unused or unsupported classes` block in `app.tss`, exactly as in previous versions.
- **Arbitrary-value parser no longer crashes on negative values inside parentheses.** Classes like `top-(-10)`, `mt-(-5)`, or `origin-(-10,-20)` used to trigger a `Cannot read properties of null (reading 'pop')` exception. The parser was rewritten to extract the `(...)` portion first, so a `-` inside the value never breaks the split — and the new pre-validator catches the inverted-sign form before it gets that far.

### v7.7.0

- `brand` now uses grouped config sections: `brand.logos`, `brand.padding`, `brand.android`, `brand.ios`, and `brand.colors`.
- `brand` supports separate Android artwork through `brand.logos.androidLauncher` / `--icon-logo` and `brand.logos.androidSplash` / `--splash-logo`.
- `brand` regenerates `app/assets/android/default.png` in Alloy projects, or `Resources/android/default.png` in Classic projects, so older Android splash paths still have a fallback.
- `cleanup-legacy` no longer removes `default.png`.
- Branding help and docs now spell out the difference between Android launcher icons, Android 12+ `splash_icon.png`, and legacy Android splash assets.
- `--notes` is explicit that `tiapp.xml` is not auto-edited and that apps with an existing custom Android theme should merge splash snippets into that theme instead of replacing it.
- `brand` does not try to manage older Android splash theme assets such as `background.png` or `background.9.png`; if a project still depends on them, that remains manual by design.

See the full release notes in [CHANGELOG.md](./CHANGELOG.md).

## Table of Content

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
