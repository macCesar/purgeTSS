// Import customRules function for resetStyles
import { customRules } from './utils.js'

// Global configurations
export const globalOptions = {
  legacy: false
}

/**
 * Reset styles for common Titanium components
 * Applies default styles to ImageView, View, and Window
 * @returns {string} Generated reset styles
 */
export function resetStyles() {
  let convertedStyles = '\n// Custom Styles and Resets\n'

  convertedStyles += customRules({ ios: { hires: true } }, 'ImageView')
  // convertedStyles += customRules({ default: { width: 'Ti.UI.FILL', height: 'Ti.UI.SIZE' } }, 'Label');
  convertedStyles += customRules({ default: { width: 'Ti.UI.SIZE', height: 'Ti.UI.SIZE' } }, 'View')
  convertedStyles += customRules({ default: { backgroundColor: '#ffffff' } }, 'Window')

  return convertedStyles
}
