# Minds and Recursiv plugins for AI coding tools

> **Status: scaffold, not released.** Signing in from Claude Code without a
> stored key is the intended design and has not yet been verified end to end.
> Nothing here is listed in a public directory or registry yet.

Each plugin connects an AI coding tool to one service with a browser sign-in.
No API key is written to any file.

| Plugin | Connects to | Guide |
| :--- | :--- | :--- |
| `minds` | Minds: your context, notifications, posts and search, and everyday social actions | [plugins/minds](plugins/minds/README.md) |
| `recursiv` | Recursiv: tasks, agents, projects, deployments, memory, data and integrations | [plugins/recursiv](plugins/recursiv/README.md) |

They are separate plugins with separate sign-ins. Install either or both.

## Install in Claude Code

```bash
claude plugin marketplace add recursivlabs/agent-plugins
```

```bash
claude plugin install minds@minds-plugins
```

```bash
claude plugin install recursiv@minds-plugins
```

Then run `/mcp` in a session, choose the server and sign in.

## What is in a plugin

A server address and one skill, and nothing else: no hooks, no scripts, no
commands and no stored credentials. Each plugin's guide says which tools the
address offers and what signing in allows.

## Check the plugins

```bash
node scripts/check-plugins.mjs
```

```bash
claude plugin validate --strict .
```

```bash
claude plugin validate --strict ./plugins/minds
```

```bash
claude plugin validate --strict ./plugins/recursiv
```

## Security

See [SECURITY.md](SECURITY.md) to report a problem.

## License

[Apache-2.0](LICENSE).
