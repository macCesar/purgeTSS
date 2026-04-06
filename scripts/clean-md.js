import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(currentDir, '..')

const DOCS_SRC = '/Users/cesar/Developer/openSource/purgetss-docs/docs'
const PAGES_SRC = '/Users/cesar/Developer/openSource/purgetss-docs/src/pages'
const OUTPUT_DIR = path.join(PROJECT_ROOT, '.dev/docs')

function cleanFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n+/, '')
}

function cleanAdmonitions(content) {
  // Converts :::tip, :::info, :::caution, :::warning, :::danger, etc. into quotes with emoji
  return content.replace(/:::(tip|info|caution|warning|danger)(.*?):::/gs, (match, type, inner) => {
    const emojis = { tip: '💡', info: 'ℹ️', caution: '⚠️', warning: '🚨', danger: '🛑' }
    const emoji = emojis[type] || '💬'
    // Cleans extra line breaks
    const text = inner.replace(/^[\s\n]+|[\s\n]+$/g, '')
    return `> ${emoji} **${type.toUpperCase()}**\n>\n> ${text.split('\n').join('\n> ')}\n`
  })
}

function cleanCodeTitles(content) {
  // Converts ```js title="file.js" into comment before the block
  return content.replace(/```(\w+)\s+title="([^"]+)"\n/g, (match, lang, title) => {
    return `\`${title}\`\n\`\`\`${lang}\n`
  })
}

function cleanCodeBlockAttrs(content) {
  // Removes any extra attributes after the language in code blocks
  // Only if it's NOT a block with title (already handled by cleanCodeTitles)
  return content.replace(/```(\w+)(?:\s+\{[^}]+\})?\n/g, (match, lang) => {
    return `\`\`\`${lang}\n`
  })
}

function cleanAll(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  content = cleanFrontmatter(content)
  content = cleanAdmonitions(content)
  content = cleanCodeTitles(content)
  content = cleanCodeBlockAttrs(content)
  fs.writeFileSync(filePath, content, 'utf8')
}

function walkAndClean(dir) {
  let count = 0
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    if (fs.statSync(fullPath).isDirectory()) {
      count += walkAndClean(fullPath)
    } else if (entry.endsWith('.md')) {
      cleanAll(fullPath)
      count++
    }
  }
  return count
}

// Validate sources exist
for (const src of [DOCS_SRC, PAGES_SRC]) {
  if (!fs.existsSync(src)) {
    console.error(`Source not found: ${src}`)
    process.exit(1)
  }
}

// Fresh copy: only remove the generated docs/ dir, preserve README.md and CHANGELOG.md
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true })
}

// Copy docs/ (full tree with assets)
fs.cpSync(DOCS_SRC, OUTPUT_DIR, { recursive: true })

// Copy pages/ .md files directly into the same output dir
for (const file of fs.readdirSync(PAGES_SRC)) {
  if (file.endsWith('.md')) {
    fs.copyFileSync(path.join(PAGES_SRC, file), path.join(OUTPUT_DIR, file))
  }
}

const totalCopied = fs.readdirSync(OUTPUT_DIR, { recursive: true }).filter(f => {
  return fs.statSync(path.join(OUTPUT_DIR, f)).isFile()
}).length

const totalCleaned = walkAndClean(OUTPUT_DIR)

console.log(`${totalCopied} files copied, ${totalCleaned} .md files cleaned`)
console.log(`Output: ${OUTPUT_DIR}`)
