# Warning!!!
- ### This script will OVERWRITE your existing app.tss file
  > Please rename your existing `app.tss` file to `base.tss`. PurgeTSS will combine it along with `tailwind.tss` and `fontawesome.tss` files.

# purgeTSS
purgeTSS creates a clean `app.tss` file by combining your `base.tss` file by copying only the classes used in your views.

**It is ment to be use in combination with [tailwind.tss](https://github.com/macCesar/tailwind-tss-color-generator/blob/master/app.tss) and [fontawesome.tss](https://github.com/macCesar/tailwind-tss-color-generator/blob/master/fontawesome.tss).**

## Installation
```bash
# In your project's root directory run:
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
    <Window class="bg-green-100">
        <View class="w-auto h-auto bg-white rounded-lg">
            <View class="my-4 w-9/12 mx-auto vertical">
                <ImageView class="h-16 w-16 rounded-16 mx-auto" image="https://randomuser.me/api/portraits/men/43.jpg" />

                <View class="vertical">
                    <Label class="text-lg font-semibold">John W. Doe</Label>
                    <Label class="mt-0.5 text-purple-600 text-sm">Product Engineer</Label>
                    <Label class="text-gray-600 text-sm">john.doe@internet.com</Label>
                    <Label class="text-gray-600 text-sm">(555) 765-4321</Label>
                </View>
            </View>
        </View>
    </Window>
</Alloy>
```

After runing the script you will have this in app.tss
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

// Project’s Styles

// FontAwesome’s Styles

// Tailwind’s Styles
'.text-gray-600': { color: '#4b5563' }
'.text-purple-600': { color: '#7e3af2' }
'.bg-white': { backgroundColor: '#ffffff' }
'.bg-green-100': { backgroundColor: '#def7ec' }
'.text-sm': { font: { fontSize: 14 } }
'.text-lg': { font: { fontSize: 18 } }
'.rounded-lg': { borderRadius: 8 }
'.rounded-16': { borderRadius: 32 }
'.my-4': { top: 16, bottom: 16 }
'.mx-auto': { right: null, left: null }
'.mt-0.5': { top: 2 }
'.w-16': { width: 64 }
'.w-auto': { width: Ti.UI.SIZE }
'.w-9/12': { width: '75%' }
'.h-16': { height: 64 }
'.h-auto': { height: Ti.UI.SIZE }
```

## Contributing
If you have any suggestions or enhancements, please make a PR.

## License
purgeTSS is open-sourced software licensed under the MIT license.
