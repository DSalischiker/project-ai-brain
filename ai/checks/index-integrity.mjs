/**
 * Every markdown path referenced from the brain must exist.
 *
 * A dangling pointer is the worst brain failure: the agent is told to read a rule,
 * finds nothing, and proceeds from memory — which is exactly what the brain exists to
 * prevent. Nothing else detects this.
 */
import { dirname, join } from 'node:path'
import { ROOT, RULES_DIR, exists, lineOf, read, rel, result, walk } from './lib.mjs'

// A backticked token that looks like a markdown path, optionally followed by a § anchor.
const REFERENCE = /`([A-Za-z0-9_./@-]+\.md)(?:\s*§[^`]*)?`/g

export default async function indexIntegrity() {
  const sources = [
    join(ROOT, 'CLAUDE.md'),
    join(ROOT, 'AGENTS.md'),
    ...(await walk(join(ROOT, '.claude'), (f) => f.endsWith('.md'))),
    ...(await walk(join(ROOT, 'ai'), (f) => f.endsWith('.md'))),
  ].filter((path, i, all) => all.indexOf(path) === i)

  const failures = []
  let checked = 0

  for (const source of sources) {
    const text = await read(source)

    for (const [, target] of text.matchAll(REFERENCE)) {
      // Templates document their own placeholders; skip unresolved ones.
      // `NNNN-` is the ADR naming convention shown illustratively, not a real path.
      if (target.includes('{{') || target.includes('NNNN')) continue
      checked++

      // Rule files reference siblings relative to ai/rules/, so try each base.
      const candidates = [
        join(ROOT, target),
        join(dirname(source), target),
        join(RULES_DIR, target),
        join(ROOT, 'ai', target),
      ]

      let found = false
      for (const candidate of candidates) {
        if (await exists(candidate)) {
          found = true
          break
        }
      }

      if (!found) {
        const line = lineOf(text, target)
        failures.push(`${rel(source)}:${line ?? '?'} → \`${target}\` does not exist`)
      }
    }
  }

  return result('index integrity', failures, checked)
}
