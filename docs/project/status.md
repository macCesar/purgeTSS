# Status — 2026-09-05

**Phase:** v7.17.0 released and published to npm
**Session by:** Claude Code · Opus 5 (`claude-opus-5`)
**Branch:** `main`, clean, pushed
**Repository state:** 5 commits landed, tag `v7.17.0` pushed, `publish.yml` published to npm

## Where things stand

v7.17.0 shipped. It carries two independent pieces of work.

The `images:` config section now rejects unknown keys instead of ignoring them, mirroring what `brand:` has done since 7.13.0. The generated block also documents the 4× master convention with worked numbers, because that rule lived only in `--help` and in the official docs, never in the file someone reads while wondering why a 1024px source produced a 256px output.

The ESLint scaffolding shipped by `install-dependencies` and `create --dependencies` was broken and silent: the `.eslintrc.js` template stopped working when eslint 9 dropped eslintrc and `eslint-config-axway@10.0.0` removed `env-alloy`. Any project scaffolded since December 2025 had a lint that could not run. It now ships `eslint.config.mjs`, a flat config that declares the Titanium and Alloy globals itself.

The design conversation behind the first piece matters more than the code: the decision was to *not* add config keys. See `decisions.md` 2026-09-05.

The official docs shipped separately as `purgetss-docs` v1.1.13, deployed and mirrored. That release's recorded blocker — documenting a PurgeTSS version that was not yet published — is resolved by this one.

## In flight

Nothing in this repository.

The Classic video series is complete and published; its remaining optional item is regenerating the delivery masters for episodes 01 through 06 from their best source captures, using the same 4K/CFR 30/H.264 High/BT.709/AAC 48 kHz/fast-start gate as episode 07. Never obtain those replacements by transcoding an already compressed final merely to raise its nominal bitrate. Keep the current YouTube uploads unchanged unless a separate replacement decision is made. The per-episode verification record for that finished work is in the git history of this file (`git log docs/project/status.md`); it was compressed here because it documents completed work.

## Next step

Nothing pending. The next natural piece of work is the drift risk this session surfaced twice: a shipped string that lives in more than one file with nothing tying the copies together. Two instances were found and closed with tests (the `images:` block in two places, the ESLint template filename in three). Whether others exist has not been audited.

## Verified vs. assumed

- Verified: `npm test` passed in full before the tag was pushed — unit 27/27, integration 7/7, e2e 6/6.
- Verified: `npm view purgetss version` returns `7.17.0`; `dist-tags.latest` is `7.17.0`.
- Verified: `publish.yml` run 34004815426 finished green, including its tag-vs-`package.json` guard.
- Verified: the GitHub release exists at `https://github.com/macCesar/purgeTSS/releases/tag/v7.17.0`.
- Verified by the user: `purgetss images` ran in a real project (`~/Developer/Apps/tombola`) with the new code and the generated images were inspected and accepted.
- Verified: both new tests fail when the thing they guard drifts. Deliberately desynchronizing one copy of the `images:` block, dropping a key from the whitelist, and renaming the ESLint template in `create.js` each produced the expected failure; all were restored.
- Verified: the error output quoted in the official docs is a byte-for-byte copy of a real run, not composed by hand.
- Verified: a 1024×1024 source produces 256/384/512/768/1024 on Android and 256/512/768 on iPhone, measured with `sips` on generated files.
- Verified: the sibling `purgetss-docs` edits from this session are committed in `a5547b3` and released as v1.1.13.
- Assumed, not verified: that no other shipped string is duplicated across files without a test. Only the two found were checked.
- Assumed, not verified: the ESLint scaffolding was reviewed and covered by tests here, but no one ran `purgetss create` end to end against a real npm install in this session.
- Pre-existing and untouched: `tests/unit/shared/helpers.test.js` prints `Some modules failed validation!` (15/16). Confirmed present before this session's changes by stashing them; the runner still counts the file as passing.
