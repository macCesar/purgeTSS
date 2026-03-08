<p align="center">
  <img src="https://codigomovil.mx/images/logotipo-purgetss-gris.svg" height="230" width="230" alt="PurgeCSS logo"/>
</p>

<div align="center">

![npm](https://img.shields.io/npm/dm/purgetss)
![npm](https://img.shields.io/npm/v/purgetss)
![NPM](https://img.shields.io/npm/l/purgetss)

</div>

**PurgeTSS** is a toolkit for building mobile apps with the [Titanium framework](https://titaniumsdk.com). It adds practical utilities to speed up styling and reduce repeated setup work.

It includes utility classes, icon font support, an Animation module, a simple grid system, and the `shades` command for generating custom colors.

If you build UI-heavy screens, PurgeTSS helps you move faster without hand-writing long TSS files.

---

## What's New in v7.3.x

**File rename and improved error handling.** PurgeTSS v7.3 renames `tailwind.tss` to `utilities.tss` to reflect the project's standalone identity, and adds XML syntax validation to catch errors early.

### Breaking changes

- **File rename**: Output file is now `utilities.tss` instead of `tailwind.tss`
  - Generated file: `purgetss/styles/utilities.tss` (was `purgetss/styles/tailwind.tss`)
  - Distribution file: `dist/utilities.tss` (was `dist/tailwind.tss`)

### Major improvements

- **XML syntax validation**: Catches common Alloy XML malformations before processing
  - Detects missing opening `<` brackets (e.g., `Label id=` instead of `<Label id=`)
  - Shows detailed error messages with line numbers, context preview, and fix suggestions
  - Saves debugging time by catching errors early in the build process

- **Classic Titanium compatibility**: `deviceInfo()` function now works in both Alloy and Classic projects
  - Removed dependency on `Alloy.isTablet`/`Alloy.isHandheld`
  - Uses platform-based detection instead

### Migration guide

If you have references to `tailwind.tss` in your project, update them to `utilities.tss`:

```bash
# Update any custom scripts or paths
# From: purgetss/styles/tailwind.tss
# To:   purgetss/styles/utilities.tss
```

For most users, upgrading is straightforward:
```bash
npm install -g purgetss@latest
```

---

Here are its main functionalities:

- **Utility-First Classes**: PurgeTSS ships with 21,000+ utility classes, so you get a lot of styling options out of the box.
- **Efficient style management**: It parses all XML files to create a clean `app.tss` containing only the classes used in your project, reducing size and improving performance.
- **Customization and JIT classes**: You can customize default classes via a config file and use JIT classes for arbitrary values inside views.
- **Icon fonts integration**: Use icon fonts such as Font Awesome, Material Icons, Material Symbols, and Framework7-Icons in Buttons and Labels.
- **`fonts.tss` generation**: The `build-fonts` command creates a `fonts.tss` file with class definitions and fontFamily selectors for regular and icon fonts, with simplified options for filenames and icon prefixes.
- **`shades` command**: Generate custom color shades from a hex color without external tools.
- **Animation module**: Apply basic 2D matrix animations or transformations to elements or arrays of elements.
- **Grid system**: A two-dimensional grid system to align and distribute elements within views.

---

## Animation Module (`purgetss.ui.js`)

Install with `purgetss module` (or `purgetss m`). This places `purgetss.ui.js` in your project's `lib` folder.

### Declaring an Animation object

```xml
<Animation id="myAnimation" module="purgetss.ui" class="opacity-0 duration-300 ease-in" />
```

You can use any position, size, color, opacity, or transformation class from `utilities.tss`.

### Available methods

| Method                                  | Description                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `play(views, cb)` / `toggle(views, cb)` | Animate views from current state to the animation state. Toggles `open`/`close` on each call. |
| `open(views, cb)`                       | Explicitly run the `open` state animation.                                                    |
| `close(views, cb)`                      | Explicitly run the `close` state animation.                                                   |
| `apply(views, cb)`                      | Apply properties instantly without animation.                                                 |
| `draggable(views)`                      | Make a view or array of views draggable inside their parent.                                  |

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

In short, PurgeTSS keeps styling consistent and removes a lot of repetitive UI setup work.

### Visit the official documentation site at [purgetss.com](https://purgetss.com) to learn more.

## Requirements

- **Titanium SDK** (Compatible with all versions; 13.1.1.GA recommended for full property support)
- **Alloy Framework** (for most commands)
- **Node.js 20+** (required for the CLI tool)

## Table of Content

- [What's New in v7.2](https://purgetss.com/#whats-new-in-v72x)
- [Installation](https://purgetss.com/docs/installation)
- [Commands](https://purgetss.com/docs/commands)
- Customization
  - [config file](https://purgetss.com/docs/customization/the-config-file)
  - [Custom rules](https://purgetss.com/docs/customization/custom-rules)
  - [apply directive](https://purgetss.com/docs/customization/the-apply-directive)
  - [opacity modifier](https://purgetss.com/docs/customization/the-opacity-modifier)
  - [Arbitrary values in XMLs](https://purgetss.com/docs/customization/arbitrary-values)
  - [Platform and Device modifiers](https://purgetss.com/docs/customization/platform-and-device-modifiers)
  - [Icon Fonts Libraries](https://purgetss.com/docs/customization/icon-fonts-libraries)
- Animation module
  - [Introduction](https://purgetss.com/docs/animation-module/introduction)
  - [Available utilities](https://purgetss.com/docs/animation-module/available-utilities)
  - [Complex UI elements](https://purgetss.com/docs/animation-module/complex-ui-elements)
- [Grid System](https://purgetss.com/docs/grid-system)
