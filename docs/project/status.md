# Status — 2026-09-26

**Phase:** v7.18.0 released and published to npm
**Session by:** Claude Code · Opus 5.5 (`claude-opus-5-5`)
**Branch:** `main`, pushed, level with `origin/main`; only `.claude/memory/` is untracked (César's, deliberately left out)
**Repository state:** 11 semantic commits (`0616b78`..`8872b64`) plus release commit `ca48eb0`, tag `v7.18.0`, `publish.yml` run 36291062640 green

## Where things stand

v7.18.0 closes the CLI defects found while auditing the TiTools `purgetss` skill against this repo. Each one was reproduced with the CLI in a disposable project before it was fixed, except `swap()`, which was confirmed by reading the code only.

- Platform and device modifiers stack (`ios:tablet:`) and share one condition bracket; contradictions leave a comment in `app.tss`. Icons written only with a modifier are generated.
- `bg-from-(#hex)` no longer writes `{value1}`.
- `(Npx)` arbitrary values are accepted again.
- `dist/utilities.tss` lost the nine `*-keyboard-type-appearance*` classes, `snap-magnet`, and the "Android Only" label on `padding`.
- `icon-library`: every `--vendor` alias works, unknown values abort; Font Awesome Pro/Beta `--module`/`--styles` and `purgetss build` work (the builder had a wrong template path).
- `images --width` is bounded at 1024; one `detectProjectType()` serves every command.
- `init --all` removed.

The reasoning is in `decisions.md` (2026-09-26 entries); the traps found along the way (dead helpers, unreliable completions data, Alloy's single-bracket selector) are in `context.md`.

## In flight

`purgetss-docs` has 20 uncommitted files from this session: corrections to 15 pages matching the list in the audit handoff, the new stacked-modifier section, and five glossary files synced from the regenerated `dist/glossary/`. They document v7.18.0 behavior and have not been released or deployed; that repo has its own release, rsync deploy and mirror sync. It also still names `ic_stat_notify` in `docs/app-assets/1-app-icons-and-branding.md`, open since v7.17.1.

TiTools' `purgetss` skill describes the pre-7.18.0 behavior in the passages listed at the end of the audit handoff (vendor aliases, `snap-magnet`, the `px` message, `bg-from-`, the `padding` label, grid class names). Its class indexes need regenerating after its `.purgetss-source` cache is updated. Nothing in TiTools was edited from here.

## Next step

Review and release `purgetss-docs` (commit, `npm run build`, deploy, `npm run clean:md`), fixing the `ic_stat_notify` reference in the same pass. Then update TiTools.

Open questions left for César:
- `snap-magnet` was a planned feature (docs said "(planned)" in April). It was removed; if the magnet is wanted, it returns with an implementation.
- The Font Awesome Pro/Beta reset templates use `FontAwesome6Pro-*` family names while the fonts are copied as `FontAwesome7Pro-*`; needs a test with real Pro fonts.
- Dead code noted, not removed: `helperToBuildTailwindClasses()` and the helpers only it reaches; `copyFont`/`copyFontLibraries` in `src/cli/commands/fonts.js`.
- The class-syntax validator still rejects `top-(-10)`, which `formatArbitraryValues` supports.

## Verified vs. assumed

- Verified: `npm test` passed before the release commit (unit, integration, e2e all green).
- Verified: `tests/unit/shared/generator-fixes.test.js` fails in all six sections against the v7.17.1 code and passes now.
- Verified: `publish.yml` run 36291062640 concluded `success`; its log shows `+ purgetss@7.18.0` with a provenance statement; `npm view purgetss dist-tags.latest` returns `7.18.0`.
- Verified: GitHub release at `https://github.com/macCesar/purgeTSS/releases/tag/v7.18.0`.
- Verified: `git status --short --branch` reports `## main...origin/main`, `git log @{u}..HEAD` is empty before this note's commit.
- Verified: `package.json` `files` excludes `docs/`, so this note is outside the tarball.
- Verified: `npm run docs:check` in `purgetss-docs` passed against v7.17.1, before the bump; not rerun against v7.18.0.
- Assumed, not verified: `swap()` behavior on a device; stacked modifiers on a real Alloy build (verified against Alloy 3.0.1's `STYLE_REGEX` and generated `app.tss` only); Font Awesome Pro output with genuine Pro fonts (tested with a fake Beta CSS).
- Assumed, not verified: the `purgetss-docs` site builds with the edited pages; `npm run build` was not run there.
- Pre-existing and untouched: `tests/unit/shared/helpers.test.js` reports 15/16 (Animation module count 28/27); the runner still counts it as passing.
