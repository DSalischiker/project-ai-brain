# Interview

The question bank for `create-ai-brain`. Ask in at most three batched rounds of
`AskUserQuestion`. Skip any question Step 1 already answered from the repository.

**Recommend a default in every question, first in the list, marked `(Recommended)`.** Most
users accept defaults; making them choose from scratch on eight axes is how an install stalls.

---

## Round 1 — Identity and workflow

### Q1. What is this project?

Free text, one or two sentences. Ask for what it **is not**, too — that line prevents an agent
building things the user deliberately excluded, and nobody volunteers it unprompted.

If a `README.md` exists, draft it yourself and ask them to correct it.

### Q2. Stage

| Option | Meaning |
|---|---|
| Live product with users **(Recommended when unsure)** | Data loss and downtime are real. Migration ceremony, expand-migrate-contract, cautious defaults |
| Pre-launch, building toward release | Moving fast but the schema is starting to matter |
| Prototype / experiment | Optimise for speed. Skip migration ceremony, lighter testing rules |
| Mature, maintenance mode | Stability over velocity. Stricter blast-radius limits |

This changes which rules are worth their tokens. A prototype carrying migration ceremony reads
as bureaucracy and gets ignored; a live product without it loses data.

### Q3. Git model

| Option | Meaning |
|---|---|
| `main` + `dev`, typed branches, PR to `dev` **(Recommended)** | `main` protected and release-only. Everything targets `dev`. Branches are `feature/`, `fix/`, etc. Agent never merges |
| Trunk-based: short branches off `main` | No `dev`. Short-lived branches, PR to `main`, squash merge. Simpler for small teams on continuous deploy |
| Git-flow with release branches | Adds `release/*` and `hotfix/*` off `main`. For versioned or scheduled releases |
| Match what the repo already does | Detected from `git branch -a` and recent history. Offer this first when detection was confident |

Then confirm: **integration branch name** (`dev`, `develop`, `main`, other) and **which
branches are protected**.

### Q4. Commit convention

| Option | Meaning |
|---|---|
| Conventional Commits **(Recommended)** | `feat(scope): subject`. Machine-readable, enables changelog generation |
| Match existing history | Read `git log --oneline -30` and infer. Offer first if the repo is consistent |
| Plain imperative subjects | `Add invoice export`. No type prefix |

Also ask whether agent-authored commits need an attribution trailer.

---

## Round 2 — Stack and scope

### Q5. Confirm the detected stack

Present what Step 1 found as a table and ask them to correct it. Do not re-ask what
`package.json` already answered.

Gaps worth asking about explicitly, because they are rarely in `package.json`:
- Where server state lives (query library, server components, something custom)
- Where global client state lives, if anywhere
- Whether there is a design system or component library with its own rules
- Whether a public API has external consumers

### Q6. Which rule domains to include? (multi-select)

Map to files per `file-manifest.md`. Pre-select by detection; let them deselect.

| Domain | Include when |
|---|---|
| Prompt improvement **(Recommended)** | Always. It is the cheapest rule in the set and it prevents the most wasted work |
| Git workflow **(Recommended)** | Always, if it is a git repo |
| TypeScript / JS **(Recommended)** | Any TS or JS in the repo |
| React | React is a dependency |
| Next.js App Router | Next.js present with an `app/` directory |
| Node / API | Backend routes, services, or handlers exist |
| Data layer | A database, ORM, or Supabase is present |
| Testing **(Recommended)** | A test runner exists, or the user wants one |
| Self-review **(Recommended)** | Always. It is the highest-value-per-token rule in the brain |
| Security | Auth, payments, user data, or a public API. Recommend whenever any is present |
| Documentation & ADRs **(Recommended)** | Always. It is what keeps history out of rule files |

**Do not include a domain the project does not use.** A React rule in a Vue project teaches the
agent that rules here are approximate, which devalues the ones that do apply.

### Q7. Anything the agent gets wrong repeatedly?

Free text, and the single most valuable question in this interview. The answer becomes either a
guardrail or a `Constraints` entry in `ai/project.md`.

Prompt them concretely, since "anything else?" gets "no": *"Files it puts in the wrong place?
A pattern it keeps reintroducing? Something it always forgets? A library it reaches for that
you have rejected?"*

Also ask what looks missing but was **decided against** — those become
`ai/project.md § Deliberate non-choices`, and without that section an agent helpfully adds them
back.

---

## Round 3 — Process (skip when defaults are accepted)

Only ask these if the user pushed back on defaults in rounds 1–2, or explicitly asked about
process. Otherwise state the defaults you are taking and move on.

### Q8. Routing depth

| Option | Meaning |
|---|---|
| Tiered: fast / standard / deep **(Recommended)** | Trivial edits skip the report. Standard tasks route normally. Deep tasks get a plan and approval. See ADR 0002 |
| Always full routing | Every task classifies and reports. Maximum consistency, higher cost on small work |

### Q9. Interaction gates

| Option | Meaning |
|---|---|
| All three: clarify, approve, close out **(Recommended)** | Structured questions on ambiguity; approval before substantive work; explicit close-out after the PR |
| Approval only | Ask before executing a plan. Judgment elsewhere |
| None | Fully autonomous. Only for throwaway work |

### Q10. Enforcement

| Option | Meaning |
|---|---|
| Docs + check scripts **(Recommended)** | Markdown plus `ai/checks/`: index integrity, router coverage, size budgets, branch names. Zero dependencies, plain Node |
| Docs only | No scripts. Nothing detects a broken pointer or a bloated rule file |
| Docs + checks + CI | Adds a git hook or GitHub Action so violations block. Needs a package manager in the project |

---

## Closing

Before generating, read back:

- The one-sentence project description
- Integration branch and protected branches
- Rule files to create, and the ones you are skipping with a reason each
- Anything you could not resolve, as an explicit `{{TODO}}` you will leave visible

One round of correction, then generate. Do not loop — a third confirmation round means the
questions were wrong, not that the user is undecided.
