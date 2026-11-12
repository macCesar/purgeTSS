import path from 'node:path'

const materialFonts = {
  materialicons: {
    regular: 'MaterialIcons-Regular.ttf',
    outlined: 'MaterialIconsOutlined-Regular.otf',
    round: 'MaterialIconsRound-Regular.otf',
    sharp: 'MaterialIconsSharp-Regular.otf',
    twoTone: 'MaterialIconsTwoTone-Regular.otf'
  },
  materialsymbols: {
    outlined: 'MaterialSymbolsOutlined-Regular.ttf',
    rounded: 'MaterialSymbolsRounded-Regular.ttf',
    sharp: 'MaterialSymbolsSharp-Regular.ttf'
  }
}

// Header metadata identifies the inputs actually bundled, never today's date.
// Google codepoints have no release version; report each font's name-table value.
export function renderIconFontHeader(template, library, root, inputs) {
  const commentValue = value => value.replace(/\s+/g, ' ').replaceAll('*/', '* /')
  if (library === 'framework7') {
    const { version } = JSON.parse(inputs.text(path.join(root, 'node_modules/framework7-icons/package.json')))
    if (typeof version !== 'string' || !version.trim()) throw new Error('Missing framework7-icons package version')
    return template.replaceAll('__ICON_VERSION__', commentValue(version))
  }
  if (!materialFonts[library]) throw new Error(`Unknown icon font library: ${library}`)
  const versions = Object.entries(materialFonts[library]).map(([face, file]) => {
    return `${face}: ${commentValue(inputs.fontVersion(path.join(root, 'assets/fonts', file)))}`
  }).join('; ')
  return template.replaceAll('__ICON_FONT_VERSIONS__', versions)
}
