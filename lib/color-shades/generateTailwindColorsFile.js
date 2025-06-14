import fs from 'fs';
import colors from 'tailwindcss/lib/public/colors.js';

console.warn(colors)
const colorsArray = []
// Iterate through the colors.default object
for (const key in colors.default) {
  if (typeof colors.default[key] === 'object') {
    const colorObject = {
      name: key,
      shades: []
    }

    // Iterate through the shades
    for (const shade in colors.default[key]) {
      colorObject.shades.push({
        number: shade,
        hexcode: colors.default[key][shade]
      })
    }

    colorsArray.push(colorObject)
  }
}

// Convierte colorsArray a una cadena JSON
const colorsArrayJSON = JSON.stringify(colorsArray, null, 2)

// Contenido del archivo tailwind.js
const fileContent = `module.exports = ${colorsArrayJSON};`

// Escribe el contenido en el archivo tailwind.js
fs.writeFileSync('tailwind.js', fileContent)

console.log('Archivo tailwind.js creado')
