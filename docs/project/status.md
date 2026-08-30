# Status — 2026-08-30

**Phase:** release preparation
**Session by:** Codex · GPT-5
**Deployed:** v7.13.2 is the last tag in this repository; external npm/GitHub publication was not rechecked in this session
**Branch:** `main`, with uncommitted and unpushed release work
**Sibling:** `/Users/cesar/Developer/openSource/purgetss-docs` — the matching brand documentation is updated, built, and still uncommitted

## Where things stand

`purgetss brand` now works as a self-contained Alloy or Classic command: it follows `tiapp.xml` deployment targets, creates the canonical config on a standalone first run, adopts a positional logo, keeps Titanium-consumed Classic Android splash qualifiers, and diagnoses contrasting padded frames. Finished square iOS/store artwork defaults to `0%`; Android launcher safe-zone paddings remain platform-specific.

The implementation, CLI help, repository README/CHANGELOG, and the Docusaurus source in the sibling repository are synchronized. No implementation commit, version bump, tag, push, GitHub release, npm publication, site deploy, or Markdown mirror sync has happened yet.

## In flight

- The release skill is preparing the confirmation plan. Publication remains deliberately paused until the maintainer confirms that exact plan.

## Requirements

- R3–R6 in `requirements.md` are implemented and verified.
- The broader Classic-compatible command inventory requested during this work has not been performed; it remains separate follow-up work rather than part of this brand release.

## Next step

Confirm or revise the semantic commit and release plan. After confirmation, release the CLI, then finish the sibling documentation release/deploy workflow recorded in its `project/status.md`.

## Verified vs. assumed

- Verified: `npm test` passed 23/23 unit suites, 5/5 integration suites, and 6/6 end-to-end suites.
- Verified: a real Classic run in `/Users/cesar/Developer/Apps/TestingBrand` produced full-bleed root/store icons with zero white pixels along the sampled border; the test repository was restored clean with `sample-icon.png` present.
- Verified: targeted branding ESLint checks and `git diff --check` passed.
- Verified: `/Users/cesar/Developer/openSource/purgetss-docs` passed `npm run build` and `npm run docs:check`.
- Assumed: no package, GitHub release, site deployment, or mirror publication has occurred for these uncommitted changes.

## Known pending

- Inventory which existing PurgeTSS commands work in Classic projects without installing the Alloy hook, and identify other commands that can be decoupled safely.
- After the CLI version is released, promote the sibling documentation's Unreleased entry, update the three-release homepage window, release/deploy the site, and run its mirror sync workflow.
