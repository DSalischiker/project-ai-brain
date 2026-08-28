---
name: brain-router
description: Route any task against this project's rule tree before touching code. Use at the start of every implementation, fix, refactor, review, audit or rule-authoring task — including small tweaks and tasks where no code is expected to change — to pick a tier, classify the work, load only the governing rules, and emit the routing report. Also use when the user says /route, re-route, or asks which rules apply.
---

# Brain Router

**The entry point to the rule system.** Run this before reading source files and before any
edit. It exists to answer one question: *which rules govern this task* — so you never load
the whole tree and never work from memory.

Everything about routing is in this file. There is no second half.

---

## Phase 0 — Is the request even ready?

Before routing, check whether you can state the task in one sentence with no guessing.

If the request is vague, contradicts the codebase, has two plausible readings that lead to
materially different work, or names an outcome without constraints — load
`ai/rules/prompting/prompt-improvement.md` and resolve it there **first**. Do not route an
unclear request; you will route it to the wrong rules.

Routing an ambiguous request and "asking as you go" is the failure this phase prevents.

---

## Phase 1 — Pick a tier

Tiers are defined in `CLAUDE.md § 3`. Choose with this table; on a tie, take the higher tier.

| Signal | Tier |
|---|---|
| Typo, copy string, comment, import order, formatting-only | **fast** |
| Single-line change, no behavior change, no new dependency | **fast** |
| Bug fix confined to one file or one component | **standard** |
| Change to an existing component, endpoint, query, or test | **standard** |
| Refactor inside a single area, no public API change | **standard** |
| New feature, new page, new route, new table | **deep** |
| Touches auth, sessions, permissions, payments, or user data | **deep** |
| Schema change or migration | **deep** |
| Changes a shared/exported API that other modules consume | **deep** |
| Spans 4+ files, or you cannot enumerate the files up front | **deep** |
| Editing the brain itself (`ai/**`, `.claude/skills/**`) | **standard**, deep if it changes routing |

**Escalate mid-task.** If a fast task turns out to need a schema change, stop, re-tier, and
report the escalation. Finishing at the wrong tier to avoid the ceremony is a violation.

**fast tier stops here.** Honour the non-negotiables, make the change, state in one line what
you changed and that you ran fast tier. No report, no rule loading.

---

## Phase 2 — Classify

Standard and deep tiers classify into **exactly one** label. Resolve by *intent first, target
second, keywords last*.

| Label | Intent | Typical target |
|---|---|---|
| `bug-fix` | Restore intended behavior | The specific broken unit |
| `feature-work` | Add or change user-visible behavior | Feature directory, page, endpoint |
| `component-work` | Create or change a reusable UI unit | Shared component or hook |
| `data-work` | Change how data is shaped, stored, or queried | Schema, migration, query layer |
| `refactor` | Change structure, not behavior | Internal module |
| `test-work` | Add or repair coverage | Test files |
| `review` | Assess quality without changing it | A diff, a branch, an area |
| `brain-work` | Author or revise a rule, template, or the router | Files under `ai/` or `.claude/` |

Do not invent labels ("cleanup", "polish", "improvements"). Those describe a task informally;
classification must land on one of the eight.

If two labels fit equally, pick the one matching the **primary deliverable**. Adding a field
to an existing form is `feature-work`, not `component-work`, even though a component changes.

Ambiguous after all three signals? Default to `feature-work`, note the ambiguity in the
report, and let the user correct it.

---

## Phase 3 — Load rules

Always load the set named in `CLAUDE.md § Always-load set`. Then apply both trigger tables
below. Load a file **once**; the tables overlap on purpose.

### 3a. By file path — check the files you are about to touch

| The task touches | Load |
|---|---|
| any `.ts` `.tsx` `.js` `.jsx` | `code/typescript.md` |
| a component, hook, or client state | `code/react.md` |
| `app/**`, `middleware.*`, server actions, route handlers | `code/nextjs-app-router.md` |
| backend services, API routes, request validation | `code/node-api.md` |
| schema, migrations, queries, Supabase client, RLS policies, seeds | `code/data-layer.md` |
| test files | `quality/testing.md` |
| `ai/**`, `.claude/**`, `CLAUDE.md` | `docs/documentation.md` |

### 3b. By condition — regardless of path

| Condition | Load |
|---|---|
| You will create a branch | `git/branching.md` |
| You will write a commit | `git/commits.md` |
| You will open or update a PR | `git/pull-requests.md` + `quality/self-review.md` |
| The change adds or alters behavior | `quality/testing.md` |
| Task involves auth, sessions, permissions, user input, uploads, env config, third-party calls, or dependency changes | `quality/security.md` |
| Tier is **deep** | `prompting/interaction-gates.md` + `quality/self-review.md` |
| Tier is **standard** and the task will produce a commit | `prompting/interaction-gates.md` |
| An architectural decision is being made or reversed | `docs/documentation.md § ADRs` |
| The user asks for a review, audit, or "check my work" | `quality/self-review.md` |

Paths are relative to `ai/rules/`.

### Loading principles

1. **Fewest files that produce a correct result.** Every extra file costs attention, and an
   over-loaded agent over-engineers.
2. **Code before rules** on fixes and modifications — read the existing implementation first,
   so the rules are checked against reality rather than applied blind.
3. **Nothing loads "to be safe."** If you cannot name the trigger that fired, do not load it.
4. **Conflicts resolve by precedence:** non-negotiables → guardrails → conventions → domain
   rule → project.md → surrounding code. Higher always wins; never split the difference.

---

## Phase 4 — Report before editing

Emit this **before** the first file edit. Standard tier: four lines. Deep tier: the same four
plus a plan.

```
Tier: [standard | deep]
Task: [label] — [one clause on what and where]
Loaded: [file] (why), [file] (why)
Skipped: [what a reader might expect, and why it does not apply]
```

`Skipped` is not filler. It is how the user catches a missing rule before work starts, and it
is the line that proves you routed rather than guessed.

Deep tier adds, before any edit:

```
Plan: [numbered steps, each one verifiable]
Files: [enumerated — if you cannot enumerate them, the scope is not yet understood]
Risk: [what could break, and what you will check to prove it did not]
```

Then stop and take the approval gate in `ai/rules/prompting/interaction-gates.md § Gate 2`.

**Forbidden: file-first reasoning.** Do not open, list, or grep source files before the
report exists. The router decides what governs the work; reading code first inverts that and
you end up justifying the code you already read.

---

## Phase 5 — Pre-flight invariants

Verify before the first edit. Any failure stops the task.

| Check | Expected |
|---|---|
| Exactly one classification label | yes |
| Tier declared and matches the Phase 1 table | yes |
| Every loaded file traces to a trigger | yes |
| Current branch is not `main` | yes — see `git/branching.md` |
| Branch is appropriate for this work | yes — new branch, or an existing one for the *same* objective |
| Files to be touched are inside the stated scope | yes |
| Deep tier: plan approved by the user | yes |
| New rule file added? | It has a rule-map row and a router trigger |

---

## Re-routing

`/route`, `re-route`, or `which rules apply?` discards all routing state and re-runs Phase
0–5 against the **current** message. Routing never refreshes itself between messages — a
long conversation that drifted into different work needs an explicit re-route.
