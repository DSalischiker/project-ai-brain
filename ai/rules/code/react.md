# React

> Loaded when authoring or changing a component, hook, or client-side state. Assumes
> `typescript.md` is loaded. Next.js server/client boundary rules are in
> `nextjs-app-router.md`.

---

## Before writing a component

1. **Does it already exist?** Search by what it renders, not by name. `core/guardrails.md § G3`.
2. **Can an existing one take a variant or a prop?** Extending beats forking.
3. **Does it belong in `components/` at all?** One consumer → keep it local to the feature.
   Promote to shared on the second consumer, not in anticipation of one.

Never write a component from memory when the project has a design system or component
library — read its rule or its source first.

---

## Structure

One component per file, file named for the export. Order inside the file:

```
imports
types (props first)
the component
  1. hooks — all of them, unconditionally, at the top
  2. derived values
  3. handlers
  4. early returns (loading, error, empty)
  5. the happy-path JSX
sub-components used only here (or a sibling file if > ~40 lines)
```

Early returns before the main JSX. A component whose entire body is one ternary chain is
unreadable — split the states.

---

## Props

- **Explicit props, not `...rest` spreading into a DOM element** — except for genuine
  primitive wrappers, where spreading is the point.
- No boolean prop explosion. Three booleans is eight states, most nonsense. Use a union:
  `variant: 'primary' | 'ghost'`, not `isPrimary` + `isGhost`.
- **Never take a prop only to pass it down two levels.** Either compose with `children`, or the
  child should read it from context itself.
- Prefer `children` over a `content` prop. Composition beats configuration.
- No prop named `data`, `props`, `config`, or `options` without saying what of.
- Required by default. Optional props need a sensible default at the destructure.
- **Never accept `className` to let callers override internal layout** in a design-system
  component, unless the project's rules explicitly allow it. It defeats the system.

---

## State

**Least powerful mechanism that works**, in this order:

| Need | Use |
|---|---|
| Derivable from props or other state | **Nothing — derive it in render** |
| Local to one component | `useState` |
| Several fields changing together | one `useState` object, or `useReducer` |
| Complex transitions with rules | `useReducer` |
| Shared by a subtree, changes rarely | `useContext` |
| Server data | the project's data layer (`data-layer.md`) — never `useState` + `useEffect` |
| Should survive a refresh or be shareable | URL search params |
| Truly global client state | the project's store, named in `ai/project.md` |

**Do not store derived state.** `const total = items.reduce(...)` in render, never a `total`
state synced by an effect. Synced-derived-state is the single most common React bug.

Colocate state with the lowest component that needs it. Lifting state higher than necessary
re-renders siblings for no reason.

---

## Effects

**Most effects you are about to write are wrong.** An effect is for synchronising with
something outside React: a subscription, a DOM API, a timer, an imperative library.

**Not for:** deriving values, transforming props, resetting state on a prop change (use `key`),
fetching data in a framework that fetches on the server, or "running something after render."

Rules when you do need one:
- Complete dependency array. Never suppress the lint rule — restructure instead.
- Every subscription, timer, and listener returns a cleanup function.
- One concern per effect. Two unrelated things in one effect run on each other's deps.
- Guard against setting state after unmount on async work.

---

## Hooks

- All hooks at the top, unconditional. Never in a condition, loop, or after an early return.
- Extract a custom hook when stateful logic is used twice, or when a component's hook block
  obscures what it renders. Not for a one-off.
- A custom hook returns data and actions, not JSX. Name it for what it gives you:
  `useActiveUser`, not `useUserLogic`.
- Custom hooks obey every hook rule, transitively.

---

## Performance

**Measure before optimising.** Correctness first; unnecessary memoisation adds code, adds
dependency-array bugs, and costs its own comparison.

Legitimate `useMemo` / `useCallback` / `memo`:
- The value is a dependency of an effect or a memoised child and would break referential
  equality every render.
- A genuinely expensive computation (large list transform, parse) on every render.
- A profiler showed the problem.

Illegitimate: wrapping every handler by habit; memoising a primitive; memoising an object
whose consumer does not care about identity.

Real wins first, in order: fix unnecessary re-renders by colocating state · stable `key`s
(never an array index for a reorderable list) · virtualise long lists · lazy-load heavy
subtrees · move work to the server.

---

## Accessibility

Non-negotiable, not a follow-up ticket:
- Semantic elements. A `div` with `onClick` is not a button — it has no keyboard, no focus, no
  role.
- Every input has a label. `placeholder` is not a label.
- Keyboard reachable and operable: focus visible, tab order sane, `Escape` closes overlays,
  focus trapped in modals and returned on close.
- Images have `alt`; decorative ones have `alt=""`.
- Never convey state by colour alone.
- ARIA only when semantics cannot express it. Wrong ARIA is worse than none.

---

## Forbidden

`useEffect` for derived state · index as `key` in a reorderable list · state mutation
(`items.push(x)` then `setItems(items)`) · `dangerouslySetInnerHTML` without sanitising ·
inline object or arrow props to a memoised child · a component over 300 lines with no seam
named · nested ternaries in JSX · business logic in JSX (extract to a named value above).
