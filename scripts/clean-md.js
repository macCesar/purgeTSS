const fs = require('fs')
const path = require('path')
const DOCS_DIR = path.join(__dirname, '../docs')

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

walk(DOCS_DIR)
