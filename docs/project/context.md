# Context

## Documentation map

| Document | What it covers | When you need it |
| --- | --- | --- |
| `README.md` | Public product overview, installation, command surface, and recent changes. | Before changing user-visible CLI behavior. |
| `CHANGELOG.md` | Canonical release history and current Unreleased work. | When planning or publishing a release. |
| `docs/project/optimization.md` | Five-stage audit implementation, compatibility contracts, measurements, remaining dependency advisories, and benchmark reproduction. | Before changing these optimizations or comparing against the audited revision. |
| `docs/rust-port.md` | Rust-port feasibility assessment of v7.18.0, before the JavaScript optimization; historical architecture analysis, not an approved implementation plan. | Before revisiting a Rust port; recheck code references and performance assumptions against the current implementation. |
| `CONTRIBUTING.md` | Animation module implementation invariants. | Before changing `purgetss.ui` animation methods. |
| `docs/error-reporting-consolidation.md` | Partially implemented proposal to unify CLI error reporting. | Before touching syntax/config error presentation. |
| `docs/jit-class-resolution-proposal.md` | Proposed staged migration from prebuilt utilities to JIT class resolution. | Before starting any JIT resolver phase. |
| `docs/prompt.md` | Historical handoff prompt for the first JIT color experiment. | For provenance only; verify its branch/status assumptions before reuse. |
| `tests/README.md` | Quick testing commands and suite layout. | For daily validation. Some recorded suite counts are historical. |
| `tests/TESTING-GUIDE.md` | Detailed test-runner output and structure. | When changing the test harness or debugging suite output. |
| `slack-posts/long-post.md` | Long-form announcement draft for older v7.3–v7.5 changes. | When reusing historical release communication. |
| `slack-posts/short-post.md` | Short announcement draft for the same older releases. | When reusing historical release communication. |
| `../purgetss-docs` | Official Docusaurus documentation source and its release/deploy workflow. | Every time public behavior, configuration, or help changes. |

## Architecture

PurgeTSS is an ESM Node.js CLI. `bin/purgetss` defines the public command surface, `src/cli/` handles command entry points, `src/core/` contains analyzers/builders and the branding pipeline, and `src/shared/` holds cross-cutting configuration and utilities. `lib/templates/` contains source templates copied into projects; `dist/` is generated for distribution. `tests/` combines unit, integration, and real CLI workflows against disposable copies of `test-project/`.

Branding behavior is data-driven from `src/core/branding/pieces.js`. Project layout determines destination roots, deployment targets determine enabled platform families, and piece-specific generators own format/alpha/sizing behavior. Keep those concerns separate.

## Conventions

- Use ESM, 2-space indentation, single quotes, and no semicolons.
- Add user-visible behavior to CLI help, `README.md`, `CHANGELOG.md`, and the sibling Docusaurus source in the same stretch of work.
- Use `apply_patch` for hand edits; regenerate `dist/` only through npm build scripts.
- Keep commits semantic and atomic. Root screenshots and temporary example PNGs stay out of commits.
- Keep only the three latest published versions in README's `Recent changes`, with a link to the complete `CHANGELOG.md`. Keep usage explanations outside that release summary so rotating versions does not remove current guidance (César, 2026-11-11).
- Test destructive asset generation in a committed fixture project and restore only that fixture afterward.

## Traps

