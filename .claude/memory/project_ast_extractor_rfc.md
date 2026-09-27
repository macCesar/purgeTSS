---
name: AST class-extractor RFC — pending implementation
description: Pointer to the RFC at docs/proposals/ast-class-extractor.md proposing migration of the controller class scanner from regex to AST. Decision pending; reasons to implement strengthened by evidence the official docs use a blind pattern.
type: project
originSessionId: 9f12d138-7025-4e20-a68b-d39fead63ff7
---
The RFC at `docs/proposals/ast-class-extractor.md` proposes replacing the per-line regex scanner in `src/core/analyzers/class-extractor.js` (`extractWordsFromLine`, ~lines 101-149) with a Babel/Acorn AST walker. The RFC's own recommendation was "Hold", but that was based on the assumption that authors know when their classes are invisible and that blind patterns are rare. Both assumptions are wrong:

**Why:** The killer evidence: `purgetss-docs/docs/best-practices/2-semantic-colors.md` "Option 3" example uses `Alloy.createStyle(..., { classes: isActive ? [...] : [...] })` — that's RFC Pattern 3 (ternary-at-value), which the current scanner sees as zero classes. PurgeTSS is literally documenting a pattern that produces silent failures. Any user copying that example loses both branches' classes unless they happen to appear elsewhere or in safelist. There's no warning at build time; the symptom is missing styles in production.

**How to apply:** When César says he's ready to ship the AST migration, start a **fresh session** (this conversation accumulated heavy context from semantic-colors work that doesn't apply). At session start, hand the agent:

- This memory entry as context
- `docs/proposals/ast-class-extractor.md` as the spec
- The "Option 3" example in `purgetss-docs/docs/best-practices/2-semantic-colors.md` as the motivating bug
- The Appendix bug about `'ms-visibility'` being swallowed by the regex (independent issue that the AST walker also closes for free)

Implementation must follow the RFC's whitelist exactly — only recurse into `ArrayExpression`, `ConditionalExpression`, and `StringLiteral` directly. **Do not** recurse into `CallExpression`, `TemplateLiteral` with expressions, `BinaryExpression`, `Identifier`, or `MemberExpression` — those are the false-positive surface the RFC analyzes carefully. Patterns 2 and 4 (identifier-as-value, `.push` mutation) intentionally stay blind and remain safelist territory; the AST migration closes 4 of 6 patterns, not 6 of 6.

Decision-side concerns to confirm before coding: parser choice (`@babel/parser` ~300KB vs `acorn` ~200KB — Acorn likely sufficient since Alloy controllers are CommonJS, no JSX), fail-soft strategy (regex fallback when parse fails matches the XML extractor's posture), and a CI test fixture per blind pattern so regressions surface before release.
