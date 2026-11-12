import fs from 'node:fs'
import css from 'css'
import FontName from 'fontname'

export class GeneratorInputs {
  constructor() {
    this.texts = new Map()
    this.parsedCss = new Map()
    this.codes = new Map()
    this.directories = new Map()
    this.fontVersions = new Map()
  }

  fontVersion(file) {
    if (!this.fontVersions.has(file)) {
      const version = FontName.parse(fs.readFileSync(file))[0]?.version?.trim()
      if (!version) throw new Error(`Missing font version metadata in ${file}`)
      this.fontVersions.set(file, version)
    }
    return this.fontVersions.get(file)
  }

  text(file) {
    if (!this.texts.has(file)) this.texts.set(file, fs.readFileSync(file, 'utf8'))
    return this.texts.get(file)
  }

  css(file) {
    if (!this.parsedCss.has(file)) this.parsedCss.set(file, css.parse(this.text(file)))
    return this.parsedCss.get(file)
  }

  codepoints(files) {
    const key = JSON.stringify(files)
    if (!this.codes.has(key)) {
      const lines = [...new Set(files.map(file => this.text(file)).join('').split('\n').sort())]
      this.codes.set(key, lines.map(line => {
        if (line === '') return undefined
        const parts = line.split(' ')
        return { selector: parts[0], property: parts[1] }
      }))
    }
    return this.codes.get(key)
  }

  names(dir, predicate = () => true) {
    if (!this.directories.has(dir)) this.directories.set(dir, fs.readdirSync(dir).filter(predicate).map(name => name.replace('.svg', '')))
    return this.directories.get(dir)
  }
}
