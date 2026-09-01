const window = Ti.UI.createWindow({
  backgroundColor: 'surfaceColor',
  layout: 'vertical'
})

const title = Ti.UI.createLabel({
  text: 'Semantic colors',
  top: 96,
  color: 'textColor',
  font: { fontSize: 28, fontWeight: 'bold' }
})

const card = Ti.UI.createView({
  top: 36,
  width: '82%',
  height: 150,
  borderRadius: 24,
  backgroundColor: 'accentColor'
})

const button = Ti.UI.createButton({
  title: 'Toggle light / dark',
  top: 30,
  color: 'textColor'
})

button.addEventListener('click', () => {
  const dark = Ti.UI.overrideUserInterfaceStyle === Ti.UI.USER_INTERFACE_STYLE_DARK
  Ti.UI.overrideUserInterfaceStyle = dark
    ? Ti.UI.USER_INTERFACE_STYLE_LIGHT
    : Ti.UI.USER_INTERFACE_STYLE_DARK
})

window.add(title)
window.add(card)
window.add(button)
window.open()
