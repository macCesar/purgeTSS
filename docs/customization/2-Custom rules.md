---
sidebar_position: 2
slug: custom-rules
---

Custom rules in **Purge TSS** allow developers to style **Titanium elements**, **IDs**, and **classes** with flexibility and precision. These rules can be configured in the `config.js` file. Additionally, you can target specific platforms, devices, or conditional blocks using global variables.

This feature is particularly useful for meeting visual and design requirements in mobile projects that span multiple platforms, such as iOS and Android. By leveraging custom rules, you ensure that every element in your application can be tailored to deliver the best possible user experience.

## Classes, IDs and Ti Elements

You can style any **Ti Element**, **IDs** or your own **classes** with as many attributes as needed. You can also optionally target specific platforms, devices, or add conditional blocks with global variables.

Whether you want to style a Ti Element (also known as a markup element), a custom id prefixed with a hash (#), or a custom class prefixed with a period (.), the structure is as follows:

### Modifier Key
- For **Titanium Elements**, use the exact name of the element, such as `Label`, `Button`, or `ScrollView`.
- For **IDs**, we recommend sticking with the **camelCase** naming convention to follow the same convention that JavaScript uses.
- For **classes**, use the **kebab-case** naming convention to ensure compatibility with **Purge TSS v6.x and above**. For example, use `.my-custom-class-name` instead of `.myCustomClassName`.

:::caution Purge TSS v5 or earlier projects
For projects created with **Purge TSS** v5 or earlier that are now using version 6.x.x or above, please set `purge.options.missing` to true in `config.js` to get a report ( at the end of `app.tss` ) of any missing classes so you can update them to the new naming convention.
:::

### Default, Platform, Device, or Conditional Blocks

- To generate a global style, use either the lowercase `default` or the uppercase `DEFAULT` keyword.
- To target a specific platform, use the `ios` or `android` keywords.
- To target a specific device, use the `tablet` or `handheld` keywords.
- To target a condition with a global variable, use the `[if=globalVariableName]` keyword.

### Property Values

- For `Titanium` constants, `Alloy Configuration Values`, or `Global Variables`, always enclose them in quotes.
- For `color` values, you can use `hex`, `8-digit hex`, `rgb(R,G,B)`, `rgba(R,G,B,A)`, `transparent`, or any of the standard color names. It is recommended to use hex values for colors to avoid any possible issues with the opacity modifier.
- For `spacing` values, you can use different types of units: `em`, `rem`, `%`, `px`, `dp`, `cm`, or `in`.
  - `%`, `px`, `cm`, or `in` - These values are passed without any conversion.
  - `em` or `rem` - Values in em or rem will be converted with this little formula: `value * 16`.
  - `dp` - For these values, the unit type will be removed and the value will remain intact.

## 'config.js' file example

```javascript title="./purgetss/config.js"
module.exports = {
  theme: {
    '#main-banner': {
      DEFAULT: {
        width: '300px',
        height: '80px'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_DISABLED'
      }
    },
    '.gallery': {
      DEFAULT: {
        height: 'Ti.UI.SIZE'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED'
      },
      android: {
        hiddenBehavior: 'Ti.UI.HIDDEN_BEHAVIOR_GONE'
      },
      handheld: {
        width: '250px'
      },
      tablet: {
        width: '500px'
      }
    },
    TextField: {
      DEFAULT: {
        top: 10,
        left: 20,
        right: 20,
        bottom: 0
      },
      '[if=Alloy.Globals.iPhoneX]': {
        bottom: 'Alloy.CFG.iPhoneXNotchSize'
      },
      android: {
        touchFeedback: true
      }
    },
  }
};
```

```css title="Custom ‘./purgetss/styles/tailwind.tss’ file"
/* Property: TextField */
/* Description: A single line text field. */
'TextField': { top: 10, left: 20, right: 20, bottom: 0 }
'TextField[if=Alloy.Globals.iPhoneX]': { bottom: Alloy.CFG.iPhoneXNotchSize }
'TextField[platform=android]': { touchFeedback: true }

/* Custom Classes */
'#main-banner': { width: '300px', height: '80px' }
'#main-banner[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }

'.gallery': { height: Ti.UI.SIZE }
'.gallery[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }
'.gallery[platform=android]': { hiddenBehavior: Ti.UI.HIDDEN_BEHAVIOR_GONE }
'.gallery[formFactor=handheld]': { width: '250px' }
'.gallery[formFactor=tablet]': { width: '500px' }
...
```
