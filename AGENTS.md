# Repository Guidelines

This project builds and ships the PurgeTSS CLI for Titanium/Alloy apps. Use this guide to stay aligned with the existing layout, commands, and style decisions.

## Project Structure & Module Organization
- `bin/purgetss`: CLI entry; runs the commands defined under `src/cli/`.
- `src/cli/commands`: User-facing commands (build, fonts, purge, shades, etc.); `src/cli/utils` for CLI-only helpers.
- `src/core`: Core processors (builders, parsers) used by the CLI; `src/dev` holds asset/icon/tailwind builders invoked by build scripts; `src/shared` holds cross-cutting utilities and config management; `src/fonts` packages font metadata.
- `dist/`: Published bundles (CommonJS where needed); regenerate via build scripts instead of editing directly.
- `assets/fonts/`: Distributed font assets; `test-project/` and `tests/` supply fixtures for integration/e2e runs.

## Build, Test, and Development Commands
- `npm run build`: Full pipeline (module + tailwind + icon/font builders); produces updated `dist/` and assets.
- Targeted builds: `npm run build:module`, `build:tailwind`, `build:fa`, `build:material`, `build:symbols`, `build:framework7`, and their `*-js` variants; `build:fonts` builds `fonts.tss`.
- Local CLI check: `node bin/purgetss --help` or `node bin/purgetss build`.
- Tests: `npm test` (all categories), `npm run test:unit`, `npm run test:integration`, `npm run test:e2e`, `npm run test:cli`, `npm run test:install`, `npm run test:install-local`, `npm run test:install-global`.
- Housekeeping: `npm run clean:md` cleans Markdown formatting artifacts.

## Coding Style & Naming Conventions
- ESM by default; use named exports unless a file is clearly a module entry point. `dist/` may use CommonJS for compatibility.
- Lint rules (see `eslint.config.js`): 2-space indent, single quotes, no semicolons, no space before function parentheses, spaced comments. Globals for Alloy/Titanium are predefined—avoid re-declaring.
- File naming favors action-oriented command files (e.g., `build.js`, `shades.js`) and lowerCamelCase helpers. Keep modules small and composable.
- Run `npx eslint .` before submitting to catch style issues.

## Testing Guidelines
- Tests live in `tests/<category>` (unit, integration, e2e); prefer `*.test.js` suffix. The runner accepts `.js` and `.mjs`, but stay consistent with existing naming.
- Use `tests/run-tests.js <category>` when iterating; `installation` simulations are heavier—run them before releases or when touching install flows.
- Add or adjust fixtures in `test-project/` when e2e coverage is needed. Keep tests deterministic and avoid network calls.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.). Release bumps use the pure version number (e.g., `7.2.5`).
- For PRs, include: scope/intent, key changes, how to reproduce, and test commands run. Attach relevant CLI output or screenshots when UX or generated assets change.
- Update `CHANGELOG.md` and `README.md` when behavior, commands, or outputs change. Note when regenerated `dist/` files or large assets are included.

## Configuration Notes
- Requires Node.js 16+; runtime usage expects a Titanium SDK + Alloy project. Prefer editing `src/` and regenerating `dist/` via build scripts instead of hand-editing built files.
- When adding new icon/font sources, keep generated assets under `assets/fonts/` and document any new flags or options in the CLI help and README.
