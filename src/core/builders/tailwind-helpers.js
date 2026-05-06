/**
 * PurgeTSS v7.1.0 - Core Builder: Tailwind Helpers
 *
 * @since 7.1.0
 * @author César Estrada
 */

/**
 * Combine keys from theme and extend, with fallback to base values
 * @param {Object} values - Theme values object
 * @param {Object} base - Base values object
 * @param {string} key - Key to combine
 * @returns {Object} Combined values
 */
export function combineKeys(values, base, key) {
  return (values[key]) ? { ...values[key], ...values.extend[key] } : { ...base, ...values.extend[key] }
}
