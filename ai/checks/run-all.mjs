#!/usr/bin/env node
/**
 * Brain integrity checks.
 *
 * Usage: node ai/checks/run-all.mjs
 * Exits non-zero on any failure. Run before opening a PR that touches the brain.
 *
 * These check that the brain is *wired*, not that its rules are wise. A rule nothing routes
 * to, a pointer to a deleted file, a rule file that quietly grew to 400 lines — those are
 * the failures that go unnoticed for months, so they are the ones worth automating.
 */
import branchName from './branch-name.mjs'
import indexIntegrity from './index-integrity.mjs'
import routerCoverage from './router-coverage.mjs'
import sizeBudget from './size-budget.mjs'

const CHECKS = [indexIntegrity, routerCoverage, sizeBudget, branchName]

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const OFF = '\x1b[0m'

const results = []

for (const check of CHECKS) {
  try {
    results.push(await check())
  } catch (error) {
    results.push({
      name: check.name,
      failures: [`check threw: ${error.message}`],
      checked: 0,
    })
  }
}

let failed = 0

for (const { name, failures, checked } of results) {
  if (failures.length === 0) {
    console.log(`${GREEN}PASS${OFF} ${name} ${DIM}(${checked} checked)${OFF}`)
    continue
  }
  failed += failures.length
  console.log(`${RED}FAIL${OFF} ${name} ${DIM}(${failures.length} of ${checked})${OFF}`)
  for (const failure of failures) console.log(`     ${failure}`)
}

console.log('')

if (failed > 0) {
  console.log(`${RED}${failed} problem${failed === 1 ? '' : 's'}.${OFF} This is blocking.`)
  process.exit(1)
}

console.log(`${GREEN}Brain intact.${OFF}`)
