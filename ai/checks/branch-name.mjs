/**
 * Validate the current branch name against ai/rules/git/branching.md.
 *
 * Cheap to check, annoying to fix later: the name is already on the remote and referenced by
 * any open PR by the time anyone notices.
 *
 * Usage: node ai/checks/branch-name.mjs [branch-name]
 * With no argument it reads the current git branch. Outside a git repo it skips.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { ROOT, result } from './lib.mjs'

const run = promisify(execFile)

const TYPES = [
  'feature', 'fix', 'hotfix', 'refactor', 'perf', 'chore',
  'docs', 'test', 'build', 'data', 'brain', 'release',
]

const PERMANENT = ['main', 'master', 'dev', 'develop', 'staging', 'production']

const VAGUE = [
  'misc', 'stuff', 'changes', 'change', 'updates', 'update', 'wip', 'temp', 'tmp',
  'fixes', 'improvements', 'new', 'old', 'final', 'stuff2', 'things',
]

export function validate(branch) {
  const problems = []

  if (PERMANENT.includes(branch)) return { skipped: `on permanent branch \`${branch}\`` }

  const slash = branch.indexOf('/')
  if (slash === -1) {
    problems.push('missing `<type>/` prefix')
    return { problems }
  }

  const type = branch.slice(0, slash)
  const rest = branch.slice(slash + 1)

  if (!TYPES.includes(type)) {
    problems.push(`unknown type \`${type}\` — allowed: ${TYPES.join(', ')}`)
  }
  if (rest !== rest.toLowerCase()) {
    problems.push('must be lowercase')
  }
  if (/[_ .]/.test(rest)) {
    problems.push('use hyphens only — no underscores, spaces, or dots')
  }
  if (rest.includes('/')) {
    problems.push('only one `/`, separating type from scope-description')
  }

  const words = rest.split('-').filter(Boolean)
  if (words.length < 2) {
    problems.push(`\`${rest}\` needs at least a scope and a description (2+ words)`)
  }
  if (words.length > 6) {
    problems.push(`${words.length} words — the ceiling is 6`)
  }

  const vague = words.filter((w) => VAGUE.includes(w.toLowerCase()))
  if (vague.length && words.length <= 3) {
    problems.push(`vague wording: ${vague.map((v) => `\`${v}\``).join(', ')}`)
  }

  return { problems }
}

export default async function branchName(argv = process.argv.slice(2)) {
  let branch = argv[0]

  if (!branch) {
    try {
      const { stdout } = await run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: ROOT })
      branch = stdout.trim()
    } catch {
      return result('branch name (skipped — not a git repo)', [], 0)
    }
  }

  if (!branch || branch === 'HEAD') {
    return result('branch name (skipped — detached HEAD)', [], 0)
  }

  const { skipped, problems } = validate(branch)
  if (skipped) return result(`branch name (skipped — ${skipped})`, [], 0)

  const failures = problems.map((p) => `\`${branch}\` — ${p}`)
  return result('branch name', failures, 1)
}
