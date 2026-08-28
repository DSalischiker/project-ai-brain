# Project Context — {{PROJECT_NAME}}

> Read on your first substantive task of a session, not on every task. This file holds what
> the codebase cannot tell you: intent, vocabulary, constraints, and the reasons behind
> choices that look arbitrary.
>
> **It does not hold rules.** Rules live in `ai/rules/**`. It does not hold history — that is
> `ai/decisions/`.

---

## What this is

{{TWO_OR_THREE_SENTENCES: what the product does, for whom, and what it is not. The "is not"
matters — it prevents an agent building features you deliberately excluded.}}

**Stage:** {{prototype | pre-launch | live with N users | mature}}

This changes the right trade-off. A prototype should not carry migration ceremony; a live
product must not lose data. Say which one you are.

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Language | {{TypeScript 5.x}} | |
| Framework | {{Next.js 15, App Router}} | |
| UI | {{React 19}} | |
| Styling | {{Tailwind v4}} | |
| Components | {{shadcn/ui, or a design system — link its rules}} | |
| State | {{server state: X · client state: Y}} | |
| Database | {{Postgres via Supabase}} | |
| Auth | {{Supabase Auth}} | |
| Validation | {{Zod}} | |
| Tests | {{Vitest + Playwright}} | |
| Hosting | {{Vercel}} | |
| Package manager | {{pnpm}} | |

---

## Commands

```bash
{{DEV_CMD}}         # dev server
{{BUILD_CMD}}       # production build
{{TEST_CMD}}        # tests
{{LINT_CMD}}        # lint
{{TYPECHECK_CMD}}   # typecheck
{{CHECKS_CMD}}      # brain integrity checks
```

Before opening a PR, the minimum is: {{LIST_THE_REQUIRED_ONES}}.

---

## Directory map

```
{{FILL_IN — only the directories an agent needs to navigate, with one clause each.
Not a full tree; `ls` produces that. Explain the non-obvious ones.}}

app/                  routes. Server Components by default
  (marketing)/        public pages, no auth
  (app)/              authenticated product
components/
  ui/                 primitives — do not add feature logic here
  <feature>/          feature-scoped, one consumer
lib/
  db/                 repository layer. All queries live here
  auth/               session and permission helpers
  env.ts              the ONLY place process.env is read
```

**Where new code goes:** {{one sentence per common case — a new page, a new endpoint, a shared
component, a new query. This single section prevents most misplacement.}}

---

## Domain vocabulary

Words that mean something specific here, especially where they differ from ordinary usage or
from the database.

| Term | Means | Not to be confused with |
|---|---|---|
| {{Account}} | {{a billing entity, may hold many users}} | {{User}} |
| {{...}} | | |

Include anything where the UI name and the DB name differ. Mismatched vocabulary between code
and conversation is a reliable source of wrong work.

---

## Constraints

Things that are true and non-obvious. Each one an agent could plausibly violate.

- {{e.g. "Free-tier accounts must never trigger the email provider — it bills per send."}}
- {{e.g. "The `legacy_orders` table is read-only; a migration is in progress until Q4."}}
- {{e.g. "All timestamps are UTC in the DB; formatting happens only in the UI layer."}}
- {{e.g. "`/api/v1/**` has external consumers — any response shape change is breaking."}}

---

## Protected areas

Extends `ai/rules/core/guardrails.md § G6`. Editing these requires saying so and getting
approval.

- {{path}} — {{why}}
- {{path}} — {{why}}

---

## Git

| | |
|---|---|
| Integration branch | `{{INTEGRATION_BRANCH}}` |
| Protected | `main`{{, and others}} |
| PR target | `{{INTEGRATION_BRANCH}}`, always |
| Required checks | {{list}} |
| Commit attribution | {{required trailer, or "none"}} |
| Review requirement | {{e.g. one approval before merge}} |

---

## Known issues and debt

Problems already known, so an agent does not "discover" and fix them out of scope.

- {{issue}} — {{status: accepted / tracked in #N / being fixed in branch X}}

---

## Deliberate non-choices

Things that look missing but were decided against. Without this section, an agent helpfully
adds them back.

- {{e.g. "No global state library. Server state plus URL params has been sufficient."}}
- {{e.g. "No barrel files. See `ai/decisions/`."}}
- {{e.g. "No E2E coverage beyond the three critical journeys, by choice."}}
