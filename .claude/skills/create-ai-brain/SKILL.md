---
name: create-ai-brain
description: Install a progressive-disclosure AI Brain into a project — the CLAUDE.md index, a task router, and a tailored rule tree covering prompt improvement, git workflow, code structure, testing, security and documentation. Use when the user asks to set up agent instructions, create a CLAUDE.md or AGENTS.md, add rules or coding standards for AI agents, structure an AI brain, or improve an existing CLAUDE.md that has grown unwieldy.
---

# Create an AI Brain

Install a rule system an agent loads *selectively* — the index is always in context, the
router loads per task, and a rule file loads only when its trigger fires.

Read `references/file-manifest.md` before writing anything. It holds the file list, the
stack-to-rule mapping, and the placeholder table.

**Never generate the whole tree and ask afterwards.** An unwanted rule file is worse than a
missing one: it loads, it costs attention, and nobody deletes it.

---

## Step 1 — Look before you ask

Inspect the target repository first, and do not ask for anything you can read:

| Read | Tells you |
|---|---|
| `package.json` | Framework, versions, package manager, scripts for dev/build/test/lint |
| `tsconfig.json` | TypeScript, path aliases, strictness |
| lockfile | Package manager, for certain |
| `app/` vs `pages/` vs `src/` | Router style, layout convention |
| `supabase/`, `prisma/`, `drizzle/` | Data layer |
| `git branch -a`, `git log --oneline -20` | Branch model, commit style already in use |
| Existing `CLAUDE.md` / `AGENTS.md` / `.cursorrules` | What already exists — never overwrite blind |
| `README.md` | What the project is |

**If a brain already exists**, this is a migration, not an install. Read it fully, tell the
user what you found, and go to Step 5.

Then state what you detected in a short table and ask the user only to confirm and fill gaps.
Reading `package.json` and then asking "what framework do you use?" wastes their turn and
signals you did not look.

---

## Step 2 — Interview

Full question bank with option wording: `references/interview.md`.

Ask in **at most three rounds** of structured multiple-choice questions (`AskUserQuestion`),
batched, never one question per turn. Recommend a default in every question and put it first.

| Round | Covers |
|---|---|
| 1 | Project identity, stage, git model, integration branch |
| 2 | Stack confirmation, which rule domains to include |
| 3 | Routing depth, interaction gates, enforcement level — only if the defaults were not accepted |

Round 3 is usually skippable. If the user accepts the recommended defaults in rounds 1 and 2,
say which defaults you are taking and skip straight to Step 3.

Stop asking when the remaining answers would not change a generated file. A question whose
answers all produce the same output is theatre.

---

## Step 3 — Confirm the plan

Before writing, show:

- The exact file tree you will create, with a line count estimate
- Which rule files you are **not** creating, and why
- Every placeholder value you resolved, so a wrong one is caught before it is written into
  fifteen files
- Whether anything existing will be modified

Then take the approval gate. Do not write on assumed approval.

---

## Step 4 — Generate

Order matters — later files reference earlier ones.

1. `ai/project.md` — fill from Step 1 and Step 2. **The highest-value file in the brain.**
   Never ship it with placeholders intact.
2. `ai/rules/core/guardrails.md` and `core/conventions.md` — always, both.
3. The selected domain rule files.
4. `.claude/skills/brain-router/SKILL.md` — trigger tables must list **only** rules that
   exist.
5. `CLAUDE.md` — the rule map lists only rules that exist. Written after the rules so it
   cannot advertise a file you decided not to create.
6. `AGENTS.md` — pointer only.
7. `ai/templates/` — the templates the chosen workflow needs.
8. `ai/checks/` + `ai/decisions/README.md`, if enforcement was chosen.
9. An ADR recording the install and the choices made.

### Source of the rule content

Resolve in this order:

1. **A local copy of the AI Brain repository** — check the directory containing this skill and
   its ancestors for a sibling `ai/rules/` tree. Copy the files and substitute placeholders.
   Preferred: the content is already reviewed.
2. **Author from `references/authoring-spec.md`** — it states what each rule file must cover
   and the house style. Use this when no source tree is available.

Either way, adapt to the project. A rule naming a framework the project does not use is noise,
and it teaches the agent that rules here are approximate.

### Non-negotiables when generating

- **Every placeholder resolved.** Grep for `{{` before finishing. A shipped `{{TEST_CMD}}` is
  a broken brain.
- **Line budgets hold**: `CLAUDE.md` ≤ 140, rule files ≤ 150, router ≤ 220.
- **One owner per fact.** Never restate a rule in two files.
- **No history in rule files.** Rationale goes in the ADR.
- **Never invent a project fact.** If you do not know the deploy target, ask or leave a marked
  `{{TODO}}` and say so — do not write a plausible guess into `ai/project.md`.

---

## Step 5 — Migrating an existing CLAUDE.md

Common, and the more valuable case — an existing file has usually grown past what an agent can
carry.

1. **Read all of it.** Never overwrite an instruction file you have not read; it encodes
   decisions nobody wrote down elsewhere.
2. **Classify every rule** into: keep as a non-negotiable, move to a domain rule file, move to
   `ai/project.md`, move to an ADR (rationale and history), or drop as stale.
3. **Show the classification and get approval per group** before moving anything. Dropping
   something the user relies on is the one unrecoverable mistake here.
4. **Preserve the original** as an appendix to `ai/decisions/NNNN-adopting-the-brain.md`, or
   note the commit that holds it. Do not delete it in the same commit that replaces it.
5. Then run Steps 3 and 4.

Anything you could not classify goes to the user as an explicit question. Never silently drop a
rule — the user wrote it for a reason you may not be able to see.

---

## Step 6 — Verify and hand off

- Run `node ai/checks/run-all.mjs` if checks were installed. It must pass.
- Grep the tree for `{{` — zero results.
- **Route one real task end to end** as a smoke test: pick something small in the repo, invoke
  `brain-router`, and confirm the tier and loaded set are sensible. This catches a broken
  trigger table, which nothing else does.

Then report: files created, rules included and excluded, placeholders you could not resolve,
and the single next thing the user should do — usually filling a section of `ai/project.md`
only they know.

Say plainly that `ai/project.md` is where the brain gets its leverage, and that a thin one
limits everything else.
