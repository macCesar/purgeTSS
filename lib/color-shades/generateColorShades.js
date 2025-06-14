// Part of this code comes from https://uicolors.app
import ntc from 'ntcjs';
import { v4 as uuidv4 } from 'uuid';
import chroma from 'chroma-js';
import findClosestColor from './findClosestColor.js';

const generateColorShades = (hexcode, referenceColors) => {
  const closestColorFamily = findClosestColor(hexcode, referenceColors)

  const inputHue = chroma(hexcode).get('hsl.h')
  const matchHue = chroma(closestColorFamily.closestShadeLightness.hexcode).get('hsl.h')

  let hueDifference = (inputHue - (matchHue || 0))

  const saturationRatio = chroma(hexcode).get('hsl.s') / chroma(closestColorFamily.closestShadeLightness.hexcode).get('hsl.s')

  if (hueDifference === 0) {
    hueDifference = matchHue.toString()
  } else if (hueDifference > 0) {
    hueDifference = '+' + hueDifference
  } else {
    hueDifference = hueDifference.toString()
  }

  const generatedColorFamily = {}

  generatedColorFamily.id = uuidv4()
  generatedColorFamily.hexcode = chroma(hexcode).hex()
  generatedColorFamily.name = ntc.name(generatedColorFamily.hexcode)[1]
  generatedColorFamily.shades = closestColorFamily.shades.map((color) => {
    let newColor = color.hexcode
    const newSaturation = chroma(newColor).get('hsl.s') * saturationRatio

    newColor = chroma(newColor).set('hsl.s', newSaturation).hex()
    newColor = chroma(newColor).set('hsl.h', hueDifference).hex()

    if (closestColorFamily.closestShadeLightness.number === color.number) {
      newColor = chroma(hexcode).hex()
    }

    return {
      number: color.number,
      hexcode: newColor,
      hue: Math.round(chroma(newColor).get('hsl.h')),
      saturation: Math.round(chroma(newColor).get('hsl.s') * 100),
      lightness: Math.round(chroma(newColor).get('hsl.l') * 100),
      luminance: Math.round(chroma(newColor).luminance() * 100)
    }
  })

  return generatedColorFamily
}

export default generateColorShades;
