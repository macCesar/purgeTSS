# Configuring and customizing your styles


## Creating your configuration file

To create a purgeTSS config file for your project use the following command:

```bash
> purgetss init
```

It will create a minimal `config.js` file inside the `purgetss` folder at the root of your project:
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    //
  }
};
```

## Generating your custom.tss file
To generate your `custom.tss` file use the following commmand:
```bash
> purgetss build-custom
```
It will generate a new `custom.tss` file based on the defined attributes in `./purgetss/config.js`. It will also be inside the `purgetss` folder.

**After generating your `custom.tss` file. You can use any of the generated classes, `purgeTSS` will parse this file and extract only the classes used in your `XMLs` files.**

## Theme
The `theme` key is where you define your `colors`, `spacing`, `width`, `height`, `textColor`, `backgroundColor`, `borderColor`, `placeholderColor`, `gradientColorStops`, `fontFamily`, `fontSize`, `borderRadius`, `borderWidth`, `opacity` and `any_custom` key or any `Ti Element` to customize your project.

```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    fontFamily: {
      display: 'AlfaSlabOne-Regular',
      body: 'BarlowSemiCondensed-Regular',
    },
    height: {
      xl: '3rem',
      '1/3': '33.333333%'
    },
    borderWidth: {
      3: '3px',
      6: '6px',
      10: '10px'
    },
    '.gallery': {
      global: {
        width: 'Ti.UI.FILL',
        height: 'Ti.UI.SIZE'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED'
      },
      android: {
        hiddenBehavior: 'Ti.UI.HIDDEN_BEHAVIOR_GONE'
      }
    }
  }
};
```

## Text Colors
Utilities for controlling the text color of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    textColor: {
      'orange-peel': '#FF9F1C',
      ultramarine: '#446DF6'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// color Property
'.text-orange-peel': { color: '#FF9F1C' }
'.text-ultramarine': { color: '#446DF6' }
```

## Background Colors
Utilities for controlling an element's background color.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    backgroundColor: {
      minion: '#EDD83D',
      pacific: '#08A4BD'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// backgroundColor Property
'.bg-minion': { backgroundColor: '#EDD83D' }
'.bg-pacific': { backgroundColor: '#08A4BD' }
```

## Border Colors
Utilities for controlling the color of an element's borders.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    borderColor: {
      'old-burgundy': '#4B3B40',
      'tea-green': '#D1F5BE'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// borderColor Property
'.border-old-burgundy': { borderColor: '#4B3B40' }
'.border-tea-green': { borderColor: '#D1F5BE' }
```

