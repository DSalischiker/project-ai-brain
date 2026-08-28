# PR Body Template

> Fill from real data, gathered before writing. Rules and preconditions:
> `ai/rules/git/pull-requests.md`. No placeholders, no unrun checks, no vague verbs alone.
>
> Delete this blockquote and every instruction line when you use it.

---

## Review summary

{{3–5 lines, written LAST. What changed, where, what could break, what was verified. A
reviewer reads only this and decides whether to look closer.}}

## What changed

{{Behavior, not files. What is true after this merges that was not true before. If a user
would notice, say what they will notice.}}

## Why

{{The trigger: the bug report, the requirement, the constraint. One or two sentences. Link the
issue.}}

## Approach

{{Only if the approach is non-obvious or an alternative was rejected. What you chose and what
you did not, and why. Omit this section when the approach is the obvious one.}}

## Files changed

{{From `git diff {{INTEGRATION_BRANCH}} --name-only`. Group by area. One clause each. Note any
file whose presence would surprise a reviewer.}}

- `path/to/file.ts` — {{what changed in it}}

## Risk

**Level:** {{High | Medium | Low}} — per `ai/rules/git/pull-requests.md § Risk`, derived from paths.

**Why:** {{which paths drive the level}}

**What could break:** {{concrete failure modes, not "nothing"}}

**What was checked:** {{what you actually did to show it did not}}

## Verification

{{Only checks you ran. Real results. If something was not run, list it as "not run" and why.}}

- `{{TYPECHECK_CMD}}` — {{result}}
- `{{LINT_CMD}}` — {{result}}
- `{{TEST_CMD}}` — {{result, including new test count}}
- `{{BUILD_CMD}}` — {{result}}
- Manual: {{what you exercised and what you observed}}

## Out of scope

{{Anything you noticed and deliberately did not fix, with one clause on why. Also anything the
task explicitly excluded. If nothing, write "Nothing." — do not delete the section, its
emptiness is information.}}

## Notes for the reviewer

{{Where to look first. Any deliberate rule deviation and its justification. Anything that needs
a decision. Omit if genuinely nothing.}}
