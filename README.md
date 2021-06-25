# IMPORTANT NOTICE!!!
### purgeTSS will OVERWRITE your existing app.tss file

> When you run `purgeTSS` for the first time, it will backup your `app.tss` file to `_app.tss`.
>
> From now on, add, update or remove your custom classes in `_app.tss.`
>
> Or better yet! Create a `config.js` file to **[configure and customize](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)** purgeTSS.

# purgeTSS
An extension for [Titanium SDK](https://github.com/appcelerator/titanium_mobile) that provides a set of Tailwind-like classes.

- It creates a clean `app.tss` on-the-fly by parsing all your XML files.
- Every default class can be customized through a simple configuration file.
- You can easily use Font Awesome, Material Design and Line Icons in Labels and Buttons.

It is an all-round package for all Titanium Developers who want to easily and quickly create beautifully designed mobile apps to satisfy their customers.

List of available libraries:
- [tailwind.tss](https://github.com/macCesar/purgeTSS/blob/master/tss/tailwind.tss)
- [fontawesome.tss](https://github.com/macCesar/purgeTSS/blob/master/tss/fontawesome.tss)
- [materialdesignicons.tss](https://github.com/macCesar/purgeTSS/blob/master/tss/materialdesignicons.tss)
- [lineicons.tss](https://github.com/macCesar/purgeTSS/blob/master/tss/lineicons.tss)
- [Your own custom styles](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)

**ALL your classes from your original ʻapp.tss` file will be copied without purging.**

## Installation
**Install it globally on your machine via [NPM](http://npmjs.org/).**
```bash
> [sudo] npm i -g purgetss
```

## Purging classes
To parse all your XML files, run `purgetss` inside your project's root directory.
```bash
> purgetss
```

`purgetss` will extract all available classes from your Views and copy them along with all your original styles from `app.tss`.

**To test it, see the [example files](https://github.com/macCesar/purgeTSS/blob/master/README.md#example-files)**

## Available Commands

### init
```bash
> purgetss init

# alias:
> purgetss i
```

By default, `purgetss` will look for an optional `./purgetss/config.js` file where you can define any customization.

Creates a minimal `./purgetss/config.js` file at the root of your project:
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

Every section of the config file is optional, so you only have to specify whatever you'd like to customize. Any missing sections will fall back to the default configuration.

You can customize the following keys:

- colors
- spacing
- textColor
- backgroundColor
- borderColor
- placeholderColor
- gradientColorStops
- width
- height
- margin
- padding
- tintColor
- contentWidth/contentHeight
- showHorizontalScrollIndicator/showVerticalScrollIndicator
- fontFamily
- fontSize
- borderRadius
- borderWidth
- opacity
- visible
- ***Your own class names and any Ti Element with any number of attributes or conditional statements***

### build
After customizing your `config.js` file, you'll need to generate a new `./purgetss/tailwind.tss` file by running:

```bash
> purgetss build

# alias:
> purgetss b
```

**After generating your custom `tailwind.tss` file, `purgeTSS` will use it instead of the default one.**

## To learn more see [Customization and Configuration Guide](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md)

### Custom `fontawesome.tss` file for Font Awesome Pro Account users
If you have a **[Font Awesome Pro Account](https://fontawesome.com/pro)** you can generate a custom `./purgetss/fontawesome.tss` file with all the extra classes that the Pro version has. ***(except duotone icons, see note below)***

After setting the **[@fortawesome scope](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro)** with your token, you can install them in your project's root folder with `npm init` and `npm install --save @fortawesome/fontawesome-pro` (current version 5.15.3)

Now, all you have to do is run `purgetss build` and it will generate a new `purgetss/fontawesome.tss` file and if needed, it will automatically copy the Pro fonts files into `app/assets/fonts`.

### Font Awesome 6 Alpha
You can even generate a custom `fontawesome.tss` file from **Font Awesome 6 Alpha**.

Just move `css` and `webfonts` folders from `fontawesome-pro-6.0.0-alpha2/fontawesome6/pro/`:

```bash
fontawesome-pro-6.0.0-alpha2
└─ fontawesome6
   └─ pro
      ├─ css
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

### dev ( NO LONGER RECOMMENDED, use [`purgetss watch`](https://github.com/macCesar/purgeTSS#watch) instead )
```bash
> purgetss dev

# alias:
> purgetss d
```

When you are prototyping your application, you will want to have all available classes in `app.tss`, rather than purging each time you add/remove classes to your XML views.

You can copy **all available classes** in `tailwind.tss`, `fontawesome.tss`, `materialdesignicons.tss`, `lineicons.tss` and your `custom.tss` file.

### A warning when working with very large `.tss` files
When you compile a very large `.tss` file, you will get the following note:

> ___[BABEL] Note: The code generator has deoptimised the styling of [ name-of-the-generated-style.js-file ] as it exceeds the max of 500KB.___

**Not to mention the increased time to compile all classes and the increased size of all generated JS files within the styles folder!**

To avoid this, you can specify certain providers. *See below*.

### Copying specific libraries
Use any of the following arguments to copy specific vendor styles.

```bash
> purgetss dev --files="tailwind, fontawesome, materialdesign, lineicons, customstyles"

# alias:
> purgetss d -f=tw,fa,md,li,cu
```

Available aliases:
- tw, tail, tailwind = Tailwind styles
- fa, font, fontawesome = Font Awesome styles
- md, material, materialdesign = Material Design Icons styles
- li, line, lineicons = LineIcons styles
- cu, custom, customstyles = Your Custom styles

### fonts
```bash
> purgetss fonts

# alias:
> purgetss f
```

Use this command to copy the free versions of [Font Awesome](https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/fontawesome-free/webfonts), [Material Design Icons](https://github.com/google/material-design-icons) and [LineIcons](https://lineicons.com/free/) fonts into your `app/assets/fonts` folder. With their names fixed to work with your application, either for iOS or Android.

> FontAwesome5Brands-Regular.ttf
>
> FontAwesome5Free-Regular.ttf
>
> FontAwesome5Free-Solid.ttf
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
> LineIcons.ttf

### Copying specific fonts
Use any of the following arguments to copy specific vendors:

```bash
> purgetss fonts --vendor="fontawesome, materialdesign, lineicons"

# alias:
> purgetss f -v=fa,md,li
```

Available aliases:
- fa, font, fontawesome = Font Awesome Icons
- md, material, materialdesign = Material Design Icons
- li, line, lineicons = LineIcons

### Copying corresponding CommonJS Modules
Add the `--modules` flag to also copy the corresponding CommonJS modules into `./app/lib/` folder:

```bash
> purgetss fonts --modules
> purgetss fonts --modules --vendor="fontawesome, materialdesign, lineicons"

# alias:
> purgetss f -m
> purgetss f -m -v=fa,md,li
```

Each library contains a CommonJS module exposing the UniCode strings for Font Awesome icons, Material Design Icons and Line Icons fonts.

All prefixes are stripped out from the names, for example:

- Font Awesome: fa-flag becomes flag
- Line Icons: lni-flag becomes flag
- Material Design Icons: md-flag becomes flag

All Icon names are camelCased, arrow-up becomes arrowUp.

### watch
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

### update
```bash
> purgetss update

# alias:
> purgetss u
```

Use this command to update `purgeTSS` to the latest version.

We constantly update **purgeTSS** to add new features, to include the latest versions of Tailwind, Tailwind UI, FontAwesome, etc., and for bug fixes.

### sudo-update
If you need to use `sudo` to install NPM modules, please use `purgetss sudo-update`

```bash
> purgetss sudo-update

# alias:
> purgetss su
```

## Example files
Use this markup to test `purgeTSS`.

`index.xml`
```xml
<Alloy>
  <Window class="bg-primary">
    <View class="w-auto h-auto bg-white rounded-lg">
      <View class="w-10/12 mx-auto my-4 vertical">
        <ImageView class="w-16 h-16 mx-auto rounded-16" image="https://randomuser.me/api/portraits/men/43.jpg" />

        <View class="vertical">
          <Label class="text-lg font-semibold text-gray-900">John W. Doe</Label>
          <Label class="text-sm text-purple-600 mt-0.5">Product Engineer</Label>

          <View class="w-screen">
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

Make sure to copy FontAwesome Fonts with
```bash
> purgetss fonts --vendor="fontawesome"
```

## Parse your XML files
Run `purgetss`
```bash
> purgetss
```
After running `purgetss` you will have a new file `app.tss` with only the classes found in your XML files.

**Your original `app.tss` file is backed up in `_app.tss`. Use this file if you need to add, delete or update any of your original styles.**

**Every time you run `purgetss` it will copy everything from `_app.tss` to `app.tss`.**

`app.tss`
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
'.font-semibold': { font: { fontWeight: 'semibold' } }
'.h-16': { height: 64 }
'.h-auto': { height: Ti.UI.SIZE }
'.horizontal': { layout: 'horizontal' }
'.horizontal[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }
'.ml-0': { left: 0 }
'.mr-0': { right: 0 }
'.mr-1': { right: 4 }
'.mt-0.5': { top: 2 }
'.mx-auto': { right: null, left: null }
'.my-4': { top: 16, bottom: 16 }
'.rounded-16': { borderRadius: 32 }
'.rounded-lg': { borderRadius: 4 }
'.text-gray-600': { color: '#52525b' }
'.text-gray-900': { color: '#18181b' }
'.text-lg': { font: { fontSize: 18 } }
'.text-purple-600': { color: '#9333ea' }
'.text-sm': { font: { fontSize: 14 } }
'.text-xs': { font: { fontSize: 12 } }
'.vertical': { layout: 'vertical' }
'.vertical[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }
'.w-10/12': { width: '83.333333%' }
'.w-16': { width: 64 }
'.w-auto': { width: Ti.UI.SIZE }
'.w-screen': { width: Ti.UI.FILL }

// Default Font Awesome styles
'.fa-envelope': { text: '\uf0e0', title: '\uf0e0' }
'.fa-phone-alt': { text: '\uf879', title: '\uf879' }
'.far': { font: { fontFamily: 'FontAwesome5Free-Regular' } }
'.fas': { font: { fontFamily: 'FontAwesome5Free-Solid' } }
```

## Result
<img src="assets/images/sample.png" width="375" alt="iOS Screen - Example">

## More examples in the accompanying app
[Tailwind TSS Sample App](https://github.com/macCesar/tailwind.tss-sample-app)

## Platform and Device Variants *(Experimental)*
You can specify different classes to any element using `Platform` and `Device` utility variants:

- `ios:`
- `android:`
- `handheld:`
- `tablet:`

`index.xml`
```xml
<Alloy>
  <Window class="tablet:bg-green-500 handheld:bg-blue-500">
    <View class="h-32 tablet:bg-green-100 handheld:bg-blue-100">
      <Label class="w-screen h-auto text-center ios:text-blue-800 ios:text-xl android:text-green-800 android:text-2xl">This is a Test</Label>
    </View>
  </Window>
</Alloy>

```

`app.tss`
```css
// purgeTSS
// Created by César Estrada
// https://github.com/macCesar/purgeTSS

// Custom Tailwind Styles
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'Window': { backgroundColor: '#ffffff' }
'.android:text-2xl[platform=android]': { font: { fontSize: 24 } }
'.android:text-green-800[platform=android]': { color: '#166534' }
'.h-32': { height: 128 }
'.h-auto': { height: Ti.UI.SIZE }
'.handheld:bg-blue-100[formFactor=handheld]': { backgroundColor: '#dbeafe' }
'.handheld:bg-blue-500[formFactor=handheld]': { backgroundColor: '#3b82f6' }
'.ios:text-blue-800[platform=ios]': { color: '#1e40af' }
'.ios:text-xl[platform=ios]': { font: { fontSize: 20 } }
'.tablet:bg-green-100[formFactor=tablet]': { backgroundColor: '#dcfce7' }
'.tablet:bg-green-500[formFactor=tablet]': { backgroundColor: '#22c55e' }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }
'.w-screen': { width: Ti.UI.FILL }
```

## Contributing
If you have any suggestions or improvements, please make a PR.


## License
`purgeTSS` is open-sourced software licensed under the MIT license.
