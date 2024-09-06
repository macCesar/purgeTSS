const { encodeHTML } = require('../index') // Asegúrate de que la ruta sea correcta

test('encodeHTML should convert & to &amp;', () => {
  const input = 'Hello & World'
  const expectedOutput = 'Hello &amp; World'
  expect(encodeHTML(input)).toBe(expectedOutput)
})
