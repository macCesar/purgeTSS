/**
 * Filter brand pieces against the deployment targets declared in tiapp.xml.
 * An explicit --only request is allowed to prepare a platform that is not yet
 * enabled in the project.
 */

/**
 * @param {string[]} selection - Resolved piece names
 * @param {Object<string, Object>} pieces - Resolved piece map
 * @param {{ios: boolean, android: boolean}} targets
 * @param {{explicit?: boolean}} [opts]
 * @returns {{selected: string[], skipped: string[]}}
 */
export function selectPiecesForTargets(selection, pieces, targets, opts = {}) {
  if (opts.explicit) return { selected: [...selection], skipped: [] }

  const selected = []
  const skipped = []

  for (const name of selection) {
    const platforms = pieces[name]?.platforms ?? ['ios', 'android']
    const enabled = platforms.some((platform) => targets[platform] === true)
    ;(enabled ? selected : skipped).push(name)
  }

  return { selected, skipped }
}

/**
 * Platforms an explicit selection asks PurgeTSS to prepare.
 * @param {string[]} selection
 * @param {Object<string, Object>} pieces
 * @returns {{ios: boolean, android: boolean}}
 */
export function targetsForExplicitSelection(selection, pieces) {
  return {
    ios: selection.some((name) => (pieces[name]?.platforms ?? ['ios', 'android']).includes('ios')),
    android: selection.some((name) => (pieces[name]?.platforms ?? ['ios', 'android']).includes('android'))
  }
}
