# Staged optimization — implementation and verification

Date: 2026-11-11. Version retained: **7.18.0**. Code baseline: `c5f735ad3387a028f8c21627eaf433085e9d283f` (HEAD before implementation, pinned for future comparisons). The implementation was initially left uncommitted as planned; César later explicitly authorized the semantic commits and documentation closure recorded in [status.md](status.md). No worktrees, global installations, version changes, pushes or npm publication were performed. The already untracked `docs/rust-port.md` was kept outside the commits.

Session authorship: Codex, GPT-6 family; the exact model identifier is not exposed.

## Scope of the five stages

| Stage | Findings | Implementation and testing |
| --- | --- | --- |
| 1. Testing and measurement | F-09, F-10 | Effective exit codes for categories, files, discovery and aggregate checks; expected e2e files also determine success. Independent timers using `performance.now()`. Global JSON profiles, aliases, `--all`, controlled errors, unwritable destinations and LiveView skips. |
| 2. Reading and analysis | F-01 | Explicit per-purge context containing paths, text, XML, ASTs, parse failures and extractions. Shared by extraction, diagnostics and SVG processing, and released in `finally`. Class/id lists and missing classes remain distinct. Acorn, entities, XML validation and the regex fallback are preserved. |
| 3. Resolution and build | F-02, F-03, F-04, F-05 | Linear path for up to 32 candidates and indexes for larger lists, preserving traversal, duplicates and first matches. Escaped selectors retain the original search. `apply` indexes exact selectors, preserves prefixes/opacity and queries updated positions; it reads sources only when needed. Missing-class detection uses UTF-16 Aho–Corasick and shared extractions. The full catalog, definitions and glossary are preserved. |
| 4. Configuration and startup | F-06, F-07, F-08, F-13, F-15 | Deferred imports, help/version without evaluating configuration, configuration evaluated and cloned per invocation, precomputed invariant names/descriptors, and cleanup of apply and temporary state even on errors. Signature of the effective configuration and generator sources/tables; metadata below 4 KiB and conservative rebuilding for values that cannot be represented. Derived text is written only when bytes change. Node/CI aligned and the npm `path` package removed. |
| 5. Generators and dependencies | F-11, F-12, F-14 | CSS/codepoints shared between TSS and JS, including Pro/Beta; one orchestrator preserves the existing order and expected copies. Image metadata/inputs/renders shared per image, with a queue of up to two jobs that stops starting tasks on failure. Color conversions reused without mutating palettes, preserving tie-breaking, operations and fresh UUIDs. Creation and installation copy/delete operations use Node. Compatible updates tested and incompatible advisories documented below. |
| Preserved condition | F-16 | The two-second guard and the `app.tss` write on every completed purge are preserved to renew its mtime. Write-if-changed is not applied to that file. |

The measurement stage provides observability and correctness; no isolated speedup is attributed to it. Read/parse measurements cover shared analysis; the 200-apply fixture measures resolution/generation; version measures startup; images and colors have their own experiments. Purge figures combine improvements that run together, without attributing all savings to an individual function.

## Direct purge: results

Each variant has a separate initial run and five subsequent samples, in alternating order. Measurements used Node 22.23.2, a fresh process per invocation, the same measurement preload and `NO_UPDATE_NOTIFIER=1` in both variants. For the baseline, the loader replaces modified modules with their source from the audited revision; it does not modify source files or copy/check out the projects. Both variants use the installed dependencies; the comparison between Sharp versions was performed separately.

The guard interval was allowed to pass naturally, without aging `app.tss`. Skipped samples were measured separately. Table timings are medians of total process time, in milliseconds.

| Project | Baseline ms | Implementation ms | Reduction | Files compared |
| --- | ---: | ---: | ---: | ---: |
| notiGAPE | 1140.2 | 471.9 | 58.6% | 81 |
| LM - Generador de Tablas | 680.5 | 448.8 | 34.1% | 442 |
| EM Industrial | 1591.3 | 547.1 | 65.6% | 107 |
| Minimal fixture | 480.3 | 388.4 | 19.1% | 6 |

Initial and subsequent files matched byte for byte. Only the new `generator-signature.json` metadata was excluded from this comparison; its contract is tested separately. The existing SVG cache is included. The JSON files retain all samples, CPU (`user`/`system`, microseconds), peak RSS, reads/writes, total time and time inside the Node process between preload and exit. That internal time includes imports; it is not presented as time spent exclusively in the purge core.

| Project | Instrumented reads | XML parses | JS parses |
| --- | ---: | ---: | ---: |
| notiGAPE | 920 → 468 | 280 → 70 | 168 → 54 |
| LM - Generador de Tablas | 600 → 360 | 40 → 10 | 30 → 10 |
| EM Industrial | 1242 → 574 | 792 → 198 | 108 → 36 |
| Minimal fixture | 540 → 337 | 4 → 1 | 0 → 0 |

