<p align="center">
	<img src="https://codigomovil.mx/images/logotipo-purgetss-gris.svg" height="230" width="230" alt="PurgeCSS logo"/>
</p>

**PurgeTSS** is a package for all [Titanium SDK developers](https://tidev.io/), who want to easily and quickly create beautifully designed mobile apps.

<p align="center">
  <a href="https://www.npmjs.com/package/purgetss" target="_blank">
    <img alt="npm" src="https://img.shields.io/npm/dm/purgetss">
  </a>
  <a href="https://www.npmjs.com/package/purgetss" target="_blank">
    <img alt="npm" src="https://img.shields.io/npm/v/purgetss">
  </a>
  <a href="https://www.npmjs.com/package/purgetss" target="_blank">
    <img alt="NPM" src="https://img.shields.io/npm/l/purgetss">
  </a>
</p>

------

## Some key features of PurgeTSS
- Provides more than 10600 [Tailwind-like utility classes](https://tailwindcss.com/) ready to use in your projects.
- Creates a clean `app.tss` file with only the classes used in your project by parsing all your XML files.
- You can customize any of the default classes through a simple configuration file, or you can create new *just-in-time* classes with arbitrary values within the `Views`.
- You can easily use Font Awesome, Material Design and Framework7-Icons fonts in `Buttons` and `Labels`.
- Includes an Animation module to apply a 2D Matrix animation or transformation to any element or to an `Array` of elements.
- Includes a simple two-dimensional Grid System to align and distribute elements in your views.

## List of available classes
- [tailwind.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/tailwind.tss)
- [fontawesome.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/fontawesome.tss)
- [framework7icons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/framework7icons.tss)
- [materialdesignicons.tss](https://github.com/macCesar/purgeTSS/blob/master/dist/materialdesignicons.tss)
- [Your own custom font classes](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)
- [Your own custom styles](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)

# IMPORTANT NOTICE!!!
### PurgeTSS will OVERWRITE your existing app.tss file

> When you run PurgeTSS for the first time, it will backup your `app.tss` file to `_app.tss`.
>
> From now on, add, delete or update your custom classes in `_app.tss.`
>
> Or better yet! Add your custom values in `config.js` to **[configure and customize](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)** PurgeTSS.

## Installation
**Install it globally on your machine via [NPM](https://www.npmjs.com/).**
```bash
> [sudo] npm i -g purgetss
```

**You'll need to run `purgetss` only once inside your project to automatically set the necesary files, after that, everytime you compile your app, PurgeTSS will `parse` all your XML files and generate a clean `app.tss` file with only the classes used in your project.**

## Example files
**Steps to use the example files:**
- Copy the content of `index.xml` and `app.tss` into a new Alloy project
- Install Fontawesome font files with `purgetss fonts --vendor="fontawesome"`
- Run `purgetss` once to process and purge all your `xml` files
- Compile your app as usual. **We recommend that you use `liveview` to speed up testing and development time.**.

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

**Every time PurgeTSS runs, it will copy the content of `_app.tss` to `app.tss`.**

`app.tss` after purging
```css
// PurgeTSS
// Created by César Estrada
// https://github.com/macCesar/purgeTSS

// Styles from _app.tss
'.bg-primary': {
  backgroundColor: '#002359'
}

// Tailwind styles
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
'.far': { font: { fontFamily: 'FontAwesome6Free-Regular' } }
'.fas': { font: { fontFamily: 'FontAwesome6Free-Solid' } }
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

    // These options are passed through directly to PurgeTSS
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

- Background Colors
- Border Colors
- Border Radius
- Border Width
- Content Width & Height
- Display
- Font Family
- Font Size
- Gradient Color Stops
- Height scale
- Margin
- Opacity
- Padding
- Placeholder Colors
- Shadow Colors
- Text Colors
- Tint Color
- Width scale
- ***Your own classes and ANY Ti Element with ANY number of attributes or conditional statements***

## To learn more see [Customization and Configuration Guide](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)

## build
When customizing your `config.js` file, you can re-generate `./purgetss/tailwind.tss` file by running:

```bash
> purgetss build

# alias:
> purgetss b
```

Every time you run the `purgetss` command, either manually or automatically (see `purgetss watch` below), **PurgeTSS** will check for any change made to `config.js` file and will re-generate `tailwind.tss` if necessary.

**After generating your new or updated `tailwind.tss` file, PurgeTSS will use it to parse your `xml` files.**

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
Use **`purgetss module`** command to install the `purgetss.ui.js` module in your `lib` folder.

```bash
> purgetss module

# alias:
> purgetss m
```

**PurgeTSS module contains:**

- **Animation**: Apply a 2D Matrix animation or transformation to any element or to an array of elements. **Please check out the new `Animation` module [here](https://github.com/macCesar/purgeTSS/blob/master/docs/whats-new/v2.5.0.md#animation-module).**

## create (Experimental)
If you want to create a new Alloy Project with `purgetss` ready to go, use the `create` command.

```bash
> purgetss create 'Name of the Project' [--vendor="fontawesome, materialdesign, lineicons, boxicons, framework7, tablericons, bootstrapicons"]

# alias:
> purgetss c 'Name of the Project' [-v=fa,md,f7]
```

#### Installing Tailwind CSS
You can also include the `--tailwind` option to install `Tailwind CSS` in your project to work with [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extenstion in VS Code with features such as autocomplete, syntax highlighting, and linting.

```bash
> purgetss create 'Name of the Project' [--tailwind]

# alias:
> purgetss c 'Name of the Project' [-t]
```

#### Requirments
You need to have `app.idprefix` and `app.idprefix` already configured in `ti config`.

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

#### List of Commands used
When you run `purgetss create 'Name of the Project'` it will execute the following commands:

- **`ti config app.idprefix && ti config app.workspace`** To retreive the related values.
- **`ti create -t app -p all -n "Name of the Project" --no-prompt --id 'the-prefix-id-and-the-name-of-the-project'`** To create an App project with the specified name and its id set automatically.
- **`cd app.workspace/"Name of the Project"`** Change to the newly created folder.
- **`alloy new`** To convert it to an Alloy Project.
- **`purgetss w`** To autorun `purgetss` every time you compile your project.
- **`purgetss b`** To build a new `./purgetss/tailwind.tss` and `./purgetss/config.js` files.
- **`[-v=fa,md,f7]`** Set the `--vendor` argument to copy the selected fonts into your project. Including the CommonJS module into `./app/lib/` folder.
- **`--tailwind`** When using this option, it will execute the following commands
  - **`npm init -y && npm i tailwindcss -D && npm i postcss -D && npx tailwindcss init`** to install `Tailwind CSS` and its dependancies.
- **`code .`**, **`subl .`** or **`open .`** It will use either one of these commands to open `VS Code`, `Sublime Text` or the project’s folder in that order.

## fonts
```bash
> purgetss fonts

# alias:
> purgetss f
```

Use this command to copy the free versions of [Font Awesome](https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/fontawesome-free/webfonts), [Material Design Icons](https://github.com/google/material-design-icons) and [Framework7 Icons](https://framework7.io/icons/),  Fonts into your `app/assets/fonts` folder. With their names fixed to work in iOS or Android.

> FontAwesome6Brands-Regular.ttf
>
> FontAwesome6Free-Regular.ttf
>
> FontAwesome6Free-Solid.ttf
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
>
> Framework7-Icons.ttf

After copying the desired fonts, you can use them in Buttons and Labels, just set the Font Family like `fa` and the desired icon like `fa-home`.

**FontAwesome example**:
```xml
<View class="vertical">
  <!-- FontAwesome -->
  <Label class="fa fa-home" />
  <Button class="fa fa-home" />
</View>
```

```xml
<Alloy>
  <Window>
    <ScrollView>
      <View class="grid">
        <View class="grid-cols-2 mx-auto gap-y-2 vertical">
          <!-- FontAwesome -->
          <Label class="mt-2 text-gray-700" text="FontAwesome" />
          <Label class="text-xl text-blue-500 fa fa-home" />
          <Button class="w-10 h-10 my-1 text-xl text-white bg-blue-500 rounded fa fa-home" />
        </View>

        <View class="grid-cols-2 mx-auto gap-y-2 vertical">
          <!-- Material Design -->
          <Label class="mt-2 text-gray-700" text="Material Design" />
          <Label class="text-xl text-blue-500 md md-home" />
          <Button class="w-10 h-10 my-1 text-xl text-white bg-blue-500 rounded md md-home" />
        </View>

        <View class="grid-cols-2 mx-auto gap-y-2 vertical">
          <!-- Framework7-Icons -->
          <Label class="mt-2 text-gray-700" text="Framework7-Icons" />
          <Label class="text-xl text-blue-500 f7 f7-house" />
          <Button class="w-10 h-10 my-1 text-xl text-white bg-blue-500 rounded f7 f7-house" />
        </View>
      </View>
    </ScrollView>
  </Window>
</Alloy>
```

```css
// PurgeTSS
// Created by César Estrada
// https://github.com/macCesar/purgeTSS

// Main styles
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'Window': { backgroundColor: '#ffffff' }
'.bg-blue-500': { backgroundColor: '#3b82f6' }
'.rounded': { borderRadius: 4 }
'.text-xl': { font: { fontSize: 20 } }
'.gap-y-2': { top: 8, bottom: 8 }
'.grid': { layout: 'horizontal' }
'.grid-cols-2': { width: '50%' }
'.h-10': { height: 40 }
'.vertical': { layout: 'vertical' }
'.my-1': { top: 4, bottom: 4 }
'.mx-auto': { right: null, left: null }
'.mt-2': { top: 8 }
'.text-white': { color: '#ffffff' }
'.text-gray-700': { color: '#374151' }
'.text-blue-500': { color: '#3b82f6' }
'.w-10': { width: 40 }

// Default Font Awesome styles
'.fa':{ font: { fontFamily: 'FontAwesome6Free-Solid' } }
'.fa-home': { text: '\uf015', title: '\uf015' }

// Material Design Icons styles
'.md': { font: { fontFamily: 'MaterialIcons-Regular' } }
'.md-home': { text: '\ue88a', title: '\ue88a' }

// Framework7 styles
'.f7': { font: { fontFamily: 'Framework7-Icons' } }
'.f7-house': { text: 'house', title: 'house' }
```

## Result
<img src="https://raw.githubusercontent.com/macCesar/purgeTSS/master/assets/images/icon-fonts-bootstrap-grid.png" width="375" alt="iOS Screen - Icon Fonts">

### Copying specific font vendors
Use any of the following arguments to copy specific vendors:

```bash
> purgetss fonts --vendor="fontawesome, materialdesign, framework7"

# alias:
> purgetss f -v=fa,md,f7
```

Available aliases:
- fa, font, fontawesome = Font Awesome Icons
- md, material, materialdesign = Material Design Icons
- f7, framework, framework7 = Framework7 Icons

### Copying corresponding CommonJS Modules
You can use the `--modules` flag to copy the corresponding CommonJS modules into `./app/lib/` folder.

```bash
> purgetss fonts --modules
> purgetss fonts --modules --vendor="fontawesome, materialdesign, framework7"

# alias:
> purgetss f -m
> purgetss f -m -v=fa,md,f7
```

Each library contains a CommonJS module exposing the UniCode strings for Font Awesome Icons, Material Design Icons and Framework7-Icons fonts.

All prefixes are stripped out from their class names and are camelCased, for example:

- **Font Awesome**: `fa-flag` becomes `flag`
- **Material Design Icons**: `md-flag` becomes `flag`
- **Framework7 Icons** `f7-alarm_fill` becomes `alarmFill` or `f7-clock_fill` becomes `clockFill`.

### Custom `fontawesome.tss` file for users with a Font Awesome Pro Account
If you have a **[Font Awesome Pro Account](https://fontawesome.com/pro)** you can generate a custom `./purgetss/fontawesome.tss` file with all the extra classes that the Pro version has. ***(except duotone icons, see note below)***

After setting the **[@fortawesome scope](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro)** with your token, you can install them in your project's root folder with `npm init` and `npm install --save-dev @fortawesome/fontawesome-pro` (current version 6.0.0)

Now, all you have to do is run `purgetss build` and it will generate a new `purgetss/fontawesome.tss` file and if needed, it will automatically copy the Pro fonts files into `app/assets/fonts`.

### Font Awesome 6 Beta
You can even generate a custom `fontawesome.tss` file from **[Font Awesome 6 Beta](https://fontawesome.com/download)**.

Just move `css` and `webfonts` folders from `fontawesome-pro-6.0.0-beta3-web/`:

```bash
fontawesome-pro-6.0.0-beta3-web
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

Use this command to update **PurgeTSS** to the latest version.

We constantly update **PurgeTSS** to add new features, to include the latest versions of Tailwind, Tailwind UI, FontAwesome, etc., and for bug fixes.

## sudo-update
If you need to use `sudo` to install NPM modules, please use `purgetss sudo-update`

```bash
> purgetss sudo-update

# alias:
> purgetss su
```

## Contributing
If you have any suggestions or improvements, please make a PR.
