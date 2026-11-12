# Requirements

Source: `README.md`, `CHANGELOG.md`, CLI help, tests, and the official documentation in `../purgetss-docs`. This is an index of load-bearing product behavior, not a replacement for those detailed documents.

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

## Images command

| # | Must do | Accepted when |
| --- | --- | --- |
| R11 | Reject unknown keys in the `images:` section of `purgetss/config.cjs`, at the top level and inside each `files[]` entry, instead of ignoring them. | An unknown key aborts the run before anything is written, every problem is listed in one pass with the offending entry index, and the error names the valid keys. |
| R12 | State in the generated config block where the output sizes come from, so the 4× master convention is readable without `--help`. | Every shipped copy of the block carries the convention with worked numbers, and a test proves the copies are identical and validate against the same whitelist. |

## Generated Completions and bundled icon fonts

| # | Must do | Accepted when |
| --- | --- | --- |
| R13 | Generate Completions permissions through the corrected v3 extractor and exclude properties marked `readOnly: true` from utilities and the glossary. Preserve descriptions and other fields; keep names writable on at least one owning SDK type eligible. | Read-only/writable/mixed-name regression probes pass, generated read-only assignments are absent, and the input was regenerated rather than hand-edited. Removing invalid read-only classes is expected. |
| R14 | Resolve Font Awesome Free families, module aliases and copied filenames from manually supplied Solid/Regular/Brands font metadata; validate the faces against the installed npm version before replacing Free outputs. | The isolated Free contract covers generation, Alloy/Classic copying, version mismatch, missing/duplicate faces and obsolete generated filenames. OTF bytes retain the existing `.ttf` copy convention. |
| R15 | Resolve Pro/Beta font identities from installed TTF PostScript metadata, omit absent optional faces and generate the module through either supported Pro installation path. | Pro/Beta contract fixtures cover both layouts, optional faces and invalid metadata. Device rendering with genuine Pro/Beta fonts is a separate check. |
| R16 | Derive TSS/JavaScript header versions from installed packages for Free/Framework7 and per-variant font metadata for Material Icons/Symbols, without fixed Material update dates. | Header contracts change package/font versions in isolated fixtures, preserve glyph/class/export data and reject missing metadata. Material `.codepoints` and fonts remain manually paired inputs; automated Pro/Beta header versions are outside this contract. |

## Icon resolution and custom font CSS

| # | Must do | Accepted when |
| --- | --- | --- |
| R17 | Resolve icon selectors consistently in direct purging and `apply`, with `fonts.tss` before project Font Awesome Pro/Beta before bundled catalogs. Retain per-class fallback and avoid duplicate overridden selectors; comments cannot disable a catalog. | The font-source-priority regression covers collisions, partial catalogs, comments, bundled families, small/indexed selections, modifiers, platform-specific apply targets and real CLI assembly. Catalog edits are visible on the next invocation. |
| R18 | Parse modern literal `--fa` and legacy `content` in custom font CSS while preserving aliases, custom filename prefixes and supplementary Unicode in Alloy TSS and Classic modules. | The build-fonts-css regression covers declaration order, quoted literals, nonliteral references, aliases, supplementary Unicode and real Font Awesome 7 CSS. Classic generation does not create an Alloy app tree. |

## Invariants

- `brand.background` is inherited only by pieces that use an opaque canvas; piece padding is never globally inherited.
- Project layout answers where files go. Deployment targets answer which platform families are generated. Neither substitutes for the other.
- `dist/` is generated through the build scripts, never edited by hand.
- A shipped string that exists in more than one file has a test tying the copies together. Two are covered: the `images:` config block and the ESLint template filename.
- Root-level screenshots and temporary sample PNGs are not release artifacts.

## Out of scope for the current release

- A complete audit of every PurgeTSS command for Classic compatibility.
- Automatic edits to Android splash themes or notification metadata beyond the existing opt-in guidance.


## Optimization compatibility contract — 2026-11-11

- Preserve every command and alias, all/class extraction, identifiers, widgets, themes, safelist, XML diagnostics, Acorn options and regex fallback, class syntax and ordering, modifier combinations, states, arbitrary/negative/unit values, semantic opacity, font priorities, and `apply` precedence.
- `build` emits the full utility catalog, definitions, and requested glossary. Source reuse ends with each invocation; do not persist XML, controller text, or ASTs.
- Preserve the two-second LiveView guard and renew `app.tss` mtime for completed purges. Other generated text may skip byte-identical writes.
- Profile commands and aliases through `--profile`, including controlled failures, without overriding the original command exit code when saving the profile fails.
- Sign effective evaluated configuration and generator inputs, not second-resolution file dates. Store only signature metadata (maximum 4 KiB); rebuild when values cannot be represented reliably.
- Preserve image codecs, dimensions, pixels, alpha, supersampling, compression, and optional quantization. Enable a queue of at most two jobs only with faster measured runs and no more than 20% extra peak memory against the reference.
- Validate directly on Real project A, Real project B, and Real project C, restoring affected bytes and timestamps and preserving previous changes. No real-project copies, worktrees, commits, global installations, publication, or version changes belong to this implementation. Preserve `docs/rust-port.md`.
- Keep the supported Node range aligned with actual dependencies: `^20.12.0 || ^22.13.0 || >=23.5.0`; CI covers Node 20.12, 22.13 and 24.

**Closure authorization — 2026-11-11:** after implementation and verification, César explicitly requested semantic commits and session-document updates. This authorizes those commits; the original restrictions on real-project copies, worktrees, global installations, publication and version changes remain. No Git push was requested. Differential references must remain fixed when HEAD advances, and color unit tests must work without the original commit in a shallow CI checkout.

**Subsequent release authorization — 2026-11-11:** César made the 7.19.0 bump, invoked `aiskills:release`, requested all remaining work committed with a clean tree, and explicitly confirmed the reviewable publication plan. That separate release authorization permits the planned commits, alignment of the unpublished local tag, push, GitHub release, npm publication and pushed session-note closure. The implementation's compatibility and real-project preservation requirements remain in effect.
