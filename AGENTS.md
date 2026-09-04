<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- Use npm; `package-lock.json` is the only lockfile. Install with `npm ci`.
- Run `npm run dev`, `npm run lint`, `npm run build`, and `npm run start`; `start` requires a completed build.
- Lint one file with `npm run lint -- <path>`.
- Type-check with `npx next typegen && npx tsc --noEmit`; route code uses generated `PageProps`, so plain `tsc` can miss or lack route types.
- No test runner or repository CI workflow is configured.

## Architecture

- The route pages are `src/app/page.tsx` and `src/app/reader/[owner]/[repo]/page.tsx`; `src/app/layout.tsx` mounts the global query provider.
- `src/api/github/` contains TanStack Query hooks, not Route Handlers. They call GitHub REST directly from the browser without authentication, so the current flow is for public repositories and is subject to anonymous API limits.
- `ReaderContent` coordinates repository metadata, the recursive tree at `HEAD`, and file content. Selection is stored in `?file=<path>`; the sidebar only enables lowercase `.md` blobs.
- Query persistence is configured per query through `localStorage` in `src/components/Providers.tsx`, with individual `staleTime` values and a 24-hour persistence/GC limit.
- `Reader` rewrites relative Markdown links into reader URLs and relative images into `raw.githubusercontent.com` URLs.

## Framework Constraints

- Dynamic route `params` are asynchronous in this Next version; keep awaiting them.
- Keep the Suspense boundary around `ReaderContent` while it uses `useSearchParams` on the reader route.
- `Reader` is loaded client-only with `dynamic(..., { ssr: false })`; preserve that boundary unless deliberately redesigning rendering.
- Tailwind CSS 4 configuration is CSS-first in `src/app/globals.css`; do not introduce Tailwind 3-style `tailwind.config.*` conventions.
- Repository Markdown enables raw HTML through `rehypeRaw` without a sanitization plugin. Treat renderer or trust-boundary changes as security-sensitive.

## Tooling Traps

- ESLint enforces no semicolons, but `.prettierrc` does not set `semi: false`; do not run broad `prettier --write` until those policies are reconciled.
- README architecture and tooling notes are stale: Markdown rendering is implemented, content uses GitHub's Contents API with the raw media type, API hooks live in `src/api/github/`, and no test framework is selected.
