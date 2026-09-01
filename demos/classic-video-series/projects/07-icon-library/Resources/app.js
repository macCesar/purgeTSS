const fontAwesome = require('fontawesome')

const window = Ti.UI.createWindow({
  backgroundColor: '#F8FAFC',
  layout: 'vertical'
})

window.add(Ti.UI.createLabel({
  text: 'Font Awesome in Classic',
  top: 86,
  color: '#0F172A',
  font: { fontSize: 24, fontWeight: 'bold' }
}))

const icons = ['house', 'heart', 'bell', 'camera']
icons.forEach(name => {
  window.add(Ti.UI.createLabel({
    text: fontAwesome.icons[name],
    top: 24,
    color: '#7C3AED',
    font: { fontFamily: fontAwesome.solid, fontSize: 38 }
  }))
})

window.open()
