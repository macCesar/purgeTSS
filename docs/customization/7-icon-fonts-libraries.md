# Icon Fonts Libraries

> ℹ️ **INFO**
>
> Official Icon Fonts for **Purge TSS**
> 
> Previous versions of **Purge TSS** included several icon font libraries such as Bootstrap Icons, Boxicons, LineIcons, and Tabler Icons. **However, adding more icon fonts was getting out of control**.
> 
> **As a result, we have decided to leave the following fonts as the official icon fonts for Purge TSS:**
> 
> - [Font Awesome 6 Free](https://fontawesome.com)
> - [Framework 7](https://framework7.io/icons/)
> - [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons)
> - [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols)


## Recreating the Deleted Libraries
The good news is that you can recreate them using the `build-fonts` command:

### 1. Download the Libraries
Start by downloading the libraries from their official websites:

- [Bootstrap Icons](https://icons.getbootstrap.com)
- [Boxicons](https://boxicons.com)
- [LineIcons](https://lineicons.com/icons/?type=free)
- [Tabler Icons](https://tabler-icons.io)

### 2. The `fonts` Folder
Put the desired libraries in the `./purgetss/fonts` folder.

> ℹ️ **INFO**
>
> You just need to copy the **TrueType** or **OpenType** font files and the `.css` file.


`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   └─ boxicons
      ├─ boxicons.css
      └─ boxicons.ttf
   └─ lineicons
      ├─ lineicons.css
      └─ lineicons.ttf
```

### 3. The `build-fonts` Command
Run the `build-fonts` command to create a custom `fonts.tss` file.

```bash
$ purgetss build-fonts [--modules]

# alias:
$ purgetss bf [-m]
```

#### The `fonts.tss` File
The `build-fonts` command will generate a custom `./purgetss/styles/fonts.tss` file with all the Unicode characters and style rules.

`./purgetss/styles/fonts.tss`
```css
'.boxicons': { font: { fontFamily: 'boxicons' } }
'.lineicons': { font: { fontFamily: 'LineIcons' } }

/* Unicode Characters */
/* To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties */

/* boxicons.css */
'.bxl-meta': { text: '\uef27', title: '\uef27' }
'.bx-lemon': { text: '\uef28', title: '\uef28' }
'.bxs-lemon': { text: '\uef29', title: '\uef29' }
/* ... */

/* lineicons.css */
'.lni-500px': { text: '\uea03', title: '\uea03' }
'.lni-add-files': { text: '\uea01', title: '\uea01' }
'.lni-adobe': { text: '\uea06', title: '\uea06' }
/* ... */
```

#### Renaming the Style Rule Name
**Purge TSS** will use the font's file name as the style rule name. **You can change it by renaming the font file**.

`./purgetss/fonts/`
```bash
# Root of the project
purgetss
└─ fonts
   └─ boxicons
      └─ bx.ttf
```

New style rule name: `'.bx'`
`./purgetss/styles/fonts.tss`
```css
/* new style rule name */
'.bx': { font: { fontFamily: 'boxicons' } }
```

#### The `assets/fonts` Folder
The `build-fonts` command will copy the font files to `./app/assets/fonts` folder and rename them to their corresponding **PostScript** name to work on both iOS and Android apps.

`./app/assets/fonts/`
```bash
app
└─ assets
   └─ fonts
      ├─ boxicons.ttf
      └─ LineIcons.ttf
```

#### The `--modules` Option
When using the `--modules` option, it will generate a `./app/lib/purgetss.fonts.js` CommonJS module file.

`./app/lib/purgetss.fonts.js`
```javascript
const icons = {
  /* boxicons */
  'boxicons': {
    'bxlMeta': '\uef27',
    'bxLemon': '\uef28',
    'bxsLemon': '\uef29',
    /* ... */
  },
  /* lineicons */
  'lni': {
    '500px': '\uea03',
    'addFiles': '\uea01',
    'adobe': '\uea06',
    /* ... */
  }
};
exports.icons = icons;
```

#### The `--prefix` Option

**Purge TSS** automatically determines the group's prefix for each icon family and class name. However, you can use the `--prefix` option to apply the style's filename as the prefix for class names in `fonts.tss` and property names in `purgetss.fonts.js`.

`./purgetss/fonts/`
```bash
purgetss
└─ fonts
   └─ lineicons
      └─ li.css
```

**New group prefix: `li`**

`./purgetss/styles/fonts.tss`
```css
/* lineicons/li.css */
'.li-zoom-out': { text: '\uea02', title: '\uea02' }
'.li-zoom-in': { text: '\uea03', title: '\uea03' }
'.li-zip': { text: '\uea04', title: '\uea04' }
/* ... */
```

`./app/lib/purgetss.fonts.js`
```javascript
const icons = {
  /* lineicons/li.css */
  'li': {
    /* ... */
  },
  /* ... */
};
exports.icons = icons;
```

:::danger WARNING
**Make sure that the new prefix remains unique to avoid conflicts with other class prefixes.**
:::
