# Project Overview

`gh-book-reader` is a web application that allows users to read books hosted as Markdown files on GitHub. Users can enter a repository URL, navigate its file tree, and read `.md` files directly in the browser.

## MVP Flow

1. **Initial Screen:** A simple input field to paste a GitHub repository URL (e.g., `https://github.com/cezaraugusto/You-Dont-Know-JS`).
2. **File Navigation:** Once a repo is loaded, a sidebar displays the repository's file tree.
   - Only `.md` files are interactive.
   - The navigation uses the GitHub Tree API.
3. **Reading Experience:** Clicking a `.md` file fetches its content via the GitHub Blob API and displays it in the main content area.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **API Integration:** [GitHub REST API](https://docs.github.com/en/rest)
- **Markdown Rendering:** (To be decided - likely `react-markdown`)

## Architecture

- `src/app/`: Contains the application's routes and layouts.
- `src/components/`: Reusable UI components (Sidebar, Reader, RepoInput).
- `src/lib/`: API client and utility functions for interacting with GitHub.
- `src/types/`: TypeScript definitions for GitHub API responses and application state.

# Building and Running

## Prerequisites

- Node.js (Version recommended by Next.js 16)
- npm, yarn, pnpm, or bun

## Commands

- **Development Server:** `npm run dev` (Starts the server at `http://localhost:3000`)
- **Production Build:** `npm run build`
- **Start Production Server:** `npm run start`
- **Linting:** `npm run lint`

# Development Conventions

## Code Style

- **TypeScript:** Use strict typing and prefer interfaces for component props.
- **Components:** Use functional components with React Hooks.
- **Styling:** Use Tailwind CSS utility classes directly in JSX. Follow the established container and typography patterns seen in `src/app/page.tsx`.
- **Formatting:** Adhere to the project's ESLint configuration (`eslint.config.mjs`).

## File Naming

- Routes: Use `page.tsx` within folders under `src/app/`.
- Layouts: Use `layout.tsx` for shared UI across routes.
- Components: Use PascalCase for component files (e.g., `BookCard.tsx`).
- Utilities/Hooks: Use camelCase (e.g., `useBookData.ts`).

## Testing

- _TODO:_ No testing framework is currently configured. When adding tests, prefer [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit/integration tests, or [Playwright](https://playwright.dev/) for E2E tests.
