# 0002 — Tier tasks fast / standard / deep instead of routing everything fully

| | |
|---|---|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Project owner |
| **Supersedes** | none |

## Context

The reference implementation reviewed in [0001](./0001-brain-architecture.md) requires full
routing before every task without exception — including, explicitly, "even when the task
appears trivial" and "even when no code is expected to change." Its routing report has six
mandatory sections and must be emitted before any file is read.

This is defensible: it is uniform, auditable, and immune to an agent talking itself into
skipping process on work that turned out not to be trivial.

It is also expensive in a way that compounds. Fixing a typo in a heading costs the always-load
set, a workflow file, a classification decision, and a six-section report. Users notice this,
and the predictable response is not "the process is thorough" — it is to stop invoking the
router for small work, which loses the guarantee entirely rather than trading it.

Uniform process on non-uniform work is not free rigour; the cost is paid in adherence.

## Decision

Every task is assigned one of three tiers, declared in one line, overridable by the user.

| Tier | Loads | Reports |
|---|---|---|
| **fast** | Non-negotiables only | One line |
| **standard** | Always-load set + triggered rules | Four-line report |
| **deep** | Standard + planning + mandatory self-review | Report, plan, approval gate |

The tier decision table lives in `.claude/skills/brain-router/SKILL.md § Phase 1`.

Three provisions make this safe rather than merely cheaper:

1. **Ties go to the higher tier.** The table resolves ambiguity upward, always.
2. **Escalation is mandatory, not optional.** A fast task that turns out to need a schema
   change stops, re-tiers, and reports the escalation. Finishing at the wrong tier to avoid
   the ceremony is a stated violation.
3. **Category triggers override shape.** Anything touching auth, permissions, payments, user
   data, or schema is deep regardless of how small the diff looks. A one-line change to an auth
   guard is not a fast task.

## Alternatives rejected

**Always-full routing**, as the reference does. Rejected on adherence grounds, not on
principle: a process bypassed on small work provides less real coverage than a tiered process
followed on all of it.

**Always-full routing with a compressed report.** Considered seriously. It keeps uniformity and
cuts most of the token cost. Rejected because the report was never the expensive part — loading
the rule set and the workflow file was, and a shorter report does not address that.

**Let the agent decide per task with no table.** Rejected: "use judgment" reliably resolves
toward less work under time pressure. The table exists so the decision is a lookup rather than
a judgment call, and so a wrong tier is visibly wrong afterward.

**Two tiers (trivial / everything else).** Simpler, and most of the benefit. Rejected because
the interesting distinction is at the top, not the bottom: a new feature and a bug fix both
land in "everything else" but only one of them needs a plan approved before work starts.

## Consequences

**Accepted costs:**
- An agent can pick the wrong tier. Mitigated by ties-go-up, mandatory escalation, and the
  category overrides — not eliminated.
- Fast-tier work produces no audit trail beyond one line. This is deliberate; the class of
  change is one where a bad outcome is cheap and obvious.
- Three tiers is a rule to learn, where "always route" is not.

**What this constrains:** the router must keep the tier table cheap to evaluate — if deciding a
tier costs as much as routing, the decision has failed. The tier must be declared before any
edit, so it can be challenged.

**What would reverse this:** evidence that tier misassignment causes real defects. The failure
signature would be fast-tier changes appearing in incident reports. If that happens, collapse
to two tiers before returning to always-full.

## Rule impact

`CLAUDE.md § 3` states the tiers. `.claude/skills/brain-router/SKILL.md` Phases 1, 4 and 5
implement them. `ai/rules/prompting/interaction-gates.md` binds Gate 2 to deep tier.
