# Agent Instructions

The instructions for this repository live in **[`CLAUDE.md`](./CLAUDE.md)**. Read it now,
before doing anything else.

It is agent-agnostic despite the filename — nothing in it is specific to Claude Code. This
file exists only so tools that look for `AGENTS.md` find their way in. It is deliberately a
pointer and holds no rules of its own, so the two can never disagree.

## If your tool cannot load skills

`CLAUDE.md § 3` tells you to invoke the `brain-router` skill. If your tool has no skill
mechanism, read the skill file directly as a normal markdown document and follow it:

```
.claude/skills/brain-router/SKILL.md
```

Everything it does is plain instructions and file reads. Nothing about the routing procedure
depends on the skill mechanism.
