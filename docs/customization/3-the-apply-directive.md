---
sidebar_position: 3
slug: the-apply-directive
title: The `apply` Directive
---

## Create Complex Classes and IDs

:::info
You can apply a set of classes to create more complex classes or when you find a repetitive pattern in your code and want to extract it into a new class component.
:::

- Set any ID, class, or Ti Element.
- Use any of the default classes.
- Use arbitrary values.
- Use any newly defined class in `config.js`.
- Set a string of classes or an array of classes.
- Combine it with any platform, device, or conditional-block properties.

## Set Any ID, Class, or Ti Element

```javascript title="./purgetss/config.js"
// ...
theme: {
  extend: {},
  Label: {
    apply: 'text-base font-bold text-gray-700'
  },
  fontWeight: {
    bold: 'bold'
  },
  fontFamily: {
    'saira-condensed': 'SairaCondensed-Regular'
  },
  '#carrousel': {
    apply: 'w-screen h-auto bg-teal-200 mx-2 my-4 horizontal'
  },
  '.my-custom-class': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5 font-saira-condensed'
  }
}
// ...
```

```css title="./purgetss/styles/tailwind.tss"
'Label': { color: '#374151', textColor: '#374151', font: { fontSize: 16, fontWeight: 'bold' } }

/* Custom Classes */
'#carrousel': { backgroundColor: '#99f6e4', height: Ti.UI.SIZE, layout: 'horizontal', right: 8, left: 8, top: 16, bottom: 16, width: Ti.UI.FILL }
'.my-custom-class': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontFamily: 'SairaCondensed-Regular', fontWeight: 'bold' } }
'.font-saira-condensed': { font: { fontFamily: 'SairaCondensed-Regular' } }
'.font-bold': { font: { fontWeight: 'bold' } }
```

## Use Any of the Default Classes

```javascript title="./purgetss/config.js"
// ...
theme: {
  '.btn': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5 font-saira-condensed'
  },
  '.btn-primary': {
    apply: 'bg-green-500 text-green-100 border-green-200'
  },
}
// ...
```

```css title="./purgetss/styles/tailwind.tss"
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontFamily: 'SairaCondensed-Regular', fontWeight: 'bold' } }
'.btn-primary': { backgroundColor: '#22c55e', borderColor: '#bbf7d0', color: '#dcfce7', textColor: '#dcfce7' }
```

## Use Arbitrary Values

You can use [**Arbitrary Values**](arbitrary-values) to define your custom classes.

```javascript title="./purgetss/config.js"
// ...
theme: {
  extend: {},
  '.progress': {
    apply: 'h-(1rem) horizontal bg-(#e9ecef) text-(.75rem) rounded-(.25rem)'
  }
}
// ...
```

```css title="./purgetss/styles/tailwind.tss"
/* Custom Classes */
'.progress': { backgroundColor: '#e9ecef', borderRadius: 4, height: 16, layout: 'horizontal', font: { fontSize: 12 } }
// ...
```

## Use Any Newly Defined Class in config.js

In the following example, we are creating `corporate` color classes so we can use them in the `apply` directive with `bg-corporate-500`, `text-corporate-100`, and `border-corporate-200`.

```javascript {5,15} title="./purgetss/config.js"
// ...
theme: {
  extend: {
    colors: {
      // New color values that will generate bg-colors, text-colors, border-colors classes.
      corporate: {
        100: '#dddfe1', 200: '#babfc4', 500: '#53606b'
      }
    }
  },
  '.btn': {
    apply: 'wh-auto font-bold border-2 rounded my-0.5'
  },
  '.btn-corporate': {
    // Newly created classes ( see extend.colors.corporate )
    apply: 'bg-corporate-500 text-corporate-100 border-corporate-200'
  }
}
// ...
```

