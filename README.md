# Warning!!!
### purgeTSS will OVERWRITE your existing app.tss file
> Please rename your existing `app.tss` file to `base.tss`. PurgeTSS will combine it along with `tailwind.tss` and `fontawesome.tss` files.


# purgeTSS
purgeTSS is a small **CLI** that creates a clean `app.tss` file by copying only the classes used in your `views`.

#### It will purge all unused classes from your Appcelerator Project. ####

#### It work with [tailwind.tss](https://github.com/macCesar/tailwind-tss-color-generator/blob/master/app.tss) and [fontawesome.tss](https://github.com/macCesar/tailwind-tss-color-generator/blob/master/fontawesome.tss) ####

## Installation
```bash
# cd into your titanium project's root directory and run:
[sudo] npm i purgetss --save
```


## Purging your classes
Before running this script, rename your existing `app.tss` file to `base.tss`
```bash
npm explore purgetss -- npm run purgetss
```


## Sample file
Use this markup to test the script.

`index.xml`
```xml
<Alloy>
    <Window class="bg-primary">
        <View class="w-auto h-auto bg-white rounded-lg">
            <View class="w-10/12 mx-auto my-4 vertical">
                <ImageView class="w-16 h-16 mx-auto rounded-16" image="https://randomuser.me/api/portraits/men/43.jpg" />

                <View class="vertical">
                    <Label class="text-lg font-semibold">John W. Doe</Label>
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


After runing the script you will have this in `app.tss`

```css
// Tailwind CSS: A utility-first CSS framework for rapidly building custom designs. ( https://tailwindcss.com )
// Tailwind UI Plugin ( https://www.npmjs.com/package/@tailwindcss/ui ).
// Created by Adam Wathan ( https://twitter.com/adamwathan ).

// Tailwind for Titanium
// Converted by César Estrada
// https://github.com/macCesar/tailwind-tss-color-generator

// Reset Styles
'Window': { backgroundColor: '#ffffff' }
'ImageView[platform=ios]': { hires: true }
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'.vertical': { layout: 'vertical' }
'.horizontal': { layout: 'horizontal' }
'.vertical[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }
'.horizontal[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }
'.clip-enabled[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }

// Project Styles
'ImageView': {
    hires: true,
    preventDefaultImage: true
}

'.bg-primary': {
    backgroundColor: '#002359'
}

// Font Awesome Styles
'.far': { font: { fontFamily: 'FontAwesome5Free-Regular' } }
'.fas': { font: { fontFamily: 'FontAwesome5Free-Solid' } }
'.fa-envelope': { text: '\uf0e0', title: '\uf0e0' }
'.fa-phone-alt': { text: '\uf879', title: '\uf879' }

// Tailwind Styles
'.text-gray-600': { color: '#4b5563' }
'.text-purple-600': { color: '#7e3af2' }
'.bg-white': { backgroundColor: '#ffffff' }
'.text-xs': { font: { fontSize: 12 } }
'.text-sm': { font: { fontSize: 14 } }
'.text-lg': { font: { fontSize: 18 } }
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
```


## Contributing
If you have any suggestions or enhancements, please make a PR.


## License
purgeTSS is open-sourced software licensed under the MIT license.
