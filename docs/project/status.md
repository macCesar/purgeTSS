# PurgeTSS 7.20.1 released — 2026-11-11

**Phase:** released on GitHub and published to npm as `latest`. **Branch:** `main`. **Release commit:** `290438fcbfa9df503db3b1b61838e71f31037e01`; annotated tag `v7.20.1` resolves to that commit locally and on origin. Publication occurred at 2026-11-12 00:58 UTC, still November 11 in the project's America/Matamoros timezone.

César explicitly invoked `aiskills:release` and confirmed the reviewable publication plan. That authorization superseded the earlier no-push instruction for this release and its session-note closure. The package, lockfile and generated module were already aligned at 7.20.1; no extra version bump was applied. `290438f` promotes all seven Unreleased corrections and updates README's release wording and latest-three summary to 7.20.1/7.20.0/7.19.0. The only removed README release entry is 7.18.0, retained in the complete changelog; current usage details and examples remain intact.

## Verified publication

- [GitHub release v7.20.1](https://github.com/macCesar/purgeTSS/releases/tag/v7.20.1) is published, not a draft or prerelease. Remote `main` and the peeled release tag were verified at the release commit before session closure.
- [Publish workflow 43131097166](https://github.com/macCesar/purgeTSS/actions/runs/43131097166) succeeded: tag/version guard, dependency installation, full distribution build, 50/50 unit files, 7/7 integration files and 6/6 e2e files, then `npm publish`. The log reports `+ purgetss@7.20.1` and signed GitHub Actions provenance.
- Both supported-Node workflows succeeded for 20.12.0, 22.13.0 and 24: [tag 43131097130](https://github.com/macCesar/purgeTSS/actions/runs/43131097130) and [main 43131094323](https://github.com/macCesar/purgeTSS/actions/runs/43131094323). Full builds/tests ran in CI; earlier successful focused implementation tests were not repeated locally solely for release metadata.
- Registry endpoints for `/purgetss/7.20.1` and `/purgetss/latest` both returned 7.20.1, with `gitHead` equal to the release commit. Initial requests returned 404/old latest while npm processed the publication; retry verification completed successfully without republishing.
- Downloaded the 13,049,791-byte registry tarball and verified SHA-1 `02249a99bf4fefc1f4037f9fbe06296a934accde`, matching registry metadata, the publishing log and the local package dry run. SLSA provenance metadata is present in the registry response. Package dry run contains 205 files and excludes all `docs/` session files.
- Local release checks verified package/lock/module version agreement, CLI `--version`, unchanged historical CHANGELOG content, README's three-version window and preserved surrounding usage content, plus clean diff/staged checks. Startup import traversal checked seven context/import files and found no import of volatile `status.md`.

The following `docs(project)` commit records this publication and its release decision, then is pushed under the same confirmation. Context and requirements remain valid and needed no release-specific edits. Session files are excluded from the npm payload; this documentation commit follows the tag and does not change the published artifact.

No release task remains. The official site's prior 7.20.1 documentation publication is recorded in the sibling repository; this CLI release did not redeploy it. Incompatible dependency upgrades, fixed Pro/Beta header versions and genuine Pro/Beta/device glyph rendering remain separate follow-up scope. Existing automatic save/upload workflow applies; it is distinct from the verified GitHub/npm publication above. No global package installation was performed.

Earlier implementation and release records follow as historical context. Their statements about pending publication, uncommitted changes and no-push restrictions describe those earlier stages.

---

# Icon class priority and custom CSS corrections — 2026-11-11

**Phase:** the three follow-up fixes are committed for 7.20.1; CLI/npm publication remains pending. **Branch:** `main`; closure base: `6f67b62`. César requested semantic commits and session updates; the no-push instruction remains in effect.

Completed the three typography follow-ups explicitly authorized by César: per-selector priority, removal of Font Awesome comment suppression, and modern custom CSS parsing. For direct purging, `fonts.tss` takes precedence over project `fontawesome.tss`, then bundled catalogs; missing selectors fall through and overridden selectors are not emitted again. `apply` now uses the same ordered project-plus-bundled source list, retaining Free fallback even when the project Font Awesome catalog exists. Catalog content/selector sets are cached within a purge, not across invocations. Font-family classes remain separate from glyphs; custom Pro glyphs do not automatically create a `fas` family alias.

`build-fonts` now reads literal `--fa` and legacy `content` declarations regardless of order, processes all simple class aliases in a selector group, ignores nonliteral `var(--fa)` references and preserves supplementary Unicode through surrogate escapes in TSS and CommonJS. Filename-derived prefixes and normal text-font handling are retained. Both Alloy and Classic were exercised with the actual installed Free 7.3.1 CSS and bundled font fixtures. No genuine Pro rendering or device glyph verification is claimed.

Verification: both new regression scripts failed before implementation and pass after it. `font-source-priority.test.js` covers local/project/bundled collisions, partial-catalog fallback, Font Awesome comments, four bundled families, small/indexed selections, platform/device modifiers, platform-specific apply targets, and actual CLI app.tss assembly. `build-fonts-css.test.js` covers modern/legacy/single-quoted CSS, aliases, declaration order, supplementary Unicode, filename prefixes, actual FA7 catalog output and Classic module generation without creating an Alloy app tree. Existing icon-index, apply-index and generated-file-messages tests pass. Focused ESLint and diff checks pass. No whole CLI suite or unrelated distribution rebuild was needed.

README/CHANGELOG and official custom-font/apply guides document the behavior, preserving examples and the warning about collisions within user-supplied prefixes. The three previously pending review findings are resolved by this change. CLI version stays 7.20.1. Before this closure the changes were uncommitted; the following records supersede that state.

## Semantic commits and closure

- `2893587` — per-selector icon source priority, fallback and removal of comment-based catalog suppression, with the shared catalog helper and regression coverage.
- `571b885` — modern/legacy font CSS parsing, aliases and supplementary Unicode, with its Alloy/Classic regression script.
- `b0c8b61` — README/CHANGELOG explanations of priority and custom CSS behavior.
- The following `docs(project)` commit records this closure and the stable context, decisions and requirements R17–R18.

Closure reviewed the actual diff, helper and source changes against the recorded behavior. `git diff --check` and staged diff checks passed. The successful focused tests, related regressions, lint and real CLI/FA 7.3.1 checks above are implementation evidence reported by César and retained from the implementation notes; they were not repeated solely to create commits. No unrelated distribution rebuild was needed.

The sibling `../purgetss-docs/project/status.md` confirms the official guides and mirrors were updated, the site build/docs check passed, rsync deployment exited 0 and the three affected live routes matched the build. Those are prior deployment results, not a new deployment or live verification in this closure. Existing save/upload workflow applies. No push, tag, npm publication or global installation was performed here.

Next: continue any further 7.20.1 adjustments or begin a separately authorized release. The three typography findings are resolved; incompatible dependency work and the fixed Pro/Beta header version remain separate. Prior records below describe their own point in time, including then-pending findings and uncommitted states.

Earlier records follow.

---

# Current session — 2026-11-11

**Phase:** accumulated corrections committed after the 7.20.0 release, preparing 7.20.1; further adjustments may follow. **Branch:** `main`; closure base: `4153caa`.
**Instruction:** César clarified that he meant **do not push**, and explicitly requested semantic commits plus updated session documents. This supersedes the earlier no-commits interpretation. Commit the accumulated corrections and these notes; no push, tag or publication is authorized by this closure.

## Accumulated corrections

- **Correct Completions permissions and remove invalid utilities:** the v3 extractor was corrected to generate the `readOnly` indicators in `lib/completions/titanium/completions-v3.json` correctly, then the generated input was refreshed through that extractor, not by hand-editing JSON. PurgeTSS now excludes properties marked `readOnly: true`. The previous session evidence records 2,865 corrected flags across 2,905 entries, preserving descriptions and other fields. Names shared with a writable SDK type remain eligible; this global flag is not a per-owner permission guarantee. César explicitly reaffirmed that removing classes for read-only properties is an intended correction, not lost supported functionality.
- **Generated catalog:** the earlier measured comparison against published 7.20.0 is 23,805 → 23,449 classes: 261 read-only classes and 95 invalid numeric variants removed, with no new class names. The generated glossary removed 45 property pages. These figures and the sibling-site checks below are prior-session evidence, not newly rerun measurements in this documentation pass.
- **SDK 14 values:** SplitWindow fractions are numeric ratios from 0 to 1; minimum/maximum widths are numeric points, with iOS conditions. Invalid custom values fail before replacing utilities. Inverted negatives such as `top-(-10)` are rejected by the formatter as well as the validator; `-top-(10)` remains supported.
- **Font Awesome Free:** Solid, Regular and Brands desktop OTFs are still supplied manually in `src/fonts/`. Internal PostScript metadata supplies families, JavaScript aliases and copied filenames. Builders validate the fonts against the installed npm package version and reject mismatches, missing faces or duplicate faces. Obsolete generated Free filenames are removed when families change. Copies keep the `.ttf` extension without converting the OTF bytes.
- **Font Awesome Pro/Beta:** TSS, JavaScript families/aliases and copied filenames use the installed TTF PostScript names; missing optional faces are omitted and the alternate Pro installation path generates JavaScript too. Their TSS/JavaScript header templates still contain a fixed **7**; metadata-driven family names do not imply automated Pro/Beta header versions.
- **Other icon headers:** Free uses the installed Font Awesome npm version validated against the OTFs; Framework7 uses its installed npm package version. Material Icons and Material Symbols use each bundled font variant's version metadata in both TSS and JavaScript, with fixed update dates removed. Material classes still come from manually maintained `.codepoints`, which must be updated together with the corresponding fonts; a header does not establish that they match.

## Verification and next step

This pass inspected Git status/diffs, the metadata helpers, active generator changes and header templates, plus the four project documents. Earlier targeted test/build/lint results remain recorded below as historical evidence; no runtime tests or builds were repeated for this documentation-only update. Existing source, generated outputs, tests, README and CHANGELOG changes were already present on arrival and were preserved.

**Semantic-commit closure:** after César clarified the no-push instruction, the accumulated changes were committed by responsibility:

- `4ddda43` — filter read-only SDK properties, correct SplitWindow values and regenerate utilities.
- `7012925` — reject inverted negative arbitrary values.
- `6041508` — derive Font Awesome families, aliases and copied filenames from font metadata, with Free validation and Pro/Beta support.
- `9c05c48` — generate icon headers from installed package and bundled font versions.
- `1cd3840` — align the existing 7.20.1 package version, lockfile and generated module header.
- `ba0400a` — document generator corrections and icon font maintenance in README/CHANGELOG.

The following `docs(project)` closure commit records these four session documents. Fresh closure checks: `git diff --check` and staged diff checks passed; a structural JSON comparison confirmed exactly 2,865 `readOnly` changes and no other Completions data changes. Manifest/module versions agree at 7.20.1 and lockfile dependency resolutions are unchanged. `npm run build:module` succeeded after manifest alignment and reported byte-identical generated output. Prior successful targeted tests were not repeated solely to create commits, following the repository's proportional-validation rule. No push, tag or npm publication was performed.

The earlier documentation pass found `package.json` and the generated module header at **7.20.1**, with both lockfile version entries still at **7.20.0**. During semantic-commit closure, both lock entries were aligned to the existing **7.20.1** package version before regenerating `dist/purgetss.ui.js` through `build:module`. Dependency resolutions remain unchanged. Existing save/upload workflow applies; this pass did not independently verify file transfer or server runtime, and automatic upload is separate from npm publication.

Next: César continues the remaining adjustments from the semantic commits. Keep them unpushed. The earlier font precedence, Font Awesome substring suppression, modern CSS parsing and incompatible dependency findings below remain separate follow-up work. No external blocker was identified for this closure. Prior release and implementation records follow; their version, count and authorization statements describe their own point in time, not the current session instruction.

---

# Remaining bundled icon header automation — 2026-11-11

Implemented the requested Framework7, Material Icons and Material Symbols TSS/JS header automation for 7.20.1. Framework7 takes the installed npm package version; both Google libraries report the name-table version of each bundled font variant from `assets/fonts/`. The manually maintained 2023 update dates and fixed Material Icons 4.0.0 header label were replaced by this input metadata. Some Icons variants carry ISO timestamps, not semver; Symbols variants currently report Version 2.637. These values describe the bundled fonts, not an inferred release of the separately maintained codepoint lists. Sources still require manual matching font/codepoint updates. Codepoint and SVG/ligature class generation, reset families, runtime exports and font-copy behavior are preserved.

`GeneratorInputs.fontVersion()` caches parsed font versions within one shared invocation; missing metadata fails rather than guessing. Framework7 rejects missing package version metadata before replacing its generated outputs. New `icon-font-headers.test.js` failed on the old fixed header and now passes after changing package/font versions in a disposable copy, checking both TSS/JS headers, unchanged class/export data and preservation of outputs when package metadata is missing. Existing generator-inputs and icon-module family tests pass; focused ESLint passes. Ran only the six affected builders. Independent comparisons against HEAD confirm the generated classes, glyph catalogs, families and aliases are equal; generated Google changes are header-only, and Framework7 output remains byte-identical with the current package. No full CLI suite, commit, push, tag or CLI publication was performed.

CLI README/CHANGELOG and official icon documentation now explain the version sources and contributor workflow. Earlier review findings about fonts.tss/catalog precedence, the Font Awesome substring suppression and modern CSS parsing in build-fonts remain a separate follow-up; this header work does not resolve those findings.

Earlier notes follow.

---

# Font Awesome Free metadata automation — 2026-11-11

Implemented for the 7.20.1 preparation at César's request. Free now resolves Solid/Regular/Brands PostScript names from the manually supplied desktop fonts in `src/fonts/`, uses them in TSS and JavaScript families/aliases, builds matching distributed filenames, and resolves bundled Free filenames in both copy paths. Header templates use `__FA_VERSION__` filled from the installed `@fortawesome/fontawesome-free/package.json` version. Contributors still download and replace the OTFs manually. Source metadata versions must match the installed npm version; missing/duplicate faces and mismatches fail the affected Free builders before writing their outputs. Old generated Free major-version filenames are removed from `assets/fonts/` after validated copies; other font assets are preserved. OTF bytes retain the existing `.ttf` distribution filename convention without format conversion.

Verification: the new isolated Free contract failed before implementation and now passes five scenarios (metadata-driven generation/headers and Alloy copying, Classic copying, mismatch, missing face, duplicate face). Tests derive fixture versions/names dynamically from the current dependency and fonts. Pro/Beta contract and existing icon-module family test pass. Focused ESLint passes. Ran `build:fa`, `build:fa-js`, `build:fonts`; current TSS and font binaries are identical to HEAD and JS exports, families and full icon catalog are equal (generated family-object formatting/order changes only). No full CLI suite was needed. README/CHANGELOG describe the contributor workflow and preserved manual steps; sibling official docs cover it under 7.20.1. No CLI commit, push, tag or publication was performed here.

Earlier notes follow.

---

# Generic readOnly filter and regenerated input — 2026-11-11

Supersedes the earlier four-name exclusion/unchanged-input status below. Installed VSCode1.5.0 commons generator patched and SDK14 JSON regenerated through it, then imported to lib/completions/titanium/completions-v3.json.2865flagschanged; descriptions and all other fields retained. No manual JSON metadata editing. Backup ~/.titanium/backups/completion-permissions-s9dv9awk retained. No user/notiGAPE language-server config change; workbench generation not observed, direct installed-generator invocation verified.

getPropertiesFromTiCompletionsFile now reads readOnly===true; arbitrary readonly/writable/mixed probe tests pass, replacing the four newly added hardcoded SceneProxy exclusions. SDK14valid ratios/bounds tests, config-invocations, generator-fixes, generator-signature and touched code lint pass. Targeted build generated utilities23449classes/593paths/391prefixes with0readonlyassignments. Published23805→23449 removes261readonlyclasses+95invalidnumericvariants; no class names added. Generated glossary removed45oldpages. Source/site630files now match, after docs importer stale-generated-page fix and3regressions. All45deletednames independently verified read-only in original api.jsca, not inferred from the changed flags.

TiTools indexes and practical guidance refreshed; source & installed Completions data equal despite source formatter changing whitespace. Dependencies/version/lock unchanged; no commit/push/release. Shared evidence TiTools docs/project/purgetss-installed-permissions-2026-11-11.md. Prior source-only records preserved below.

# Unreleased SDK14 and Font Awesome corrections — 2026-11-11

Authorized from the TiTools PurgeTSS audit: fix the identified generator/font issues, leave incompatible dependency work pending, no commits/push/release. Package/lock remain7.20.0. Existing official release record below is historical; these worktree changes have not been published.

Implemented:
- `src/core/builders/auto-utilities-builder.js`: exclude the four read-only SceneProxy states through the existing exclusion policy; numeric ratio scale includes all fraction suffixes plus0/1/full, SplitWindow bounds contain numeric points only, iOS conditions added. Invalid ratio/bounds overrides fail before replacing utilities. No blanket trust in the legacy inverted global readOnly flag.
- `src/shared/helpers/utils.js`: inverted negatives return no properties/comment even on direct formatter calls. CLI rejection remains intentional; -top-(10) is supported.
- New `src/dev/utils/fontawesome-fonts.js` resolves installed TTF PostScript metadata for both font-copy routes, reset TSS and JS family/face exports. Replaced version guesses in Pro/Beta resets and active builders; alternate Pro location now generates JS. Optional faces omitted; invalid font metadata stops generation before output. Built-in Free artifacts unchanged.
- Generated `dist/utilities.tss` rebuilt using `npm run build:tailwind`; no hand edits. TiTools indexes regenerated from this output:23702unique names,634properties,409prefixes. SDK14 compatibility, migration/version notes and font guidance distinguish these source corrections from published7.20.0.

Completions boundary and origin:
César corrected an attempted manual metadata edit. All seven readOnly edits were reverted; `git diff --exit-code -- lib/completions/titanium/completions-v3.json` passes. Do not hand-edit or normalize this extension-generated input on SDK updates. The installed SDK14 api.jsca already has permission=read-only for isActive/isForeground/isPrimary/isKey and read-write for three SplitWindow widths. Separate local titanium-editor-commons fix changes the inverted permission comparison and duplicate merge;2865flags corrected across2905entries, all other fields including descriptions identical in isolated SDK generation. No extension patch or completion replacement performed. Its original description PR820 remains untouched remotely; recommend a separate permissions PR. Global metadata cannot express all per-owner permissions for80mixed names. Exact SDK GA YAML pin269fc733a813ea4ef0b27a36b34a63e8a5107aa0.

Validation:
- Red/green: new sdk14-utilities and fontawesome-family-contract tests failed on original source; strengthened generator-fixes failed on direct inverted negatives. All pass after fixes.
- Eight focused files pass: SDK14/FontAwesome contracts, generator-fixes, cli/config-invocations, core/generator-inputs, core/generator-signature, integration/classic-command-compatibility and icon-module-families. Six font fixture variants cover Pro/Beta, alternate, Classic, optional faces and invalid metadata using real bundled TTFs; no genuine Pro/Beta/device rendering claim.
- Eight touched JS/test files ESLint clean, targeted distribution build clean and repeat output unchanged, diff check clean. No full-suite/release testing was needed; shared generation/config and Classic font paths were explicitly checked.
- npm dry-run203files includes new metadata helper; tests/docs/private notes absent. README and Unreleased changelog updated without removing existing usage. Dependencies/package/lock unchanged by user choice. Review deleted output classes as invalid old read-only/spacing or unsupported values; no unrelated valid generated family removed.

TiTools docs/project/purgetss-source-fixes-2026-11-11.md records the cross-repo evidence and final index/link checks. Existing save/upload workflow applies. No global install, device test, dependency fix, commit, push, tag, PR edit or release.

---

# Status — PurgeTSS 7.20.0

**2026-11-11 · Phase:** v7.20.0 released on GitHub, available on npm as latest, and documented on the deployed Docusaurus site.
**Session by:** Codex · GPT-6 family (exact model identifier not exposed).
**Branch:** `main`. **Release commit/tag:** `dbc4c223d06c957411fbf6a0399541f31835c3d7` / `v7.20.0`, verified on origin.

## SDK 14 release

César committed the SDK Completions and generated utilities in `d73ad34`, bumped both manifests in `34d8270`, and regenerated the module header in `ce3c6d4`. This release adds notes in `dbc4c22` and aligns the previously unpublished local tag with that final commit before pushing it. Compared with v7.19.0, the Completions add 63 property entries and recover 356 previously empty property descriptions. The glossary gains 18 pages and updates 135 existing property pages.

- [GitHub release v7.20.0](https://github.com/macCesar/purgeTSS/releases/tag/v7.20.0) is published.
- [Publish workflow 43112803168](https://github.com/macCesar/purgeTSS/actions/runs/43112803168) succeeded: build, 44/44 unit files, 7/7 integration files, 6/6 e2e files and npm publication. npm reported `+ purgetss@7.20.0`, signed provenance and explicitly reported package processing.
- Both supported-Node workflows passed all three jobs (20.12.0, 22.13.0, 24): [tag 43112803176](https://github.com/macCesar/purgeTSS/actions/runs/43112803176) and [main 43112800128](https://github.com/macCesar/purgeTSS/actions/runs/43112800128).
- Local full distribution build, configuration-invocation tests, generator-contract tests, CLI version/help and diff checks passed. Existing diagnostic output in the syntax test is expected. Full test suites were run by CI rather than repeated locally.
- Package dry run: 202 files; SHA-1 `bb785508078c72254172eeba7240ab555c8de622`, matching the publishing log. `docs/` is excluded from the package.
- Registry availability verified after processing: `/purgetss/7.20.0` and `/purgetss/latest` both return 7.20.0, with `gitHead` equal to the release commit and SLSA provenance attestations. The downloaded 13,049,383-byte tarball matches SHA-1 `bb785508078c72254172eeba7240ab555c8de622`, identical to the local build and publishing log. The first bare tarball requests hit a cached 404; a cache-busting request downloaded and verified the package.

## Documentation launch

The Docusaurus site documents 7.20.0 and the SDK 14 glossary. `73aa24c` fixes glossary import by `clean:md`; `36c8fbf` adds release pages and generated glossary; `f07ff51` records the verified launch. All are pushed. Site version remains 1.1.14. Context7 documents and README are pushed in `4df9bfc`; glossary import does not extend the mirrors' content scope.

Site build, version check and two sync regressions passed. `npm run deploy` succeeded. Six live routes returned HTTP 200 and matched the build through `</body>`: home, changelog, installation, new snapping/linkColor glossary pages and the recovered allowBackground description. The 675 imported glossary files match their generated sources byte for byte. README/home retain the latest three versions; 7.17.1 remains in the full changelog. No current API or usage documentation was removed.

The release skill was explicitly named mid-execution; it was absent from the initial skill catalog and was then read from the installed aiskills source. Its invocation policy is explicit-only. The existing publication authorization was retained. No skill configuration was changed.

No release or site-launch work remains. Session notes land after the release tag and do not change the npm package because `docs/` is excluded. Earlier records below are retained as historical context.

---

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
