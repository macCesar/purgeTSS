import chroma, { deltaE } from 'chroma-js'

const convertedShades = new WeakMap()
const converted = shade => {
  let cached = convertedShades.get(shade)
  if (!cached || cached.hexcode !== shade.hexcode) {
    const color = chroma(shade.hexcode)
    cached = { hexcode: shade.hexcode, color, lightness: color.get('hsl.l') }
    convertedShades.set(shade, cached)
  }
  return cached
}

const findClosestColor = (hexcode, referenceColors) => {
  const input = chroma(hexcode)
  const lightness = input.get('hsl.l')
  referenceColors = referenceColors.map(color => ({
    ...color,
    shades: color.shades.map(shade => ({ ...shade, delta: deltaE(input, converted(shade).color) }))
  }))

  // Calculate the lowest DELTA per color
  referenceColors.forEach((color) => {
    color.closestShade = color.shades.reduce((previous, current) => previous.delta < current.delta ? previous : current)
  })

  // Calculate the color family with the lowest DELTA
  const closestColorFamily = referenceColors.reduce((previous, current) => previous.closestShade.delta < current.closestShade.delta ? previous : current)

  // Add lightness difference key / value to array of objects
  closestColorFamily.shades = closestColorFamily.shades.map((shade) => ({
    ...shade,
    lightnessDiff: Math.abs(chroma(shade.hexcode).get('hsl.l') - lightness)
  }))

  closestColorFamily.closestShadeLightness = closestColorFamily.shades.reduce((previous, current) => previous.lightnessDiff < current.lightnessDiff ? previous : current)

  return closestColorFamily
}

export default findClosestColor
