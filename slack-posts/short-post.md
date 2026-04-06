Hi everyone!

Three releases since v7.2, quick recap.

**v7.3, `tailwind.tss` renamed to `utilities.tss`** (breaking)
- Output file is now `purgetss/styles/utilities.tss`, update any references
- XML files are validated before processing (catches malformed tags with line numbers)
- `deviceInfo()` works in Classic Titanium projects too, not just Alloy

**v7.4, Animation module, 9 new methods**
- `transition(views, layouts)`, multi-view GPU-accelerated layout transitions (position, rotation, scale, opacity)
- `pulse(view, count)`, scale-up-and-back using native `autoreverse`
- `shake(view, intensity)`, bidirectional shake for error feedback (was only going right)
- `detectCollisions(views, dragCB, dropCB)`, collision detection for draggable views
- `swap(view1, view2)`, two views exchange positions
- `sequence(views, cb)`, animate views one after another (not in parallel like `play`)
- `snapTo(view, targets)`, snap to nearest target by center distance
- `reorder(views, newOrder)`, animated reordering via index mapping
- `undraggable(views)`, removes drag behavior and cleans up listeners
- All methods inherit `duration`, `delay`, `curve` from the `<Animation>` object
- New `snap-back` and `snap-center` classes (opt-in)
- Fixed draggable views at `left: 0` / `top: 0` jumping on drag start

**v7.5, Config and apply fixes**
- `theme.extend` works for Window, View, and ImageView (was silently ignored before)
- Shorthand `{ apply: '...' }`, the `default` wrapper is now optional
- Applied values override static defaults instead of duplicating the property
- `ios:` blocks auto-resolve platform-specific classes, no more redundant `ios:` prefix inside `ios:` blocks
- Array-type properties (`extendEdges`, `orientationModes`, etc.) use bracket notation `[ ]`

`npm install -g purgetss@latest`

If upgrading from 7.2, the new `utilities.tss` is generated automatically. You can delete the old `tailwind.tss` from `purgetss/styles/` if it's still there.
