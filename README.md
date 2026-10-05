<div align="center">

# Mobile App Code Template

**Everything your app needs before it's an app.**

Sign-in that works, a real database with real row level security, and a build
that runs on both stores. Clone it and start describing what you want.

[![License: MIT](https://img.shields.io/badge/License-MIT-df7228.svg?style=flat-square)](LICENSE)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.8x-20232a?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![CI](https://img.shields.io/github/actions/workflow/status/robinsadeghpour/mobile-app-code-template/ci.yml?branch=main&style=flat-square&label=checks)](https://github.com/robinsadeghpour/mobile-app-code-template/actions/workflows/ci.yml)

[Quickstart](#quickstart) ·
[Set it up with an agent](#set-it-up-with-an-agent) ·
[What's inside](#whats-inside) ·
[Use it from Claude or ChatGPT](#use-it-from-claude-or-chatgpt)

<img src=".github/assets/starter.gif" alt="Clone the template, install, and the tests pass" width="860">

</div>

---

## Why this exists

Every app starts with the same three weeks. Accounts, a database, a theme, a
build that a store will accept. None of it is the thing you wanted to make, and
all of it has to be right before anyone can use what you did want to make.

This is those three weeks, done, under MIT. It is deliberately not a kitchen
sink: [what it leaves out](#what-it-deliberately-leaves-out) is as considered as
what it includes.

## Quickstart

> **Prerequisites.** Node 20+, Yarn, and a free [Supabase](https://supabase.com)
> account. To run the app on a simulator you also need Xcode (iOS) or Android
> Studio (Android). Cloning, typechecking and the tests need neither.

```bash
git clone https://github.com/robinsadeghpour/mobile-app-code-template my-app
cd my-app
yarn install
cp .env.example .env
```

Create a project at [supabase.com](https://supabase.com), then from
**Settings → API** copy the project URL and the anon key into `.env`.

Both are safe on the client. The anon key is public by design; row level
security is what protects the data, not the key.

Push the schema and run it:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
npx supabase functions deploy delete-account
yarn ios          # or: yarn android
```

Then open `config.js` and set your app name, scheme, bundle identifier and
package name.

> [!WARNING]
> `iosBundleIdentifier` and `androidPackageName` are **permanent** once an app is
> published. You cannot rename them later, only ship a new listing. Decide them
> before your first submission, not after.

## Set it up with an agent

If you'd rather not do the above by hand, paste this into Claude, Claude Code,
Cursor, or any agent with terminal access. It takes you from nothing to a
running app and stops to ask you only for the things it cannot know.

<details open>
<summary><b>Copy this prompt</b></summary>

```text
You are setting up a React Native app for me from a template. I may be new to
mobile development, so explain each step in one sentence before you run it, and
stop when you need something only I can give you.

The template is https://github.com/robinsadeghpour/mobile-app-code-template

Work in this order and do not skip ahead.

1. CHECK THE MACHINE
   Report the versions of node, yarn and git. Node must be 20 or higher.
   Check whether Xcode (macOS) or Android Studio is installed, and tell me
   plainly which platforms I can run on. If neither is installed, say so and
   carry on: everything except running the app still works.

2. GET THE CODE
   Clone the template into a folder named after my app, then run `yarn install`.
   Do not run the app yet.

3. PROVE IT IS INTACT BEFORE CHANGING ANYTHING
   Run `yarn typecheck` and `yarn test`. Both should pass. If a test fails on
   this first run, re-run it once before you investigate, because the suites
   are slow and can time out on a cold cache.
   Do not continue to step 4 until these pass.

4. ASK ME FOR THE THINGS YOU CANNOT KNOW
   Stop and ask me for all of these in one message:
     - The app's display name
     - A URL scheme: lowercase, no spaces, unique to this app
     - A bundle identifier, like com.mycompany.myapp. Tell me this is
       permanent once published and cannot be changed later
     - Whether I already have a Supabase project, or need to make one
   Wait for my answer.

5. SUPABASE
   If I need a project, walk me through creating one at supabase.com and tell
   me exactly where to find the project URL and the anon key
   (Settings -> API). Have me paste them, then write them into .env yourself.
   Never print the keys back to me in full.
   Then link the project, push the schema and deploy the function that
   deletes accounts:
     npx supabase link --project-ref <ref>
     npx supabase db push
     npx supabase functions deploy delete-account
   Confirm afterwards that the `profiles` table exists and has row level
   security enabled. If it does not, stop and tell me, because every later
   problem will trace back to this.

6. CONFIGURE THE APP
   Edit config.js with the answers from step 4. Change nothing else in it.
   Re-run `yarn typecheck` to confirm the edits are clean.

7. RUN IT
   Run `yarn ios` or `yarn android` depending on what step 1 found. The first
   build compiles native code and takes a long time; tell me that before you
   start it so I do not think it has hung.

8. TEST THE PART THAT IS USUALLY BROKEN
   Walk me through, one at a time, and confirm each before the next:
     a. Sign up with a real address I can open
     b. Open the confirmation link from the email on the same device, and
        confirm the app opens and I end up signed in
     c. Sign out, then sign back in
     d. Request a password reset and complete it from the email link
     e. Delete the account from the profile screen
   Step b and d are deep links, and they are the most common thing to be
   silently broken. If either does nothing, check the `scheme` in config.js
   matches the redirect URLs configured in Supabase, and say so rather than
   guessing at the code.

9. REPORT
   Tell me what works, what does not, and what I should decide next. Do not
   add features. Do not install packages I did not ask for.

Before writing any code of your own in this project, read AGENTS.md in the
repo root. It describes the conventions this codebase already uses. Match them
rather than introducing your own.
```

</details>

## What's inside

| | |
|---|---|
| **Accounts** | Sign up, sign in, email confirmation, password reset, change password, sign out |
| **Deep links** | The links in confirmation and reset mail open the app and become a session. This is the part that usually silently doesn't work |
| **Account deletion** | From inside the app, a real delete rather than a deactivate. Both stores require it and most templates skip it |
| **Database** | Supabase with a `profiles` table, created by a trigger on signup, and row level security policies. An actual policy, not a query that happens to filter |
| **Storage** | An avatars bucket where each user can write only their own file |
| **Theming** | Light, dark or system, switched from the profile screen. Every colour is a token in one CSS file |
| **Navigation** | Expo Router, with a tab layout and protected routes |
| **Types** | TypeScript throughout, with database types generated from the schema |
| **Tests** | Jest suites covering the auth flows, deep links and session handling, run in CI on every pull request |
| **Agent docs** | `AGENTS.md` and `CLAUDE.md`, so an agent working in the repo already knows its conventions |

### What it deliberately leaves out

- **Social sign in.** Each provider needs its own console setup and redirect
  handling, and Apple's becomes mandatory the moment you offer any other one
- **Payments and paywalls.** Entitlement belongs on a server, and that decision
  deserves to be made on purpose
- **Push notifications.** Needs a paid Apple account, a certificate, and a real
  device before anything can be tested
- **Analytics and crash reporting.** Vendor choices that are easier to add than
  to remove

Three of those four cannot even be tested without a paid developer account. They
are left out so you add them deliberately, not so you discover them halfway
through.

## Project structure

```
src/
  app/              Expo Router. A file here is a screen.
    (app)/(tabs)/   Signed in: home and profile
    (public)/       Signed out: welcome, sign in, sign up
  components/       Screen layout, title, button, and the auth forms
  hooks/
    auth/           One hook per auth action
  provider/         SessionProvider, ThemeProvider
  lib/              Supabase client, storage helpers, logger
  theme/            Light and dark colour tokens
supabase/
  migrations/       Schema, RLS policies, signup trigger, avatars bucket
  functions/        The edge function that deletes an account
config.js           App name, scheme, bundle id. The only file you must edit
```

## Scripts

| Command | What it does |
|---|---|
| `yarn start` | Expo dev server |
| `yarn ios` / `yarn android` | Build and run natively |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn lint` | ESLint over `src` and edge functions |
| `yarn test` | Jest |
| `yarn format` | Prettier. `yarn format:check` only reports |

### Checks

```bash
yarn typecheck && yarn lint && yarn test && yarn format:check
```

All four pass on a fresh clone. The test suites are slow, and on a cold cache a
first run can time out; re-run before investigating.

## Use it from Claude or ChatGPT

There's a free MCP server that plans an app before you build it: describe an
idea and it tells you which parts belong in version one, which to defer, and
which not to build at all, with the screens, data model and build order.

```
https://www.native.express/mcp
```

Setup for Claude, Claude Code and ChatGPT is in
**[docs/ai-connectors.md](docs/ai-connectors.md)**.

## FAQ

<details>
<summary><b>Do I need to know React Native?</b></summary>

No. The point of `AGENTS.md` is that an agent can work in here without you
knowing the conventions first. You will learn them by reading what it changes.
</details>

<details>
<summary><b>Is the anon key really safe in the app?</b></summary>

Yes. It identifies the project, not a user, and it is designed to ship to
clients. What protects your data is row level security, which is why the
migrations turn it on for every table. Never ship the *service role* key.
</details>

<details>
<summary><b>Can I use npm or pnpm instead of Yarn?</b></summary>

Yes, though the committed lockfile is Yarn's. Delete `yarn.lock` and install
with your package manager of choice if you prefer.
</details>

<details>
<summary><b>Why is the first native build so slow?</b></summary>

It compiles every native dependency from source. Ten to twenty minutes is
normal. Later builds reuse that work and take seconds.
</details>

<details>
<summary><b>The confirmation email link does nothing.</b></summary>

Almost always the `scheme` in `config.js` not matching the redirect URLs set in
Supabase under **Authentication → URL Configuration**. Fix that before touching
any code.
</details>

## Versions and support

Releases are tagged `vX.Y.Z`, and `package.json` carries the same number, so a
clone records which release it started from. Each release tracks one Expo SDK,
currently 57, and the release notes say when that changes.

Only the latest release gets fixes. Support is best-effort, through issues.

## Contributing

Issues and pull requests are welcome. [CONTRIBUTING.md](CONTRIBUTING.md) has the
setup, the checks to run and what gets merged. Report security problems
privately, as [SECURITY.md](SECURITY.md) describes.

## Licence

[MIT](LICENSE). Use it for anything, including commercial work. No attribution
required.
