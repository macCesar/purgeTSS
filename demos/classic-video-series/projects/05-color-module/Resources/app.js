const colors = require('lib/purgetss.colors')

const window = Ti.UI.createWindow({
  backgroundColor: colors.brand['50']
})

const swatch = Ti.UI.createView({
  width: 220,
  height: 220,
  borderRadius: 36,
  backgroundColor: colors.brand['600']
})

swatch.add(Ti.UI.createLabel({
  text: "colors.brand['600']",
  color: '#FFFFFF',
  font: { fontSize: 18, fontWeight: 'bold' }
}))

window.add(swatch)
window.open()
