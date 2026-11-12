# Security

## Report a problem

Report it privately through this repository's **Security** tab ("Report a
vulnerability"). Please do not open a public issue for a security problem, and
never include a key, token or sign-in code in a report.

## What these plugins can do

A plugin here holds a server address and a skill, which is a set of
instructions an AI tool follows. After you sign in, the tool acts as your
account through the tools that address offers. For that reason:

- Install only from this repository (`recursivlabs/agent-plugins`).
- Approve a sign-in only when you started it yourself, a moment ago.
- No plugin here stores or asks for an API key. A copy that does is not ours.

## How changes are checked

Every pull request and every push to the default branch is checked for valid
plugin manifests, for files that could run, for credential headers and for
server addresses other than the two approved ones.
