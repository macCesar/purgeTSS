# Contributing to PurgeTSS

## Animation Module — Implementation Rules

Every method in the Animation module (`app/lib/purgetss.ui.js`) MUST follow these rules. They ensure consistency across the entire API and preserve the declarative philosophy of PurgeTSS.

> Full documentation with examples: [Animation Module — Implementation Rules](https://purgetss.com/docs/animation-module/implementation-rules)

### Rule 1: Inherit from the `<Animation />` object via `...args`

Every method MUST inherit all properties from the Animation object by spreading `args`. Never cherry-pick individual properties.

```javascript
// CORRECT
view.animate({ ...args, left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D() })

// WRONG
view.animate({ duration: args.duration, delay: args.delay, left: destLeft, top: destTop })
```

The `<Animation />` is the **single source of truth**. `...args` inherits timing (`duration`, `delay`, `curve`) AND visual (`opacity`, `backgroundColor`, etc.) properties — the developer decides from XML what to animate.

### Rule 2: Override by position, not by exclusion

Fixed values go AFTER `...args` to override. Never filter properties from args.

```javascript
// CORRECT — shake: inherits all, overrides what it needs
view.animate({
  ...args,
  transform: Ti.UI.createMatrix2D().translate(intensity, 0),
  duration: Math.round((args.duration ?? 400) / 6),
  autoreverse: true,
  repeat: 3,
  curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
})
```

### Rule 3: No timing parameters in method signatures

Core methods (`play`, `open`, `close`, `apply`, `sequence`) do NOT accept `duration`/`delay`/`curve`. New methods MUST follow the same pattern. Only method-specific parameters are allowed.

```javascript
// CORRECT
animationView.swap = (view1, view2) => {
animationView.shake = (view, intensity = 10) => {    // intensity is shake-specific

// WRONG
animationView.swap = (view1, view2, duration) => {
animationView.shake = (view, intensity, duration) => {
```

Timing is controlled declaratively via `<Animation>` classes:

```xml
<Animation id="fast" module="purgetss.ui" class="duration-75" />
<Animation id="slow" module="purgetss.ui" class="delay-200 duration-500" />
```

**Note on `transition`**: This method accepts a `layouts` array parameter because the layout data is inherently per-call and cannot be declared in XML. This is not a violation of Rule 3 — `layouts` defines *what* to animate (positions), not *how* to animate (timing).

### Rule 4: Consolidate state with `applyProperties` post-animation

After animating position, ALWAYS call `applyProperties` in the callback.

```javascript
view.animate({
  ...args, left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D()
}, () => {
  view.applyProperties({ left: destLeft, top: destTop, transform: Ti.UI.createMatrix2D() })
})
```

### Rule 5: Track position with `_origin*` properties

Methods that move position (`swap`, `reorder`, `snapTo`) MUST update `_originTop`/`_originLeft` after animation.

```javascript
view._originTop = destTop
view._originLeft = destLeft
```

### Rule 6: Clean up in `undraggable`

Every internal property (`_origin*`, `_visual*`, `_dragListeners`, `_collisionEnabled`, `_wasDragged`, `_bouncingBack`) MUST be cleaned up in `undraggable`.

### New method template

```javascript
animationView.newMethod = (view, specificParam = defaultValue) => {
  if (params.debug) { console.log('') }
  logger('`newMethod` method called on: ' + params.id)
  if (!view) { return notFound() }

  view.animate({
    ...args,                          // Rule 1: inherit all
    specificProp: computedValue,      // Rule 2: override after ...args
  }, () => {
    view.applyProperties({ ... })    // Rule 4: consolidate state
  })

  view._originTop = newTop           // Rule 5: track position (if applicable)
  view._originLeft = newLeft
}
// Rule 3: no timing params in signature
// Rule 6: add cleanup to undraggable (if new internal state)
```
