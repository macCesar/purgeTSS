import fs from 'node:fs'

// app.tss deliberately does not use this: its mtime is the LiveView guard.
export function writeIfChanged(file, data) {
  const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data)
  if (fs.existsSync(file) && fs.readFileSync(file).equals(bytes)) return false
  fs.writeFileSync(file, bytes)
  return true
}
