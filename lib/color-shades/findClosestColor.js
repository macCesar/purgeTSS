const chroma = require('chroma-js')

const findClosestColor = (hexcode, referenceColors) => {
  // Add DELTA key / value to array of objects
  referenceColors.forEach((color) => {
    color.shades = color.shades.map((shade) => ({ ...shade, delta: chroma.deltaE(hexcode, shade.hexcode) }))
  })

  // Calculate the lowest DELTA per color
  referenceColors.forEach((color) => {
    color.closestShade = color.shades.reduce((previous, current) => previous.delta < current.delta ? previous : current)
  })

  // Calculate the color family with the lowest DELTA
  const closestColorFamily = referenceColors.reduce((previous, current) => previous.closestShade.delta < current.closestShade.delta ? previous : current)

  // Add lightness difference key / value to array of objects
  closestColorFamily.shades = closestColorFamily.shades.map((shade) => ({
    ...shade,
    lightnessDiff: Math.abs(chroma(shade.hexcode).get('hsl.l') - chroma(hexcode).get('hsl.l'))
  }))

  closestColorFamily.closestShadeLightness = closestColorFamily.shades.reduce((previous, current) => previous.lightnessDiff < current.lightnessDiff ? previous : current)

  return closestColorFamily
}

module.exports = findClosestColor