## Placeholder Colors
Utilities for controlling the color of placeholder text.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    placeholderColor: {
      flame: '#EC4E20',
      'spanish-blue': '#016FB9'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// hintTextColor Property
'.placeholder-flame': { hintTextColor: '#EC4E20' }
'.placeholder-spanish-blue': { hintTextColor: '#016FB9' }
```

## Gradient Color Stops
Utilities for controlling the color stops in background gradients.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    gradientColorStops: {
      corporate: '#3490dc',
      danger: '#e3342f'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// Gradient Color Stops
// From Color
'.from-corporate': { backgroundGradient: { colors: [ '#003490dc', '#3490dc' ] } }
'.from-danger': { backgroundGradient: { colors: [ '#00e3342f', '#e3342f' ] } }

// To Color
'.to-corporate': { backgroundGradient: { colors: [ '#3490dc' ] } }
'.to-danger': { backgroundGradient: { colors: [ '#e3342f' ] } }
```

## Customizing Colors
Customizing the color palette for your project.

### Nested object syntax
You can define your colors as a simple list of key-value pairs, or using a nested object notation where the nested keys are added to the base color name as modifiers

```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    colors: {
      highlight: '#ffff00',
      primary: {
        solid: '#002359',
        dark: '#000030',
        transparent: '#D9002359'
      },
      secondary: {
        solid: '#13294B',
        dark: '#000023',
        transparent: '#D913294B'
      },
      gray: {
        light: '#f1f2f3',
        medium: '#ebeff2',
        dark: '#2B2B2B'
      }
    }
  }
}
```

## Shared Colors
The `colors` property are automatically shared by the `textColor`, `backgroundColor`, `borderColor`, `placeholderColor`, and `gradientColorStops` utilities.

> **When you include the `colors` property, purgeCSS will automatically generate all inherited utilities.**

```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    colors: {
      highlight: '#ffff00',
      primary: {
        solid: '#002359',
        dark: '#000030',
        transparent: '#D9002359'
      },
      secondary: {
        solid: '#13294B',
        dark: '#000023',
        transparent: '#D913294B'
      },
      gray: {
        light: '#f1f2f3',
        medium: '#ebeff2',
        dark: '#2B2B2B'
      }
    },
    textColor: {
      'orange-peel': '#FF9F1C',
      ultramarine: '#446DF6'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// color Property
'.text-orange-peel': { color: '#FF9F1C' }
'.text-ultramarine': { color: '#446DF6' }
'.text-highlight': { color: '#ffff00' }
'.text-primary-solid': { color: '#002359' }
'.text-primary-dark': { color: '#000030' }
'.text-primary-transparent': { color: '#D9002359' }
'.text-secondary-solid': { color: '#13294B' }
'.text-secondary-dark': { color: '#000023' }
'.text-secondary-transparent': { color: '#D913294B' }
'.text-gray-light': { color: '#f1f2f3' }
'.text-gray-medium': { color: '#ebeff2' }
'.text-gray-dark': { color: '#2B2B2B' }

// Rest of inherited utilities:

// backgroundColor
    ...
// borderColor
    ...
// placeholderColor
    ...
// gradientColorStops
```

## Width scale
Utilities for setting the width of an element
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    width: {
      banner: '5rem'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// width Property
'.w-banner': { width: 80 }
```

## Height scale
Utilities for setting the height of an element
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    height: {
      xl: '3rem',
      '1/3': '33.333333%'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// height Property
'.h-xl': { height: 48 }
'.h-1/3': { height: '33.333333%' }
```

## Margin
Utilities for controlling an element's margin.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    margin: {
      tiny: '.125rem',
    }
  }
}
```

```css
// ./purgetss/custom.tss
// Margin
'.m-tiny': { top: 2, right: 2, bottom: 2, left: 2 }
'.-m-tiny': { top: -2, right: -2, bottom: -2, left: -2 }
'.my-tiny': { top: 2, bottom: 2 }
'.-my-tiny': { top: -2, bottom: -2 }
'.mx-tiny': { right: 2, left: 2 }
'.-mx-tiny': { right: -2, left: -2 }
'.mt-tiny': { top: 2 }
'.-mt-tiny': { top: -2 }
'.mr-tiny': { right: 2 }
'.-mr-tiny': { right: -2 }
'.mb-tiny': { bottom: 2 }
'.-mb-tiny': { bottom: -2 }
'.ml-tiny': { left: 2 }
'.-ml-tiny': { left: -2 }
```

## Padding
Utilities for controlling an element's padding.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
    }
  }
}
```

```css
// ./purgetss/custom.tss
// padding Property
'.p-sm': { padding: { top: 16, right: 16, bottom: 16, left: 16 } }
'.p-md': { padding: { top: 24, right: 24, bottom: 24, left: 24 } }
'.py-sm': { padding: { top: 16, bottom: 16 } }
'.py-md': { padding: { top: 24, bottom: 24 } }
'.px-sm': { padding: { right: 16, left: 16 } }
'.px-md': { padding: { right: 24, left: 24 } }
'.pt-sm': { padding: { top: 16 } }
'.pt-md': { padding: { top: 24 } }
'.pr-sm': { padding: { right: 16 } }
'.pr-md': { padding: { right: 24 } }
'.pb-sm': { padding: { bottom: 16 } }
'.pb-md': { padding: { bottom: 24 } }
'.pl-sm': { padding: { left: 16 } }
'.pl-md': { padding: { left: 24 } }
```

