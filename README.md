<p align="center">
  <img src="https://codigomovil.mx/images/logotipo-purgetss-gris.svg" height="230" width="230" alt="PurgeCSS logo"/>
</p>

<div align="center">

![npm](https://img.shields.io/npm/dm/purgetss)
![npm](https://img.shields.io/npm/v/purgetss)
![NPM](https://img.shields.io/npm/l/purgetss)

</div>

**PurgeTSS** is a toolkit designed to enhance the development of mobile applications using the **[Titanium framework](https://titaniumsdk.com)**. It introduces several key features to streamline the app development process, making it simpler and more efficient for developers.

It offers a range of tools such as customizable utility classes, support for icon fonts, a user-friendly Animation module, a straightforward grid system, and the added convenience of the `shades` command for crafting personalized colors.

With **PurgeTSS**, creating visually appealing and dynamic mobile apps becomes more accessible and efficient.

---

## What's New in v7.2.x

**FontAwesome 7 & Major Optimization**: **PurgeTSS v7.2** introduces full support for **FontAwesome 7**, including the new CSS custom properties format. This version also features a significant reduction in installation size and a complete internal restructuring for better performance and maintainability.

### ⚠️ Breaking Changes

- **Node.js 20+** required (due to `inquirer` v13 upgrade)
- **Removed deprecated commands**:
  - `copy-fonts` (use `icon-library` instead)
  - `build-legacy` (legacy Tailwind build removed)
- **Complete legacy mode removal**:
  - All legacy-related code and conditional checks eliminated
  - Legacy mode no longer supported anywhere in the codebase

### ✅ Major Improvements

- **FontAwesome 7 Support**: Full compatibility with FontAwesome 7's new CSS custom properties (`--fa:`) format, while maintaining backward compatibility with version 6.
- **Reduced Installation Size**: Installation size has been reduced by approximately **45MB** by moving non-essential assets to development dependencies.
- **Improved Unicode Extraction**: Enhanced support for various Unicode formats, including short hex codes, ASCII symbols, and direct character mappings.
- **Optimized Internal Structure**: Entire codebase restructured into specialized modules for improved readability and faster execution.
- **Enhanced CLI Experience**: Reorganized commands into logical categories with improved error handling and intelligent command suggestions.

### 🔄 Command Improvements

- **`build-fonts` simplified**:
  - Automatically detects and handles both FontAwesome 6 and 7 formats.
  - The `-f` flag now controls both font class names AND icon prefixes using filenames.
- **`tailwind init`**: Removed redundant flags for a cleaner initialization process.
- **`shades` command**: Improved precision in generating custom color shades.
- **CLI Categories**: Commands are now grouped by purpose: Setup, Development, Assets, Utilities, and Maintenance.

### 🔧 Migration Guide

For most users, upgrading is seamless:
```bash
npm install -g purgetss@latest
```

**Key changes to note:**
- **Node.js 20 or higher** is now required.
- **FontAwesome 7**: If you use FA7, PurgeTSS will automatically handle the new `--fa:` properties.
- **VS Code Extension**: We now recommend using `KevinYouu.tailwind-raw-reorder-tw4` for better compatibility with modern Tailwind versions and XML reordering.

---

Here are its main functionalities:

- **Tailwind-like Utility Classes**: *PurgeTSS* offers over 21,000 utility classes similar to Tailwind CSS, providing a vast array of styling options for your projects.
- **Efficient Style Management**: It parses all your XML files to create a clean `app.tss` file, containing only the classes actually used in your project. This helps in reducing file size and improving performance.
- **Customization and JIT Classes**: Developers can customize default classes via a simple configuration file. It also supports just-in-time (JIT) classes, allowing the creation of arbitrary values within views for tailored styling.
- **Icon Fonts Integration**: *PurgeTSS* facilitates the use of popular icon fonts such as *Font Awesome*, *Material Icons*, *Material Symbols*, and *Framework7-Icons* in Buttons and Labels.
- **fonts.tss Generation**: The `build-fonts` command creates a `fonts.tss` file with class definitions and fontFamily selectors for various font types. It supports both regular fonts and icon fonts, with simplified options for using filenames as class names and icon prefixes.
- **Shades Command**: The toolkit includes a `shades` command that enables developers to generate custom color shades from a specified hex color, eliminating the need for external tools.
- **Animation Module**: *PurgeTSS* comes with an Animation module to apply basic 2D Matrix animations or transformations to elements or arrays of elements.
- **Grid System**: It includes a simple yet effective two-dimensional grid system to align and distribute elements within views.

Overall, *PurgeTSS* aims to simplify the mobile app development process, offering tools and features that enhance productivity and creativity in designing user interfaces.

### Visit the official documentation site at [purgetss.com](https://purgetss.com) to learn more.

## Requirements

- **Titanium SDK** (13.0.0.GA recommended)
- **Alloy Framework** (for most commands)
- **Node.js 20+** (required)

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
