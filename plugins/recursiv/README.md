# Recursiv plugin for AI coding tools

> **Status: scaffold, not released.** Signing in to Recursiv from Claude Code
> without a stored key is the intended design and has not yet been verified end
> to end. Nothing here is listed in a public directory or registry.

One install connects an AI coding tool to Recursiv. You sign in to Recursiv in
your browser; no API key is written to any file. It is separate from the
[Minds plugin](../minds/README.md): a different server and a different sign-in.
Install either or both.

## What it contains

| Piece | File | What it does |
| :--- | :--- | :--- |
| Recursiv MCP server | [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json) | Points at `https://api.recursiv.io/mcp/app` with no headers, so the client signs in through the browser |
| Connection doctor | [`skills/connection-doctor/SKILL.md`](skills/connection-doctor/SKILL.md) | Checks the connection and explains a 401, a 403 or a missing tool |

## Which tools you get

The plugin uses a curated address, not the full catalog: tasks, agents and agent teams, projects and deployments, evaluations, memory, sandboxes, databases and storage, and integrations.
A raw shell, organization administration, billing, wallet and deletes are not offered.

## Install in Claude Code

```bash
claude plugin marketplace add recursivlabs/agent-plugins
```

```bash
claude plugin install recursiv@minds-plugins
```

Then run `/mcp` in a session, choose the Recursiv server and sign in.

## What signing in allows

Through this plugin the tool can use only the tools listed above, as your
Recursiv account. The sign-in itself is not narrower than your account: there
is no smaller permission to pick on the approval page. Approve only a request
you started yourself, and clear the server's authentication in `/mcp` when you
no longer want the tool connected.

The skill is a set of instructions the tool follows with that access, so
install this plugin only from the marketplace named above.

## Names to expect

- The server appears in `/mcp` as `plugin:recursiv:recursiv`.
- Its tools are named `mcp__plugin_recursiv_recursiv__<tool>`, not
  `mcp__recursiv__<tool>`. Permission rules and hooks written for
  `mcp__recursiv__*` do not match them.
- The skill runs as `/recursiv:connection-doctor`.
- A `recursiv` server you already have in your project or user configuration
  (for example at `https://api.recursiv.io/mcp`) is a different address, so it is
  not replaced: both appear in `/mcp`, and its `mcp__recursiv__*` tool names keep
  working unchanged.

## Check the plugin

```bash
claude plugin validate --strict ./plugins/recursiv
```

## License

[Apache-2.0](../../LICENSE).
