# Security

This template handles sign-in, sessions and row level security, so a flaw here
ends up in every app built from it. Reports are taken seriously.

## Reporting a vulnerability

Report it privately through GitHub:
[open a security advisory](https://github.com/robinsadeghpour/mobile-app-code-template/security/advisories/new).
Please do not open a public issue for it.

Include what you found, how to reproduce it, and which tag or commit you tested.
We aim to reply within a week. Once a fix is released, the advisory is
published and credits you unless you ask otherwise.

## What counts

- Anything that lets one user read or change another user's data, whether
  through the `profiles` policies or the `avatars` storage policies
- Session or token handling: storage on the device, the email deep links, the
  `delete-account` edge function
- A secret that ends up in the client bundle or in this repository

The anon key in `.env` is public by design and is not a finding. Row level
security is what protects the data.

## Supported versions

Only the latest release gets fixes. An app you built from an older clone is
yours to patch; the release notes say what changed.
