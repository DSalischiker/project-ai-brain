# File Manifest

What `create-ai-brain` installs, what is conditional, and every placeholder to resolve.

---

## Always installed

| File | Budget | Notes |
|---|---|---|
| `CLAUDE.md` | ≤ 140 lines | Index. Rule map lists **only** rules that exist |
| `AGENTS.md` | ≤ 25 lines | Pointer to `CLAUDE.md`. No rules of its own |
| `ai/project.md` | ≤ 220 lines | Project context. **Must ship fully filled in** |
| `.claude/skills/brain-router/SKILL.md` | ≤ 220 lines | Trigger tables reference **only** rules that exist |
| `ai/rules/core/guardrails.md` | ≤ 150 lines | Always-loaded |
| `ai/rules/core/conventions.md` | ≤ 150 lines | Always-loaded |

---

## Conditional rule files

| File | Install when |
|---|---|
| `prompting/prompt-improvement.md` | Always in practice — recommend it unconditionally |
| `prompting/interaction-gates.md` | Gates chosen (default: yes) |
| `git/branching.md` | Git repo |
| `git/commits.md` | Git repo |
| `git/pull-requests.md` | Git repo with a remote |
| `code/typescript.md` | Any `.ts`/`.js` in the repo |
| `code/react.md` | `react` in dependencies |
| `code/nextjs-app-router.md` | `next` in dependencies **and** an `app/` directory. For Pages Router, adapt or omit — do not ship App Router rules for a Pages project |
| `code/node-api.md` | Backend routes, services, or handlers |
| `code/data-layer.md` | A database, ORM, or Supabase. Trim the Supabase section if not used |
| `quality/testing.md` | A test runner, or the user wants one |
| `quality/self-review.md` | Always — highest value per token in the brain |
| `quality/security.md` | Auth, payments, user data, or a public API |
| `docs/documentation.md` | Always — it is what keeps history out of rule files |

**Adapt, do not just copy.** Trim sections about tools the project does not use. A rule
mentioning Supabase in a Prisma project teaches the agent that these files are approximate.

---

## Templates

Install only what the chosen workflow uses.

| File | When |
|---|---|
| `ai/templates/pull-request.md` | Git remote exists |
| `ai/templates/execution-prompt.md` | Deep tier enabled (default: yes) |
| `ai/templates/adr.md` | Documentation domain included |
| `ai/templates/rule-file.md` | Always — the brain will be extended |

## Checks

Install as a set when enforcement is chosen. Zero dependencies, plain Node ESM.

```
ai/checks/lib.mjs             shared helpers
ai/checks/index-integrity.mjs dangling pointers
ai/checks/router-coverage.mjs rules with no trigger
ai/checks/size-budget.mjs     line budgets
ai/checks/branch-name.mjs     branch name validity
ai/checks/run-all.mjs         entry point
```

Add a script to `package.json` if one exists: `"checks:brain": "node ai/checks/run-all.mjs"`.

`ALWAYS_LOADED` in `router-coverage.mjs` must match the always-load block in the generated
`CLAUDE.md`. If you change one, change the other.

## Decisions

`ai/decisions/README.md` plus one ADR recording this install: what was chosen, what was
excluded, and why. It is the record of why the brain looks the way it does, and the first thing
someone reads when they want to change it.

---

## Placeholders

Every one must be resolved before finishing. **Grep for `{{` as the last step.**

| Placeholder | Source | If unknown |
|---|---|---|
| `{{PROJECT_NAME}}` | `package.json` name, or directory name | Ask |
| `{{ONE_SENTENCE_DESCRIPTION}}` | Interview Q1 | Ask — never invent |
| `{{STACK}}` | Detected | Ask to confirm |
| `{{PACKAGE_MANAGER}}` | Lockfile | Ask |
| `{{DEV_CMD}}` `{{BUILD_CMD}}` `{{TEST_CMD}}` `{{LINT_CMD}}` `{{TYPECHECK_CMD}}` | `package.json` scripts | Omit the row rather than guess a script that does not exist |
| `{{CHECKS_CMD}}` | `node ai/checks/run-all.mjs` | — |
| `{{DEPLOY_TARGET}}` | `vercel.json`, CI config, Dockerfile | Ask |
| `{{INTEGRATION_BRANCH}}` | Interview Q3 | Ask — appears in ~8 files, must be right |

`{{INTEGRATION_BRANCH}}` is the one that hurts most if wrong: it is written into branching,
commits, PR, gate and template files, and a wrong value sends work at the wrong branch.

---

## Post-install verification

1. `node ai/checks/run-all.mjs` passes.
2. `grep -r '{{' CLAUDE.md AGENTS.md ai/ .claude/` returns nothing.
3. Every rule file in `ai/rules/` has a `CLAUDE.md` row **and** a router trigger.
4. Every path referenced in `CLAUDE.md` exists.
5. `ai/project.md` has no empty section and no placeholder.
6. One real task routed end to end, with a sensible tier and loaded set.

Step 6 is the only one that catches a trigger table that parses but routes wrongly. Do not skip
it because the scripts passed — they check wiring, not judgment.
