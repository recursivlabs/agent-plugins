---
name: connection-doctor
description: Check and repair the connection to the Minds MCP server. Use when Minds tools are missing, the server shows as needing authentication, a Minds tool answers 401 or 403, or the user asks to connect, reconnect or sign in to Minds.
---

# Minds connection doctor

This plugin connects to `https://api.minds.com/mcp/minds`, a curated set of the Minds MCP
server's tools: your context, your notifications, posts, communities and search, plus posting, replying, reacting, reposting and following, which go through an approval step.
Agents, the dispatcher, deployments, billing, wallet, code execution and deletes are not offered here. The full catalog is a different
address, `https://api.minds.com/mcp`, which this plugin does not use.

The connection is a browser sign-in (Sign in, Approve, Connected). No API key
is stored in the plugin, and you never need one for these steps. Do not ask
the user for a key, token, authorization code or callback URL, and do not
print one.

Work down the list and stop at the first step that fails.

## 1. Find which Minds server this session is using

- Installed through this plugin, the server is `plugin:minds:minds` and its
  tools are named `mcp__plugin_minds_minds__<tool>`.
- The project or the user's own configuration may also define a Minds server,
  usually at the full-catalog address. That is a second, separate server with
  its own tool names (for example `mcp__minds__<tool>`), its own tool list and
  its own way of authenticating, possibly a key from an environment variable.
  Say which server a failing tool belongs to before diagnosing further: a 401
  from a keyed entry is a key problem, not a sign-in problem.

## 2. If the server needs authentication

You cannot start the sign-in yourself. Tell the user to run `/mcp`, choose the
Minds server and sign in. The browser opens Minds, they sign in, approve the
connection and return to the app. If the browser does not open, they can copy
the address shown; if the return to the app fails, Claude Code shows its own
sign-in prompt where they can paste the address from the browser's address
bar. That address holds a one-time sign-in code: it goes into that prompt
only, never into the conversation. If the user pastes it to you anyway, do
not repeat it, and tell them to start the sign-in again.

Before they approve, the Minds page names the app asking for access. They
should approve only a request they started themselves, a moment ago, from
this tool.

## 3. Check that Minds is reachable, without credentials

```bash
curl -s -m 15 -o /dev/null -w "%{http_code}\n" https://api.minds.com/.well-known/oauth-protected-resource
```

Expect `200`. Anything else is a network or service problem, not a sign-in
problem: report the status and stop.

## 4. Once it shows connected, prove it with a data read

A connected indicator is not proof. Call `get_my_context`, then one tool
that returns rows the account may read, such as `list_posts` with a small limit.
Report the account it names and whether the read returned rows.

## 5. Read the failure

| Answer | Meaning | Next step |
| :--- | :--- | :--- |
| 401 after signing in | The stored sign-in expired or was revoked | In `/mcp`, clear the server's authentication and sign in again |
| 403 naming an organization or project | The account is signed in but is not a member, or lacks the permission | Ask an administrator of that organization for access. Signing in again does not help |
| A tool is missing | It is outside this plugin's curated set, or the account's permissions do not include it | List the tools the server offers and compare with what the task needs. Do not work around a missing tool with a raw request |

## 6. Report

Say what was wrong, what changed, and whether the user still has a step to
take. If the server is not connected in this session, say so plainly.
