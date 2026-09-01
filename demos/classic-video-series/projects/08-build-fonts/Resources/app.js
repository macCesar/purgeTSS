const fonts = require('lib/purgetss.fonts')

const window = Ti.UI.createWindow({
  backgroundColor: '#0F172A',
  layout: 'vertical'
})

window.add(Ti.UI.createLabel({
  text: 'Your own icon font',
  top: 86,
  color: '#FFFFFF',
  font: { fontSize: 24, fontWeight: 'bold' }
}))

const names = ['home', 'chat', 'settings', 'share']
names.forEach(name => {
  window.add(Ti.UI.createLabel({
    text: fonts.icons.ili[name],
    top: 24,
    color: '#A7F3D0',
    font: { fontFamily: fonts.families.ili, fontSize: 40 }
  }))
})

window.open()