- A fresh Classic template is not an exhaustive list of files Titanium can consume. In particular, Android `Resources/android/images/res-*` qualifiers remain useful even when absent initially.
- `brand.background` is not an instruction to paint every piece: dark/tinted variants have platform-specific alpha/compositing rules.
- An opaque full-bleed source already contains its own background. Adding padding exposes PurgeTSS's canvas background and can create a contrasting frame.
- The official docs are a sibling repository with a separate version, release, rsync deployment, and mirror-sync workflow. A clean CLI release does not publish those docs automatically.
- `tests/README.md`, `tests/TESTING-GUIDE.md`, and some assistant context describe historical test counts; trust the current runner output.
- `dist/utilities.tss` comes from `src/core/builders/auto-utilities-builder.js`: Titanium properties from `lib/completions/titanium/completions-v3.json`, plus the helpers that builder calls by name. Most helpers in `src/shared/helpers/` (for example `keyboardType()` in `input.js`) are reached only through `helperToBuildTailwindClasses()`, which nothing calls, so editing them changes no output. Check the `dist/` diff after `npm run build:tailwind`.
- `npm run build:tailwind` (also included in `npm run build`) generates `dist/glossary/` alongside `dist/utilities.tss`. The glossary is ignored by Git in this repo. In the sibling documentation repository, `npm run clean:md` imports it into `glossary/` before converting handwritten docs/pages for the mirrors. The generated root/category indexes contain Docusaurus metadata and unit admonitions; the site import preserves them.
- The completions data is not authoritative: it listed `KEYBOARD_APPEARANCE_*` under `keyboardType`. Verify generated values against the Titanium API before trusting them.
- Alloy keeps only the last `[...]` of a TSS selector. Combined conditions go in one bracket: `[platform=ios formFactor=tablet]`.

## Provenance

| When | Assistant · model | What it produced |
| --- | --- | --- |
| 2026-11-11 | Codex · GPT-6 family (exact model identifier not exposed) | Five-stage optimization, differential verification, compatible dependency updates, semantic commits authorized at closure, and session documentation. |
| 2026-09-26 | Claude Code · Opus 5.5 (`claude-opus-5-5`) | Fixes from the TiTools skill audit: stacked platform/device modifiers, Font Awesome Pro/Beta module builds, `--vendor` validation, keyboard and `snap-magnet` class removals, `bg-from-(…)`, `images --width` bound, single project detector; the matching `purgetss-docs` corrections and `tests/unit/shared/generator-fixes.test.js`. |
| 2026-09-11 | Claude Code · Opus 5 (`claude-opus-5[1m]`) | The v7.17.1 release: grouped the `notificationicon.png` rename already present in the working tree into one semantic commit, wrote the README entry, and shipped the tag. The rename itself was authored earlier, outside this session. |
| 2026-09-05 | Claude Code · Opus 5 (`claude-opus-5`) | `images:` key validation, the 4× convention in the generated config block, the eslint 9 flat-config scaffolding, and the tests that keep each duplicated shipped string in sync. |
| 2026-08-30 | Codex · GPT-5 | Classic/deployment-aware brand pipeline, full-bleed iOS/store defaults, frame diagnostics, tests, and synchronized documentation. |


## Invocation and generator lifetimes — 2026-11-11

`InvocationContext` owns source lists, text, XML trees, Acorn ASTs (including cached parse failures), and class extractions. `purgeClasses` passes it explicitly to extraction, diagnostics, and the SVG pipeline and clears it in `finally`. XML lists used for normal class/id extraction and missing-class detection remain separate. Configuration evaluation is scoped by `withConfigInvocation`; consumers receive deep copies so utility generation cannot mutate the evaluated configuration.

`generator-signature.js` signs effective configuration and relevant generator sources/tables. Unsupported values cause conservative rebuilding. The signature file is metadata only. Human-readable date comments remain in generated utilities for compatibility; they are no longer the invalidation key. `generated-files.js` compares bytes for independent generated text. Never route `app.tss` through it: LiveView uses its mtime as the execution guard.

`GeneratorInputs` shares CSS trees, codepoint rules, and icon names between TSS and JavaScript distribution builders in one orchestrated build. It is also used for paired Font Awesome Pro/Beta generation. Image contexts belong to one input image, share metadata/render buffers across Android and iPhone scales, and limit the render queue to two jobs. They are not persistent caches.

The test runner executes Node using `execFile(process.execPath, [file])`, propagates aggregate failures, and treats discovery errors as failures. `tests/performance/benchmark.mjs` compares source modules from the fixed audited revision `c5f735ad3387a028f8c21627eaf433085e9d283f` through a loader against the working implementation without copying or checking out projects. `PURGETSS_BENCH_BASELINE` can select another reference; the chosen revision must exist in Git history. It protects affected generated/config/asset files in memory and restores them in `finally`; exclude signature metadata from output equivalence and test it separately. Color differential tests and their benchmark use frozen original implementations in `tests/fixtures/color-shades/`, so those checks need no Git history. Existing unit/e2e fixtures remain separate from direct real-project benchmarks.
