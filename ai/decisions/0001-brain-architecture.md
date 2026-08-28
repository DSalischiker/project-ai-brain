# 0001 — Three-layer progressive disclosure for agent instructions

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Project owner |
| **Supersedes** | none |

## Context

An agent's context window is a budget. Every instruction loaded competes for attention with
the code being changed, and a large instruction set degrades in two directions at once: it
costs tokens, and it dilutes the rules that actually apply to the task.

The naive approach — one large instructions file — fails predictably. It grows monotonically,
because nobody deletes from it, and everything in it loads on every task including a typo fix.
The opposite extreme — many small files with no index — fails differently: the agent cannot
tell which files exist or when they apply, so it either reads everything or nothing.

A reference implementation was reviewed (a design-system repository with a mature rule tree).
Its architecture was sound and is the basis for this one. Its problems were concentrated in
execution: a 14.7 KB always-loaded index, a 77 KB workflow file that loaded on every
code-producing task and then instructed the agent which of its own sections to skip, rule
files carrying their own changelogs inline, and one fact deliberately duplicated across two
files with a script to compare the copies.

## Decision

Instructions are organised in three layers, each loaded on a different condition.

1. **`CLAUDE.md`** — always in context. An index of pointers plus the constraints that must
   hold with nothing else loaded. Budget: 140 lines. It owns no domain rules.
2. **`.claude/skills/brain-router/SKILL.md`** — loaded when a task starts. Classifies the task
   and decides what to load. All routing logic lives in this one file.
3. **`ai/rules/**/*.md`** — loaded only when a trigger fires. One domain per file, ≤ 150 lines.

Supporting the three layers:
- `ai/project.md` — project-specific context, read once per session.
- `ai/templates/` — canonical artifact shapes.
- `ai/decisions/` — this directory. All rationale and history.
- `ai/checks/` — scripts that verify the wiring.

**One owner per fact.** Every rule lives in exactly one file; others link to it. The only
exception is `CLAUDE.md`'s non-negotiables and always-load list, which must survive the router
never being invoked.

**Line budgets are enforced**, not advisory, by `ai/checks/size-budget.mjs`.

## Alternatives rejected

**A single large instructions file.** Simple and impossible to get wrong structurally, but it
loads entirely on every task and grows without bound. The token cost is the whole problem.

**Copy the reference implementation as-is.** Its architecture is right, and adopting it wholesale
would have been faster. Rejected because its specific failures — the oversized index and the
77 KB always-loaded workflow — are exactly the failures that matter most, and they were
structural rather than incidental.

**Duplicate critical facts and lint for drift**, as the reference does for its always-load
block. Rejected: a linter comparing two copies treats the symptom. One owner and a link cannot
drift at all.

**Split routing across two files** (skill + a loader document), as the reference does. Rejected:
it forces a context switch mid-routing and the phase-ownership table needed to explain the split
costs more than the split saves.

## Consequences

**Accepted costs:**
- Adding a rule requires three edits, not one: the file, the index row, the router trigger.
  `ai/checks/router-coverage.mjs` exists because this is easy to get wrong.
- Line budgets will occasionally force a split that a human would rather not make.
- An agent whose tool cannot load skills must read the router file manually. `AGENTS.md`
  documents this.

**What this constrains:** no rule file may restate a rule owned elsewhere; no rule file may
carry history; the index may not grow into a manual.

**What would reverse this:** a substantially larger effective context window that makes
selective loading irrelevant. Note that this would remove the token argument but not the
attention-dilution one, so a partial reversal is more likely than a full one.

## Rule impact

Creates the whole tree under `ai/rules/`, plus `CLAUDE.md`, `AGENTS.md`, the router skill, and
the checks. `ai/rules/docs/documentation.md § Editing the brain` is the durable statement of
this decision's consequences.
