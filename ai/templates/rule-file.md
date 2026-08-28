# Rule File Template

> Copy when adding a rule to `ai/rules/**`. Contract:
> `ai/rules/docs/documentation.md § Editing the brain`.
>
> **Two steps are mandatory and easy to forget:** add a row to `CLAUDE.md § 4` and a trigger to
> `.claude/skills/brain-router/SKILL.md § Phase 3`. A rule with no trigger never loads.
>
> Budget: ≤ 150 lines. Delete this blockquote when you use it.

---

# {{Rule Domain}}

> {{One line: what this covers and when it loads. This is the only context an agent has when
> deciding whether to read further, so make it a filter, not a summary.}}

---

## {{Section}}

{{Imperative and specific. "Parse every external input with a schema at the boundary" — not
"input validation is important".

State the reason in one clause when it changes behavior under ambiguity. An agent that knows
why generalises to the case you did not write down; an agent given a bare rule guesses.

No history. No dated notes. No "this used to be X". That is what ADRs are for.}}

- {{Rule as an instruction}}
- {{Rule as an instruction}}

### Wrong / right

Include a pair for anything commonly done wrong. One pair beats three paragraphs.

```ts
// no — {{what goes wrong, in a few words}}
{{code}}

// yes
{{code}}
```

## {{Section}}

Use a table when the rule is a mapping — situation to action. It is denser than prose and much
harder to misread.

| Situation | Do this |
|---|---|
| {{...}} | {{...}} |

---

## Forbidden

{{A closing forbidden list, where the domain has one. Forbidden lists are checkable;
preferences are negotiable under pressure, so state the hard boundaries explicitly.

Separate with `·` to keep it dense.}}

{{thing}} · {{thing}} · {{thing}}

---

<!--
Before opening the PR:
  [ ] ≤ 150 lines
  [ ] Opening blockquote says what it covers and when it loads
  [ ] Every rule is imperative, not a preference
  [ ] No fact here is also stated in another rule file
  [ ] No history, no changelog, no dated notes
  [ ] Row added to CLAUDE.md § 4
  [ ] Trigger added to brain-router SKILL.md § Phase 3
  [ ] {{CHECKS_CMD}} passes
Delete this comment.
-->
