# Authoring Spec

Fallback for when no AI Brain source tree is available locally. States what each file must
cover and the house style, so a generated brain matches a copied one.

This is a spec, not the content. Write the rules for the project in front of you.

---

## House style

Every rule file:

1. **Opens with a one-line blockquote**: what it covers and when it loads. This is the only
   context an agent has when deciding whether to read on — make it a filter, not a summary.
2. **Is imperative and specific.** "Parse every external input with a schema at the boundary",
   not "input validation is important."
3. **States the reason in one clause** where it changes behavior under ambiguity. An agent that
   knows why generalises to the case you did not write; an agent given a bare rule guesses.
4. **Ends with a `## Forbidden` list** where the domain has hard boundaries. Forbidden lists are
   checkable; preferences are negotiable under pressure.
5. **Shows wrong next to right** for anything commonly done wrong. One pair beats three
   paragraphs.
6. **Contains no history**, no dated notes, no "this used to be". That goes in an ADR.
7. **Uses tables for mappings** — situation to action. Denser than prose and harder to misread.
8. **≤ 150 lines.**

Never hedge. "Consider possibly avoiding" is not a rule. Decide, or leave it out.

---

## `CLAUDE.md`

Sections, in order: project table · non-negotiables · router entry point with the tier table and
always-load block · rule map table · how to edit the brain.

- **Non-negotiables** must hold with nothing else loaded: language policy, branch protection,
  no secrets, scope discipline, no-convention-from-memory, no unapproved merge, honest
  reporting.
- **Rule map** is a table of domain, path, and load-when. It lists only rules that exist.
- It owns no domain rules and duplicates nothing from a rule file.
- ≤ 140 lines.

## `AGENTS.md`

A pointer to `CLAUDE.md` and a note on reading the router file directly when the tool has no
skill mechanism. No rules — a pointer cannot disagree with its target.

## `ai/project.md`

What the codebase cannot tell you. Sections: what it is (including what it is **not**) · stage ·
stack · commands · directory map with *where new code goes* · domain vocabulary · constraints ·
protected areas · git settings · known issues · deliberate non-choices.

The two sections that pay for themselves: **where new code goes** (prevents most misplacement)
and **deliberate non-choices** (stops an agent helpfully re-adding what you rejected).

## Router skill

Phases: readiness check → tier → classify → load → report → pre-flight invariants → re-route
command.

- All routing in one file. Do not split it across two documents.
- Trigger tables in two forms: **by file path** (least ambiguous — "the task touches `app/**`")
  and **by condition**.
- The report must include what was **skipped and why**. That line is what proves routing
  happened rather than guessing, and it is where a user catches a missing rule.
- Forbid file-first reasoning: no reading source before the report exists.
- ≤ 220 lines.

---

## Rule files by domain

**`core/guardrails.md`** — numbered hard constraints, each with allowed / forbidden: scope,
blast radius with expected file counts per task shape, reuse-before-creation, no speculative
structure, wrappers must earn existence, protected areas, find-the-callers, verify-before-claim,
report-uncertainty. Close with the enforcement priority order.

**`core/conventions.md`** — naming table by kind · file size budgets · comments (why not what) ·
edit workflow · imports and module boundaries · error handling · dead code · user-facing copy.

**`prompting/prompt-improvement.md`** — first: is improvement even needed (would two developers
build different things?). Then the gap taxonomy — outcome, scope, trigger, constraint, shape,
done-condition, prior art — with the instruction to resolve from the codebase before asking. Then
how to ask (batched, structured, max four, never block on what you can proceed past). Then the
restatement shape, where `Out of scope` is the highest-value line.

**`prompting/interaction-gates.md`** — three gates, each with precondition, required action,
exclusions: clarify · approve (Go / Adjust / Hold / Drop) · close out (review / merge / merge and
clean up / keep working). Plus a recovery clause for a missed gate, and a note that gates are
behavioral because asking cannot be enforced by a hook.

**`git/branching.md`** — the model with `main` protected · `<type>/<scope>-<description>` format ·
type table · validation rules with a bad/good table · lifecycle · when reusing a branch is
allowed · rebase and force-push restrictions.

**`git/commits.md`** — format · body guidance with a worked example · granularity (what to split,
what to keep together) · never-commit list · bad-message table · amending.

**`git/pull-requests.md`** — preconditions · title · body from real `git diff` data · the
no-placeholders and no-fabricated-verification rules · review summary · risk table derived from
paths · size guidance · handling reviewer comments · keeping the body current.

**`code/typescript.md`** — typing discipline (`any`, casts, non-null) · type design (make illegal
states unrepresentable, derive don't duplicate, no enums) · validate at the boundary · functions ·
async (parallel awaits, no await-in-loop, timeouts) · data handling · forbidden list.

**`code/react.md`** — before writing a component · file structure and ordering · props · a state
table from least to most powerful · effects (most are wrong, and why) · hooks · performance
(measure first) · accessibility · forbidden list.

**`code/nextjs-app-router.md`** — server by default and pushing the boundary down · file
conventions · data fetching and avoiding waterfalls · server actions **must** authenticate,
authorise, validate, revalidate · caching (verify against the installed version; never cache
per-user data across users) · runtime (default Node, do not reach for edge) · routing · metadata
and assets · forbidden list.

**`code/node-api.md`** — the three layers and what each must not know · the ordered handler shape
(authenticate → validate → authorise → delegate → shape → map errors) · validation · status code
table · error design · side effects and idempotency · external calls with timeouts ·
configuration parsed once · forbidden list.

**`code/data-layer.md`** — schema and constraints in the database · indexes · migrations
(forward-only, expand-migrate-contract, destructive needs approval) · queries (repository layer,
no N+1, transactions, always paginate) · the ORM or platform in use. For Supabase: **RLS on
every table** and the `service_role` key never reaching a client. Seeds. Forbidden list.

**`quality/testing.md`** — what to test and what not to · the four levels and their weighting ·
how to write one (one reason to fail, name the case, assert outcomes not mechanisms, no logic in
tests) · mocking minimally · coverage is a tool not a target · what to do when a test fails, and
never delete or skip to go green.

**`quality/self-review.md`** — a checklist run on `git diff`, grouped: scope · leftovers ·
correctness (error paths, every state rendered) · blast radius · security · rules followed ·
verification · the reviewer's view. Close with an honesty clause: unverified is unchecked.

**`quality/security.md`** — secrets (and what to do on finding one committed) · authentication
versus authorisation, and never trusting client identity · input with a sink-to-requirement table ·
data exposure · sessions and tokens · dependencies · a pre-PR checklist · what to do on finding a
vulnerability.

**`docs/documentation.md`** — a where-things-go table · writing docs · ADRs (when, immutability,
record what was rejected) · comments · **editing the brain**: one owner per fact, the three edits
adding a rule requires, how to write a rule an agent will follow, how to remove one, line
budgets.

---

## Checks

Four checks, plain Node ESM, no dependencies: dangling pointers · rule files with no trigger ·
line budgets · branch name validity. A shared `lib.mjs` and a `run-all.mjs` that exits non-zero.

They verify the brain is **wired**, not that its rules are **wise**. Write them for the failures
that otherwise go unnoticed for months, and do not try to lint judgment.
