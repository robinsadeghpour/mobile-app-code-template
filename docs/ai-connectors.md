# Using this template from Claude or ChatGPT

There's a free MCP server at `https://www.native.express/mcp` that plans a mobile
app before you build it. You describe an idea in your own words and it answers
the question that's hard to answer yourself: which parts belong in version one,
which to defer until somebody is using it, and which not to build at all, with
the reasoning attached so you can argue with it. It also hands over this
template with the commands to get it running.

It needs no account and no sign in. Two of its tools are part of a paid product
and say so when you reach them; the planning tools are free.

- **Server URL:** `https://www.native.express/mcp`
- **Transport:** streamable HTTP
- **Auth:** none

---

## Claude

Two ways in. The plugin is the better one, because it also installs the skills
that tell Claude *when* to reach for the tools and what to do with the answers.
A connector on its own leaves Claude to work that out from tool names.

### As a plugin (recommended)

Covers claude.ai, the desktop and mobile apps, Cowork, and Claude Code from one
install.

**Claude Code:**

```
/plugin marketplace add robinsadeghpour/native-express-plugin
/plugin install native-express
```

**claude.ai and Cowork:** go to **Customize → Plugins → Add → Add marketplace**,
enter the repository URL, install the plugin, then open its **Connectors** tab
and connect the bundled connector.

You get two skills alongside the connector:

- `plan-a-mobile-app`, which fires when you describe an app you want to build
- `ship-to-the-stores`, which covers what App Store and Play Store review
  actually rejects. It works offline and needs no connector at all

### As a connector only

**claude.ai, Desktop, mobile:** **Settings → Connectors → Add custom connector**,
then paste the server URL. Leave authentication empty.

**Claude Code:**

```bash
claude mcp add --transport http native-express https://www.native.express/mcp
```

Check it with `/mcp`, which should show it connected.

### Try it

Start a normal conversation and describe something:

> I want to build an app where people log their runs and share them with friends

Claude should reach for the planner on its own. If it answers from its own
knowledge instead, ask directly: *"use the native-express connector to scope
this"*.

---

## ChatGPT

ChatGPT reaches remote MCP servers through **Developer mode**. A few things are
worth knowing before you start, because they're the usual reasons this doesn't
work:

- It needs a **paid plan**. Plus, Pro, Business, Enterprise or Edu. Developer
  mode and custom connectors are not on the free tier
- It connects to **remote HTTPS servers only**, never local stdio ones. This
  server is remote, so that's fine
- OpenAI has moved these settings more than once. If the path below doesn't
  match what you see, look for "Developer mode" under **Settings → Connectors**,
  **Apps & Connectors**, or **Security and login**

### Setup

1. Open **Settings → Apps & Connectors** and turn on **Developer mode**
2. Choose **Create**, or **Add → Create MCP App**
3. Name it `NativeExpress`
4. **Server URL:** `https://www.native.express/mcp`
5. Leave authentication as none
6. Run **Scan tools**. You should see five, three of them free
7. Save

### Try it

In a new chat, enable the connector for that conversation, then describe an app
idea the same way. If ChatGPT doesn't pick the tool up, name it: *"use the
NativeExpress app to scope this"*.

---

## What the tools do

| Tool | Needs a key | What it's for |
|---|---|---|
| `scope_mobile_app` | no | Turns an app idea into a first version: build now, defer, don't build, plus screens, data model and build order |
| `get_starter_template` | no | This repo, what it includes, what it leaves out, and the commands to run it |
| `list_build_prompts` | no | Titles of the prompt library for working in a React Native codebase with an agent |
| `get_build_prompt` | yes | The full text of one of those prompts |
| `unlock_paid_tools` | no | Emails a buyer their key |

## What gets sent

The app idea you describe, and nothing else. No conversation history, no file
contents, and nothing from your machine. `unlock_paid_tools` sends an email
address so it can be checked against purchase records; it answers the same way
whether or not that address has bought anything.

## Troubleshooting

**The connector won't connect.** Check the URL ends in `/mcp` with no trailing
slash. Confirm the server is up:

```bash
curl -sS -X POST https://www.native.express/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H 'MCP-Protocol-Version: 2025-06-18' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"you","version":"1"}}}'
```

You should get back `"serverInfo":{"name":"native-express",...}`.

**It connects but never uses the tools.** Ask for them by name once. Models pick
tools from the description, and a first message that doesn't sound like a build
request often won't trigger one.

**A tool says it needs a key.** That's one of the two paid tools. The free
planning tools don't, and the template this repo holds doesn't either.
