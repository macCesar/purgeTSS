function getIcon(selector) {
  if (selector === undefined || selector === null) {
    console.warn('Selector is null or undefined')
    return 'N/A'
  }

  if (typeof selector !== 'string' && typeof selector !== 'number') {
    console.warn('Selector must be string or number')
    return 'N/A'
  }

  return icons[selector] || 'N/A'
}
exports.getIcon = getIcon

function setTitle(selector, object) {
  if (selector === undefined || selector === null) {
    console.warn('Selector is null or undefined')
    return
  }

  if (!object || typeof object !== 'object') {
    console.warn('Invalid target object')
    return
  }

  object.title = icons[selector] || 'N/A'
}
exports.setTitle = setTitle

function setText(selector, object) {
  if (selector === undefined || selector === null) {
    console.warn('Selector is null or undefined')
    return
  }

  if (!object || typeof object !== 'object') {
    console.warn('Invalid target object')
    return
  }

  object.text = icons[selector] || 'N/A'
}
exports.setText = setText

function getRandomKey() {
  return iconKeys[Math.floor(Math.random() * iconKeys.length)]
}
exports.getRandomKey = getRandomKey

function getRandomValue() {
  return icons[iconKeys[Math.floor(Math.random() * iconKeys.length)]]
}
exports.getRandomValue = getRandomValue