## Customizing Spacing
Customizing the `spacing` scale for your project.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    spacing: {
      tight: '0.25rem',
      loose: '1.0rem'
    }
  }
}
```

## Shared Spacing
The `spacing` scale is shared by the `margin`, `padding`, `width`, and `height` utilities.

> **When you include the `spacing` property, purgeCSS will automatically generate all inherited utilities**

```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    spacing: {
      tight: '0.25rem',
      loose: '1.0rem'
    },
    width: {
      banner: '5rem'
    },
    height: {
      xl: '3rem',
      '1/3': '33.333333%'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// width Property
'.w-banner': { width: 80 }
'.w-tight': { width: 4 }
'.w-loose': { width: 16 }

// height Property
'.h-xl': { height: 48 }
'.h-1/3': { height: '33.333333%' }
'.h-tight': { height: 4 }
'.h-loose': { height: 16 }

// Rest of inherited utilities:

// margin
    ...
// padding
    ...
```

## Font Family
Utilities for controlling the font family of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    fontFamily: {
      display: 'AlfaSlabOne-Regular',
      body: 'BarlowSemiCondensed-Regular',
    }
  }
}
```

```css
// ./purgetss/custom.tss
// fontFamily Property
'.font-display': { font: { fontFamily : 'AlfaSlabOne-Regular' } }
'.font-body': { font: { fontFamily : 'BarlowSemiCondensed-Regular' } }
```

## Font Size
Utilities for controlling the font size of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    fontSize: {
      '10xl': '8rem',
      'small-print': '.5rem',
    }
  }
}
```

```css
// ./purgetss/custom.tss
// fontSize Property
'.text-10xl': { font: { fontSize: 128 } }
'.text-small-print': { font: { fontSize: 8 } }
```

## Border Radius
Utilities for controlling the border radius of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    borderRadius: {
      default: '0.25rem',
      large: '1.0rem',
      'extra-large': '2.0rem'
    }
  }
}
```

```css
// ./purgetss/custom.tss
// borderRadius Property
'.rounded': { borderRadius: 4 }
'.rounded-large': { borderRadius: 16 }
'.rounded-extra-large': { borderRadius: 32 }
```

## Border Width
Utilities for controlling the width of an element's borders.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    borderWidth: {
      3: '3px',
      6: '6px',
      10: '10px',
    }
  }
}
```

```css
// ./purgetss/custom.tss
// borderWidth Property
'.border-3': { borderWidth: '3px' }
'.border-6': { borderWidth: '6px' }
'.border-10': { borderWidth: '10px' }
```

## Opacity
Utilities for controlling the opacity of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    opacity: {
      10: '.1',
      20: '.2',
      30: '.3',
      40: '.4',
      60: '.6',
      70: '.7',
      80: '.8',
      90: '.9',
    }
  }
}
```

```css
// ./purgetss/custom.tss
// opacity Property
'.opacity-10': { opacity: 0.1 }
'.opacity-20': { opacity: 0.2 }
'.opacity-30': { opacity: 0.3 }
'.opacity-40': { opacity: 0.4 }
'.opacity-60': { opacity: 0.6 }
'.opacity-70': { opacity: 0.7 }
'.opacity-80': { opacity: 0.8 }
'.opacity-90': { opacity: 0.9 }
```


## Custom classes
You can use your own key names or any Ti Element with as many attributes as needed, you can optionally place a conditional block that can specify platform or device size conditionals.
```javascript
// ./purgetss/config.js
module.exports = {
  theme: {
    TextField: {
      global: {
        top: 10, left: 20, right: 20, bottom: 0
      },
      '[if=Alloy.Globals.iPhoneX]': {
        bottom: 'Alloy.CFG.iPhoneXNotchSize'
      },
      android: {
        touchFeedback: true
      }
    },
    '.gallery': {
      global: {
        width: 'Ti.UI.FILL',
        height: 'Ti.UI.SIZE'
      },
      ios: {
        clipMode: 'Ti.UI.iOS.CLIP_MODE_ENABLED'
      },
      android: {
        hiddenBehavior: 'Ti.UI.HIDDEN_BEHAVIOR_GONE'
      }
    }
  }
};
```

```css
// ./purgetss/custom.tss
'TextField': { top: 10, left: 20, right: 20, bottom: 0 }
'TextField[if=Alloy.Globals.iPhoneX]': { bottom: Alloy.CFG.iPhoneXNotchSize }
'TextField[platform=android]': { touchFeedback: true }

'.gallery': { width: Ti.UI.FILL, height: Ti.UI.SIZE }
'.gallery[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }
'.gallery[platform=android]': { hiddenBehavior: Ti.UI.HIDDEN_BEHAVIOR_GONE }
```
