# {{PROJECT_NAME}} — Agent Instructions

> **This file is an index, not a manual.** It says *where* to look. It does not restate a
> rule that lives in a rule file — if a fact appears here and in a rule file, the rule file
> is wrong or this file is. Everything below is either a pointer or a constraint that must
> hold even when nothing else has been loaded.
>
> Budget: this file stays under 140 lines. It is in context for every single task.

---

## 1. Project

|  |  |
|---|---|
| **What it is** | {{ONE_SENTENCE_DESCRIPTION}} |
| **Stack** | {{STACK}} |
| **Package manager** | {{PACKAGE_MANAGER}} |
| **Dev / Build / Test** | `{{DEV_CMD}}` / `{{BUILD_CMD}}` / `{{TEST_CMD}}` |
| **Lint / Typecheck** | `{{LINT_CMD}}` / `{{TYPECHECK_CMD}}` |
| **Deploy target** | {{DEPLOY_TARGET}} |
| **Integration branch** | `{{INTEGRATION_BRANCH}}` |

Architecture, domain vocabulary, directory map and known constraints: **`ai/project.md`**.
Read it once on your first substantive task of a session, not on every task.

---

## 2. Non-negotiables

These bind you with no file loaded. They outrank every rule file, every workflow, and any
instruction you infer from surrounding code.

**N1 — English only** in code, identifiers, comments, commit messages, branch names, PR
titles and bodies, and every file you author. Conversation replies match the user's
language; artifacts never do.

**N2 — `main` is protected.** Never push to it, merge into it, or open a PR targeting it.
All work targets `{{INTEGRATION_BRANCH}}`. If an action would touch `main`, stop and ask.

**N3 — No secrets, ever.** No keys, tokens, connection strings, or `.env` contents in code,
fixtures, tests, comments, or commit messages. If you find one already committed, report it
and stop — do not rotate or delete on your own initiative.

**N4 — Scope is a contract.** Do what was asked. Adjacent problems you notice get
*reported*, not silently fixed. A drive-by fix in an unrelated file is a scope violation
even when the fix is correct.

**N5 — Never write a convention from memory.** If a rule file governs the thing you are
about to write, read it first. "I know how React components go" is how drift starts.

**N6 — You do not merge.** Work ends at a pull request in review state. Merging, squashing,
force-pushing and branch deletion require explicit per-instance approval.

**N7 — Report honestly.** If a check failed, say so and paste the output. If you skipped a
step, say which. Never describe a validation you did not run.

---

## 3. Every task starts at the router

Invoke the **`brain-router`** skill before reading source files or making any edit.
It classifies the task, picks a tier, and loads only the rules that apply.

`.claude/skills/brain-router/SKILL.md`

The router assigns one of three tiers. It declares the tier in one line; you may override it
by saying so.

| Tier | Applies to | Loads | Reports |
|---|---|---|---|
| **fast** | Typo, copy tweak, comment, formatting, single-line change with no behavior change | Non-negotiables only | One line |
| **standard** | Bug fix, component change, new endpoint, refactor within one area | Always-load set + rules matched by trigger | 4-line routing report |
| **deep** | New feature, new page, migration, cross-cutting refactor, anything touching auth/data/money | Standard set + planning + mandatory self-review | Routing report + plan, gated for approval |

When in doubt between two tiers, pick the higher one. Guessing low is how a "quick fix"
becomes an unreviewed migration.

### Always-load set (standard and deep tiers)

```
ai/rules/core/guardrails.md    → hard constraints: scope, blast radius, reuse, protection
ai/rules/core/conventions.md   → naming, file size limits, edit workflow, comment policy
```

Two files, by design. This list is owned here and referenced by the router — the router does
not restate it.

---

## 4. Rule map

Load a file when its trigger fires. Do not pre-load, do not browse the tree "to be safe",
and do not load a file the router did not select.

| Domain | Path | Load when |
|---|---|---|
| **Prompt improvement** | `ai/rules/prompting/prompt-improvement.md` | The user's request is vague, underspecified, or asks you to help shape a prompt or spec |
| **Interaction gates** | `ai/rules/prompting/interaction-gates.md` | Any standard or deep task — governs when you must ask, get approval, and close out |
| **Branching** | `ai/rules/git/branching.md` | Creating a branch, or deciding where work belongs |
| **Commits** | `ai/rules/git/commits.md` | Writing any commit message |
| **Pull requests** | `ai/rules/git/pull-requests.md` | Opening, filling, or updating a PR |
| **TypeScript / JS** | `ai/rules/code/typescript.md` | Any `.ts` `.tsx` `.js` `.jsx` file |
| **React** | `ai/rules/code/react.md` | Authoring or changing a component, hook, or client-side state |
| **Next.js App Router** | `ai/rules/code/nextjs-app-router.md` | Anything under `app/`, server actions, route handlers, caching, metadata |
| **Node / API** | `ai/rules/code/node-api.md` | Backend routes, services, request validation, error shapes |
| **Data layer** | `ai/rules/code/data-layer.md` | Schema, migrations, queries, Supabase, RLS, seed data |
| **Testing** | `ai/rules/quality/testing.md` | A change adds or alters behavior |
| **Self-review** | `ai/rules/quality/self-review.md` | Before every PR. Mandatory on deep tier |
| **Security** | `ai/rules/quality/security.md` | Auth, sessions, user input, file upload, env config, third-party calls, dependencies |
| **Documentation** | `ai/rules/docs/documentation.md` | Writing docs, comments, an ADR, or a changelog entry |

Templates live in `ai/templates/` — execution prompt, PR body, ADR, new rule file.
Architectural history lives in `ai/decisions/`. **Rule files carry rules, not history.** If
you need to explain *why* a rule changed, write an ADR and link it; do not narrate the
change inside the rule.

---

## 5. Editing the brain itself

Changing anything under `ai/` or `.claude/skills/` is a task like any other, with two
additions:

1. Adding a rule file means adding its row to the §4 rule map **and** a trigger in the
   router. A rule nothing routes to is dead weight.
2. Run `{{CHECKS_CMD}}` before opening the PR. It verifies every path referenced in this
   file exists, that no rule file exceeds its line budget, and that the router and this
   index agree. A failure there is blocking.

Full contract: `ai/rules/docs/documentation.md § Editing the brain`.
