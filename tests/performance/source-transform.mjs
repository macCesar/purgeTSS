let config
export function initialize(data) { config = data }
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context)
  if (!url.startsWith(config.root) || url.includes('/node_modules/') || !result.source) return result
  let source = config.baseline && config.sources[url] !== undefined ? config.sources[url] : String(result.source)
  source = source.replaceAll('convert.xml2json(', 'globalThis.__purgetssMeasure(\'xmlParses\', convert.xml2json.bind(convert), ')
    .replaceAll('acorn.parse(', 'globalThis.__purgetssMeasure(\'jsParses\', acorn.parse, ')
  return { ...result, source }
}

export async function resolve(specifier, context, nextResolve) {
  if (config.baseline && config.sharpOverride && specifier === 'sharp') return { url: config.sharpOverride, shortCircuit: true }
  return nextResolve(specifier, context)
}
