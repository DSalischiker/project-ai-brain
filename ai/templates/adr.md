# ADR Template

> Copy to `ai/decisions/NNNN-short-title.md`. Rules: `ai/rules/docs/documentation.md § ADRs`.
> Immutable once merged — a changed decision gets a new ADR that supersedes this one.
>
> Delete this blockquote when you use it.

---

# NNNN — {{Decision, stated as a decision}}

Title the decision, not the topic. "Use cursor pagination for list endpoints", not
"Pagination".

| | |
|---|---|
| **Status** | {{Proposed / Accepted / Superseded by NNNN / Deprecated}} |
| **Date** | {{YYYY-MM-DD}} |
| **Deciders** | {{who}} |
| **Supersedes** | {{NNNN, or none}} |

## Context

{{What forced a decision. The constraint, the problem, the thing that stopped working. Written
so someone who joins in a year understands the pressure without asking anyone.

State the facts that were true at the time, including ones that may have since changed. This
section is why the ADR stays useful after the code moves on.}}

## Decision

{{What was decided, in the present tense and as an instruction. "List endpoints use cursor
pagination with an opaque cursor." Specific enough that a reader can tell whether a given piece
of code complies.}}

## Alternatives rejected

{{The most valuable section — nobody can reconstruct it later, and it is what stops the same
debate recurring.}}

**{{Alternative}}** — {{why not. Be concrete: what it would have cost, what it could not do.}}

**{{Alternative}}** — {{why not}}

## Consequences

**Accepted costs:** {{what this makes harder or worse. Every real decision has some. An ADR
with no costs listed was not a decision, it was a preference.}}

**What this constrains:** {{what future work must now respect}}

**What would reverse this:** {{the condition under which revisiting is correct — a scale
threshold, a library maturing, a requirement disappearing. This is how an ADR avoids becoming
dogma.}}

## Rule impact

{{Which files under `ai/rules/**` this creates or changes, if any. If it changed a rule, the
rule file states the current rule only and links here for the reasoning — it does not narrate
the change.}}
