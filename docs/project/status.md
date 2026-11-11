# Status — 2026-11-11

**Phase:** v7.19.0 released on GitHub and published to npm through trusted publishing.
**Session by:** Codex · GPT-6 family (exact model identifier not exposed).
**Version:** 7.19.0; `npm view purgetss version dist-tags.latest --json --prefer-online` returned 7.19.0 for both values.
**Branch:** `main`; the release and all preceding work have been pushed to `origin/main`.
**Release commit:** `7d44f9100afa4d588adbdbb853849c19d5c7336f`; annotated tag `v7.19.0` resolves to the same commit locally and on origin.

**README follow-up — 2026-11-11:** at César's request, `Recent changes` now contains only the three latest published versions (7.19.0, 7.18.0, 7.17.1) and links to the unchanged full CHANGELOG. The 4× source convention was moved out of the historical entries into its own usage section. Scoped checks verified the version window, unchanged retained entries and surrounding README content, preserved source-convention text, link target and unchanged CHANGELOG; no runtime tests were needed for this documentation edit.

**Report language correction — 2026-11-11:** at César's request, the public `docs/project/optimization.md` report was translated in full into English. Numeric data, reproduction commands, technical references, section/table/list counts and paragraph layout were checked against the preceding revision; no technical content was removed. César explicitly chose to keep the report public. A follow-up anonymizes the project names as Real project A/B/C, consistently with the README, replaces machine-specific report paths with examples, and removes the names from related project notes. Historical commits and the release tag retain their original content. The documentation site must link to the translated revision rather than the unchanged `v7.19.0` tag, which retains the historical Spanish report.

## Publication and verification

- César made the version bump in `9a4815a`. The confirmed release plan preserved 7.19.0, committed the Rust feasibility document in `dc9e520`, regenerated/checked the module after the bump, and promoted the complete Unreleased entry in `7d44f91`. The local tag was moved to that final release commit before its first remote push, as explicitly approved.
- [GitHub release v7.19.0](https://github.com/macCesar/purgeTSS/releases/tag/v7.19.0) is published, not a draft or prerelease, with the exact CHANGELOG notes.
- [Publish workflow 43083479984](https://github.com/macCesar/purgeTSS/actions/runs/43083479984) succeeded. It ran install, full distribution build, tests and npm publication. The test log reports **44/44 unit files, 7/7 integration files and 6/6 e2e files**. npm signed a provenance statement and reported `+ purgetss@7.19.0`.
- Both supported-Node workflows passed all three jobs: Node **20.12.0, 22.13.0 and 24**, on [the tag](https://github.com/macCesar/purgeTSS/actions/runs/43083480000) and [main](https://github.com/macCesar/purgeTSS/actions/runs/43083454929).
- npm initially reported that the package was processing. Registry availability was checked separately after that completed: `latest` is **7.19.0**, `gitHead` is the release commit, and the registry SHA-1 `932cdf57076129437dd2060550bbad422cf45612` matches the checked local package and publishing log. The package has **202 files**, and the registry advertises SLSA provenance attestations. Verified at **2026-11-11 19:06:12 UTC**.
- `npm run build:module`, version/header consistency and `git diff --check` passed locally. The package dry run excludes `docs/`, so this session-note commit does not change the published tarball. This note follows the release tag in its own `docs(project)` commit.
- All work was included as requested, including `docs/rust-port.md`; no files were excluded. Before writing this note, the working tree was clean and `main` matched `origin/main`. No global installation or real-project test mutation was performed for the release.

The five documented incompatible dependency advisories remain separate follow-up work. README and CHANGELOG document 7.19.0's public behavior. The sibling Docusaurus site and TiTools skill were not updated or published by this release; their historical follow-up notes remain below. Previous real-project and image benchmark evidence is retained in [optimization.md](optimization.md); those benchmarks were not repeated for publication.

**Documentation follow-up — 2026-11-11:** after the CLI release, César requested the official documentation update. `purgetss-docs` content commit `9d4e338` documents 7.19.0, including [execution profiles and performance](https://purgetss.com/docs/performance), Node requirements, configuration signatures and created/updated/unchanged messages. The site build and version check passed; six live pages were verified against the generated content. Both documentation copies were synchronized and the Context7 mirror was pushed in `ca7859e`. The site's own version remains 1.1.14; no additional CLI/npm release or GitHub Pages deployment was made. Detailed session state is in the sibling repository's `project/status.md`; TiTools remains a separate follow-up.

The implementation and earlier release records below are preserved as historical context. Their then-current statements about unpublished changes and pending work describe those earlier stages.

## Historical optimization implementation and commit closure — 2026-11-11

**Phase:** five-stage optimization completed and recorded in semantic commits at César's explicit request; no npm release/publication.
**Session by:** Codex · GPT-6 family (exact model identifier not exposed).
**Version:** 7.18.0 unchanged.
**Branch:** `main`; this session's commits have not been pushed.

**Follow-up — generated-file diagnostics:** César confirmed that the 12:18 Real project C activity was his manual `pt`, `pt b` and `pt bf` check. He found the retained `file created!` messages misleading when unchanged bytes preserved mtimes. Before optimization those generators wrote on each run; the new comparison skipped writes while retaining the old messages. The follow-up now reports created/updated/unchanged from the actual write decision, including fonts, definitions, utilities, paired Font Awesome outputs and the distribution module. Rebuild messages distinguish missing, unreadable/invalid signatures, changed inputs and conservative rebuilding. The `app.tss` write and LiveView guard remain intact. Targeted CLI message/mtime tests, same-second/LiveView tests, repeated-config tests, signature tests and lint cover the correction; earlier benchmark numbers describe the implementation validation, not a fresh benchmark of this logging follow-up.

The 16 audit findings are covered by the implementation or an explicitly preserved condition/deferred incompatible dependency fix. See [optimization.md](optimization.md) for the stage mapping, measurements, exact coverage and remaining five npm advisories.

- Direct medians: Real project A 1140.2 → 471.9; Real project B 680.5 → 448.8; Real project C 1591.3 → 547.1; minimal fixture 480.3 → 388.4. First-call costs are reported separately; an existing project without signature metadata rebuilds once.
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

The read-only closing check found Real project A and Real project B clean. Real project C has an untracked `purgetss/.cache/generator-signature.json` created at 12:18, with `app.tss` renewed at the same time, after the implementation validation archive was finalized at 12:14 and before this commit session. That later project activity was preserved, not deleted as benchmark residue.

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
