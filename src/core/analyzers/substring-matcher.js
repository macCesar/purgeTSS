// Aho–Corasick over UTF-16 code units, matching String.prototype.includes.
export function findSubstrings(text, patterns) {
  const nodes = [{ next: new Map(), fail: 0, outputs: [] }]
  for (const pattern of new Set(patterns)) {
    let state = 0
    for (let i = 0; i < pattern.length; i++) {
      const unit = pattern[i]
      if (!nodes[state].next.has(unit)) {
        nodes[state].next.set(unit, nodes.length)
        nodes.push({ next: new Map(), fail: 0, outputs: [] })
      }
      state = nodes[state].next.get(unit)
    }
    nodes[state].outputs.push(pattern)
  }
  const queue = [...nodes[0].next.values()]
  for (let head = 0; head < queue.length; head++) {
    const state = queue[head]
    for (const [unit, target] of nodes[state].next) {
      queue.push(target)
      let failure = nodes[state].fail
      while (failure && !nodes[failure].next.has(unit)) failure = nodes[failure].fail
      nodes[target].fail = nodes[failure].next.get(unit) ?? 0
      nodes[target].outputs.push(...nodes[nodes[target].fail].outputs)
    }
  }
  const found = new Set(nodes[0].outputs)
  let state = 0
  for (let i = 0; i < text.length; i++) {
    const unit = text[i]
    while (state && !nodes[state].next.has(unit)) state = nodes[state].fail
    state = nodes[state].next.get(unit) ?? 0
    for (const match of nodes[state].outputs) found.add(match)
  }
  return found
}
