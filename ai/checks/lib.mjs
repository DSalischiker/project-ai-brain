import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)))
export const RULES_DIR = join(ROOT, 'ai', 'rules')
export const ROUTER = join(ROOT, '.claude', 'skills', 'brain-router', 'SKILL.md')
export const INDEX = join(ROOT, 'CLAUDE.md')

const IGNORED = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage'])

/** Recursively collect files under `dir` matching `filter`. Returns absolute paths. */
export async function walk(dir, filter = () => true) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full, filter)))
    else if (filter(full)) out.push(full)
  }
  return out
}

export const read = (path) => readFile(path, 'utf8')

export async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

/** Repo-relative path with forward slashes, for stable output across platforms. */
export const rel = (path) => relative(ROOT, path).split(sep).join('/')

export const lineCount = (text) => text.split('\n').length

/** 1-indexed line number of the first line containing `needle`, or null. */
export function lineOf(text, needle) {
  const index = text.split('\n').findIndex((line) => line.includes(needle))
  return index === -1 ? null : index + 1
}

/**
 * A check returns { name, failures, checked }.
 * `failures` are user-facing strings; an empty array is a pass.
 */
export const result = (name, failures, checked) => ({ name, failures, checked })
