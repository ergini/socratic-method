#!/usr/bin/env node
'use strict';

// Installs the socratic-method Agent Skill into your agent's skills directory.
// Zero dependencies. The tool -> directory map below is the one verified in the
// README's install section; keep the two in sync.

const fs = require('fs');
const os = require('os');
const path = require('path');

const PKG_ROOT = path.join(__dirname, '..');
const SKILL_FILES = ['SKILL.md', 'references', 'assets', 'LICENSE'];
const REPO = 'github.com/ergini/socratic-method';

// Verified skill-discovery directories per tool. `global` is null where the tool
// has no global/personal skills directory (Cursor and Windsurf are project-only),
// so we refuse --global there rather than invent a path.
const TOOLS = {
  claude:   { label: 'Claude Code', project: '.claude/skills',   global: '.claude/skills' },
  cursor:   { label: 'Cursor',      project: '.cursor/skills',   global: null },
  windsurf: { label: 'Windsurf',    project: '.windsurf/skills', global: null },
  codex:    { label: 'Codex CLI',   project: '.agents/skills',   global: '.agents/skills' },
};

// Tools whose users invoke a skill with a slash command.
const SLASH_TOOLS = new Set(['claude', 'cursor']);

// --- color: on only for a real terminal, off when piped / NO_COLOR / dumb ------
function colorOn(stream) {
  if (process.env.FORCE_COLOR) return true;
  if (process.env.NO_COLOR || process.env.TERM === 'dumb') return false;
  return Boolean(stream && stream.isTTY);
}
function painter(on) {
  const wrap = (code) => (str) => (on ? `\x1b[${code}m${str}\x1b[0m` : String(str));
  return {
    bold: wrap('1'), dim: wrap('2'), red: wrap('31'),
    green: wrap('32'), cyan: wrap('36'), greenBold: wrap('1;32'),
  };
}
const out = painter(colorOn(process.stdout));
const err = painter(colorOn(process.stderr));

// Shorten a path for display: ./relative when under cwd, ~/… when under home.
function prettyPath(p) {
  const rel = path.relative(process.cwd(), p);
  if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) return '.' + path.sep + rel;
  const home = os.homedir();
  if (p === home) return '~';
  if (p.startsWith(home + path.sep)) return '~' + path.sep + path.relative(home, p);
  return p;
}

function help() {
  console.log(`
  ${out.bold('socratic-method')} - install the self-questioning Agent Skill

  Usage:
    npx socratic-method [options]

  Options:
    --tool <name>   claude (default) | cursor | windsurf | codex
    --global, -g    install into your home dir (every project); claude & codex only
    --dir <path>    install into <path>/socratic-method, ignoring --tool
    --force, -f     overwrite an existing install without asking
    --help, -h      show this

  Examples:
    npx socratic-method                    # ./.claude/skills  (this project)
    npx socratic-method --global           # ~/.claude/skills  (every project)
    npx socratic-method --tool cursor      # ./.cursor/skills
    npx socratic-method --tool codex -g    # ~/.agents/skills
    npx socratic-method --dir ./skills     # ./skills/socratic-method
`);
}

function parseArgs(argv) {
  const opts = { tool: 'claude', global: false, dir: null, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--global' || a === '-g') opts.global = true;
    else if (a === '--force' || a === '-f') opts.force = true;
    else if (a === '--tool' || a === '-t') opts.tool = (argv[++i] || '').toLowerCase();
    else if (a === '--dir' || a === '-d') opts.dir = argv[++i];
    else if (a.startsWith('--tool=')) opts.tool = a.slice(7).toLowerCase();
    else if (a.startsWith('--dir=')) opts.dir = a.slice(6);
    else if (!a.startsWith('-') && TOOLS[a.toLowerCase()]) opts.tool = a.toLowerCase();
    else { console.error(`Unknown argument: ${a}\nRun with --help for usage.`); process.exit(2); }
  }
  return opts;
}

function fail(msg) {
  console.error(`\n  ${err.red('socratic-method:')} ${msg}\n`);
  process.exit(1);
}

function resolveBase(opts) {
  if (opts.dir) return path.resolve(opts.dir);
  const tool = TOOLS[opts.tool];
  if (!tool) fail(`unknown --tool "${opts.tool}". Choose one of: ${Object.keys(TOOLS).join(', ')}.`);
  if (opts.global) {
    if (!tool.global) fail(`${tool.label} has no global skills directory (it is project-scoped). Install into a project (drop --global) or pass --dir <path>.`);
    return path.join(os.homedir(), tool.global);
  }
  return path.join(process.cwd(), tool.project);
}

function report({ dest, verb, label, showSlash }) {
  const lines = [
    '',
    `  ${out.greenBold('✓')} ${out.bold('socratic-method')} ${out.dim('· ' + verb)}`,
    `    ${out.cyan(prettyPath(dest))}  ${out.dim('·  ' + label)}`,
    '',
    `    Your agent will now cross-examine its own work before it ships,`,
    `    ${out.dim('activating when you debug, plan, or touch something irreversible.')}`,
  ];
  if (showSlash) lines.push(`    ${out.dim('Invoke it directly with')} ${out.cyan('/socratic-method')}${out.dim('.')}`);
  lines.push('', `    ${out.dim('→ ' + REPO)}`, '');
  console.log(lines.join('\n'));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { help(); return; }

  // Guard: make sure we are running from an intact package.
  if (!fs.existsSync(path.join(PKG_ROOT, 'SKILL.md'))) {
    fail('could not find SKILL.md next to the installer. The package looks incomplete.');
  }

  const dest = path.join(resolveBase(opts), 'socratic-method');
  const verb = fs.existsSync(dest) ? 'updated' : 'installed'; // re-running is how you update

  fs.mkdirSync(dest, { recursive: true });
  for (const name of SKILL_FILES) {
    const src = path.join(PKG_ROOT, name);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(dest, name), { recursive: true, force: true });
  }

  report({
    dest,
    verb,
    label: opts.dir ? 'custom directory' : TOOLS[opts.tool].label,
    showSlash: !opts.dir && SLASH_TOOLS.has(opts.tool),
  });
}

main();
