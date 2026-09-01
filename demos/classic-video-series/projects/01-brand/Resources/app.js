const window = Ti.UI.createWindow({
  backgroundColor: '#0F172A'
})

const title = Ti.UI.createLabel({
  text: 'PurgeTSS\nClassic',
  color: '#FFFFFF',
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  font: { fontSize: 34, fontWeight: 'bold' }
})

window.add(title)
window.open()
