# Execution Prompt Template

> Instantiate this for any deep-tier task, or when the user asks for a prompt to be drafted.
> Drafting and executing are separate turns — the approval gate sits between them
> (`ai/rules/prompting/interaction-gates.md § Gate 2`).
>
> Every `{{...}}` must be resolved or explicitly marked `{{TODO: ...}}`. Never invent a value
> to make the template look complete — a plausible fabricated constraint is worse than a
> visible hole.

---

## OBJECTIVE

{{One to three sentences: the end state, not the activity.}}

**This task IS:** {{the precise shape of the work — "a targeted fix to X", "a structural
refactor of Y with no behavior change"}}

**This task is NOT:** {{the adjacent work a reader might assume is included — "not a redesign",
"not a broadening into an audit", "not a dependency upgrade"}}

---

## SCOPE

**In:**
- {{file or area}}
- {{file or area}}

**Out:**
- {{explicitly excluded area a reasonable reader might assume was in}}
- {{...}}

If a file not listed here needs to change, stop and report before changing it.

---

## CONTEXT

{{Only what the executor cannot discover: why this is needed now, prior attempts, decisions
already made, a person's stated preference. Omit this section entirely if there is nothing to
say — do not pad it with restated scope.}}

---

## BRANCH

| | |
|---|---|
| Mode | `create-new` (default) / `use-existing` |
| Type | `{{feature\|fix\|refactor\|chore\|data\|...}}` per `ai/rules/git/branching.md` |
| Name | `{{type}}/{{scope}}-{{description}}` |
| Target | `{{INTEGRATION_BRANCH}}` |

`use-existing` requires every condition in `ai/rules/git/branching.md § Reusing an existing branch` to hold.
Work ends at a PR in review state. No merge, no branch deletion.

---

## TASKS

Numbered, ordered, each independently verifiable. One concern each.

1. {{action}} — {{what proves it is done}}
2. {{action}} — {{what proves it is done}}
3. {{action}} — {{what proves it is done}}

A task nobody can verify is a wish, not a task. If a step's completion is a matter of opinion,
split it until it is not.

---

## CONSTRAINTS

- {{what must not change: public API, DB shape, visual output, performance budget}}
- {{approach constraints: "extend the existing service, do not add a new one"}}
- {{"no new dependencies"}}

---

## VALIDATION

Commands to run, with the expected result. The PR reports the **actual** output.

```bash
{{TYPECHECK_CMD}}   # expect: no errors
{{LINT_CMD}}        # expect: no errors
{{TEST_CMD}}        # expect: all pass, N new tests
{{BUILD_CMD}}       # expect: success
```

Manual verification:
- [ ] {{what to click or observe, and what should happen}}

Then run `ai/rules/quality/self-review.md` in full before opening the PR.

---

## DELIVERABLE

- [ ] Branch created per BRANCH
- [ ] Every TASK complete, or explicitly reported as not done with a reason
- [ ] VALIDATION run with real output
- [ ] Self-review complete
- [ ] PR opened against `{{INTEGRATION_BRANCH}}` from `ai/templates/pull-request.md`
- [ ] Gate 3 fired (`ai/rules/prompting/interaction-gates.md`)
