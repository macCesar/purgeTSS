# Requirements

Source: `README.md`, `CHANGELOG.md`, CLI help, tests, and the official documentation in `/Users/cesar/Developer/openSource/purgetss-docs`. This is an index of load-bearing product behavior, not a replacement for those detailed documents.

## Core PurgeTSS behavior

| # | Must do | Accepted when |
| --- | --- | --- |
| R1 | Extract the utility classes used by a Titanium Alloy project and generate the minimized styling output without making application runtime depend on the CLI. | Unit, integration, and end-to-end purge suites pass against the fixture project. |
| R2 | Keep standalone asset/helper commands usable without requiring the Alloy compile hook when their output is valid in Classic projects. | The command detects the project layout, writes only project-consumable outputs, and its test does not require `app/alloy.jmk`. |

## Brand command

| # | Must do | Accepted when |
| --- | --- | --- |
| R3 | Generate only the normal iOS and Android branding families enabled in `tiapp.xml`, independent of Alloy vs. Classic layout; explicit `--only` remains an override. | Target-selection tests cover iOS-only, Android-only, both, and explicit override behavior. |
| R4 | Generate the complete Titanium-consumed Classic branding surface, including `Resources/android/images/res-*` splash qualifiers even when `ti create` did not seed the directories. | A fresh Classic fixture receives the correct root, `Resources/iphone`, `Resources/android`, and `platform/android/res` outputs. |
| R5 | Make the first standalone Classic run self-contained by creating `purgetss/config.cjs` and adopting a positional logo into `purgetss/brand/logo.{png,svg}` when no canonical source exists. | The command reports both actions, never silently replaces an existing canonical logo, and leaves no empty brand setup. |
| R6 | Preserve platform-appropriate icon geometry: finished iOS/store squares are full-bleed by default, Android launcher pieces retain safe-zone padding, and white is a configurable fallback rather than a platform mandate. | Defaults, help, generated config, output pixels, warnings, tests, README, and official docs agree. |

## Custom fonts

| # | Must do | Accepted when |
| --- | --- | --- |
| R7 | Generate a CommonJS font module whose `families` object includes every processed TTF/OTF, including collections with no icon CSS, while retaining icon Unicode maps when CSS is present. | Classic integration tests prove text-only and icon-font inputs, exact PostScript values, filename-derived keys, and `Resources/lib/purgetss.fonts.js` output. |

## Classic demo series handoff

| # | Must do | Accepted when |
| --- | --- | --- |
| R8 | After all eight Classic demo videos are complete, publish a separate repository containing pristine copies of the initial projects under `demos/classic-video-series/projects`. The current `demos/` tree is a temporary local workspace and must not ship in the PurgeTSS repository. | The separate repository excludes generated command outputs, recording temporaries, and VS Code state; its README documents prerequisites, per-episode commands and build steps where applicable, and links to the [PurgeTSS in Classic Apps playlist](https://www.youtube.com/playlist?list=PLBgzic3Fjodc). Once the handoff is verified, `demos/` is absent from the PurgeTSS repository. |
| R9 | Generalize the technical tutorial video skill only after the current workflow is refined and proven with at least one non-PurgeTSS tutorial. | The reusable skill contains no PurgeTSS-specific project assumptions, can prepare another kind of technical tutorial from a conversational brief, and is published in the appropriate skills repository. Prefer AISkills for the generic producer/director workflow; keep only Titanium- or PurgeTSS-specific guidance in TiTools if an overlay is still useful. |
| R10 | Keep every distributed Classic tutorial fixture directly runnable on current iOS and Android layouts, without placing generated command outputs in the pristine source. | Every `tiapp.xml` enables the iOS Launch Screen storyboard; a clean copy can run its documented PurgeTSS command and then compile, install, and launch on both target platforms. |

## Invariants

- `brand.background` is inherited only by pieces that use an opaque canvas; piece padding is never globally inherited.
- Project layout answers where files go. Deployment targets answer which platform families are generated. Neither substitutes for the other.
- `dist/` is generated through the build scripts, never edited by hand.
- Root-level screenshots and temporary sample PNGs are not release artifacts.

## Out of scope for the current release

- A complete audit of every PurgeTSS command for Classic compatibility.
- Automatic edits to Android splash themes or notification metadata beyond the existing opt-in guidance.
