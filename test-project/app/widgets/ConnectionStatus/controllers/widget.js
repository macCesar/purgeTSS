let networkListener = null

exports.init = function() {
  networkListener = Ti.Network.addEventListener('change', updateStatus)
  updateStatus()
}

function updateStatus() {
  const isOnline = Ti.Network.online

  if (isOnline) {
    $.connectionIcon.applyProperties(Alloy.createStyle('index', { classes: ['lu', 'lu-wifi', 'text-xl', 'text-green-600']  }))
  } else {
    $.connectionIcon.applyProperties(Alloy.createStyle('index', { classes: ['lu', 'lu-wifi-off', 'text-xl', 'text-red-600'] }))
  }

  $.statusLabel.applyProperties({
    color: isOnline ? '#16a34a' : '#dc2626',
    text: isOnline ? L('conectado') : L('sin_conexion'),
  })
}

exports.cleanup = function() {
  if (networkListener) {
    Ti.Network.removeEventListener('change', updateStatus)
  }
}

// Asegurarnos de que se limpie cuando el controlador se destruya
$.addListener($.getView(), 'close', exports.cleanup)
