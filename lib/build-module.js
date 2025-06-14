import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PurgeTSSModule = path.resolve(__dirname, './templates/purgetss.ui.js.cjs')
const PurgeTSSPackageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const PurgeTSSPackageVersion = `// Purge TSS v${PurgeTSSPackageJSON.version}\n`

fs.writeFileSync('./dist/purgetss.ui.js', PurgeTSSPackageVersion + fs.readFileSync(PurgeTSSModule, 'utf8'), err => {
  throw err
})

logger.file('./dist/purgetss.ui.js')
