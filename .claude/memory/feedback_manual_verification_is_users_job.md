---
name: Manual verification sections in plans are the user's job, not mine
description: When a plan has a "Manual verification" / "Verificación end-to-end (manual)" section listing CLI commands, the user runs those — not me. Stop after the code changes.
type: feedback
originSessionId: 7dec6d1a-2d27-4fcb-906e-1a5605802e66
---
When an implementation plan includes a section titled "Manual verification", "Verificación end-to-end (manual)", "Manual testing", or similar, **those steps are written for the user to execute on their real project/data — not for me to run**. After finishing the code edits, stop and tell the user the implementation is ready for them to verify.

**Why:** The user is approaching their token-budget limit. Running manual verification commands myself (especially ones that involve creating fixture files, scaffolding test projects, or repeatedly invoking the CLI) burns tokens on work the user explicitly intended to do themselves. In the trigger incident (2026-04-28, purgeTSS `--width` flag), the user had a real SVG logo in another project waiting to be tested — my synthetic fixtures in `test-project/` provided no actual signal beyond what they could verify in two seconds locally.

**How to apply:**
- After implementing all code-edit tasks from a plan, **stop**.
- Running the project's existing automated test suite (`npm test`, `npm run test:unit`) is OK as a regression check — those are quick and prove I didn't break adjacent code.
- Do NOT execute the plan's "Manual verification" / "End-to-end" / CLI-command checklist. Hand it to the user.
- Do NOT create synthetic fixtures (SVGs, PNGs, etc.) just to exercise the new code path — the user has real fixtures.
- Tell the user the code is ready, list the files touched, and wait.
- This is independent of the existing rule about not auto-committing — that rule still applies separately.

**Exception:** If the plan explicitly says "verify with these commands and report results" or the user explicitly asks me to run the manual checks, then run them. Default is don't.
