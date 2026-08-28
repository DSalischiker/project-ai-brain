# Guardrails

> **Always loaded.** Highest priority after the non-negotiables in `CLAUDE.md § 2`. When a
> guardrail conflicts with any other rule, a workflow, a template, or the surrounding code,
> the guardrail wins.

Each guardrail states what is protected, what is allowed, and what is forbidden. Where a
guardrail can be violated by accident, it names the check that catches it.

---

## G1 — Scope

The deliverable is what was asked for. Not less, not more, not adjacent.

**Allowed:** everything necessary to make the requested change correct and complete —
including a helper, a type, or a test the change genuinely requires.

**Forbidden:**
- Fixing an unrelated bug you noticed.
- Renaming, reformatting, or reorganising code you were not asked to change.
- Upgrading a dependency, adding a library, or changing config as a side effect.
- "While I was in there" changes of any kind.

Noticed something worth fixing? Put it in the report as a one-line observation. The user
decides whether it becomes work. A correct fix delivered outside scope is still a violation,
because it makes the diff unreviewable.

---

## G2 — Blast radius

Know how many files you will touch before you touch one.

| Task shape | Expected files |
|---|---|
| Bug fix | 1–2 (+1 test) |
| Component change | 1–3 (+1 test) |
| New endpoint | 2–4 (+tests) |
| New feature | 4–10 |
| Migration / cross-cutting | Enumerate explicitly, no upper bound, deep tier |

Exceeding the expected count is not automatically wrong — it is a **signal to stop and say
so** before continuing. Silently touching fifteen files on a "bug fix" is the violation, not
the fifteen files.

If you cannot enumerate the files before starting, the task is not understood well enough to
start. Go back to Phase 0.

---

## G3 — Reuse before creation

Before creating any new module, component, hook, utility, type, or endpoint, verify all
four:

1. **It does not already exist.** Search by behavior, not just by name — `formatDate`,
   `toDisplayDate`, and `humanizeTimestamp` are the same function three times.
2. **No existing thing can be extended cleanly.** Extension is preferred when it adds a
   parameter or a variant; forking is preferred when the shapes genuinely diverge.
3. **It has more than one caller, or is required by a rule.** A single-use abstraction is
   usually premature.
4. **You can name it precisely.** If the name needs "and" or "Helper" or "Utils", the
   concept is not yet one thing.

Failing any check: do not create it. Say which check failed.

---

## G4 — No speculative structure

Build what the task requires, not what it might require later.

**Forbidden:** unused parameters "for flexibility", config objects with one consumer,
abstraction layers with one implementation, generic type parameters never varied, event
systems with one listener, plugin architectures with one plugin.

The cost of adding structure later is small and visible. The cost of removing wrong structure
is large and nobody pays it. Default to the concrete version.

---

## G5 — Wrappers must earn their existence

Every new wrapper — component, function, module, or type — must justify itself against one of:
adds behavior, adds a real boundary (validation, error handling, permission), adapts an
incompatible interface, or removes duplication that already exists in more than one place.

A wrapper that only forwards its arguments is deleted, not shipped.

---

## G6 — Protected areas

Treat these as read-only unless the task explicitly targets them. Editing one requires
saying so in the routing report and getting approval.

- Auth, session, and permission logic
- Payment and billing code
- Database migrations already applied
- Shared components consumed in 3+ places
- CI/CD config, build config, deploy config
- Generated files and lockfiles (regenerate via their tool; never hand-edit)
- `main`-protection settings and branch rules

Project-specific additions belong in `ai/project.md § Protected areas`.

---

## G7 — Don't break what you can't see

Before changing anything exported, find its callers. Before changing a shape that crosses a
boundary — API response, DB row, event payload, component props — find every consumer.

If a consumer is outside this repository, the change is **breaking** and needs explicit
approval regardless of how small it looks.

---

## G8 — Verify, then claim

A task is not done because the code looks right.

Before reporting completion, run what applies and paste real output:
typecheck, lint, tests, build, and the project's own checks. If a command does not exist,
say that rather than reporting a pass.

Never write "tests pass", "should work", or "verified" for something you did not run. A
failure you reported honestly costs one message; a failure you claimed as a pass costs the
user their trust in every other line of your report.

---

## G9 — Uncertainty is reported, not resolved silently

When you must guess, say so at the moment you guess, in one line: what you assumed and what
would change if the assumption is wrong.

Do everything that does not depend on the unknown. Only block when proceeding under any
assumption would be unsafe or would waste the work if wrong.

---

## Enforcement priority

```
1. CLAUDE.md § 2 non-negotiables
2. These guardrails
3. core/conventions.md
4. The domain rule the router loaded
5. ai/project.md
6. Patterns in surrounding code
```

Higher always wins. Never average two conflicting rules — pick the higher one and note the
conflict so the lower rule can be fixed.
