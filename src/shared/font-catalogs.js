import fs from 'node:fs'
import {
  cwd, projectsFA_TSS_File, srcFontAwesomeTSSFile,
  srcMaterialIconsTSSFile, srcMaterialSymbolsTSSFile, srcFramework7FontTSSFile
} from './constants.js'

export const projectFontsTSS = `${cwd}/purgetss/styles/fonts.tss`

export function iconFontSources() {
  return [projectsFA_TSS_File, srcFontAwesomeTSSFile, srcMaterialIconsTSSFile, srcMaterialSymbolsTSSFile, srcFramework7FontTSSFile]
}

export function higherPriorityFontSources(file) {
  const sources = [projectFontsTSS, ...iconFontSources()]
  const index = sources.indexOf(file)
  return index > 0 ? sources.slice(0, index) : []
}

// Cache only within one purge, so subsequent runs see edited/generated catalogs.
export function createFontCatalogs() {
  const catalogs = new Map()
  const load = file => {
    if (!catalogs.has(file)) {
      const lines = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split(/\r?\n/) : []
      const names = new Set()
      for (const line of lines) {
        const match = /^'\.((?:\\.|[^'])*)'\s*:/.exec(line)
        if (match) names.add(match[1])
      }
      catalogs.set(file, { lines, names })
    }
    return catalogs.get(file)
  }
  return { lines: file => load(file).lines, has: (file, name) => load(file).names.has(name) }
}
