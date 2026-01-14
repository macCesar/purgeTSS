import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFile = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFile)
const DEFAULT_DOCS_DIR = path.join(currentDir, '../docs')
const DEFAULT_GLOSSARY_DIR = path.join(currentDir, '../dist/glossary')
const DOCS_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : (fs.existsSync(DEFAULT_GLOSSARY_DIR) ? DEFAULT_GLOSSARY_DIR : DEFAULT_DOCS_DIR)

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
  console.log(`Cleaned: ${filePath}`)
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath)
    } else if (file.endsWith('.md')) {
      cleanAll(fullPath)
    }
  })
}

if (!fs.existsSync(DOCS_DIR)) {
  console.error(`Docs directory not found: ${DOCS_DIR}`)
  console.error('Pass a path explicitly: node scripts/clean-md.js ./path/to/docs')
  process.exit(1)
}

walk(DOCS_DIR)
