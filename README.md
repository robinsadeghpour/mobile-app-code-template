# Mobile app code template

Everything your app needs before it's an app. Sign-in, a real database, and a
working build for iOS and Android. Clone it and start describing what you want.

Built with Expo and React Native, in TypeScript.

## What's already done

**Accounts that work.** Sign up, sign in, email confirmation, password reset,
change password, sign out. The links in confirmation and reset mail open the app
and become a session, which is the part that usually silently doesn't work.

**A real database behind it.** Supabase with a `profiles` table, created
automatically when someone signs up, and row level security so a user can read
and write only their own row. Not a query that happens to filter. An actual
policy.

**Account deletion.** From inside the app, deleting rather than deactivating.
Both stores require this and most templates skip it.

**Theming.** Light and dark generated from one seed colour. Change the seed,
the whole app changes.

**The build.** iOS and Android, EAS profiles for development, preview and
production.

**Tests.** 43 of them, covering the auth flows and the session handling.

## Getting started

```bash
git clone https://github.com/robinsadeghpour/mobile-app-code-template.git my-app
cd my-app
yarn install
cp .env.example .env
```

Create a free Supabase project at supabase.com. It takes about a minute. From
**Settings → API**, copy the project URL and the anon key into `.env`.

Both are safe in the client. The anon key is public by design; row level
security is what protects the data, not the key.

Then push the schema:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

And run it:

```bash
yarn start
```

Open `config.js` and set your app name, bundle identifier and package name.
Those last two are permanent once an app is published, so decide them before
your first submission rather than after.

## What's deliberately not here

**No Google or Apple sign-in.** Email auth only. If you offer any social login,
Apple requires Sign in with Apple too, so this is a pair of things to add
together rather than one.

**No payments.** No RevenueCat, no paywall, no entitlement checking. This is the
part that takes the longest to get right, and the part where getting it wrong
means either giving the product away or charging someone twice.

**No push, analytics or crash reporting.**

Saying that plainly because a template that quietly stubs the expensive parts
costs you more time than one that admits what it doesn't do. You'd find out in
week two either way.

If your app has no accounts and sells nothing, you don't need this. Use
`create-expo-app` and an afternoon will beat it.

## The paid version

The pieces above are in [NativeExpress](https://www.native.express), along with
AI features, the store submission guides, Figma listing templates and agent
skills for this codebase. Same conventions and the same folder layout, so
moving across is adding modules rather than switching template.

## Support

Use this as a template. Open an issue and I'll read it, though I'll be honest
that support is for customers.

Pull requests are welcome for bugs. I'm unlikely to merge new features, because
a free template that grows features is a free template that stops being
maintained.

## Licence

MIT. Fork it into a different shape if this one is wrong for you.
