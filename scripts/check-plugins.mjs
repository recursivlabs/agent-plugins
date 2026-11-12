// Content rules for this repository. A plugin here may hold a server address
// and skills, and nothing that runs or carries a credential.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const ALLOWED_SERVERS = {
  minds: 'https://api.minds.com/mcp/minds',
  recursiv: 'https://api.recursiv.io/mcp/app',
};
const ALLOWED_PLUGIN_KEYS = new Set([
  'name',
  'displayName',
  'version',
  'description',
  'author',
  'homepage',
  'repository',
  'license',
  'keywords',
  'mcpServers',
  'icon',
  'privacyPolicyUrl',
]);
const ALLOWED_FILES = [
  /^README\.md$/,
  /^\.claude-plugin\/plugin\.json$/,
  /^\.claude-plugin\/icon\.png$/,
  /^skills\/[a-z0-9-]+\/SKILL\.md$/,
];
const SECRET_SHAPES = [
  /sk_(live|test)_[A-Za-z0-9]/,
  /eyJ[A-Za-z0-9_-]{20,}\./,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /xox[abp]-[A-Za-z0-9-]{10,}/,
];
// Zero-width and direction-changing characters can hide instructions in a skill.
const HIDDEN = /[​-‏‪-‮⁠-⁩﻿]/;
const SKIP_DIRS = new Set(['.git', 'node_modules']);

const problems = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP_DIRS.has(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const slash = (path) => path.split(sep).join('/');

for (const plugin of readdirSync(join(ROOT, 'plugins'))) {
  const dir = join(ROOT, 'plugins', plugin);
  const where = `plugins/${plugin}`;

  for (const file of walk(dir)) {
    const rel = slash(relative(dir, file));
    if (!ALLOWED_FILES.some((re) => re.test(rel))) {
      problems.push(`${where}/${rel}: this kind of file is not allowed in a plugin`);
    }
  }

  const manifest = JSON.parse(readFileSync(join(dir, '.claude-plugin', 'plugin.json'), 'utf8'));
  if (manifest.name !== plugin) problems.push(`${where}: manifest name is "${manifest.name}"`);
  for (const key of Object.keys(manifest)) {
    if (!ALLOWED_PLUGIN_KEYS.has(key)) problems.push(`${where}: plugin.json key "${key}" is not allowed`);
  }

  const servers = manifest.mcpServers ?? {};
  if (typeof servers !== 'object' || Array.isArray(servers)) {
    problems.push(`${where}: mcpServers must be written inline as an object`);
    continue;
  }
  if (Object.keys(servers).length !== 1 || !servers[plugin]) {
    problems.push(`${where}: expected exactly one server, named "${plugin}"`);
  }
  for (const [name, server] of Object.entries(servers)) {
    const extra = Object.keys(server).filter((key) => key !== 'type' && key !== 'url');
    if (extra.length) problems.push(`${where}: server "${name}" has extra keys: ${extra.join(', ')}`);
    if (server.type !== 'http') problems.push(`${where}: server "${name}" must be type http`);
    if (ALLOWED_SERVERS[name] !== server.url) {
      problems.push(`${where}: server "${name}" does not use its approved address`);
    }
  }
}

for (const file of walk(ROOT)) {
  const rel = slash(relative(ROOT, file));
  if (rel === 'LICENSE' || rel.endsWith('.png')) continue;
  const text = readFileSync(file, 'utf8');
  // This file names the patterns it looks for.
  if (rel !== 'scripts/check-plugins.mjs') {
    if (SECRET_SHAPES.some((re) => re.test(text))) problems.push(`${rel}: contains something shaped like a credential`);
    if (HIDDEN.test(text)) problems.push(`${rel}: hidden or direction-changing character`);
  }
  if (/http:\/\/(?!localhost|127\.0\.0\.1)/.test(text.replace(/http:\\\/\\\//g, ''))) {
    problems.push(`${rel}: plain http address`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('plugin content rules: clean');
