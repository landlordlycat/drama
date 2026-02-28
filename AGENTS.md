# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js 16 + TypeScript app using the App Router.

- `app/`: route groups and pages (`(main)` for public pages, `(auth)/dashboard` for admin UI, `app/api` for API routes).
- `components/`: shared UI and feature components (`components/ui` contains reusable shadcn-style primitives).
- `lib/`: services, utilities, and shared types (`lib/services`, `lib/types`).
- `db/`, `auth-schema.ts`, `drizzle.config.ts`, `drizzle/`: database client and schema/migration config.
- `public/`: static assets.
- `styles/`: global styles.
- `design/`: reference design assets (not runtime code).

## Build, Test, and Development Commands
Use `pnpm` (lockfile is `pnpm-lock.yaml`).

- `pnpm dev`: run local dev server.
- `pnpm build`: create production build.
- `pnpm start`: run production server from build output.
- `pnpm lint`: run ESLint checks.
- `pnpm exec tsc --noEmit`: run TypeScript type-check (recommended before PR).

If PowerShell blocks `pnpm.ps1`, run via `cmd /c pnpm <command>`.

## Coding Style & Naming Conventions
- Language: TypeScript (`.ts`/`.tsx`), React function components.
- Indentation: 2 spaces; keep files UTF-8 and prefer ASCII content unless needed.
- Components: `PascalCase` exports; route/component files commonly use `kebab-case` (e.g., `category-manager.tsx`).
- Keep business logic in `lib/` or dedicated hooks; keep route files focused on composition/data loading.
- Run `pnpm lint` before committing.

## Testing Guidelines
There is currently no formal test framework configured (no Jest/Vitest/Playwright setup).

For now:
- Run `pnpm lint` and `pnpm exec tsc --noEmit`.
- Manually verify affected flows in both public routes and dashboard pages.
- For UI changes, include before/after screenshots in PRs.

## Commit & Pull Request Guidelines
Follow Conventional Commit style seen in history:
- `feat(scope): ...`
- `fix(scope): ...`
- `refactor(scope): ...`

PRs should include:
- clear summary of behavior changes,
- linked issue/task (if available),
- validation steps (commands run + manual checks),
- screenshots for visible UI updates.

## Security & Configuration Tips
- Store secrets in `.env`; never commit credentials.
- Keep `.env.example` updated when adding new environment variables.
- Validate API changes under `app/api/admin/*` carefully; these routes affect dashboard operations.
