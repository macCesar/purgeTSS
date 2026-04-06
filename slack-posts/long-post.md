Hi everyone!

Three releases since v7.2. Here's what changed in v7.3 through v7.5.

:label: `tailwind.tss` is now `utilities.tss` (v7.3, breaking change)

The output file has been renamed from `purgetss/styles/tailwind.tss` to `purgetss/styles/utilities.tss`. Same file, new name. PurgeTSS generates the new file automatically; you can delete the old `tailwind.tss` if it's still in your project.

Also in v7.3:
- XML files are validated before processing. If you have a malformed tag like `Label id=` (missing the `<`), PurgeTSS catches it and tells you exactly where.
- `deviceInfo()` works in Classic Titanium projects too, not just Alloy.

:film_projector: Animation module, 9 new methods (v7.4)

`transition(views, layouts)` does multi-view layout transitions using GPU-accelerated Matrix2D transforms. You define position, rotation, scale, and opacity per view. Layout arrays are positional (`layouts[i]` maps to `views[i]`), so presets are reusable across different view groups. Views without a layout entry fade out automatically.

`pulse(view, count)` is a scale-up-and-back animation using native `autoreverse` + `repeat`. No timers needed.

`shake(view, intensity)` is a bidirectional shake for error feedback. Was only shaking right before, now goes left-right properly.

`detectCollisions(views, dragCB, dropCB)` enables collision detection on draggable views. `dragCB` fires during drag when hovering over a target, `dropCB` fires on release. Automatic snap-back if dropped outside any target.

`swap(view1, view2)` animates two views exchanging positions. Handles iOS transform reset and z-index management.

`sequence(views, cb)` animates views one after another (unlike `play(array)` which runs them all at once).

`snapTo(view, targets)` snaps to the nearest target by center-to-center distance. Centers the view on the target, accounting for different sizes.

`reorder(views, newOrder)` does animated reordering via index mapping. `reorder(cards, [2, 1, 0])` reverses the order.

`undraggable(views)` removes draggable behavior and cleans up all listeners.

All these methods inherit `duration`, `delay`, and `curve` from the `<Animation>` object's classes, so you don't pass parameters manually.

Drag fixes: views with rotation or scale (from `transition`) now drag correctly using delta-based tracking. Views positioned at `left: 0` or `top: 0` no longer jump on drag start, that was a truthiness bug where `0` was treated as "not set".

New snap classes: `snap-back` (return to origin on miss) and `snap-center` (auto-center on target). Both opt-in via classes on the `<Animation>` object.

:wrench: Config and apply fixes (v7.5)

`theme.extend` works for Window, View, and ImageView now. It was silently ignored before. You can override component defaults the same way you extend colors or spacing:

```
extend: {
  Window: { apply: 'exit-on-close-false bg-blue-500' }
}
```

The `default` wrapper is optional. `{ apply: '...' }` and `{ default: { apply: '...' } }` are equivalent.

Property deduplication: if your apply class sets `backgroundColor` and the component default already has one, the applied value wins instead of both appearing in the output.

Platform-aware apply: classes inside `ios:` or `android:` blocks now resolve their platform-specific version automatically. No more writing `ios:status-bar-style-light-content` inside an `ios:` block, just write `status-bar-style-light-content`.

Array-type properties (`extendEdges`, `mediaTypes`, `orientationModes`, etc.) are generated with bracket notation `[ ]` as the Ti SDK expects.

:arrow_up: How to update

```
npm install -g purgetss@latest
```

The new `utilities.tss` is generated automatically. You can delete the old `tailwind.tss` from `purgetss/styles/` if it's still there.

Check the full CHANGELOG for details: https://github.com/anthropics/purgeTSS/blob/main/CHANGELOG.md
