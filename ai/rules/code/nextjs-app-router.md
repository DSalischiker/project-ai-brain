# Next.js App Router

> Loaded for anything under `app/`, plus server actions, route handlers, middleware, caching
> and metadata. Assumes `typescript.md` and `react.md` are loaded.

---

## Server by default

Every component in `app/` is a Server Component unless a `'use client'` directive puts it on
the client. **Server is the default and the goal** — it ships no JS, reads data directly, and
keeps secrets on the server.

Add `'use client'` only for: hooks (`useState`, `useReducer`, `useEffect`, `useContext`),
event handlers, browser APIs, or a client-only third-party library.

### Push the boundary down

The mistake is marking a page `'use client'` because one button needs state. Instead, keep the
page a Server Component and extract the interactive part into its own client component.

```
app/dashboard/page.tsx          server — fetches data, composes
  └─ filter-bar.tsx             'use client' — owns the interactive state
  └─ metric-card.tsx            server — pure rendering
```

A `'use client'` directive is transitive: everything imported into that module lands in the
client bundle. One badly-placed directive can pull a data library into the browser.

Server Components can render client ones. A client component cannot import a server one — pass
server-rendered output as `children` instead.

Props crossing the boundary must be serialisable. No functions, no class instances, no `Date`
in a way you depend on, no `Symbol`.

---

## File conventions

| File | Purpose |
|---|---|
| `page.tsx` | The route. Default export required |
| `layout.tsx` | Shared shell. Does **not** re-render on navigation within it |
| `template.tsx` | Like layout, but remounts per navigation. Use only when you need that |
| `loading.tsx` | Suspense fallback for the segment |
| `error.tsx` | Error boundary. Must be a client component |
| `not-found.tsx` | 404 for the segment |
| `route.ts` | API endpoint. Never in the same segment as a `page.tsx` |

Keep `page.tsx` thin: fetch, compose, delegate. Business logic goes in `lib/` or a service, not
in a page.

Colocate freely — a `_components/` or `components/` folder inside a route segment is correct
for things only that route uses. Private folders prefixed `_` are never routable.

---

## Data fetching

**Fetch in the component that needs the data**, not at the top and then drill props. React
dedupes identical requests within a render pass, so two components fetching the same thing cost
one request.

- `async` Server Components fetch directly — call your DB or service, no API layer in between
  for your own data.
- Never call your own route handler from a Server Component. That is a network round trip to
  yourself.
- Independent fetches run in parallel (`Promise.all`) — a sequential chain of awaits creates a
  request waterfall, and this is the most common App Router performance bug.
- Stream slow sections with `<Suspense>` rather than blocking the whole page.
- Client-side fetching is for data that changes after load: mutations, polling,
  infinite scroll. Use the project's query library, never bare `useEffect` + `fetch`.

`params` and `searchParams` are async — `await` them.

---

## Mutations — server actions

Server actions are the default way to mutate. A `'use server'` function is a public HTTP
endpoint: **anyone can call it with any arguments.**

Therefore every action, without exception:

1. **Authenticates.** Get the session inside the action. Never trust a userId passed as an
   argument.
2. **Authorises.** Check this user may act on this resource. Being logged in is not permission.
3. **Validates** every input with a schema. Arguments arrive from the network.
4. **Revalidates** — `revalidatePath` or `revalidateTag` — or the UI shows stale data.
5. **Returns a serialisable result.** Never throw raw errors to the client; return a typed
   `{ ok: false, error }` shape.

Skipping any of the first three is a vulnerability, not a style issue. See `quality/security.md`.

---

## Caching

Caching defaults change between Next.js versions. **Read the version in `package.json` and
verify against the docs for that version rather than assuming.** Getting this wrong causes
either stale data in production or no caching at all, and both are silent.

What holds regardless:
- Be explicit about intent — per-request or cached, with a stated revalidation strategy.
- **Any fetch that depends on the current user must not be cached across users.** This is a
  data-leak class of bug, the worst outcome in this file.
- After a mutation, revalidate the affected paths or tags. Every time.
- Reading cookies or headers opts a route out of static rendering. That is expected, not a bug
  to work around.

State the caching choice in the PR body when a route's behavior changes.

---

## Runtime

**Default to the Node.js runtime.** Do not reach for the edge runtime — it has real API
compatibility gaps, and modern Vercel Fluid Compute runs Node in the same regions at the same
price, with instance reuse that removes most cold-start cost. Middleware supports full Node.js
too.

Only pin a different runtime with a stated reason. "Edge is faster" is not one.

---

## Routing

- Route groups `(marketing)` organise without affecting the URL.
- Dynamic segments `[id]`, catch-all `[...slug]`, optional `[[...slug]]`.
- Parallel routes `@slot` and intercepting routes `(.)` are powerful and confusing — use only
  when a modal-over-route or a genuine multi-pane layout requires them, and comment why.
- `<Link>` for internal navigation, always. `router.push` only from a handler.
- URL search params are the right home for shareable UI state: filters, tabs, pagination, sort.
  Not `useState`.

---

## Metadata and assets

- Export `metadata` or `generateMetadata` from every page. No page ships without a title.
- `next/image` for images — always with `width`/`height` or `fill`, and `priority` on the LCP
  image only.
- `next/font` for fonts. Never a `<link>` to a font CDN; it costs a render-blocking round trip.

---

## Forbidden

`'use client'` on a `layout.tsx` or `page.tsx` that does not itself need hooks · fetching your
own route handlers from the server · secrets in a `NEXT_PUBLIC_` variable · a server action
without auth, authorisation, and validation · sequential awaits for independent data ·
`useEffect` data fetching for initial page data · mutating without revalidating ·
`export const runtime = 'edge'` without a documented reason.
