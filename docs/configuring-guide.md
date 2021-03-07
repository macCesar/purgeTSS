# **Customization and Configuration Guide**

- [**Customization and Configuration Guide**](#customization-and-configuration-guide)
  - [Customization](#customization)
  - [Creating your configuration file](#creating-your-configuration-file)
  - [Generating your custom `tailwind.tss` file](#generating-your-custom-tailwindtss-file)
  - [Configuration file example](#configuration-file-example)
- [**`config.js` file structure**](#configjs-file-structure)
  - [Theme Property](#theme-property)
  - [Colors property](#colors-property)
    - [Nested object syntax](#nested-object-syntax)
    - [Shared colors](#shared-colors)
    - [Overriding a default color](#overriding-a-default-color)
    - [Extending the default palette](#extending-the-default-palette)
  - [Spacing property](#spacing-property)
    - [Shared spacing](#shared-spacing)
    - [Overriding the default spacing scale](#overriding-the-default-spacing-scale)
    - [Extending the default spacing scale](#extending-the-default-spacing-scale)
  - [Individual properties](#individual-properties)
  - [Purge property](#purge-property)
    - [Large safelist?](#large-safelist)
- [**Overriding, extending or disabling properties**](#overriding-extending-or-disabling-properties)
  - [Overriding properties](#overriding-properties)
  - [Extending properties](#extending-properties)
  - [Disabling properties](#disabling-properties)
- [**Core Properties**](#core-properties)
    - [Text Colors](#text-colors)
    - [Background Colors](#background-colors)
    - [Border Colors](#border-colors)
    - [Placeholder Colors](#placeholder-colors)
    - [Gradient Color Stops](#gradient-color-stops)
    - [Tint Color](#tint-color)
    - [Width scale](#width-scale)
    - [Height scale](#height-scale)
    - [Margin](#margin)
    - [Padding](#padding)
    - [Font Family](#font-family)
    - [Font Size](#font-size)
    - [Border Radius](#border-radius)
    - [Border Width](#border-width)
    - [Opacity](#opacity)
- [**Adding your own properties**](#adding-your-own-properties)

## Customization
By default, `purgetss` will look for an optional `./purgetss/config.js` where you can define any customizations.

Every section of the config file is optional, so you only have to specify what you'd like to change. Any missing sections will fall back to the default configuration.

## Creating your configuration file
To create a purgeTSS configuration file for your project, run this command:

```bash
> purgetss init

# alias:
> purgetss i
```

It will create a minimal `config.js` file inside the `purgetss` folder at the root of your project:
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
  },
  corePlugins: {}
};
```

## Generating your custom `tailwind.tss` file
To generate your custom `tailwind.tss` file use the following command:

```bash
> purgetss build-custom

# alias:
> purgetss b
```

It will generate a new `tailwind.tss` file inside the `purgetss` folder, with the attributes defined in `./purgetss/config.js`.

**After generating your custom `tailwind.tss` file. You can use any of the generated classes, `purgeTSS` will parse this file instead of the default Tailwind file.**

## Configuration file example
- **For the modifier keys, you can use any name or convention you want**.
- For `Titanium` constants, `Alloy Configuration Values` or `Global Variables` always enclose them in quotes.
- For `color` values, you can use `hex`, `8-digit hex`, `rgb(R,G,B)`, `rgba(R,G,B,A)`, `transparent` or any of the standard color names.
- For `spacing` values, you can use different type of units: `rem`, `%`, `px` or `dp`.
  - `percentages` - This values will be passed on without any conversion.
  - `rem` - Values in rem will be converted with this little formula: `remValue * 16`.
  - `dp` and `px` - For these values, the unit type will be removed and the value will be left. Except for your custom classes where pixel units will be maintained.

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'colors': {
      'highlight': 'rgba(255, 255, 0, .70)',
      'primary': {
        'solid': '#002359',
        'dark': '#000030',
        'transparent': '#D9002359'
      }
    },
    'fontFamily': {
      'display': 'AlfaSlabOne-Regular',
      'body': 'BarlowSemiCondensed-Regular',
    },
    'height': {
      'xl': '3rem',
      '1/3': '33.333333%'
    },
    'borderWidth': {
      '3': '3',
      '6': '6',
      '10': '10'
    },
    '.gallery': {
      'DEFAULT': {
        'width': 'Ti.UI.FILL',
        'height': 'Ti.UI.SIZE'
      },
      'ios': {
        'clipMode': 'Ti.UI.iOS.CLIP_MODE_ENABLED'
      },
      'android': {
        'hiddenBehavior': 'Ti.UI.HIDDEN_BEHAVIOR_GONE'
      }
    }
  }
};
```

# **`config.js` file structure**

## Theme Property
The `theme` property in `./purgetss/config.js`, is where you define your project's color palette, type scale, font stacks, border radius values, and more.

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'fontFamily': {
      'display': 'AlfaSlabOne-Regular',
      'body': 'BarlowSemiCondensed-Regular'
    },
    'borderWidth': {
      'DEFAULT': 1,
      '0': '0',
      '2': '2',
      '4': '4',
    },
    'extend': {
      'colors': {
        'cyan': '#9cdbff',
      },
      'spacing': {
        '96': '24rem',
        '128': '32rem',
      }
    }
  }
}
```

## Colors property
The `colors` property allows you to customize the global color palette for your project.

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'colors': {
      'transparent': 'transparent',
      'black': '#000',
      'white': '#fff',
      'gray': {
        '100': '#f7fafc',
        // ...
        '900': '#1a202c',
      },

      // ...
    }
  }
}
```

By default, these colors are inherited by the `textColor`, `backgroundColor`, `borderColor`, `placeholderColor`, `gradientColorStops` and `hintTextColor` properties.


### Nested object syntax
You can define the colors as a simple list of key-value pairs, or using a nested object notation where the nested keys are added to the base color name as modifiers.

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'colors': {
      'highlight': '#ffff00',
      'primary': {
        'solid': '#002359',
        'dark': '#000030',
        'transparent': '#D9002359'
      },
      'secondary': {
        'solid': '#13294B',
        'dark': '#000023',
        'transparent': '#D913294B'
      },
      'gray': {
        'light': '#f1f2f3',
        'medium': '#ebeff2',
        'dark': '#2B2B2B'
      }
    }
  }
};
```

### Shared colors
All colors defined in the `colors` property are automatically shared with the `textColor`, `backgroundColor`, `borderColor`, `placeholderColor`, `gradientColorStops` and `hintTextColor`  properties.

> **When you include the `colors` property, `purgeTSS` will automatically generate all color-related preperties and merge them with any other color-related preperties present in the configuration file.**

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'colors': {
      'highlight': '#ffff00',
      'primary': {
        'solid': '#002359',
        'dark': '#000030',
        'transparent': '#D9002359'
      },
      'secondary': {
        'solid': '#13294B',
        'dark': '#000023',
        'transparent': '#D913294B'
      },
      'gray': {
        'light': '#f1f2f3',
        'medium': '#ebeff2',
        'dark': '#2B2B2B'
      }
    },
    'textColor': {
      'orange-peel': '#FF9F1C',
      'ultramarine': '#446DF6'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// color Property
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
'.text-orange-peel': { color: '#FF9F1C' }
'.text-ultramarine': { color: '#446DF6' }

// Rest of inherited properties:

// backgroundColor
    ...
// borderColor
    ...
// placeholderColor
    ...
// gradientColorStops
```

### Overriding a default color
If you'd like to override one of the default colors but preserve the rest, simply provide the new values in the `theme.extend.colors` section of your `config.js` file.

For example, here we've replaced the default cool grays with a neutral gray palette:
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'extend': {
      'colors': {
        'gray': {
          '100': '#f5f5f5',
          '200': '#eeeeee',
          '300': '#e0e0e0',
          '400': '#bdbdbd',
          '500': '#9e9e9e',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121',
        }
      }
    }
  }
}
```

### Extending the default palette
If you'd like to extend the default color palette, you can do so using the `theme.extend.colors` section of your `config.js` file:
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'extend': {
      'colors': {
        'regal-blue': '#243c5a',
      }
    }
  }
}
```

This will generate classes like bg-regal-blue in addition to all of Tailwind's default colors.

## Spacing property
The `spacing` property allows you to customize the global spacing and sizing scale for your project.

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'spacing': {
      '0': '0',
      'px': '1px',
      'tight': '0.25rem',
      'loose': '1.0rem',
      'extra-loose': '3.0rem',
    }
  }
}
```

By default, these values are inherited by the `padding`, `margin`, `width`, and `height` properties.


### Shared spacing
The `spacing` property is shared by the `margin`, `padding`, `width`, and `height` properties.

> **When you include the `spacing` property, `purgeTSS` will automatically generate all spacing-related properties and merge them with any other spacing-related properties present in the configuration file.**

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'spacing': {
      'tight': '0.25rem',
      'loose': '1.0rem'
    },
    'width': {
      'banner': '5rem'
    },
    'height': {
      'xl': '3rem',
      '1/3': '33.333333%'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// width Property
'.w-banner': { width: 80 }
'.w-tight': { width: 4 }
'.w-loose': { width: 16 }

// height Property
'.h-xl': { height: 48 }
'.h-1/3': { height: '33.333333%' }
'.h-tight': { height: 4 }
'.h-loose': { height: 16 }

// Margin
'.m-tight': { top: 4, right: 4, bottom: 4, left: 4 }
'.m-loose': { top: 16, right: 16, bottom: 16, left: 16 }
    ...

// padding Property
'.p-tight': { padding: { top: 4, right: 4, bottom: 4, left: 4 } }
'.p-loose': { padding: { top: 16, right: 16, bottom: 16, left: 16 } }
    ...

// Rest of inherited properties
```

### Overriding the default spacing scale
If you'd like to override the default spacing scale, you can do so using the `theme.spacing` section of your `config.js` file:
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'spacing': {
      'sm': '8',
      'md': '12',
      'lg': '16',
      'xl': '24',
    }
  }
}
```

This will disable the default spacing scale and generate classes like p-sm, m-md, w-lg, and h-xl instead.

### Extending the default spacing scale
If you'd like to extend the default spacing scale, you can do so using the `theme.extend.spacing` section of your `config.js` file:
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'extend': {
      'spacing': {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      }
    }
  }
}
```

This will generate classes like p-72, m-84, and h-96 in addition to all of the default spacing/sizing utilities.


## Individual properties
The rest of the theme section is used to configure which values are available for each individual property.

For example, the `borderRadius` property lets you customize which border radius classes will be generated:

```javascript
module.exports = {
  'theme': {
    'borderRadius': {
      'none': '0',
      'sm': '.125rem',
      'DEFAULT': '.25rem',
      'lg': '.5rem'
    },
  }
}
```
The keys determine the suffix for the generated classes, and the values determine the value of the actual TSS declaration.

The example `borderRadius` configuration above would generate the following TSS classes:

```css
// borderRadius Property
'.rounded-none': { borderRadius: 0 }
'.rounded-sm': { borderRadius: 2 }
'.rounded': { borderRadius: 4 }
'.rounded-lg': { borderRadius: 8 }
```

You'll notice that using a key of `default` in the theme configuration created the class `.rounded` with no suffix.

This is a common convention in `purgeTSS` supported by many (although not all) of the properties.

## Purge property

You can control how `purgetss` removes unused classes or keep the ones you want.

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
}
```

- `purge.mode.all` By default, `purgeTSS` will look everywhere inside your XML files, like in comments, attributes, classes, ids, Ti Element, and even the actual written content in your markup. **This mode is necessary if you want `purgetss` to parse any Ti Element that you've styled in `config.js`**.
- `purge.mode.classes` Use `classes` to search only in `class` and `id` attributes of your XML files.
- `purge.mode.options.safelist` List of styles that you would like to keep regardless of the purge mode or whether or not they are included in your XML files.

### Large safelist?
If you need to keep a very large set of styles, you can create a CommonJS module with an array of all the styles and import it into your config file like this:
```javascript
// ./purgetss/config.js
module.exports = {
  'purge': {
    'mode': 'all',

    // These options are passed through directly to purgeTSS
    'options': require('./safelist'),
  },
}
```

It is recommended to store it inside the `purgetss` folder, to keep everything organized:
```javascript
// ./purgetss/safelist.js
exports.safelist = [
  // A large list of styles to keep
  'bg-blue-50',
  'bg-blue-100',
  'bg-blue-200',
  'bg-blue-300',
  'bg-blue-400',
  'bg-blue-500',
  // ...
  // ...
  // ...
  'bg-indigo-600',
  'bg-indigo-700',
  'bg-indigo-800',
  'bg-indigo-900',
];
```

# **Overriding, extending or disabling properties**
Out of the box, your project will automatically inherit the values from the default theme configuration. If you would like to customize it, you have a few different options depending on your goals.

## Overriding properties
To override a property in the default theme, add the key you'd like to override.

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    // Replaces all of the default `opacity` values
    'opacity': {
      '15': '0.15',
      '35': '0.35',
      '65': '0.65',
      '85': '0.85'
    }
  }
}
```
This will completely replace the original default configuration for that key, so in the example above none of the default opacity utilities would be generated.

**Any keys you do not provide will be inherited from the default theme, so in the above example, the default theme configuration for things like colors, spacing, border radius, background position, etc. would be preserved.**

## Extending properties
If you'd like to preserve the default values for a theme option but also add new values, add your extensions under the `theme.extend` key.

For example, if you wanted to add an extra color but preserve the existing ones, you could extend the `colors` property:

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'extend': {
      // Adds a new color in addition to the default colors
      'colors': {
        'primary': '#002359',
      }
    }
  }
}
```

You can of course override some parts of the default theme and extend other parts of the default theme within the same configuration:

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'opacity': {
      '15': '0.15',
      '35': '0.35',
      '65': '0.65',
      '85': '0.85'
    },
    'extend': {
      'colors': {
        'primary': '#002359',
      }
    }
  }
}
```

## Disabling properties
If you don't want to generate any classes for a certain property, set that plugin to false in your `corePlugins` configuration.

```javascript
// ./purgetss/config.js
module.exports = {
  'corePlugins': {
    'opacity': false,
  }
}
```

# **Core Properties**

### Text Colors
Utilities for controlling the text/title color of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'textColor': {
      'orange-peel': '#FF9F1C',
      'ultramarine': '#446DF6'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// color Property
'.text-orange-peel': { color: '#FF9F1C' }
'.text-ultramarine': { color: '#446DF6' }
```

### Background Colors
Utilities for controlling an element's background color.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'backgroundColor': {
      'minion': '#EDD83D',
      'pacific': '#08A4BD'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// backgroundColor Property
'.bg-minion': { backgroundColor: '#EDD83D' }
'.bg-pacific': { backgroundColor: '#08A4BD' }
```

### Border Colors
Utilities for controlling the color of an element's borders.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'borderColor': {
      'old-burgundy': '#4B3B40',
      'tea-green': '#D1F5BE'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// borderColor Property
'.border-old-burgundy': { borderColor: '#4B3B40' }
'.border-tea-green': { borderColor: '#D1F5BE' }
```

### Placeholder Colors
Utilities for controlling the color of placeholder text.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'placeholderColor': {
      'flame': '#EC4E20',
      'spanish-blue': '#016FB9'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// hintTextColor Property
'.placeholder-flame': { hintTextColor: '#EC4E20' }
'.placeholder-spanish-blue': { hintTextColor: '#016FB9' }
```

### Gradient Color Stops
Utilities for controlling the color stops in background gradients.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'gradientColorStops': {
      'corporate': '#3490dc',
      'danger': '#e3342f'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// Gradient Color Stops
// From Color
'.from-corporate': { backgroundGradient: { colors: [ '#003490dc', '#3490dc' ] } }
'.from-danger': { backgroundGradient: { colors: [ '#00e3342f', '#e3342f' ] } }

// To Color
'.to-corporate': { backgroundGradient: { colors: [ '#3490dc' ] } }
'.to-danger': { backgroundGradient: { colors: [ '#e3342f' ] } }
```

### Tint Color
Utilities for controlling an element's tint color.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'tintColor': {
      'corporate': '#3490dc',
      'highlight': '#ffff00'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss

// tintColor Property
'.tint-corporate': { tintColor: '#3490dc' }
'.tint-highlight': { tintColor: '#ffff00' }
```

### Width scale
Utilities for setting the width of an element
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'width': {
      'banner': '5rem'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// width Property
'.w-banner': { width: 80 }
```

### Height scale
Utilities for setting the height of an element
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'height': {
      'xl': '3rem',
      '1/3': '33.333333%'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// height Property
'.h-xl': { height: 48 }
'.h-1/3': { height: '33.333333%' }
```

### Margin
Utilities for controlling an element's margin.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'margin': {
      'tiny': '.125rem',
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
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

### Padding
Utilities for controlling an element's padding.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'padding': {
      'sm': '1rem',
      'md': '1.5rem',
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
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

### Font Family
Utilities for controlling the font family of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'fontFamily': {
      'display': 'AlfaSlabOne-Regular',
      'body': 'BarlowSemiCondensed-Regular',
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// fontFamily Property
'.font-display': { font: { fontFamily: 'AlfaSlabOne-Regular' } }
'.font-body': { font: { fontFamily: 'BarlowSemiCondensed-Regular' } }
```

### Font Size
Utilities for controlling the font size of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'fontSize:' {
      '10xl': '8rem',
      'small-print': '.5rem',
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// fontSize Property
'.text-10xl': { font: { fontSize: 128 } }
'.text-small-print': { font: { fontSize: 8 } }
```

### Border Radius
Utilities for controlling the border radius of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'borderRadius:' {
      'DEFAULT': '0.25rem',
      'large': '1.0rem',
      'extra-large': '2.0rem'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// borderRadius Property
'.rounded': { borderRadius: 4 }
'.rounded-large': { borderRadius: 16 }
'.rounded-extra-large': { borderRadius: 32 }
```

### Border Width
Utilities for controlling the width of an element's borders.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'borderWidth': {
      '3': '3',
      '6': '6',
      '10': '10',
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// borderWidth Property
'.border-3': { borderWidth: 3 }
'.border-6': { borderWidth: 6 }
'.border-10': { borderWidth: 10 }
```

### Opacity
Utilities for controlling the opacity of an element.
```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'opacity': {
      '15': '0.15',
      '35': '0.35',
      '65': '0.65',
      '85': '0.85'
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
// opacity Property
'.opacity-15': { opacity: 0.15 }
'.opacity-35': { opacity: 0.35 }
'.opacity-65': { opacity: 0.65 }
'.opacity-85': { opacity: 0.85 }
```

# **Adding your own properties**
You can use your own classes, ids and any Ti Element with as many attributes as needed, optionally you can place a conditional block that can specify platform or device size conditionals.

Whether you want to style a Ti Element (also known as a markup element), a custom class name prefixed with a period (.) or even a custom id name prefixed with a hash tag (#), the structure is as follows:

```javascript
'Markup-.class-or-#id-name': {
  'DEFAULT': {
    // Any default properties
    // even custom properties to use in your Controllers
  },
  // Optional: platform specific properties
  'ios-android-[conditional-block]': {
    // platform specific properties
  }
};
```

```javascript
// ./purgetss/config.js
module.exports = {
  'theme': {
    'TextField': {
      'DEFAULT': {
        'top': '10',
        'left': '20',
        'right': '20',
        'bottom': '0'
      },
      '[if=Alloy.Globals.iPhoneX]': {
        'bottom': 'Alloy.CFG.iPhoneXNotchSize'
      },
      'android': {
        'touchFeedback': true
      }
    },
    '.gallery': {
      'DEFAULT': {
        'width': 'Ti.UI.FILL',
        'height': 'Ti.UI.SIZE'
      },
      'ios': {
        'clipMode': 'Ti.UI.iOS.CLIP_MODE_ENABLED'
      },
      'android': {
        'hiddenBehavior': 'Ti.UI.HIDDEN_BEHAVIOR_GONE'
      }
    }
  }
};
```

```css
// ./purgetss/tailwind.tss
'TextField': { top: 10, left: 20, right: 20, bottom: 0 }
'TextField[if=Alloy.Globals.iPhoneX]': { bottom: Alloy.CFG.iPhoneXNotchSize }
'TextField[platform=android]': { touchFeedback: true }

'.gallery': { width: Ti.UI.FILL, height: Ti.UI.SIZE }
'.gallery[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }
'.gallery[platform=android]': { hiddenBehavior: Ti.UI.HIDDEN_BEHAVIOR_GONE }
```