| Project | Baseline CPU ms | Implementation CPU ms | Baseline RSS MiB | Implementation RSS MiB |
| --- | ---: | ---: | ---: | ---: |
| notiGAPE | 1395.2 | 686.7 | 163.4 | 159.3 |
| LM - Generador de Tablas | 915.9 | 600.9 | 163.8 | 158.0 |
| EM Industrial | 1926.6 | 830.4 | 165.4 | 167.1 |
| Minimal fixture | 565.8 | 455.4 | 153.1 | 143.5 |

Reads include startup and signatures as well as app sources. Subsequent purges write `app.tss` once. Invocations skipped by LiveView recorded zero XML/JS parses and zero writes.

**Explicit initial cost:** the existing minimal fixture without a signature went from 398.3 to 481.2 ms on the first optimized invocation: it must rebuild the catalog to establish a reliable signature. Afterward, its median went from 480.3 to 388.4 ms (a 19.1% improvement, so there is no median regression greater than 5%). An old timestamp is not used as proof of validity to avoid this one-time cost. Initialization with the new generator already writes its signature. Initial invocations and their higher peak RSS are stored separately from subsequent medians.

## Targeted measurements

- **Startup (`--version`):** median 333.2 → 188.6 ms. Median RSS: 147.7 → 104.1 decimal MB. Help and version were also verified not to execute a configuration with side effects/errors.
- **Build with 200 apply directives:** median 709.4 → 332.4 ms, with identical generated files. Median RSS: 185.8 → 165.2 decimal MB. This remains full generation, not a reduced catalog.
- **Colors, 100 palettes per sample:** 48.2 → 30.7 ms. Differential results, fresh UUIDs, color-type inputs and last-match selection on ties were preserved. The benchmark retains the input table and alternates order; neither generated palettes nor UUIDs are cached.
- **Images, 512 dp base, initial codecs:** 1145.6 → 794.9 ms with shared inputs/renders in serial execution → 618.2 ms with two jobs. Median peak RSS: 229.8 → 264.8 decimal MB for the two-job path.
- **Images at the 1024 dp maximum:** 3182.8 → 2181.6 → 1697.5 ms (baseline/shared serial/two jobs). Median RSS: 459.8 → 496.7 decimal MB from baseline to two jobs. Acceptance checked the **maximum across the five samples and the initial invocation**, in addition to recording medians: it did not exceed 20% above baseline. Measurements also covered 128 dp.
- **All codecs, additional comparison between dependencies:** PNG from SVG and raster, WebP, JPEG, AVIF, TIFF and GIF: **56/56 files** with identical bytes, decoded pixels, dimensions and alpha. The previous code with temporarily installed Sharp **0.35.3 / libvips 8.18.3** was compared against the implementation with **0.35.5 / libvips 8.18.7**. The temporary baseline was removed. The queue also passed the memory limit with this 32 dp fixture; this does not replace the maximum-resolution measurement above.

Concurrency remains capped at two, preserves result order and waits for already started jobs before propagating the first error. A render-failure test verifies that the remaining queue is not started. Codecs, supersampling, compression options and optional quantization are preserved; no improvement comes from reducing quality.

The distribution build completed through its scripts. The four icon modules preserved bytes, export names, families and Unicode: Font Awesome 2606 icons, Material Icons 2276, Material Symbols 3021 and Framework7 1252. `dist/` and assets have no content differences against the audited revision; they were not edited by hand.

## Dependencies

`npm audit` went from **12 to 5 affected packages**. Sharp and its binaries/libvips, `@humanfs/node`, `brace-expansion`, `js-yaml`, `postcss-selector-parser`, `source-map-js` and `sucrase` were updated within compatible ranges, along with their transitive changes. `path` and its exclusive dependencies were removed: existing uses resolve Node's native module. Tailwind remains on 3.x; Acorn, xml-js and the parsers used by PurgeTSS were not replaced.

These advisories remain in the installed tree:

| Package | Severity | Reason for not automatically applying npm's proposal |
| --- | --- | --- |
| `css` | High | npm proposes downgrading from 3.x to 2.2.1; this is a major/incompatible parser change outside this optimization. |
| `source-map-resolve` | High | Transitive chain from `css`; the proposed fix requires the same incompatible change. |
| `decode-uri-component` | High | Transitive dependency in the same chain, with a range that does not admit the current fix. No out-of-range override is forced. |
| `glob` | Moderate | npm proposes 14.0.4, a major change from 13.x. It requires a dedicated review of paths, ordering and compatibility. |
| `minimatch` | Moderate | The proposed fix for this branch comes through the same major glob upgrade. |

PurgeTSS uses CSS calls for parsing, not sourcemap generation; glob calls do not supply AbortSignal. This provides context for the advisories, but does not declare them resolved or replace their review in a separate update. `audit fix --force` was not run.

The supported range was aligned with actual dependencies: `^20.12.0 || ^22.13.0 || >=23.5.0`. A CI matrix was added for 20.12.0, 22.13.0 and 24. Node 20.12 is retained, supported by the intersection of the Commander, Sharp, Inquirer and glob engines; Node 22 is not required unnecessarily. Local validation for this implementation used 22.23.2; the remote matrix was not run because no push was performed.

## Verification and reviews

