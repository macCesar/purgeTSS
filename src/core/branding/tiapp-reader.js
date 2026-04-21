/**
 * PurgeTSS - tiapp-reader
 *
 * Parses tiapp.xml and exposes just enough config for context-aware cleanup
 * decisions. Uses fast-xml-parser under the hood when available, falls back
 * to regex when the dep is unavailable.
 *
 * @fileoverview tiapp.xml parser for branding cleanup
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'

let XMLParser = null
try {
  const mod = await import('fast-xml-parser')
  XMLParser = mod.XMLParser
} catch {
  XMLParser = null
}

export function readTiapp(tiappPath) {
  const result = {
    exists: false,
    storyboardEnabled: false,
    portraitOnly: false,
    defaultBgColor: null
  }

  if (!fs.existsSync(tiappPath)) return result

  result.exists = true
  const xml = fs.readFileSync(tiappPath, 'utf8')

  if (XMLParser) return parseWithFastXml(xml, result)
  return parseWithRegex(xml, result)
}

function parseWithFastXml(xml, result) {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: true
    })
    const doc = parser.parse(xml)

    const ios = doc?.['ti:app']?.ios || doc?.ti?.app?.ios
    if (ios) {
      const sb = ios['enable-launch-screen-storyboard']
      if (typeof sb === 'string' && sb.trim().toLowerCase() === 'true') {
        result.storyboardEnabled = true
      }
      const bg = ios['default-background-color']
      if (typeof bg === 'string' && bg.trim()) {
        result.defaultBgColor = bg.trim()
      }

      const orientations = ios.orientations
      if (orientations) {
        const iphoneBlock = orientations.iphone
        if (iphoneBlock !== undefined) {
          const flat = JSON.stringify(iphoneBlock)
          result.portraitOnly = !/Landscape/i.test(flat)
        }
      }
    }
    return result
  } catch {
    return parseWithRegex(xml, result)
  }
}

function parseWithRegex(xml, result) {
  if (/<enable-launch-screen-storyboard>\s*true\s*</i.test(xml)) {
    result.storyboardEnabled = true
  }

  const bgMatch = xml.match(/<default-background-color>\s*(#[0-9A-Fa-f]{6,8})\s*</)
  if (bgMatch) result.defaultBgColor = bgMatch[1]

  if (/<orientations\b/i.test(xml) && !/UIInterfaceOrientationLandscape/i.test(xml)) {
    result.portraitOnly = true
  }

  return result
}

export function detectProjectType(projectRoot) {
  if (fs.existsSync(path.join(projectRoot, 'app'))) return 'alloy'
  if (fs.existsSync(path.join(projectRoot, 'Resources'))) return 'classic'
  return 'unknown'
}

export function resolveAndroidResRoot(projectRoot, projectType) {
  if (projectType === 'alloy') return path.join(projectRoot, 'app', 'platform', 'android', 'res')
  if (projectType === 'classic') return path.join(projectRoot, 'platform', 'android', 'res')
  return null
}

export function hasAdaptiveIcons(projectRoot) {
  const candidates = [
    path.join(projectRoot, 'app', 'platform', 'android', 'res', 'mipmap-anydpi-v26'),
    path.join(projectRoot, 'platform', 'android', 'res', 'mipmap-anydpi-v26')
  ]
  return candidates.some((c) => fs.existsSync(c))
}
