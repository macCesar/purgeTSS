# IMPORTANT NOTICE!!!
### purgeTSS will OVERWRITE your existing app.tss file

> When you run `purgeTSS` for the first time, it will backup your `app.tss` file to `_app.tss`.
>
> It will use it together with `tailwind.tss`,` fontawesome.tss`, `materialicons.tss`,` lineicons.tss` and your `custom.tss` file to create a new purged ʻapp.tss` file.
>
> From now on, add, update or remove your custom classes in `_app.tss.`


# purgeTSS
`purgeTSS` is a small **CLI** that creates a clean `app.tss` file by copying only the classes used in your XML Files.

It works with [tailwind.tss](https://github.com/macCesar/purgeTSS/blob/master/tss/tailwind.tss), [fontawesome.tss](https://github.com/macCesar/purgeTSS/blob/master/tss/fontawesome.tss), [materialicons.tss](https://github.com/macCesar/purgeTSS/blob/master/tss/materialicons.tss), [lineicons.tss](https://github.com/macCesar/purgeTSS/blob/master/tss/lineicons.tss) and your [custom.tss](https://github.com/macCesar/purgeTSS/blob/master/docs/configuring-guide.md) file.

**ALL your classes from your original ʻapp.tss` file will be copied without purging.**

## Installation
Install it globally on your machine via [NPM](http://npmjs.org/).
```bash
> [sudo] npm i -g purgetss
```

## Purging classes
To parse all your XML files, run `purgetss` inside the root directory of your project.
```bash
> purgetss
```

`purgetss` will extract all the classes found and copy them along with all the styles originally declared in app.tss.

## Commands

### auto-update
```bash
> purgetss auto-update

# alias:
> purgetss a
```

Use this command to update `purgeTSS` to the latest version.

We constantly update purgeTSS to add new features, to include the latest versions of Tailwind, Tailwind UI and to fix bugs.

### init
```bash
> purgetss init

# alias:
> purgetss i
```
Create a `config.js` file inside the `purgetss` folder in the root of your project
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    //
  }
};
```
You can create a custom TSS file with the following keys:

- colors
- spacing
- width
- height
- textColor
- backgroundColor
- borderColor
- placeholderColor
- gradientColorStops
- fontFamily
- fontSize
- borderRadius
- borderWidth
- opacity
- *Your own class names or any Ti Element with any number of attributes or conditional statements*

### build-custom
```bash
> purgetss build-custom

# alias:
> purgetss b
```
It generates a new `custom.tss` file based on the attributes defined in `./purgetss/config.js`.

The file is stored inside the `purgetss` folder.

After generating the file, you can use any of your custom classes in your project.

**Remember to run `purgetss` to copy all used classes to `app.tss`.**

### To learn more see **[Configuring and customizing styles](/docs/configuring-guide.md)**

### dev-mode
```bash
> purgetss dev-mode

# alias:
> purgetss d
```

When you are creating a prototype of your application, you will want to have all the classes available in the `app.tss` file, rather than purging each time you add new classes to your XML views.

You can copy **all available classes** in `tailwind.tss`, `fontawesome.tss`, `materialicons.tss`, `lineicons.tss` and your `custom.tss` file.

### A warning when working with very large `.tss` files
When you compile a very large `.tss` file, you will get the following note:

> ___[BABEL] Note: The code generator has deoptimised the styling of [ name-of-the-generated-style.js-file ] as it exceeds the max of 500KB.___

**Not to mention the increased time to compile all classes and the increased size of all generated JS files within the styles folder!**

To avoid this, you can copy the styles from the desired providers. *See below*.

### Copying specific styles
```bash
> purgetss dev-mode --files="tailwind, fontawesome, materialdesing, lineicons, customstyles"

# alias:
> purgetss d -f=tw,fa,md,li,cu
```
Use any of the following arguments to copy specific vendor styles:

- tw, tail, tailwind = Tailwind styles
- fa, font, fontawesome = Font Awesome styles
- md, material, materialdesign = Material Design Icons styles
- li, line, lineicons = LineIcons styles
- cu, custom, customstyles = Your Custom styles

### copy-fonts
```bash
> purgetss copy-fonts

