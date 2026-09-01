const PurgeTSS = require('lib/purgetss.ui')
const pulse = PurgeTSS.createAnimation({ duration: 220 })

const window = Ti.UI.createWindow({ backgroundColor: '#0F172A' })
const badge = Ti.UI.createView({
  width: 180,
  height: 180,
  borderRadius: 48,
  backgroundColor: '#7C3AED'
})
const label = Ti.UI.createLabel({
  text: 'TAP',
  color: '#FFFFFF',
  font: { fontSize: 32, fontWeight: 'bold' }
})

badge.add(label)
badge.addEventListener('click', () => pulse.pulse(badge, 2))
window.add(badge)
window.open()
