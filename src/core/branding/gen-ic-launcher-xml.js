/**
 * PurgeTSS - gen-ic-launcher-xml
 *
 * Writes the adaptive-icon XML binder to mipmap-anydpi-v26/ic_launcher.xml.
 * Titanium/Android loads this file on API 26+ to pick up the adaptive icon triplet
 * (foreground + background + monochrome).
 *
 * @fileoverview Adaptive-icon XML binder
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'

export const IC_LAUNCHER_XML = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@mipmap/ic_launcher_background"/>
  <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
  <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
`

export function genIcLauncherXml(resRoot) {
  const dir = path.join(resRoot, 'mipmap-anydpi-v26')
  fs.mkdirSync(dir, { recursive: true })
  const outPath = path.join(dir, 'ic_launcher.xml')
  fs.writeFileSync(outPath, IC_LAUNCHER_XML, 'utf8')
  return outPath
}
