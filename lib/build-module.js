const fs = require('fs')
const path = require('path')
const logger = require('./logger')
const PurgeTSSModule = path.resolve(__dirname, './templates/purgetss.ui.js')
const PurgeTSSPackageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const PurgeTSSPackageVersion = `// PurgeTSS v${PurgeTSSPackageJSON.version}\n`

fs.writeFileSync('./dist/purgetss.ui.js', PurgeTSSPackageVersion + fs.readFileSync(PurgeTSSModule, 'utf8'), err => {
  throw err
})

logger.file('./dist/purgetss.ui.js')
