# Working in this codebase

Read this before writing anything. It describes where things go and the few
conventions that are load-bearing, so you can edit rather than invent.

## The stack

Expo (React Native) with Expo Router, TypeScript, Supabase for auth and data,
Uniwind for styling, HeroUI Native for components, TanStack Query for server
state, i18n-js for copy.

## Layout

```
src/app/              routes. The file tree is the navigation.
  (public)/           reachable signed out: welcome, sign-in, sign-up,
                      forgot-password, check-email
  (app)/              reachable signed in. (tabs)/ holds the tab screens.
  auth/confirmed.tsx  where confirmation links land
  update-password.tsx where password-reset links land
  _layout.tsx         providers, fonts, the signed-in/out gate
src/components/       ScreenLayout, ScreenTitle, AppButton, ThemeSwitch
  auth/               FormInput and the auth forms
src/hooks/auth/       one hook per auth action
src/provider/         SessionProvider (who is signed in), ThemeProvider
src/lib/              supabase client, storage, logger, zod schemas
src/theme/            light and dark colour tokens
src/i18n/             en and de
supabase/migrations/  the schema
supabase/functions/   Deno edge functions; _utils/ holds what they share
```

## Conventions that matter

**Adding a screen.** Create the file under `src/app`. Signed-in screens go in
`(app)`, signed-out in `(public)`. The route is the path; there is no router
config to update. Wrap the screen in `ScreenLayout`, which owns the background,
safe area, padding and tablet width, and use `ScreenTitle`, `AppButton` and
`FormInput` rather than restyling a heading, button or field.

**Auth actions.** Every one is a hook in `src/hooks/auth` built on
`useAuthMutation`, which handles the loading state, the error toast and the
logging. Follow that shape rather than calling `supabase.auth` from a component.
Each hook returns a function that takes the variables and, optionally, per-call
callbacks: `signUp({ email, password }, { onSuccess })`. It never rejects.

**Data.** Query through TanStack Query. Types come from
`src/lib/db/database.types.ts`, which is generated. Never hand-edit it:

```bash
npx supabase gen types typescript --project-id <id> > src/lib/db/database.types.ts
```

**Every new table needs a row level security policy.** A query that filters by
user id is not security; without a policy, anyone with the anon key can read
every row. Follow the `profiles` policies in the migration.

**Styling.** Tailwind classes via `className`. Colours come from theme tokens
(`text-foreground`, `text-muted`, `bg-background`), never hex values, or dark
mode breaks.

**Copy.** All user-facing strings go through `i18n.t('section.key')` and must
exist in both `en.json` and `de.json`.

**Never edit the first migration** once it has been pushed. Add new ones.

## Checks

```bash
yarn typecheck
yarn lint
yarn test
yarn format:check
```

All four pass on a clean clone. Keep it that way.

## What is not here

No payments, no OAuth, no push, no analytics, no crash reporting. If a task
needs one of those, say so rather than stubbing it: a stub that looks like a
paywall is worse than no paywall.
