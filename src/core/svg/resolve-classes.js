/**
 * PurgeTSS - Class cascade resolver for the SVG pipeline
 *
 * Given an ordered list of classes (as they appear in `class=""` / `classes:`)
 * and the class→props map produced by tss-reader, apply later-wins cascading
 * to return the final width and height.
 *
 * V1 limitations (out of scope, see plan):
 *   - Tag selectors (`'View': { ... }`) not applied
 *   - ID selectors (`'#foo': { ... }`) not applied
 *   - Platform/device modifiers (`'[platform=ios]'`) not applied
 *
 * If a project needs any of these, add the SVG to `images.files` manually.
 *
 * @fileoverview Cascade resolver: classes[] + tssMap → { width, height }
 * @author César Estrada
 */

/**
 * Resolve width/height for a list of classes by applying later-wins cascading.
 * Classes that don't exist in the map are skipped silently — they may be
 * unknown utilities, typos, or classes registered via tag/ID selectors that
 * V1 doesn't see.
 *
 * Returned value shape per dimension:
 *   - number    → resolved to a finite dp value
 *   - 'auto'    → resolved to Ti.UI.SIZE
 *   - 'fill'    → resolved to Ti.UI.FILL
 *   - 'percent' → resolved to a percentage / non-numeric (can't size a PNG)
 *   - null      → no class in the list set this dimension
 *
 * @param {string[]} classes - Class tokens in source order.
 * @param {Map} tssMap - Output of parseTssMap().
 * @returns {{ width: number|'auto'|'fill'|'percent'|null, height: number|'auto'|'fill'|'percent'|null }}
 */
export function resolveDimensions(classes, tssMap) {
  let width = null
  let height = null
  for (const cls of classes) {
    const entry = tssMap.get(cls)
    if (!entry) continue
    if (entry.width !== undefined) width = entry.width
    if (entry.height !== undefined) height = entry.height
  }
  return { width, height }
}