```css title="./purgetss/styles/tailwind.tss"
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn-corporate': { backgroundColor: '#53606b', borderColor: '#babfc4', color: '#dddfe1', textColor: '#dddfe1' }
/* ... */
/* color Property */
'.text-corporate-100': { color: '#dddfe1', textColor: '#dddfe1' }
'.text-corporate-200': { color: '#babfc4', textColor: '#babfc4' }
'.text-corporate-500': { color: '#53606b', textColor: '#53606b' }
/* backgroundColor Property */
'.bg-corporate-100': { backgroundColor: '#dddfe1' }
'.bg-corporate-200': { backgroundColor: '#babfc4' }
'.bg-corporate-500': { backgroundColor: '#53606b' }
/* borderColor Property */
'.border-corporate-100': { borderColor: '#dddfe1' }
'.border-corporate-200': { borderColor: '#babfc4' }
'.border-corporate-500': { borderColor: '#53606b' }
/* And the rest of color properties! */
```

## Set a String of Classes or an Array of Classes

```javascript {10,14} title="./purgetss/config.js"
// ...
theme: {
  extend: {
    colors: {
      corporate: {
        100: '#dddfe1', 200: '#babfc4', 500: '#53606b'
      }
    }
  },
  // Use a string of classes
  '.btn': {
    apply: 'font-bold border-2 rounded wh-auto my-0.5'
  },
  // or an array of classes
  '.btn-corporate': {
    apply: [
      'bg-corporate-500',
      'text-corporate-100',
      'border-corporate-200'
    ]
  }
}
// ...
```

```css title="./purgetss/styles/tailwind.tss"
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn-corporate': { backgroundColor: '#53606b', borderColor: '#babfc4', color: '#dddfe1', textColor: '#dddfe1' }
/* ... */
```

## Combine with Any Platform, Device, or Conditional-Block Properties

```javascript title="./purgetss/config.js"
// ...
theme: {
  '.btn': {
    // Default .btn
    apply: 'font-bold border-2 rounded wh-auto my-0.5',

    // Specific to iOS devices
    ios: {
      apply: 'w-screen mx-4'
    },

    // Specific to handheld devices
    handheld: {
      apply: 'h-20'
    },

    // Specific to iPhoneX (if Alloy.Global.iPhoneX is set)
    '[if=Alloy.Globals.iPhoneX]': {
      apply: 'mb-12'
    }
  },
}
// ...
```

```css title="./purgetss/styles/tailwind.tss"
/* Custom Classes */
'.btn': { borderRadius: 4, borderWidth: 2, top: 2, bottom: 2, width: Ti.UI.SIZE, height: Ti.UI.SIZE, font: { fontWeight: 'bold' } }
'.btn[platform=ios]': { right: 16, left: 16, width: Ti.UI.FILL }
'.btn[formFactor=handheld]': { height: 80 }
'.btn[if=Alloy.Globals.iPhoneX]': { bottom: 48 }
// ...
```

## Platform-Specific Classes

Several classes in `tailwind.tss` are platform-specific to prevent polluting objects with properties that are not specific to a particular platform.

:::caution IMPORTANT!

To properly apply these platform styles when creating custom rules, you must specify the platform variant in the `apply` directive.

**Even if you are not targeting a specific platform, you must specify the platform variant.**
:::

```javascript {15} title="./purgetss/config.js"
module.exports = {
  theme: {
    '.my-view': {
      // Targeting iOS.
      'ios': {
        'apply': 'bg-green-500 wh-32 ios:clip-enabled'
      }
    }
  },
};
```

```css title="./purgetss/styles/tailwind.tss"
/* Custom Classes */
'.my-view[platform=ios]': { backgroundColor: '#22c55e', clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED, width: 128, height: 128 }
```

### Omitting the Platform Variant

If you omit the platform variant, **Purge TSS** won't be able to determine which platform you are targeting, and the custom class will not have the corresponding property.

```javascript {5} title="./purgetss/config.js"
module.exports = {
  theme: {
    // Even if you are not targeting a specific platform, you must specify the platform variant
    '.my-view': {
      // Missing platform variant in clip-enabled
      'apply': 'wh-32 clip-enabled bg-green-500'
    }
  },
};
```

```css title="./purgetss/styles/tailwind.tss"
/* Omitting the platform variant in `config.js` will not generate the corresponding property. */
/* Missing the property related to `clip-enabled`. */
'.my-view': { backgroundColor: '#22c55e', width: 128, height: 128 }
```
