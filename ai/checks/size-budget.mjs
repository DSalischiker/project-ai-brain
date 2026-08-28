/**
 * Line budgets for brain files.
 *
 * Progressive disclosure fails quietly: a rule file grows past the point where loading it
 * is cheap, and nothing complains because the content is all correct. The budget is what
 * makes that growth visible while it is still one file and not ten.
 *
 * A file over budget usually means two subjects in one file, or history that belongs in an
 * ADR. Split along a real seam or move the history out — never compress prose to fit.
 */
import { join } from 'node:path'
import { ROOT, lineCount, read, rel, result, walk } from './lib.mjs'

const BUDGETS = [
  { label: 'index', ceiling: 160, match: (p) => rel(p) === 'CLAUDE.md' },
  { label: 'router', ceiling: 220, match: (p) => rel(p).endsWith('brain-router/SKILL.md') },
  { label: 'skill', ceiling: 260, match: (p) => rel(p).endsWith('SKILL.md') },
  { label: 'rule', ceiling: 200, match: (p) => rel(p).startsWith('ai/rules/') },
  { label: 'template', ceiling: 200, match: (p) => rel(p).startsWith('ai/templates/') },
  { label: 'project context', ceiling: 220, match: (p) => rel(p) === 'ai/project.md' },
]

export default async function sizeBudget() {
  const files = [
    join(ROOT, 'CLAUDE.md'),
    ...(await walk(join(ROOT, '.claude'), (f) => f.endsWith('.md'))),
    ...(await walk(join(ROOT, 'ai'), (f) => f.endsWith('.md'))),
  ]

  const failures = []
  let checked = 0

  for (const file of files) {
    // Decisions are historical records and deliberately unbudgeted.
    if (rel(file).startsWith('ai/decisions/')) continue

    const budget = BUDGETS.find((b) => b.match(file))
    if (!budget) continue

    checked++
    const lines = lineCount(await read(file))
    if (lines > budget.ceiling) {
      failures.push(
        `${rel(file)} — ${lines} lines, ${budget.label} ceiling is ${budget.ceiling} ` +
          `(over by ${lines - budget.ceiling})`,
      )
    }
  }

  return result('size budget', failures, checked)
}
