# Decisions

Append-only. Most recent entries first.

## 2026-09-11 — The notification icon's filename is fixed, not configurable

**Chose:** generate `notificationicon.png` and hardcode that name.
**Over:** keeping `ic_stat_notify.png`, or exposing the name as a `brand.notificationIcon` config key.
**Because:** the consumer dictates it. `firebase.cloudmessaging` resolves the drawable through `getResource("notificationicon")` in `TiFirebaseMessagingService.showNotification()`, and the `default_notification_icon` meta-data — the only configurable path — covers notification messages alone, so it cannot rescue a data message. Any other value would produce a build that quietly falls back to the opaque `appicon` and renders a white blob in the status bar. This is the same reason `appicon.png` and `DefaultIcon.png` are fixed: a config key here would only let a project misconfigure itself silently.

## 2026-09-05 — The `images:` section stays small; a source file carries its own configuration

**Chose:** validate the five existing keys and add none.
**Over:** promoting the `--width`, `--opacity`, `--padding` and `--output` flags into `images:` config keys.
**Because:** `brand:` needs config because it generates a fixed set of 15 pieces with platform-dictated geometry from one logo, and per-piece variation has nowhere else to live. `images:` processes an open set of files the developer places, and each source already states most of its own configuration: its pixels are the width, its subfolder is the destination, its extension is the format. A semi-transparent padded logo is stored that way in the PNG. Adding those keys would reproduce in `config.cjs` what the file already says, which is how `brand:` grew to 24 lines with four empty piece blocks. The one case a file genuinely cannot answer is an SVG, which has no natural pixels; `files[]` already covers it.

## 2026-09-05 — Unknown keys in `images:` are an error, matching `brand:`

**Chose:** abort the run and list the valid keys, generating nothing.
**Over:** ignoring unknown keys, as the section did before.
**Because:** an ignored `qualty: 95` is indistinguishable from the default, so the typo produced the wrong output without reporting anything. `brand:` reached the same conclusion in 7.13.0 for the same reason. The check extends into `files[]` entries, where a missing `filename` matched no file and was skipped the same way.

## 2026-09-03 — Tutorial fixtures stay pristine; stable processed samples live outside the repository

**Chose:** keep initial projects under the ignored `demos/` workspace without generated command outputs, enable the iOS Launch Screen storyboard in all eight `tiapp.xml` files, and keep separately processed copies named `01-brand` through `08-purgetss-module` under `/Users/PurgeTSS`.
**Over:** compiling directly in the initial fixtures or using disposable hash-named copies as the long-lived test projects.
**Because:** viewers need reproducible starting points, recordings need fresh VS Code state, and César also needs stable installed/output-complete projects for repeated iOS and Android tests.

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