- Full suite: **43/43 unit files, 7/7 integration files and 6/6 e2e files**. Making failures effective exposed and corrected both incorrect aggregation and an e2e test that counted success even with missing files. The fixture naturally waits for the guard before the first purge; its rule is unchanged.
- Targeted regressions: nested timers, failed/unwritable profiles, aliases and asynchronous callbacks; `--all` with empty font sources and a skipped purge; repeated options and `--`; XML/entities, AST/fallback, extraction and missing classes; UTF-16 with substrings/surrogates; threshold 32, duplicates and escaped selectors; chained apply and precedence; same-second configuration changes, environment, symlinks/target redirection, repeated builds, derived-file mtimes and state restoration on failure; shared rendering and queue stopping; palettes/UUIDs/ties.
- Existing tests retain coverage of combined modifiers, states, arbitrary values, negatives, units, semantic opacity, fonts, widgets/themes and configuration options.
- ESLint on modified and new JS/MJS files. The extensionless entry point was checked through stdin as JS, with the CLI-specific `n/no-process-exit` exception. `node --check bin/purgetss`, distribution build, module exports, `npm pack --dry-run --json`, CI YAML and `git diff --check`.
- An independent review found regressions involving CRLF, escaped selectors, deferred-import errors and asynchronous profiles, as well as temporary state after errors. They were corrected with tests that failed first and passed afterward. Review of those corrections found no further major issue; the configuration test was subsequently extended to cover symlink retargeting.
- All three real projects ended with their prior Git state. Protected files were restored individually in `finally` (bytes and access/modification times); no blanket Git restore was performed. Benchmark temporaries and the local baseline installation were removed.
- At closure, the differential baseline was pinned so commits would not change it. The color-equivalence test using frozen original fixtures and the runner-failure test passed. A startup smoke test after the eight code/test commits confirmed the audited revision, initial invocations, five alternating samples per variant and equivalent bytes. It does not replace earlier measurements; full suites and real-project benchmarks were not repeated merely to make commits. Lint of this reference tooling had no errors; an import-style warning remained in the frozen copy of the original code.
- The read-only closing check found notiGAPE and Generador de Tablas clean. EM Industrial had a new untracked signature and `app.tss` renewed at 12:18, after the validation archive was finalized at 12:14 and before this commit session. That later activity was preserved rather than removed as test residue.

Measurements apply to these fixtures and this Mac; they are not extrapolated as a guaranteed percentage for every project. Initial cost and measurement conditions are recorded so the comparison can be repeated.

## Evidence and reproduction

Small evidence files in `/Users/cesar/Developer/validation-evidence/purgeTSS/`:

- `implementation-final-benchmark.json`: real projects, minimal fixture, initial invocations, five samples and skips.
- `implementation-startup.json`, `implementation-build.json`, `implementation-colors.json`.
- `implementation-images.json`, `implementation-images-512.json`, `implementation-images-1024.json`, `implementation-images-updated.json`, `implementation-all-codecs.json`.
- `implementation-validation.tar.gz`: validation logs and dependency audits for this implementation.
- `implementation-commit-startup-smoke.json`, `implementation-commit-validation.json`: pinned-baseline check after the commits and targeted closure validation.

```sh
node tests/performance/benchmark.mjs /tmp/purge-results.json   '/Users/cesar/Developer/Apps/notiGAPE'   '/Users/cesar/Developer/Apps/LM - Generador de Tablas'   '/Users/cesar/Developer/Apps/EM Industrial'
PURGETSS_BENCH_COMMAND='["--version"]' node tests/performance/benchmark.mjs /tmp/startup-results.json
PURGETSS_BENCH_COMMAND='["build"]' PURGETSS_BENCH_STRESS=1 node tests/performance/benchmark.mjs /tmp/build-results.json
node tests/performance/color-benchmark.mjs /tmp/color-results.json
node tests/performance/images-benchmark.mjs /tmp/image-results.json 512
node tests/performance/images-benchmark.mjs /tmp/all-codecs-results.json 32 all
```

Source and image benchmarks default to `c5f735ad3387a028f8c21627eaf433085e9d283f`, rather than the changing HEAD. That revision must be available in history; `PURGETSS_BENCH_BASELINE=<revision>` explicitly selects another, and the JSON records the reference used. Only modified files that existed at that revision are substituted. The color unit test and benchmark import the frozen original implementations in `tests/fixtures/color-shades/` and do not require Git history, including in a shallow CI checkout.

To additionally compare two Sharp versions, `PURGETSS_BENCH_BASE_SHARP` can point to the `file:` URL of the entry point in a temporary local installation of the baseline version. The driver uses it only in the baseline variant. Without that variable, both variants use the installed dependencies.

No implementation tasks from these stages remain open. The five advisories requiring incompatible changes are explicitly outside this implementation; no automatic publication was performed either.

## Documentation preservation

No current capabilities, examples or requirements were condensed. The general Node 20+ statement was corrected to the actual compatible range, along with references to HEAD as the baseline and the uncommitted status after closure was authorized; the previous state was retained in full as a historical record. No current documentation or the pre-existing `docs/rust-port.md` was removed.
