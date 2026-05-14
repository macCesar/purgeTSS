/**
 * PurgeTSS - SVG reference extractor for controllers
 *
 * Companion to class-extractor.js for the SVG image pipeline. Walks the AST of
 * each controller file looking for ObjectExpressions that pair an image (or
 * backgroundImage) property pointing to an .svg with a sibling `classes`
 * property. Typical shape:
 *
 *   $.UI.create('ImageView', {
 *     image: '/images/logos/logo.svg',
 *     classes: 'w-32 h-auto'
 *   })
 *
 * Only the in-place shape counts — references built from concatenated/dynamic
 * strings cannot be detected statically and must be declared manually in
 * config.cjs > images.files (per the plan).
 *
 * @fileoverview Extract SVG references from controller .js files
 * @author César Estrada
 */

import * as acorn from 'acorn'

const AST_META_KEYS = new Set(['type', 'loc', 'range', 'start', 'end', 'sourceType', 'comments'])

/**
 * Parse a controller's source and return SVG references paired with their
 * `classes` siblings inside the same object literal.
 *
 * Falls back to a conservative regex scan if the parser rejects the source.
 *
 * @param {string} data - Controller file content.
 * @returns {Array<{ src: string, classes: string[] }>}
 */
export function extractSvgRefsFromController(data) {
  try {
    const ast = acorn.parse(data, {
      ecmaVersion: 'latest',
      sourceType: 'script',
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowHashBang: true
    })
    const out = []
    walkAST(ast, out)
    return out
  } catch {
    return extractSvgRefsRegex(data)
  }
}

function walkAST(node, out) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const child of node) walkAST(child, out)
    return
  }
  if (!node.type) return

  if (node.type === 'ObjectExpression') {
    inspectObject(node, out)
  }

  for (const key of Object.keys(node)) {
    if (AST_META_KEYS.has(key)) continue
    walkAST(node[key], out)
  }
}

function inspectObject(obj, out) {
  let svgSrc = null
  let classes = null

  for (const prop of obj.properties) {
    if (!prop || prop.type !== 'Property' || prop.computed || prop.shorthand) continue
    const keyName = propKeyName(prop)
    if (!keyName) continue

    if (keyName === 'image' || keyName === 'backgroundImage') {
      const literal = stringLiteralValue(prop.value)
      if (literal && literal.toLowerCase().endsWith('.svg')) {
        svgSrc = literal
      }
    } else if (keyName === 'classes') {
      classes = collectClassTokens(prop.value)
    }
  }

  if (svgSrc) {
    out.push({ src: svgSrc, classes: classes || [] })
  }
}

function propKeyName(prop) {
  if (prop.key.type === 'Identifier') return prop.key.name
  if (prop.key.type === 'Literal' && typeof prop.key.value === 'string') return prop.key.value
  return null
}

function stringLiteralValue(node) {
  if (!node) return null
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0 && node.quasis.length === 1) {
    const cooked = node.quasis[0].value.cooked
    return typeof cooked === 'string' ? cooked : null
  }
  return null
}

function collectClassTokens(node) {
  if (!node) return []
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value.split(/\s+/).filter(Boolean)
  }
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0 && node.quasis.length === 1) {
    const cooked = node.quasis[0].value.cooked
    return typeof cooked === 'string' ? cooked.split(/\s+/).filter(Boolean) : []
  }
  if (node.type === 'ArrayExpression') {
    const tokens = []
    for (const el of node.elements) {
      if (el && el.type === 'Literal' && typeof el.value === 'string') {
        tokens.push(...el.value.split(/\s+/).filter(Boolean))
      }
    }
    return tokens
  }
  return []
}

// Conservative regex fallback: look for objects that pair both keys on the
// same {...} chunk. Misses anything spread across complex expressions, but the
// AST path already covers the realistic cases — this is just a safety net.
function extractSvgRefsRegex(data) {
  const out = []
  const objRegex = /\{[^{}]*\}/g
  for (const match of data.matchAll(objRegex)) {
    const chunk = match[0]
    const imgMatch = chunk.match(/\b(?:image|backgroundImage)\s*:\s*['"`]([^'"`]+\.svg)['"`]/i)
    if (!imgMatch) continue
    const classesMatch = chunk.match(/\bclasses\s*:\s*(?:['"`]([^'"`]+)['"`]|\[([^\]]+)\])/)
    let classes = []
    if (classesMatch) {
      const raw = classesMatch[1] || classesMatch[2] || ''
      classes = raw
        .split(/[,\s]+/)
        .map(t => t.trim().replace(/^['"`]|['"`]$/g, ''))
        .filter(Boolean)
    }
    out.push({ src: imgMatch[1], classes })
  }
  return out
}
