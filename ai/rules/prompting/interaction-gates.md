# Interaction Gates

> Loaded on every standard and deep task. Gates are the points where control returns to the
> user. They exist because the expensive failure is not a bug — it is finishing the wrong
> work and only finding out at review.

Three gates. Each has a precondition, a required action, and a set of exclusions. A gate whose
precondition holds and whose action was skipped makes the task non-compliant, regardless of
code quality.

---

## Gate 1 — Clarify

**Precondition:** The task has open decisions the user must resolve — unresolved
placeholders, two plausible readings that lead to different work, or a discrete trade-off you
should not pick unilaterally.

**Action:** End the turn with a single structured question set (`AskUserQuestion`), max four
entries, each with 2–4 concrete options. Method and quality bar:
`prompt-improvement.md § 3`.

**Do not:**
- Split one clarification into a sequence of turns.
- Ask in prose when the answer space is discrete.
- Ask about anything you could resolve by reading the codebase.
- Combine this with Gate 2 in one call. Clarification precedes approval; merging them asks
  the user to approve a plan built on answers they have not given yet.

**Excluded:** the request is unambiguous; the answer has a conventional default and you state
which one you took; the user pre-authorized ("just pick", "use your judgment", "don't ask").

---

## Gate 2 — Approve

**Precondition:** Tier is **deep**, or you have drafted an execution prompt or a multi-step
plan. Gate 1 is resolved or did not apply.

**Action:** Present the plan (routing report + `Plan` / `Files` / `Risk` per
`brain-router § Phase 4`), then end the turn with a question offering exactly:

| Option | Meaning |
|---|---|
| **Go** | Execute as planned |
| **Adjust** | Plan is close; user states what to change |
| **Hold** | Do not execute yet, no changes needed |
| **Drop** | Discard the plan entirely |

Put `Go` first. The tool appends its own "Other".

**Do not:**
- Ask for approval in prose while a drafted plan is on screen. Prose approval requests get
  answered ambiguously and you end up guessing.
- Begin any edit before the answer arrives. Not "starting on the safe parts."
- Re-scope after approval. Approval covers the plan as shown; material change means a new
  Gate 2.

**Excluded:** fast and standard tier without a drafted plan; explicit pre-authorization in the
current message; the user's message already selects an option.

---

## Gate 3 — Close out

**Precondition:** all of the following hold —

- Work was executed and is committed
- Current branch is not `main` or `{{INTEGRATION_BRANCH}}`
- At least one commit exists versus `{{INTEGRATION_BRANCH}}`
- Verification per `core/guardrails.md § G8` has been run and reported
- Self-review per `quality/self-review.md` has been run
- A PR exists targeting `{{INTEGRATION_BRANCH}}` — create it if missing, per
  `git/pull-requests.md`

**Action:** End the turn with a question offering exactly:

| Option | Meaning |
|---|---|
| **Review only** | Leave the PR open, do nothing further |
| **Merge if green** | Merge into `{{INTEGRATION_BRANCH}}` once checks pass |
| **Merge and clean up** | Merge, then delete the source branch (remote, then local) |
| **Keep working** | More changes coming on this branch |

Constraints on the merge options, which override anything else:
- Target is always `{{INTEGRATION_BRANCH}}`. Never `main`.
- Cleanup never deletes `main`, `{{INTEGRATION_BRANCH}}`, or any protected branch.
- A failing check blocks merge. The one exception: CI blocked purely by billing or quota
  (not by a test result) is non-blocking — say so explicitly when you invoke it.

**Excluded:** nothing was committed; work is explicitly mid-progress; the user already stated
what happens after the PR.

---

## Recovery

If a gate's precondition held on your **previous** turn and you did not fire it, fire it as
the **first action of this turn**, before responding to anything else. Acknowledge the miss in
one short sentence — no extended apology, no post-mortem — then call the gate.

The one exception: the user's current message already contains an unambiguous answer to the
missed gate. Then act on that answer and note that you are treating it as the gate response.

Most common miss: pushing a branch and opening a PR, then reporting success in prose without
Gate 3. Pushing and asking are not alternatives.

---

## Why these are behavioral, not automated

Gates require asking the user a question, and that is a model action — it cannot be forced by
a hook, a linter, or CI. Nothing will fail if you skip a gate. That is exactly why the
obligation is written down: the enforcement is you.
