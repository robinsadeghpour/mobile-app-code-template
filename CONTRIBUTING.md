# Contributing

Bug reports and pull requests are welcome.

## Setup

```bash
git clone https://github.com/robinsadeghpour/mobile-app-code-template
cd mobile-app-code-template
yarn install
```

Typechecking, linting and the tests need nothing else. Running the app needs a
Supabase project and Xcode or Android Studio; the README covers both.

## Before you open a pull request

```bash
yarn typecheck && yarn lint && yarn test && yarn format:check
```

CI runs the same four, plus a Deno typecheck of each edge function.

`AGENTS.md` lists the conventions the code follows: where a screen goes, how an
auth action is shaped, how copy and colours are handled. Match them.

## What gets merged

Fixes, and improvements to what is already here.

Features on the [left-out list](README.md#what-it-deliberately-leaves-out)
are left out on purpose: social sign-in, payments, push, analytics and crash
reporting. A pull request that adds one will be closed, however good it is. If
you think the list is wrong, open an issue and make the case first.

## Reporting a security problem

Privately, please. See [SECURITY.md](SECURITY.md).
