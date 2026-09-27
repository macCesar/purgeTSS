---
name: Always consult local skills before external sources
description: When a skill is available AND applicable to the task, read its reference files before doing any WebFetch, WebSearch, or external lookup
type: feedback
originSessionId: 9f12d138-7025-4e20-a68b-d39fead63ff7
---
When a Skill is loaded and applicable to the current task, **read its reference files first** (via Grep across the skill directory, then Read the matched files). Only fall back to WebFetch/WebSearch/gh API if the skill genuinely lacks the needed detail.

**Why:** The user invested in building skills like `ti-api`, `ti-expert`, `ti-ui`, `ti-guides`, `ti-howtos`, `ti-branding` precisely so answers come from curated, verified sources instead of uncertain internet content. External sources may be stale, contradictory, or marketing-driven; skills are the source of truth for these topics. Twice in the same session I invoked a ti-* skill and then still went to WebFetch for the exact same information (semantic.colors.json schema with alpha). The user correctly pointed out this defeats the entire purpose of having skills.

**How to apply:** Whenever a ti-* skill (or any domain skill) is active and you need a spec, schema, property, or API detail in that domain:
1. `Grep` recursively across the skill's root directory (resolve symlinks if needed — ti-* skills at `~/.claude/skills/ti-*` symlink to `~/.agents/skills/ti-*`) for the concept (e.g. `semantic`, `alpha`, `fetchSemanticColor`).
2. `Read` the matched reference files for the verbatim quote.
3. Only if the skill does NOT contain the info, escalate to WebFetch — and say so explicitly in the response ("skill doesn't cover this, falling back to the official site").

Also applies beyond Titanium: whenever a Knowledge Index exists (project `CLAUDE.md` lists reference files + matching skills), consult the index and skills BEFORE writing code or doing research. The project CLAUDE.md section "When AGENTS.md or CLAUDE.md Contains a Knowledge Index, USE IT" already codifies this — treat repeated violations as a hard failure, not a style preference.
