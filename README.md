<p align="center">
  <img src="https://codigomovil.mx/images/logotipo-purgetss-gris.svg" height="230" width="230" alt="PurgeCSS logo"/>
</p>

<div align="center">

![npm](https://img.shields.io/npm/dm/purgetss)
![npm](https://img.shields.io/npm/v/purgetss)
![NPM](https://img.shields.io/npm/l/purgetss)

</div>

**PurgeTSS** is a toolkit for building mobile apps with the [Titanium framework](https://titaniumsdk.com). It provides utility classes, icon font support, an Animation module, a grid system, and the `shades` command for generating custom colors.

---

- 23,300+ utility classes for styling Titanium views
- Parses XML files to generate a clean `app.tss` with only the classes your project uses
- Customizable defaults via `config.cjs`, with JIT classes for arbitrary values
- Icon font support: Font Awesome, Material Icons, Material Symbols, Framework7-Icons
- `build-fonts` command generates `fonts.tss` with class definitions and fontFamily selectors
- `shades` command generates color shades from any hex color
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

Requires `semantic.colors.json` in `app/assets/` for views to respond to mode changes. See the [Titanium docs on semantic colors](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_How-tos/User_Interface_Deep_Dives/iOS_Dark_Mode.html) for the file format.

### Default font families

PurgeTSS generates `font-sans`, `font-serif`, and `font-mono` classes automatically with platform-appropriate values:

| Class        | iOS                | Android       |
| ------------ | ------------------ | ------------- |
| `font-sans`  | `Helvetica Neue`   | `sans-serif`  |
| `font-serif` | `Georgia`          | `serif`       |
| `font-mono`  | `monospace`        | `monospace`   |

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

## Table of Content

- [Installation](https://purgetss.com/docs/installation)
- [Commands](https://purgetss.com/docs/commands)
- Customization
  - [The Config File](https://purgetss.com/docs/customization/the-config-file)
  - [Custom Rules](https://purgetss.com/docs/customization/custom-rules)
  - [The `apply` Directive](https://purgetss.com/docs/customization/the-apply-directive)
  - [The `opacity` Modifier](https://purgetss.com/docs/customization/the-opacity-modifier)
  - [Arbitrary Values](https://purgetss.com/docs/customization/arbitrary-values)
  - [Platform and Device Modifiers](https://purgetss.com/docs/customization/platform-and-device-modifiers)
  - [Icon Fonts Libraries](https://purgetss.com/docs/customization/icon-fonts-libraries)
- Animation Module
  - [Introduction](https://purgetss.com/docs/animation-module/introduction)
  - [The `play` Method](https://purgetss.com/docs/animation-module/the-play-method)
  - [The `apply` Method](https://purgetss.com/docs/animation-module/the-apply-method)
  - [The `open` and `close` Methods](https://purgetss.com/docs/animation-module/the-open-and-close-methods)
  - [The `draggable` Method](https://purgetss.com/docs/animation-module/the-draggable-method)
  - [Complex UI Elements](https://purgetss.com/docs/animation-module/complex-ui-elements)
  - [Additional Methods](https://purgetss.com/docs/animation-module/additional-methods)
  - [Available Utilities](https://purgetss.com/docs/animation-module/available-utilities)
  - [Implementation Rules](https://purgetss.com/docs/animation-module/implementation-rules)
- [Grid System](https://purgetss.com/docs/grid-system)
