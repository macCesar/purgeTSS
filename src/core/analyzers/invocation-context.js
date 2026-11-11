import fs from 'node:fs'
import convert from 'xml-js'
import * as acorn from 'acorn'
import { currentProfile } from '../../cli/utils/profile.js'

// Sources and parse failures live only as long as one invocation.
export class InvocationContext {
  constructor(profile = currentProfile()) {
    this.profile = profile
    this.counters = {}
    this.texts = new Map()
    this.xmlResults = new Map()
    this.controllerResults = new Map()
    this.extractions = new Map()
    this.paths = new Map()
  }

  count(name) {
    this.counters[name] = (this.counters[name] || 0) + 1
    this.profile?.increment(name === 'reads' ? 'sourceReads' : name)
  }

  read(file) {
    if (!this.texts.has(file)) {
      this.count('reads')
      this.texts.set(file, fs.readFileSync(file, 'utf8'))
    }
    return this.texts.get(file)
  }

  xml(text) {
    return this.parse(this.xmlResults, text, 'xmlParses', () =>
      JSON.parse(convert.xml2json(text.replace(/&/gm, '&amp;'), { compact: true })))
  }

  controller(text) {
    return this.parse(this.controllerResults, text, 'jsParses', () => acorn.parse(text, {
      ecmaVersion: 'latest',
      sourceType: 'script',
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowHashBang: true
    }))
  }

  parse(cache, text, counter, action) {
    if (!cache.has(text)) {
      this.count(counter)
      try {
        cache.set(text, { value: action() })
      } catch (error) {
        cache.set(text, { error })
      }
    }
    const result = cache.get(text)
    if (result.error) throw result.error
    return result.value
  }

  extract(kind, text, action) {
    if (!this.extractions.has(kind)) this.extractions.set(kind, new Map())
    const cache = this.extractions.get(kind)
    if (!cache.has(text)) cache.set(text, action())
    return cache.get(text)
  }

  dispose() {
    for (const cache of [this.texts, this.xmlResults, this.controllerResults, this.extractions, this.paths]) cache.clear()
  }
}
