# Repository Guidelines

This repository builds and ships the PurgeTSS CLI for Titanium/Alloy projects. Follow the sections below to keep changes consistent with the current layout and workflows.

## Project Structure & Module Organization
- `bin/purgetss` is the CLI entry point; command implementations live in `src/cli/`.
- `src/core/` contains builders and analyzers used by the CLI; `src/shared/` holds shared config, utils, and constants.
- `src/dev/` contains build-time generators (tailwind, icons, fonts) invoked by npm scripts.
- `dist/` contains generated outputs for publishing; update it via build scripts rather than hand edits.
- `assets/fonts/` stores distributed font assets; `tests/` and `test-project/` provide fixtures.

## Build, Test, and Development Commands
- `npm run build` runs the full build pipeline (module, tailwind, icon/font builders).
- Targeted builds: `npm run build:module`, `build:tailwind`, `build:fa`, `build:material`, `build:symbols`, `build:framework7`, plus `*-js` variants and `build:fonts`.
- `npm test` runs all tests; faster options include `npm run test:unit`, `npm run test:integration`, and `npm run test:e2e`.
- `node bin/purgetss --help` is a quick local CLI smoke check.

## Coding Style & Naming Conventions
- ESM modules by default; keep CommonJS only where already used for compatibility.
- Follow the eslint rules in `eslint.config.js`: 2-space indent, single quotes, no semicolons.
- File naming favors clear action-based names (e.g., `build.js`, `shades.js`) and lowerCamelCase helpers.

## Testing Guidelines
- Tests live under `tests/<category>` with `*.test.js` naming; `tests/run-tests.js <category>` is the main runner.
- Use `test-project/` for real-project fixtures in e2e tests and keep tests deterministic (no network calls).

## Commit & Pull Request Guidelines
- Prefer Conventional Commit prefixes (`feat:`, `fix:`, `chore:`); release commits may be a plain version number (e.g., `7.2.6`).
- PRs should include: scope summary, test commands run, and relevant output/screenshots for CLI or generated-asset changes.
- Update `CHANGELOG.md` and `README.md` when user-facing behavior or commands change.

## Configuration Notes
- Requires Node.js 16+ and a Titanium/Alloy project for most CLI workflows.
- Regenerate `dist/` via build scripts when changing `src/` logic.
