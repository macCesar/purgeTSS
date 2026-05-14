# Error Reporting Consolidation

**Status:** proposal — partially implemented (config-validator uses the new reporter; legacy reporters untouched).

PurgeTSS surfaces user-facing errors in at least four different formats today. They look similar but are coded inline in each call site, with copy-pasted chalk colors and slightly different layouts. This document inventories what exists, what was added during the 2026-05-12 side-quest, and a path to unify them — without breaking any of the current output.

---

## 1. The four existing patterns

### 1.1 `XML Syntax Error` — compact variant
- **File:** `src/cli/commands/purge.js:391-400`
- **Trigger:** XML tag mismatch, illegal `--` inside comments, etc.
- **Layout:**
  ```
  ::PurgeTSS:: XML Syntax Error
     File: "..."
     Line: 42
     Content: "..."
     <message>
     Fix: <hint>
  ```
- **Sink:** `logger.block(chalk.red('XML Syntax Error'), …)`.
- **Bubble:** sets `error.isPreValidationError = true`.

### 1.2 `Class Syntax Error`
- **File:** `src/cli/utils/unsupported-class-reporter.js:177-208`
- **Trigger:** XML uses a class with invalid PurgeTSS syntax (`top-[10px]` instead of `top-(10px)`, empty parens, etc.).
- **Layout:**
  ```
  ::PurgeTSS:: Class Syntax Error
     Class: "..."
     File: "..."
     Line: 42
     Content: ...
     Issue: <description>
     Fix: <suggestion>
  ```
- **Sink:** `logger.block(chalk.red('Class Syntax Error'), …)`.
- **Bubble:** sets `error.isClassSyntaxError = true`.

### 1.3 `XML Syntax Error with Context`
- **File:** `src/cli/commands/purge.js:160-188`
- **Trigger:** `xml2json` parse failures.
- **Layout:** same header as 1.1 but shows ±2 lines around the offending line with a `>>>` cursor.
  ```
  ::PurgeTSS:: XML Syntax Error
  File: "..."
  Error near line: 42

  Context:
       40: ...
       41: ...
  >>>  42: <broken tag
       43: ...

  Error: Unmatched or malformed tag (missing < or >)

  Tip: Check for tags missing opening < or closing >
  ```
- **Sink:** built as a plain string and thrown via `new Error(errorMessage)`.
- **Different shape from 1.1** even though they share the same header — this is one of the reasons consolidation matters.

### 1.4 `Config Syntax Error` *(new — added in this side-quest)*
- **File:** `src/shared/validation/config-validator.js`
- **Trigger:** invalid types in `purgetss/config.cjs` (initial scope: `theme.fontFamily.*` and `theme.extend.fontFamily.*` must be strings, not arrays).
- **Layout:** identical to 1.3 (context variant) with `Path:` instead of `Content:`.
- **Sink:** `throwSyntaxError()` from `src/shared/error-reporter.js`.
- **Bubble:** sets `error.isSyntaxError = true`.

---

## 2. What this side-quest already shipped

- **New `src/shared/error-reporter.js`** with two exports:
  - `formatSyntaxError(opts)` → returns `{ header, lines }` ready for `logger.block`.
  - `throwSyntaxError(opts)` → throws an `Error` whose `.message` is the rendered report and which carries `isSyntaxError: true`.
