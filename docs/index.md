---
layout: default
title: Home
---

<p align="center">
  <img src="https://codigomovil.mx/images/logotipo-purgetss-gris.svg" height="230" width="230" alt="PurgeCSS logo"/>
</p>

<div align="center">

![npm](https://img.shields.io/npm/dm/purgetss)
![npm](https://img.shields.io/npm/v/purgetss)
![NPM](https://img.shields.io/npm/l/purgetss)

</div>

:::info
**Purge TSS** is a toolkit designed to enhance the development of mobile applications using the **[Titanium framework](https://titaniumsdk.com)**. It introduces several key features to streamline the app development process, making it simpler and more efficient for developers.

It offers a range of tools such as customizable utility classes, support for icon fonts, a user-friendly Animation module, a straightforward grid system, and the added convenience of the `shades` command for crafting personalized colors.

With **Purge TSS**, creating visually appealing and dynamic mobile apps becomes more accessible and efficient.
:::

---

Here are its main functionalities:

- **Tailwind-like Utility Classes**: *Purge TSS* offers over 21,000 utility classes similar to Tailwind CSS, providing a vast array of styling options for your projects.
- **Efficient Style Management**: It parses all your XML files to create a clean `app.tss` file, containing only the classes actually used in your project. This helps in reducing file size and improving performance.
- **Customization and JIT Classes**: Developers can customize default classes via a simple configuration file. It also supports just-in-time (JIT) classes, allowing the creation of arbitrary values within views for tailored styling.
- **Icon Fonts Integration**: *Purge TSS* facilitates the use of popular icon fonts such as *Font Awesome*, *Material Icons*, *Material Symbols*, and *Framework7-Icons* in Buttons and Labels.
- **fonts.tss Generation**: This process creates a `fonts.tss` file with class definitions and *fontFamily* selectors for various font types, making it easy to add custom fonts, including icon fonts, to a project.
- **Shades Command**: The toolkit includes a `shades` command that enables developers to generate custom color shades from a specified hex color, eliminating the need for external tools.
- **Animation Module**: *Purge TSS* comes with an Animation module to apply basic 2D Matrix animations or transformations to elements or arrays of elements.
- **Grid System**: It includes a simple yet effective two-dimensional grid system to align and distribute elements within views.

Overall, *Purge TSS* aims to simplify the mobile app development process, offering tools and features that enhance productivity and creativity in designing user interfaces.

## Table of Content

- [Installation](./Installation.md)
- [Commands](./Commands.md)
- Customization
  - [config file](./customization/1-Configuring%20Guide.md)
  - [Custom rules](./customization/2-Custom%20rules.md)
  - [apply directive](./customization/3-The%20apply%20directive.md)
  - [opacity modifier](./customization/4-Opacity.md)
  - [Arbitrary values in XMLs](./customization/5-Arbitrary%20Values.md)
  - [Platform and Device modifiers](./customization/6-Platform%20and%20Device%20modifiers.md)
  - [Icon Fonts Libraries](./customization/7-Icon%20Fonts%20Libraries.md)
- Animation module
  - [Introduction](./animation-module/1.%20Introduction.md)
  - [Available utilities](./animation-module/7.%20Available%20Utilities.md)
  - [Complex UI elements](./animation-module/6.%20Complex%20UI%20Elements.md)
- [Grid System](./Grid%20System.md)
