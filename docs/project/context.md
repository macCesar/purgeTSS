# Context

## Documentation map

| Document | What it covers | When you need it |
| --- | --- | --- |
| `README.md` | Public product overview, installation, command surface, and recent changes. | Before changing user-visible CLI behavior. |
| `CHANGELOG.md` | Canonical release history and current Unreleased work. | When planning or publishing a release. |
| `CONTRIBUTING.md` | Animation module implementation invariants. | Before changing `purgetss.ui` animation methods. |
| `docs/error-reporting-consolidation.md` | Partially implemented proposal to unify CLI error reporting. | Before touching syntax/config error presentation. |
| `docs/jit-class-resolution-proposal.md` | Proposed staged migration from prebuilt utilities to JIT class resolution. | Before starting any JIT resolver phase. |
| `docs/prompt.md` | Historical handoff prompt for the first JIT color experiment. | For provenance only; verify its branch/status assumptions before reuse. |
| `tests/README.md` | Quick testing commands and suite layout. | For daily validation. Some recorded suite counts are historical. |
| `tests/TESTING-GUIDE.md` | Detailed test-runner output and structure. | When changing the test harness or debugging suite output. |
| `slack-posts/long-post.md` | Long-form announcement draft for older v7.3–v7.5 changes. | When reusing historical release communication. |
| `slack-posts/short-post.md` | Short announcement draft for the same older releases. | When reusing historical release communication. |
| `/Users/cesar/Developer/openSource/purgetss-docs` | Official Docusaurus documentation source and its release/deploy workflow. | Every time public behavior, configuration, or help changes. |

## Architecture

PurgeTSS is an ESM Node.js CLI. `bin/purgetss` defines the public command surface, `src/cli/` handles command entry points, `src/core/` contains analyzers/builders and the branding pipeline, and `src/shared/` holds cross-cutting configuration and utilities. `lib/templates/` contains source templates copied into projects; `dist/` is generated for distribution. `tests/` combines unit, integration, and real CLI workflows against disposable copies of `test-project/`.

Branding behavior is data-driven from `src/core/branding/pieces.js`. Project layout determines destination roots, deployment targets determine enabled platform families, and piece-specific generators own format/alpha/sizing behavior. Keep those concerns separate.

## Conventions

- Use ESM, 2-space indentation, single quotes, and no semicolons.
- Add user-visible behavior to CLI help, `README.md`, `CHANGELOG.md`, and the sibling Docusaurus source in the same stretch of work.
- Use `apply_patch` for hand edits; regenerate `dist/` only through npm build scripts.
- Keep commits semantic and atomic. Root screenshots and temporary example PNGs stay out of commits.
- Test destructive asset generation in a committed fixture project and restore only that fixture afterward.

## Traps

- A fresh Classic template is not an exhaustive list of files Titanium can consume. In particular, Android `Resources/android/images/res-*` qualifiers remain useful even when absent initially.
- `brand.background` is not an instruction to paint every piece: dark/tinted variants have platform-specific alpha/compositing rules.
- An opaque full-bleed source already contains its own background. Adding padding exposes PurgeTSS's canvas background and can create a contrasting frame.
- The official docs are a sibling repository with a separate version, release, rsync deployment, and mirror-sync workflow. A clean CLI release does not publish those docs automatically.
- `tests/README.md`, `tests/TESTING-GUIDE.md`, and some assistant context describe historical test counts; trust the current runner output.

## Provenance

| When | Assistant · model | What it produced |
| --- | --- | --- |
| 2026-08-30 | Codex · GPT-5 | Classic/deployment-aware brand pipeline, full-bleed iOS/store defaults, frame diagnostics, tests, and synchronized documentation. |