- **New `src/shared/validation/config-validator.js`** that uses `acorn` (already a dep) to locate the offending line in `config.cjs` and reports through `throwSyntaxError`.
- **Wired** validator into `getConfigFile()` (`src/shared/config-manager.js`).
- **Local try/catch** in `src/core/builders/auto-utilities-builder.js` to suppress the Node stack when `error.isSyntaxError` is set (the validator can throw at module import time, before the bin's catch is reachable).
- **`PURGETSS_DEBUG=1` flag** in `bin/purgetss` to print stack traces for diagnostics without changing default UX.

What this **did not** touch:
- `unsupported-class-reporter.js` (pattern 1.2)
- The two patterns inside `purge.js` (1.1 and 1.3)

The four formatters remain separate. The new infrastructure exists alongside them.

---

## 3. Proposed consolidation

### 3.1 Goal
A single API in `src/shared/error-reporter.js` that all four patterns funnel through. Output stays byte-identical to today after the migration (visual regression must be zero).

### 3.2 Suggested API surface

```js
// One entry point, two ways out:

reportSyntaxError({
  type,        // 'XML' | 'Class' | 'Config'
  file,        // absolute path (made relative to cwd for display)
  path,        // dotted JSON path (optional — used by Config)
  className,   // string (optional — used by Class)
  line,
  content,     // single-line snippet (optional — used when no contextLines)
  contextLines,// array of file lines (1-based) — when provided, the ±2 block
               //   is rendered instead of `Content:`
  issue,       // human description
  fix,         // suggestion
  also,        // optional array of extra locations (e.g. "also used in 3 other places")
}, { mode: 'log' | 'throw' })
```

- `mode: 'log'`  → `logger.block(header, ...lines)` — same as today's 1.1 / 1.2.
- `mode: 'throw'` → throws `Error` with rendered message — same as today's 1.3 / 1.4.

### 3.3 Migration plan — one file at a time

| Step | Target                                               | Risk                                                           | Validation                                                                                               |
| ---- | ---------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1    | `unsupported-class-reporter.js` (Class Syntax Error) | low — single layout, all data already structured               | Capture today's output for a known offending class; diff after refactor must be empty.                   |
| 2    | `purge.js:391` (XML Syntax Error compact)            | low — fewest fields                                            | Same diff strategy.                                                                                      |
| 3    | `purge.js:160` (XML Syntax Error with context)       | medium — string concat with embedded chalk; tip line is unique | Diff against captured baseline; preserve the trailing `Tip:` line as-is or add a `tip` field to the API. |

After each step, run `pt` against a fixture that triggers that pattern and binary-compare the output. **Do not bundle steps** — one regression in one of the three patterns is harder to bisect if all three change at once.

### 3.4 Acceptance criteria for consolidation
- `diff` of pre-refactor stdout vs post-refactor stdout is **zero bytes** for each pattern's representative fixture.
- All three `error.isXxxError` boolean flags keep working for callers that branch on them.
- `logger.block` remains the underlying sink (not bypassed in any of the migrated patterns).

---

## 4. Other places that would benefit

These are not syntax errors per se, but they share the "user did something wrong in a file or argument" shape. They surface today as raw `console.error(chalk.red(...), err.message)` lines:

- **`bin/purgetss`** generic catches (lines 78, 220, 253, 339, 401, 422, 439, 454, 478, 498, 516, 544, 569). Today: `Error running build:`, `Error running shades:`, etc., followed by `err.message`. Many of these wrap downstream `throw` calls that already have useful context — they'd benefit from a thin formatter that decides whether to render as a Syntax Error block (if `err.isSyntaxError`) or as a one-line failure.
- **`src/cli/commands/init.js:79,178`** — config.cjs already exists. Could promote to a structured `Usage Warning` with the path and a one-liner on how to start over (`pt init --force`).
- **`src/cli/commands/shades.js:82`** — no hex color provided. Currently a chalked usage line; could become a structured `Usage Error` with the offending CLI invocation and the expected syntax.
- **`src/cli/commands/shades.js:394`** — invalid `semantic.colors.json`. Strong candidate for the Config family (file + line + tip).
- **`src/cli/commands/semantic.js:121`** — missing light hex. Same shape as 4.3.
- **`src/cli/commands/create.js:189`** — can't create a Titanium project. Could include the directory state in the report so the user understands *why* (file already exists? missing alloy?).
- **`src/core/analyzers/class-extractor.js:70,91`** and **`src/cli/commands/purge.js:418,549`** — `Error processing: "<file>"`. These rethrow the underlying error tagged with the file name. Folding into the reporter would give consistent `File:` and `Line:` framing when downstream errors carry that info.
- **`src/core/branding/branding-logger.js:35`** — branding error sink. Aligning it with `error-reporter.js` (or making it import from there) keeps the visual identity of brand/images errors consistent with everything else.

### 4.1 Suggested taxonomy

Three families, all rendered by the same reporter with different `type` values:

1. **Syntax Error** — config / xml / class. Locating a line in a file matters. Always actionable Fix.
2. **Usage Error** — CLI invocation wrong (missing arg, bad value). No file/line. Show the corrected invocation.
3. **Processing Error** — runtime failure (file unreadable, network down, sharp crash, etc.). File context if available; otherwise a one-liner. These map roughly to today's generic `Error running …:` lines in `bin/purgetss`.

Each family gets a tiny helper (`reportSyntaxError`, `reportUsageError`, `reportProcessingError`) that delegates to a single internal formatter. The bin's generic catches become:

```js
} catch (err) {
  reportProcessingError({ command: 'shades', error: err })
  process.exit(1)
}
```

---

## 5. Rollout suggestion

1. **Land the current side-quest** as-is (this branch). Validator + reporter exist alongside the legacy patterns, zero regression.
2. **Phase 1 — Migrate the three syntax patterns** (table in 3.3). One PR per pattern, each ≤ 50 LOC, with the byte-diff check as the acceptance gate.
3. **Phase 2 — Promote `Usage Error` family** (init, shades, semantic, create). Pick one command, prove the pattern, port the rest.
4. **Phase 3 — Wrap the bin's generic catches** in `reportProcessingError`. This is the lowest-priority phase because the current output is already fine — the win is consistency, not correctness.

There is no hard dependency between phases. You can stop after Phase 1 and the architecture is already cleaner than today.
