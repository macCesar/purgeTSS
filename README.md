# purgeTSS
It is an all-round package for all [Titanium Developers](https://github.com/appcelerator/titanium_mobile) who want to easily and quickly create beautifully designed mobile apps by providing a set of [Tailwind-like classes](https://tailwindcss.com/) to build any design, directly in your Alloy Views.

**Some key features of purgeTSS:**
- Provides more than 5000 utility classes ready to use in your projects.
- It generates an `app.tss` file with only the classes used in your project by parsing all your XML files from the `Views` folder.
- You can customize any of the default classes through a simple configuration file, or you can create new *just-in-time* classes with arbitrary values within the `Views`.
- You can easily use Font Awesome, Material Design, Boxicons and LineIcons fonts in `Labels` and `Buttons`.
- Includes an Animation module to apply a 2D Matrix animation or transformation to any element or to an `Array` of elements.
- Includes a simple two-dimensional Grid System to align and distribute the elements in your views.

**List of available classes:**
- [tailwind.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/tailwind.tss)
- [lineicons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/lineicons.tss)
- [boxicons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/boxicons.tss)
- [fontawesome.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/fontawesome.tss)
- [materialdesignicons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/materialdesignicons.tss)
- [Your own custom styles](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)

# IMPORTANT NOTICE!!!
### purgeTSS will OVERWRITE your existing app.tss file

**ALL your classes from your original `app.tss` file will be copied without purging.**

> When you run purgeTSS for the first time, it will backup your `app.tss` file to `_app.tss`.
>
> From now on, add, delete or update your custom classes in `_app.tss.`
>
> Or better yet! Add your custom values in `config.js` to **[configure and customize](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)** purgeTSS.

## Installation
**Install it globally on your machine via [NPM](http://npmjs.org/).**
```bash
> [sudo] npm i -g purgetss
```

## Example files
**Steps to use the example files:**
- Copy the content of `index.xml` and `app.tss` into a new Alloy project.
- Install Fontawesome font files with `purgetss fonts --vendor="fontawesome"`
- Run `purgetss` to process and `purge` the `xml` file.
- Compile your app

`index.xml`
```xml
<Alloy>
  <Window class="bg-primary">
    <View class="w-10/12 h-auto bg-white rounded-lg">
      <View class="m-4 vertical">
        <ImageView class="w-16 h-16 mx-auto rounded-16" image="https://randomuser.me/api/portraits/men/43.jpg" />

        <View class="vertical">
          <Label class="text-lg font-semibold text-center text-gray-900">John W. Doe</Label>
          <Label class="text-sm text-center text-purple-600 mt-0.5">Product Engineer</Label>

          <View class="w-screen mt-6">
            <View class="ml-0 horizontal">
              <Label class="mr-1 text-xs text-gray-600 far fa-envelope"></Label>
              <Label class="text-xs text-gray-600">john@internet.com</Label>
            </View>

            <View class="mr-0 horizontal">
              <Label class="mr-1 text-xs text-gray-600 fas fa-phone-alt"></Label>
              <Label class="text-xs text-gray-600">(555) 765-4321</Label>
            </View>
          </View>
        </View>
      </View>
    </View>
  </Window>
</Alloy>
```

`app.tss`
```css
'.bg-primary': {
  backgroundColor: '#002359'
}
```

After running `purgetss` you will have a new `app.tss` file with only the classes used in your XML files.

**Your original `app.tss` file is backed up in `_app.tss`. Use this file if you need to add, delete or update any of your original styles.**

**Every time you run `purgetss` it will copy the content of `_app.tss` to `app.tss`.**

`app.tss` after purging
```css
// purgeTSS
// Created by César Estrada
// https://github.com/macCesar/purgeTSS

// Styles from _app.tss
'.bg-primary': {
  backgroundColor: '#002359'
}

// Custom Tailwind Styles
'ImageView[platform=ios]': { hires: true }
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'Window': { backgroundColor: '#ffffff' }
'.bg-white': { backgroundColor: '#ffffff' }
'.rounded-16': { borderRadius: 32 }
'.rounded-lg': { borderRadius: 8 }
'.text-xs': { font: { fontSize: 12 } }
'.text-sm': { font: { fontSize: 14 } }
'.text-lg': { font: { fontSize: 18 } }
'.font-semibold': { font: { fontWeight: 'semibold' } }
'.h-16': { height: 64 }
'.h-auto': { height: Ti.UI.SIZE }
'.vertical': { layout: 'vertical' }
'.horizontal': { layout: 'horizontal' }
'.m-4': { top: 16, right: 16, bottom: 16, left: 16 }
'.mx-auto': { right: null, left: null }
'.mt-6': { top: 24 }
'.mt-0.5': { top: 2 }
'.mr-0': { right: 0 }
'.mr-1': { right: 4 }
'.ml-0': { left: 0 }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }
'.text-purple-600': { color: '#9333ea' }
'.text-gray-600': { color: '#52525b' }
'.text-gray-900': { color: '#18181b' }
'.w-16': { width: 64 }
'.w-10/12': { width: '83.333334%' }
'.w-screen': { width: Ti.UI.FILL }

// Default Font Awesome styles
'.fa-envelope': { text: '\uf0e0', title: '\uf0e0' }
'.fa-phone-alt': { text: '\uf879', title: '\uf879' }
'.far': { font: { fontFamily: 'FontAwesome5Free-Regular' } }
'.fas': { font: { fontFamily: 'FontAwesome5Free-Solid' } }
```

## Result
<img src="https://raw.githubusercontent.com/macCesar/purgeTSS/master/assets/images/sample-fixed.png" width="375" alt="iOS Screen - Example">

## More examples in the accompanying app
**[Tailwind TSS Sample App](https://github.com/macCesar/tailwind.tss-sample-app)**

## Available Commands

## init
Creates a `./purgetss/config.js` file at the root of your project.

```bash
> purgetss init

# alias:
> purgetss i
```

```javascript
// ./purgetss/config.js
module.exports = {
  'purge': {
    'mode': 'all',

    // These options are passed through directly to purgeTSS
    'options': {
      'safelist': [],
    }
  },
  'theme': {
    'extend': {}
  }
};
```

`purgetss` will look for this file `./purgetss/config.js` file where you can define any customization.

Every section of the config file is optional, so you only have to specify whatever you'd like to customize. Any missing sections will fall back to the default configuration.

You can customize the following properties:

- width
- height
- visible
- margin
- opacity
- padding
- fontSize
- tintColor
- fontStyle
- textColor
- fontFamily
- borderColor
- borderWidth
- borderRadius
- placeholderColor
- backgroundColor
- gradientColorStops
- contentWidth/contentHeight
- showHorizontalScrollIndicator / showVerticalScrollIndicator
- ***Your own class names and any Ti Element with any number of attributes or conditional statements***

## See [Customization and Configuration Guide](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md) to learn more

## build
When customizing your `config.js` file, you can re-generate `./purgetss/tailwind.tss` file by running:

```bash
> purgetss build

# alias:
> purgetss b
```

Every time you run the `purgetss` command, either manually or automatically (see `purgetss watch` below), **purgeTSS** will check for any change made to `config.js` file and will re-generate `tailwind.tss` if necessary.

**After generating your new or updated `tailwind.tss` file, purgeTSS will use it to parse your `xml` files.**

## watch
```bash
> purgetss watch

# alias:
> purgetss w
```

Use this command to autorun `purgetss` every time you compile your project.

This is very useful in combination with `LiveView` because it will purge all of your files every time you make a change, for example when adding or deleting styles in your Views.

**You'll get instant feedback of any change you made and speed up your prototyping process significantly.**

*This only works with regular Alloy projects compiled with `[appc] ti build` command, we haven't test it with any other type of project like webpack or vue.*

**Use the `--off` option to turn it off.**
```bash
> purgetss watch --off

# alias:
> purgetss w -o
```

## module
Use **`purgetss module`** command to install the `Animation`  module library in your `lib` folder.

```bash
> purgetss module

# alias:
> purgetss m
```

**Please check out the new `Animation` module [here](https://github.com/macCesar/purgeTSS/blob/master/docs/whats-new/v2.5.0.md#animation-module).**

## create (Experimental)
If you want to create a new Alloy Project with `purgetss` already configured, use the `create` command.
```bash
> purgetss create 'Name of the Project' [--vendor="fontawesome, materialdesign, lineicons, boxicons"]

# alias:
> purgetss c 'Name of the Project' [-v=fa,md,li,bx]
```

You'll have to have `app.idprefix` and `app.idprefix` already configured in `ti config`.

```bash
# A name in reverse domain name format.
app.idprefix               = "com.yourdomain"
# Path to use as the workspace directory for new projects.
app.workspace              = "/<full-path-to>/<workspace>/<folder>"
# ...
```

You can configure them like this:
```bash
ti config app.idprefix 'com.yourdomain'
ti config app.workspace 'the-full-path/to-the-workspace-folder'
```

When you run `purgetss create 'Name of the Project'` it will execute the following commands:

- **`ti config app.idprefix && ti config app.workspace`** To retreive the related values.
- **`ti create -t app -p all -n "Name of the Project" --no-prompt --id 'the-prefix-id-and-the-name-of-the-project'`** To create an App project with the specified name and its id set automatically.
- **`cd app.workspace/"Name of the Project"`** Change to the newly created folder.
- **`alloy new`** To convert it to an Alloy Project.
- **`purgetss w`** To autorun `purgetss` every time you compile your project.
- **`purgetss b`** To build a new `./purgetss/tailwind.tss` and `./purgetss/config.js` files.
- **`[-v=fa,md,li,bx]`** To copy the selected fonts with the optional `-v` argument into your project. Including the CommonJS module into `./app/lib/` folder.
- **`code .`**, **`subl .`** or **`open .`** It will use either one of these commands to open `VS Code`, `Sublime Text` or the project’s folder in that order.

## fonts
```bash
> purgetss fonts

# alias:
> purgetss f
```

Use this command to copy the free versions of [Font Awesome](https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/fontawesome-free/webfonts), [Material Design Icons](https://github.com/google/material-design-icons), [LineIcons](https://lineicons.com/icons/?type=free) and [Boxicons](https://boxicons.com) fonts into your `app/assets/fonts` folder. With their names fixed to work with your application, either for iOS or Android.

> boxicons.ttf
>
> FontAwesome5Brands-Regular.ttf
>
> FontAwesome5Free-Regular.ttf
>
> FontAwesome5Free-Solid.ttf
>
> LineIcons.ttf
>
> MaterialIcons-Regular.ttf
>
> MaterialIconsOutlined-Regular.otf
>
> MaterialIconsRound-Regular.otf
>
> MaterialIconsSharp-Regular.otf
>
> MaterialIconsTwoTone-Regular.otf

### Copying specific fonts
Use any of the following arguments to copy specific vendors:

```bash
> purgetss fonts --vendor="fontawesome, materialdesign, lineicons, boxicons"

# alias:
> purgetss f -v=fa,md,li,bx
```

Available aliases:
- bx, box, boxicons = BoxIcons
- li, line, lineicons = LineIcons
- fa, font, fontawesome = Font Awesome Icons
- md, material, materialdesign = Material Design Icons

### Copying corresponding CommonJS Modules
Add the `--modules` flag to also copy the corresponding CommonJS modules into `./app/lib/` folder:

```bash
> purgetss fonts --modules
> purgetss fonts --modules --vendor="fontawesome, materialdesign, lineicons, boxicons"

# alias:
> purgetss f -m
> purgetss f -m -v=fa,md,li,bx
```

Each library contains a CommonJS module exposing the UniCode strings for Font Awesome icons, Material Design Icons, Line Icons and Boxicons fonts.

All prefixes are stripped out from the names, for example:

- Line Icons: `lni-flag` becomes `flag`
- Font Awesome: `fa-flag` becomes `flag`
- Material Design Icons: `md-flag` becomes `flag`

Except for `boxicons`, because there are three sets of icons in the same font file: Logos, Regular and Solid.
- Regular: `bx-flag` becomes `bxFlag`
- Solid: `bxs-flag` becomes `bxsFlag`
- Logos: Almost all the logos have no conflict with other classes, because almost all have unique names, except for one: `bxl-windows` and `bx-windows`. That's why we are also keeping the prefix for all `logos` variants, so they become: `bxlWindows` for example.

**All Icon names are camelCased, `arrow-up` becomes `arrowUp`.**

### Custom `fontawesome.tss` file for users with a Font Awesome Pro Account
If you have a **[Font Awesome Pro Account](https://fontawesome.com/pro)** you can generate a custom `./purgetss/fontawesome.tss` file with all the extra classes that the Pro version has. ***(except duotone icons, see note below)***

After setting the **[@fortawesome scope](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro)** with your token, you can install them in your project's root folder with `npm init` and `npm install --save-dev @fortawesome/fontawesome-pro` (current version 5.15.4)

Now, all you have to do is run `purgetss build` and it will generate a new `purgetss/fontawesome.tss` file and if needed, it will automatically copy the Pro fonts files into `app/assets/fonts`.

### Font Awesome 6 Beta1
You can even generate a custom `fontawesome.tss` file from **Font Awesome 6 Beta**.

Just move `css` and `webfonts` folders from `fontawesome-pro-6.0.0-beta1-web/`:

```bash
fontawesome-pro-6.0.0-beta1-web
└─ css
└─ webfonts
```

Into `./purgetss/fontawesome-beta`:

```bash
purgetss
└─ fontawesome-beta
   ├─ css
   └─ webfonts
```

And as with the Pro Version, just run `purgetss build` to generate your custom `fontawesome.tss` file to beta-test your new icons!

**Note: Titanium can't use FontAwesome's Duotone icons because they have two separate glyphs for each individual icon.**

## update
```bash
> purgetss update

# alias:
> purgetss u
```

Use this command to update **purgeTSS** to the latest version.

We constantly update **purgeTSS** to add new features, to include the latest versions of Tailwind, Tailwind UI, FontAwesome, etc., and for bug fixes.

## sudo-update
If you need to use `sudo` to install NPM modules, please use `purgetss sudo-update`

```bash
> purgetss sudo-update

# alias:
> purgetss su
```

## Contributing
If you have any suggestions or improvements, please make a PR.

## License
```
Copyright 2020-2021 César Estrada

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License.

You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and limitations under the License.
```
