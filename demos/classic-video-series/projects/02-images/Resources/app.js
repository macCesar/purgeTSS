const window = Ti.UI.createWindow({
  backgroundColor: '#F8FAFC',
  layout: 'vertical'
})

window.add(Ti.UI.createLabel({
  text: 'One SVG. Every density.',
  top: 72,
  color: '#0F172A',
  font: { fontSize: 24, fontWeight: 'bold' }
}))

window.add(Ti.UI.createImageView({
  image: '/illustrations/empty-state.png',
  top: 36,
  width: 220,
  height: 220
}))

window.open()
