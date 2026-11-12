import fs from 'node:fs'
import path from 'node:path'
import FontName from 'fontname'

// Free desktop fonts are supplied manually; their filenames are not a contract.
export function getFreeFontAwesomeFonts(folder, expectedVersion) {
  const families = {}
  const copies = {}
  for (const file of fs.readdirSync(folder).filter(file => /\.(otf|ttf)$/i.test(file))) {
    const metadata = FontName.parse(fs.readFileSync(path.join(folder, file)))[0]
    const name = metadata?.postScriptName
    const face = /Free-Solid$/.test(name) ? 'solid' : /Free-Regular$/.test(name) ? 'regular' : /Brands-Regular$/.test(name) ? 'brands' : null
    if (!face) continue
    if (!/^[\w-]+$/.test(name)) throw new Error(`Invalid PostScript name in ${file}`)
    if (families[face]) throw new Error(`Duplicate Font Awesome Free ${face} font in ${folder}`)
    if (expectedVersion) {
      const version = /Font Awesome version:\s*([^\s)]+)/i.exec(metadata.version)?.[1]
      if (version !== expectedVersion) {
        throw new Error(`Font Awesome Free font version ${version ?? 'unknown'} in ${file} does not match npm version ${expectedVersion}; replace the OTFs in src/fonts with matching desktop fonts`)
      }
    }
    families[face] = name
    copies[file] = `${name}.ttf`
  }
  for (const face of ['solid', 'regular', 'brands']) {
    if (!families[face]) throw new Error(`Missing Font Awesome Free ${face} font in ${folder}`)
  }
  families.default = families.solid
  return { families, copies }
}

export function getFreeFontAwesomeBuildInfo(root) {
  const { version } = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/@fortawesome/fontawesome-free/package.json'), 'utf8'))
  return { version, ...getFreeFontAwesomeFonts(path.join(root, 'src/fonts'), version) }
}

export function renderFreeFontAwesomeHeader(template, version) {
  return template.replaceAll('__FA_VERSION__', version)
}

// Both font installers and both generators must use the installed font metadata.
// A package version, CSS family or renamed filename is not a PostScript name.
export function getFontAwesomeFonts(webFonts) {
  const faces = { thin: 'fa-thin-100', light: 'fa-light-300', regular: 'fa-regular-400', solid: 'fa-solid-900', brands: 'fa-brands-400' }
  const families = {}
  const copies = {}
  for (const [face, basename] of Object.entries(faces)) {
    const file = path.join(webFonts, `${basename}.ttf`)
    if (!fs.existsSync(file)) continue
    const name = FontName.parse(fs.readFileSync(file))[0]?.postScriptName
    if (!name || !/^[\w-]+$/.test(name)) throw new Error(`Invalid PostScript name in ${file}`)
    families[face] = name
    copies[`${basename}.ttf`] = `${name}.ttf`
    if (fs.existsSync(path.join(webFonts, `${basename}.woff2`))) copies[`${basename}.woff2`] = `${name}.woff2`
  }
  if (!families.solid) throw new Error(`Font Awesome solid TTF is missing in ${webFonts}`)
  families.default = families.solid
  return { families, copies }
}

export function renderFontAwesomeReset(template, families) {
  return template.split('\n').filter(line => {
    const match = /__FA_(\w+)__/.exec(line)
    return !match || families[match[1].toLowerCase()]
  }).map(line => line.replace(/__FA_(\w+)__/g, (_, face) => families[face.toLowerCase()])).join('\n')
}