# alias:
> purgetss c
```
Use this command to copy the free versions of [Font Awesome](https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/fontawesome-free/webfonts), [Material Design Icons](https://github.com/google/material-design-icons) and [LineIcons](https://lineicons.com/free/) fonts into your `app/assets/fonts` folder. With their names corrected to work with your application, either for iOS or Android.

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
```bash
> purgetss copy-fonts --files="fontawesome, materialdesing, lineicons"

# alias:
> purgetss c -f=fa,md,li
```
Use any of the following arguments to copy specific vendor sources:

- fa, font, fontawesome = Font Awesome Icons
- md, material, materialdesign = Material Design Icons
- li, line, lineicons = LineIcons

## Sample files
Use this markup to try `purgeTSS`.

`index.xml`
```xml
<Alloy>
  <Window class="bg-primary">
    <View class="w-auto h-auto bg-white rounded-lg">
      <View class="w-10/12 mx-auto my-4 vertical">
        <ImageView class="w-16 h-16 mx-auto rounded-16" image="https://randomuser.me/api/portraits/men/43.jpg" />

        <View class="vertical">
          <Label class="text-lg text-gray-900 font-semibold">John W. Doe</Label>
          <Label class="mt-0.5 text-purple-600 text-sm">Product Engineer</Label>

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
> purgetss copy-fonts --files="fontawesome"
```

## Purged `app.tss` file
After running `purgetss` you will have a new file `app.tss` with only the classes found in your XML files.

Your original `app.tss` file is backed up in the `_app.tss` file. Use this file if you need to add, delete or update any of your original styles.

Every time you run `purgetss` it will copy everything from `_app.tss` to `app.tss`.

```css
// purgeTSS
// Created by César Estrada
// https://github.com/macCesar/purgeTSS

// Reset Styles
'Window': { backgroundColor: '#ffffff' }
'ImageView[platform=ios]': { hires: true }
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'.vertical': { layout: 'vertical' }
'.horizontal': { layout: 'horizontal' }
'.vertical[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }
'.horizontal[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }
'.clip-enabled[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }

// Styles from _app.tss
'.bg-primary': {
  backgroundColor: '#002359'
}

// Tailwind CSS v1.9.6: A utility-first CSS framework for rapidly building custom designs. ( https://tailwindcss.com )
// Tailwind UI Plugin v0.6.2 ( https://www.npmjs.com/package/@tailwindcss/ui ).
// Created by Adam Wathan ( https://twitter.com/adamwathan ).
'.text-gray-600': { color: '#4b5563' }
'.text-gray-900': { color: '#161e2e' }
'.text-purple-600': { color: '#7e3af2' }
'.bg-white': { backgroundColor: '#ffffff' }
'.text-xs': { font: { fontSize: 12 } }
'.text-sm': { font: { fontSize: 14 } }
'.text-lg': { font: { fontSize: 18 } }
'.font-semibold': { font: { fontWeight: 'semibold' } }
'.rounded-lg': { borderRadius: 8 }
'.rounded-16': { borderRadius: 32 }
'.my-4': { top: 16, bottom: 16 }
'.mx-auto': { right: null, left: null }
'.mt-0.5': { top: 2 }
'.mr-0': { right: 0 }
'.mr-1': { right: 4 }
'.ml-0': { left: 0 }
'.w-16': { width: 64 }
'.w-auto': { width: Ti.UI.SIZE }
'.w-10/12': { width: '83.333333%' }
'.w-screen': { width: Ti.UI.FILL }
'.h-16': { height: 64 }
'.h-auto': { height: Ti.UI.SIZE }

// Font Awesome Free 5.15.1 by @fontawesome - https://fontawesome.com
// License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)

// Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen readers do not read off random characters that represent icons
'.far': { font: { fontFamily: 'FontAwesome5Free-Regular' } }
'.fas': { font: { fontFamily: 'FontAwesome5Free-Solid' } }
'.fa-envelope': { text: '\uf0e0', title: '\uf0e0' }
'.fa-phone-alt': { text: '\uf879', title: '\uf879' }

```

## Result
<img src="assets/images/sample.png" width="375" alt="iOS Screen - Example">

## More examples in the accompanying app
[Tailwind TSS Sample App](https://github.com/macCesar/tailwind.tss-sample-app)

## Contributing
If you have any suggestions or improvements, please make a PR.


## License
`purgeTSS` is open-sourced software licensed under the MIT license.
