# Documentation & Decisions

> Loaded when writing docs, an ADR, a changelog entry, or when editing the brain itself.

---

## Where things go

| Content | Home |
|---|---|
| How to run, build, deploy this project | `README.md` |
| Architecture, domain vocabulary, directory map, constraints | `ai/project.md` |
| Rules the agent must follow | `ai/rules/**` |
| **Why** a rule or architecture is what it is | `ai/decisions/` (an ADR) |
| Why *this line* is surprising | a code comment |
| What changed in a release | `CHANGELOG.md` |
| How to use a module | its own doc, next to it |

The critical split: **rules state the current rule. ADRs hold the history.** A rule file that
narrates its own evolution ("the aggregate file was retired in May", "this used to live in
X") makes every future agent pay tokens for archaeology it does not need. Write the ADR, link
it once if the reasoning is genuinely load-bearing, and keep the rule file about the rule.

---

## Writing docs

- Write for someone competent who has not seen this code. Not for yourself.
- Lead with what the thing is and when to use it. Not with its history.
- Show the shortest working example before the options.
- State constraints and failure modes. What *cannot* be done is often what a reader needs.
- No marketing language. "Robust", "seamless", "powerful", "simply" — cut all of them.
- **Delete a doc that is wrong.** A stale doc is worse than none: it is trusted and it lies.

Prefer a table to a paragraph, a short example to a long explanation, and a link to a copy.
Never duplicate a fact across two documents — put it in one and link. Two copies drift, and
you will not find out which one is wrong until someone follows the wrong one.

---

## ADRs

Write one when a decision constrains future work and the reasoning is not obvious from the
code: choosing a library or pattern, rejecting an obvious approach, accepting a trade-off,
introducing or changing a convention, deprecating something.

Do not write one for: implementation details, anything reversible in an afternoon, or a
decision the code already states clearly.

- One file per decision: `ai/decisions/NNNN-short-title.md`, numbered sequentially.
- Template: `ai/templates/adr.md`.
- **Immutable once merged.** A decision that changes gets a *new* ADR that supersedes the old
  one, with both linked. Never edit history to look consistent — the record of having changed
  your mind is the most useful part.
- Record what you **rejected** and why. That is the part nobody can reconstruct later, and the
  part that stops the same debate happening again.
- Status: `Proposed` → `Accepted` → `Superseded by NNNN` / `Deprecated`.

---

## Comments

Full policy in `core/conventions.md § Comments`. The rule that matters most here: a comment
explains **why**, never **what**. If you are describing what the next line does, delete the
comment and name things better.

---

## Editing the brain

Changing anything under `ai/` or `.claude/skills/` follows this contract.

### One owner per fact

Every rule lives in exactly one file. If two files need it, one owns it and the other links.
Do not restate a rule "for convenience" — the copy will drift, and a linter that compares two
copies is treating the symptom rather than the disease.

The one deliberate exception: `CLAUDE.md § 2` non-negotiables and the always-load list, which
must survive with nothing else loaded. That file owns them; no rule file restates them.

### Adding a rule file

1. Confirm no existing file owns the topic. Prefer a section in an existing file over a new
   file — more small files is not better disclosure if they all load together anyway.
2. Write it under the right domain folder, ≤ 150 lines.
3. Open with a one-line blockquote: what it covers and when it loads.
4. **Add a row to `CLAUDE.md § 4` rule map.**
5. **Add a trigger to `.claude/skills/brain-router/SKILL.md § Phase 3.**
6. Run `{{CHECKS_CMD}}`.

Steps 4 and 5 are not optional. A rule with no trigger never loads, which is worse than not
writing it — it looks like coverage and provides none.

### Writing a rule that an agent will actually follow

- **Imperative and specific.** "Parse every external input with a schema at the boundary", not
  "input validation is important."
- **Say what is forbidden, not only what is preferred.** A forbidden list is checkable; a
  preference is negotiable under pressure.
- **Give the reason when it changes behavior under ambiguity**, in one clause. An agent that
  knows *why* generalises correctly to the case you did not write down. An agent given a bare
  rule guesses.
- **Show the wrong version next to the right one** for anything commonly done wrong. A single
  bad/good pair outperforms three paragraphs.
- **No history, no changelog, no dated notes.** That is what ADRs are for.
- **No hedging.** "Consider possibly avoiding" is not a rule. Decide, or leave it out.

### Removing a rule

Delete the file, its rule-map row, and its router trigger together. Write an ADR saying why it
went — otherwise it gets re-added by someone who hits the problem it solved. Grep for
references before deleting; a dangling link fails the checks.

### Line budgets

Enforced by `{{CHECKS_CMD}}`. A file over budget means the topic has two subjects, or it is
carrying history that belongs in an ADR. Split along a real seam or move the history out —
never satisfy the number by compressing prose into unreadable density.
