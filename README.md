<p align="center">
  <img src="https://codigomovil.mx/images/logotipo-purgetss-gris.svg" height="230" width="230" alt="PurgeCSS logo"/>
</p>

<div align="center">

![npm](https://img.shields.io/npm/dm/purgetss)
![npm](https://img.shields.io/npm/v/purgetss)
![NPM](https://img.shields.io/npm/l/purgetss)

</div>

**PurgeTSS** is a toolkit for building mobile apps with the [Titanium framework](https://titaniumsdk.com). It adds practical utilities to speed up styling and reduce repeated setup work.

It includes utility classes, icon font support, an Animation module, a simple grid system, and the `shades` command for generating custom colors.

If you build UI-heavy screens, PurgeTSS helps you move faster without hand-writing long TSS files.

---

## What's New in v7.2.x

FontAwesome 7 support and major internal cleanup. PurgeTSS v7.2 adds full support for FontAwesome 7, including the new CSS custom properties format. It also reduces installation size and reorganizes the codebase for better performance and maintainability.

### Breaking changes

- Node.js 20+ required (due to the `inquirer` v13 upgrade)
- Removed deprecated commands:
  - `copy-fonts` (use `icon-library` instead)
  - `build-legacy` (legacy Tailwind build removed)
- Complete legacy mode removal:
  - All legacy-related code and conditional checks eliminated
  - Legacy mode no longer supported anywhere in the codebase

### Major improvements

- FontAwesome 7 support: Works with the new `--fa:` custom properties while staying compatible with version 6.
- Reduced installation size: About 45MB smaller by moving non-essential assets to dev dependencies.
- Improved Unicode extraction: Better handling of short hex codes, ASCII symbols, and direct character mappings.
- Optimized internal structure: Codebase split into focused modules for readability and speed.
- Enhanced CLI experience: Commands grouped by purpose, with better error handling and smarter suggestions.

### Command improvements

- `build-fonts` simplified:
  - Automatically detects and handles both FontAwesome 6 and 7 formats.
  - The `-f` flag now controls both font class names and icon prefixes using filenames.
- `tailwind init`: Removed redundant flags for a cleaner initialization process.
- `shades` command: Better precision when generating custom color shades.
- CLI categories: Commands grouped by purpose: Setup, Development, Assets, Utilities, and Maintenance.

### Migration guide

For most users, upgrading is straightforward:
```bash
npm install -g purgetss@latest
```

Key changes to note:
- Node.js 20 or higher is now required.
- FontAwesome 7: If you use FA7, PurgeTSS will automatically handle the new `--fa:` properties.
- VS Code extension: We recommend `KevinYouu.tailwind-raw-reorder-tw4` for better compatibility with modern Tailwind versions and XML reordering.
- Clean reinstall: If you run into issues, try `npm uninstall -g purgetss && npm install -g purgetss`.

---

Here are its main functionalities:

- **Utility-First Classes**: PurgeTSS ships with 21,000+ utility classes, so you get a lot of styling options out of the box.
- **Efficient style management**: It parses all XML files to create a clean `app.tss` containing only the classes used in your project, reducing size and improving performance.
- **Customization and JIT classes**: You can customize default classes via a config file and use JIT classes for arbitrary values inside views.
- **Icon fonts integration**: Use icon fonts such as Font Awesome, Material Icons, Material Symbols, and Framework7-Icons in Buttons and Labels.
- **`fonts.tss` generation**: The `build-fonts` command creates a `fonts.tss` file with class definitions and fontFamily selectors for regular and icon fonts, with simplified options for filenames and icon prefixes.
- **`shades` command**: Generate custom color shades from a hex color without external tools.
- **Animation module**: Apply basic 2D matrix animations or transformations to elements or arrays of elements.
- **Grid system**: A two-dimensional grid system to align and distribute elements within views.

In short, PurgeTSS keeps styling consistent and removes a lot of repetitive UI setup work.

### Visit the official documentation site at [purgetss.com](https://purgetss.com) to learn more.

## Requirements

- **Titanium SDK** (Compatible with all versions; 13.1.1.GA recommended for full property support)
- **Alloy Framework** (for most commands)
- **Node.js 20+** (required for the CLI tool)

## Table of Content

- [What's New in v7.2](https://purgetss.com/#whats-new-in-v72x)
- [Installation](https://purgetss.com/docs/installation)
- [Commands](https://purgetss.com/docs/commands)
- Customization
  - [config file](https://purgetss.com/docs/customization/the-config-file)
  - [Custom rules](https://purgetss.com/docs/customization/custom-rules)
  - [apply directive](https://purgetss.com/docs/customization/the-apply-directive)
  - [opacity modifier](https://purgetss.com/docs/customization/the-opacity-modifier)
  - [Arbitrary values in XMLs](https://purgetss.com/docs/customization/arbitrary-values)
  - [Platform and Device modifiers](https://purgetss.com/docs/customization/platform-and-device-modifiers)
  - [Icon Fonts Libraries](https://purgetss.com/docs/customization/icon-fonts-libraries)
- Animation module
  - [Introduction](https://purgetss.com/docs/animation-module/introduction)
  - [Available utilities](https://purgetss.com/docs/animation-module/available-utilities)
  - [Complex UI elements](https://purgetss.com/docs/animation-module/complex-ui-elements)
- [Grid System](https://purgetss.com/docs/grid-system)
