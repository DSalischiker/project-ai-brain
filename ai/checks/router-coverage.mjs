/**
 * Every rule file must be reachable: listed in the CLAUDE.md rule map AND triggered by the
 * router.
 *
 * This is the failure the brain is most likely to have. Someone writes a good rule, forgets
 * one of the two registration steps, and the rule never loads — so it looks like coverage
 * and provides none. Unlike a dangling link, nothing ever surfaces it at runtime.
 *
 * Always-loaded files are exempt from the router requirement: CLAUDE.md loads them directly,
 * by design, so the guarantee survives the skill not being invoked.
 */
import { INDEX, ROUTER, RULES_DIR, read, rel, result, walk } from './lib.mjs'

const ALWAYS_LOADED = ['ai/rules/core/guardrails.md', 'ai/rules/core/conventions.md']

export default async function routerCoverage() {
  const index = await read(INDEX)
  const router = await read(ROUTER)
  const ruleFiles = await walk(RULES_DIR, (f) => f.endsWith('.md'))

  const failures = []

  for (const file of ruleFiles) {
    const path = rel(file)
    // e.g. "core/guardrails.md" — the form both the index and the router use.
    const short = path.replace(/^ai\/rules\//, '')

    const inIndex = index.includes(short) || index.includes(path)
    const inRouter = router.includes(short) || router.includes(path)

    if (!inIndex) {
      failures.push(
        `${path} — no row in CLAUDE.md § 4 rule map. Add one, or the reader cannot find it.`,
      )
    }
    if (!inRouter && !ALWAYS_LOADED.includes(path)) {
      failures.push(
        `${path} — no trigger in brain-router SKILL.md § Phase 3. It will never load.`,
      )
    }
  }

  // The reverse direction: the index must not advertise a rule that was deleted.
  // index-integrity.mjs catches dangling paths; this catches the always-load block
  // drifting out of sync with what exists.
  for (const path of ALWAYS_LOADED) {
    if (!index.includes(path)) {
      failures.push(
        `${path} — declared always-loaded by the checks but absent from CLAUDE.md. ` +
          `Update the always-load block, or ALWAYS_LOADED in this check.`,
      )
    }
  }

  return result('router coverage', failures, ruleFiles.length)
}
