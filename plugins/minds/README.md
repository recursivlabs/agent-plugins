# Minds plugin for AI coding tools

> **Status: scaffold, not released.** Signing in to Minds from Claude Code
> without a stored key is the intended design and has not yet been verified end
> to end. Nothing here is listed in a public directory or registry.

One install connects an AI coding tool to Minds. You sign in to Minds in your
browser; no API key is written to any file.

## What it contains

| Piece | File | What it does |
| :--- | :--- | :--- |
| Minds MCP server | [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json) | Points at `https://api.minds.com/mcp/minds` with no headers, so the client signs in through the browser |
| Connection doctor | [`skills/connection-doctor/SKILL.md`](skills/connection-doctor/SKILL.md) | Checks the connection and explains a 401, a 403 or a missing tool |

## Which tools you get

The plugin uses a curated address, not the full catalog: your context, your notifications, posts, communities and search, plus posting, replying, reacting, reposting and following, which go through an approval step.
Agents, the dispatcher, deployments, billing, wallet, code execution and deletes are not offered.

## Install in Claude Code

```bash
claude plugin marketplace add recursivlabs/agent-plugins
```

```bash
claude plugin install minds@minds-plugins
```

Then run `/mcp` in a session, choose the Minds server and sign in.

## What signing in allows

Through this plugin the tool can use only the tools listed above, as your
Minds account. The sign-in itself is not narrower than your account: there
is no smaller permission to pick on the approval page. Approve only a request
you started yourself, and clear the server's authentication in `/mcp` when you
no longer want the tool connected.

The skill is a set of instructions the tool follows with that access, so
install this plugin only from the marketplace named above.

## Names to expect

- The server appears in `/mcp` as `plugin:minds:minds`.
- Its tools are named `mcp__plugin_minds_minds__<tool>`, not `mcp__minds__<tool>`.
  Permission rules and hooks written for `mcp__minds__*` do not match them.
- The skill runs as `/minds:connection-doctor`.
- A `minds` server you already have in your project or user configuration
  (for example at `https://api.minds.com/mcp`) is a different address, so it is
  not replaced: both appear in `/mcp`, and its `mcp__minds__*` tool names keep
  working unchanged.

## Check the plugin

```bash
claude plugin validate --strict ./plugins/minds
```

```bash
claude plugin validate --strict .
```

## Other tools

The skill is a plain `SKILL.md` file with `name` and `description`, which is
also the format Codex reads. A Codex package for this plugin is not included
yet.

## License

[Apache-2.0](../../LICENSE).
