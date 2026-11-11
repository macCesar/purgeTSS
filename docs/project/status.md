# Status — 2026-11-11

**Phase:** five-stage optimization completed and recorded in semantic commits at César's explicit request; no npm release/publication.
**Session by:** Codex · GPT-6 family (exact model identifier not exposed).
**Version:** 7.18.0 unchanged.
**Branch:** `main`; this session's commits have not been pushed.

**Follow-up — generated-file diagnostics:** César confirmed that the 12:18 EM Industrial activity was his manual `pt`, `pt b` and `pt bf` check. He found the retained `file created!` messages misleading when unchanged bytes preserved mtimes. Before optimization those generators wrote on each run; the new comparison skipped writes while retaining the old messages. The follow-up now reports created/updated/unchanged from the actual write decision, including fonts, definitions, utilities, paired Font Awesome outputs and the distribution module. Rebuild messages distinguish missing, unreadable/invalid signatures, changed inputs and conservative rebuilding. The `app.tss` write and LiveView guard remain intact. Targeted CLI message/mtime tests, same-second/LiveView tests, repeated-config tests, signature tests and lint cover the correction; earlier benchmark numbers describe the implementation validation, not a fresh benchmark of this logging follow-up.

The 16 audit findings are covered by the implementation or an explicitly preserved condition/deferred incompatible dependency fix. See [optimization.md](optimization.md) for the stage mapping, measurements, exact coverage and remaining five npm advisories.

- Direct medians: notiGAPE 1140.2 → 471.9; Generador de Tablas 680.5 → 448.8; EM Industrial 1591.3 → 547.1; minimal fixture 480.3 → 388.4. First-call costs are reported separately; an existing project without signature metadata rebuilds once.
- Full suite: 43 unit files, 7 integration files, 6 e2e files passed. Later focused regressions verify profile argument semantics, handled prompt failures, symlink retargeting, unchanged derived mtimes, image failure-stop and color ties. JS/MJS and the CLI entry point pass lint; CI YAML and package dry-run were checked.
- All 56 codec outputs match in bytes/pixels/dimensions/alpha. The image queue passed the 20% maximum-RSS acceptance criterion; it remains capped at two.
- Config is evaluated per invocation and cloned; source analysis is shared only within a purge. Only signature metadata persists. The two-second LiveView guard and every completed `app.tss` write remain intact.
- Compatible dependency fixes are included, including Sharp 0.35.5. Five css/source-map/glob-chain advisories need incompatible upgrades and remain documented. Engines preserve valid Node 20.12 support and CI covers the declared minimum branches; local validation used Node 22.23.2, and no remote workflow was triggered.
- All three real projects were restored individually to their previous files/timestamps and Git state. No real-project copies, worktrees, global installations, pushes or version changes were made. The pre-existing untracked `docs/rust-port.md` is retained outside the commits.

## Semantic commits and session closure

The implementation initially remained uncommitted under the original plan. César then explicitly requested semantic commits and session-document updates on 2026-11-11. The implementation/test commits are:

| Commit | Scope |
| --- | --- |
| `ebd8b4a` | `fix(tests)`: propagate runner and aggregate assertion failures. |
| `e544d19` | `chore(deps)`: compatible dependency fixes and supported Node versions/CI. |
| `6841cb6` | `feat(cli)`: structured profiles, independent timers, lazy commands and awaited maintenance operations. |
| `04ebcf4` | `perf(core)`: invocation analysis reuse, class/apply indexes and generator signatures. |
| `8a4a7e9` | `perf(build)`: shared generator inputs and ordered distribution orchestration. |
| `7ecaef8` | `perf(images)`: shared renders and bounded concurrency. |
| `0964399` | `perf(colors)`: palette conversion reuse and frozen differential fixtures. |
| `7eca5e5` | `test(perf)`: reproducible benchmarks anchored to the audited revision. |

The closing `docs(project)` commit records these hashes and updates README, CHANGELOG, requirements, context, decisions, this status and the detailed optimization report. At César's request, README includes a measured before/after table, equivalence results and the initial signature setup cost. The original reference remains `c5f735ad3387a028f8c21627eaf433085e9d283f`, independently of HEAD. Color tests import frozen reference fixtures so they also run in shallow CI checkouts without Git history.

Closure validation was limited to the new reference handling: color equivalence and runner failure tests passed; a startup benchmark smoke test after the eight commits retained the audited SHA, separate initial calls and five alternating samples per variant, with equivalent output bytes. Lint reported no errors in the changed reference tooling (one existing-style warning in the frozen color reference). The completed full suite and real-project/image measurements above were not repeated merely to make commits. Small closure evidence is saved alongside the implementation evidence; benchmark temporaries were removed.

The read-only closing check found notiGAPE and Generador de Tablas clean. EM Industrial has an untracked `purgetss/.cache/generator-signature.json` created at 12:18, with `app.tss` renewed at the same time, after the implementation validation archive was finalized at 12:14 and before this commit session. That later project activity was preserved, not deleted as benchmark residue.

Session documents are tracked; CLAUDE/GEMINI startup imports reach only the stable project documents, with no direct or transitive import of `status.md`. Existing historical documentation remains intact. Saving files follows César's existing SFTP auto-upload workflow; Git push and npm publication were not performed.

No implementation task from these stages remains open. A separate dependency-compatibility task can address the documented major-version changes; release/publication is outside this task.

The prior release record below is retained as historical context, including its then-current next steps.

## Historical status — 2026-09-26

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

`purgetss-docs` v1.1.14 documents v7.18.0: released (`1523500`, tag `v1.1.14`), deployed to purgetss.com and synced to `purgetss-docs-context7` (`c5c2055`). Its `project/status.md` has the verification. The `ic_stat_notify` mention left in its branding page is the deliberate migration note, not a stale reference.

TiTools' `purgetss` skill describes the pre-7.18.0 behavior in the passages listed at the end of the audit handoff (vendor aliases, `snap-magnet`, the `px` message, `bg-from-`, the `padding` label, grid class names). Its class indexes need regenerating after its `.purgetss-source` cache is updated. Nothing in TiTools was edited from here.

## Next step

Update TiTools' `purgetss` skill and regenerate its class indexes.

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
