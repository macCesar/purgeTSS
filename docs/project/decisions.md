# Decisions

Append-only. Most recent entries first.

## 2026-08-30 — Finished iOS/store square artwork is full-bleed by default

**Chose:** `0%` as the default for `icon`, `dark`, `tinted`, and `marketplace`.
**Over:** the former PurgeTSS-specific `4%` aesthetic inset.
**Because:** Apple permits full-bleed artwork, and applying a white fallback behind an opaque dark finished icon produced a visible frame that looked like malformed icon geometry. Insets remain configurable for logo artwork that actually needs breathing room.

## 2026-08-30 — Android launcher paddings remain separate from iOS/store padding

**Chose:** keep `18%` adaptive and `10%` legacy/appicon defaults, with transparent piece-specific Android artwork as the preferred source when the main source is a finished opaque square.
**Over:** forcing all platforms to `0%`, or inheriting one global padding value.
**Because:** Android launcher masks impose safe-zone constraints that do not exist for square iOS/store canvases.

## 2026-08-30 — Deployment targets and project layout are independent decisions

**Chose:** read `<deployment-targets>` to select platform families and detect Alloy/Classic only to route destinations. Explicit `--only` intentionally overrides disabled targets.
**Over:** generating every platform because files happen to exist, or treating Classic as a reduced asset set.
**Because:** an app may target one platform in either layout, while Titanium can consume useful Classic files that a fresh `ti create` template does not seed.

## 2026-08-30 — Classic Android qualifier splashes remain generated

**Chose:** create the 11 `Resources/android/images/res-*` variants in Classic projects.
**Over:** excluding them merely because a fresh Classic template lacks those directories.
**Because:** Titanium consumes them for density/orientation-specific legacy splash resources; template presence is not the same as build usefulness.

## 2026-08-30 — Standalone brand runs establish a canonical local source

**Chose:** create `purgetss/config.cjs` when missing and move a positional source to `purgetss/brand/logo.{png,svg}` only when no canonical logo exists, reporting the move.
**Over:** relying on invisible internal defaults and leaving an empty `purgetss/brand/` directory.
**Because:** Classic apps should be able to use the asset command without adopting the Alloy hook or depending on PurgeTSS at application runtime.
