#!/usr/bin/env node
'use strict';

// Installs the socratic-method Agent Skill into every AI tool that reads the
// Agent Skills format (agentskills.io) - not just one of them.
//
// Every path in TOOLS was read out of that tool's own documentation. A wrong
// directory does not fail loudly; it copies files nowhere useful and the skill
// silently never loads. So: no path goes in here unverified, and the installer
// always prints exactly what it wrote. Keep TOOLS and the README in sync.

const fs = require('fs');
const os = require('os');
const path = require('path');

const PKG_ROOT = path.join(__dirname, '..');
const SKILL_FILES = ['SKILL.md', 'references', 'assets', 'LICENSE'];
const REPO = 'github.com/ergini/socratic-method';

// Two directories carry almost the whole ecosystem: `.agents/skills` is the
// cross-agent path (Codex, Cursor, VS Code, Gemini, Windsurf, Amp, Roo), and
// Claude Code is the notable tool that reads only its own. Writing both is what
// makes the bare `npx socratic-method` work everywhere instead of in one tool.
const UNIVERSAL = ['.agents/skills', '.claude/skills'];

// project/global: the tool's own directory, relative to the repo root or to
// $HOME. `global: null` means the tool genuinely documents no personal skills
// directory, so we refuse --global there rather than invent a path.
// reads:   shared directories the tool ALSO discovers skills from, per its docs.
//          Listed conservatively - claiming coverage that does not exist is the
//          one error that produces a silent no-op.
// markers: directories that betray the tool is in use, checked in the project
//          and in $HOME. Only consulted for tools the universal pair misses.
const TOOLS = {
  claude: {
    label: 'Claude Code',
    project: '.claude/skills',
    global: '.claude/skills',
    reads: [],
    markers: ['.claude'],
  },
  codex: {
    label: 'Codex',
    project: '.agents/skills',
    global: '.agents/skills',
    reads: [],
    markers: ['.codex', '.agents'],
  },
  cursor: {
    label: 'Cursor',
    project: '.cursor/skills',
    global: '.cursor/skills',
    reads: ['.agents/skills', '.claude/skills'],
    markers: ['.cursor'],
  },
  vscode: {
    label: 'VS Code / Copilot',
    project: '.github/skills',
    global: '.copilot/skills',
    reads: ['.agents/skills', '.claude/skills'],
    markers: ['.copilot'],
  },
  gemini: {
    label: 'Gemini CLI',
    project: '.gemini/skills',
    global: '.gemini/skills',
    reads: ['.agents/skills'],
    markers: ['.gemini'],
  },
  windsurf: {
    label: 'Windsurf',
    project: '.windsurf/skills',
    global: null, // documents only project and /etc/windsurf/skills
    reads: ['.agents/skills', '.claude/skills'],
    markers: ['.windsurf', '.codeium'],
  },
  amp: {
    label: 'Amp',
    project: '.agents/skills',
    global: '.config/amp/skills',
    reads: ['.agents/skills', '.claude/skills'],
    markers: ['.config/amp'],
  },
  opencode: {
    label: 'OpenCode',
    project: '.opencode/skills',
    global: '.config/opencode/skills',
    reads: [], // reads ~/.agents and ~/.claude globally, but not at project scope
    markers: ['.opencode', '.config/opencode'],
  },
  roo: {
    label: 'Roo Code',
    project: '.roo/skills',
    global: '.roo/skills',
    reads: ['.agents/skills'],
    markers: ['.roo'],
  },
  kiro: {
    label: 'Kiro',
    project: '.kiro/skills',
    global: '.kiro/skills',
    reads: [],
    markers: ['.kiro'],
  },
  factory: {
    label: 'Factory Droid',
    project: '.factory/skills',
    global: '.factory/skills',
    reads: [],
    markers: ['.factory'],
  },
};

// --- color: on only for a real terminal, off when piped / NO_COLOR / dumb ------
function colorOn(stream) {
  const forced = process.env.FORCE_COLOR;
  if (forced) return forced !== '0' && forced !== 'false';
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

  With no options it installs for ${out.bold('every')} AI tool that reads the Agent Skills
  format - Claude Code, Codex, Cursor, VS Code / Copilot, Gemini CLI, Windsurf,
  Amp, Roo Code and others - plus any additional tool it detects on this machine.

  Options:
    --tool <name>   install for one tool only (${Object.keys(TOOLS).join(', ')})
    --all, -a       cover every known tool, not only the ones detected here
    --global, -g    install into your home dir, for every project
    --dir <path>    install into <path>/socratic-method, ignoring --tool
    --list, -l      show the directory each tool reads, and exit
    --help, -h      show this

  Examples:
    npx socratic-method                    # every tool, this project
    npx socratic-method --global           # every tool, every project
    npx socratic-method --tool cursor      # ./.cursor/skills
    npx socratic-method --all --global     # every tool's own dir, in ~
    npx socratic-method --dir ./skills     # ./skills/socratic-method
`);
}

function list() {
  const rows = Object.keys(TOOLS).map((key) => {
    const t = TOOLS[key];
    return [key, t.label, t.project, t.global ? '~/' + t.global : '-'];
  });
  const width = (i) => Math.max(...rows.map((r) => r[i].length));
  const [w0, w1, w2] = [width(0), width(1), width(2)];
  console.log(`\n  ${out.bold('tool'.padEnd(w0))}  ${out.bold('name'.padEnd(w1))}  ${out.bold('project'.padEnd(w2))}  ${out.bold('global')}`);
  for (const [key, label, project, global] of rows) {
    console.log(`  ${out.cyan(key.padEnd(w0))}  ${label.padEnd(w1)}  ${project.padEnd(w2)}  ${out.dim(global)}`);
  }
  console.log(`\n  ${out.dim('Most tools also read ' + UNIVERSAL.join(' and ') + ', which is why the')}`);
  console.log(`  ${out.dim('default install writes those two and adds only what they miss.')}\n`);
}

function parseArgs(argv) {
  const opts = { tool: null, all: false, global: false, dir: null, help: false, list: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--list' || a === '-l') opts.list = true;
    else if (a === '--all' || a === '-a') opts.all = true;
    else if (a === '--global' || a === '-g') opts.global = true;
    else if (a === '--force' || a === '-f') continue; // accepted for compatibility; re-running always overwrites
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

// A tool is in use if one of its marker dirs sits in the project or in $HOME.
function isPresent(tool) {
  const roots = [process.cwd(), os.homedir()];
  return tool.markers.some((m) => roots.some((r) => fs.existsSync(path.join(r, m))));
}

// Which relative directories to write, for the chosen scope.
function planDirs(opts, scope) {
  if (opts.tool) {
    const t = TOOLS[opts.tool];
    if (!t) fail(`unknown --tool "${opts.tool}". Choose one of: ${Object.keys(TOOLS).join(', ')}.`);
    if (!t[scope]) {
      fail(`${t.label} documents no global skills directory (it is project-scoped). Install into a project (drop --global) or pass --dir <path>.`);
    }
    return [t[scope]];
  }

  const dirs = new Set(UNIVERSAL);
  for (const key of Object.keys(TOOLS)) {
    const t = TOOLS[key];
    const own = t[scope];
    if (!own || dirs.has(own)) continue;
    if (t.reads.some((r) => dirs.has(r))) continue; // already reachable via a dir we are writing
    if (opts.all || isPresent(t)) dirs.add(own);
  }
  return [...dirs];
}

// Every tool that will find the skill once `dir` exists.
function servedBy(dir, scope) {
  return Object.keys(TOOLS)
    .filter((k) => TOOLS[k][scope] === dir || TOOLS[k].reads.includes(dir))
    .map((k) => TOOLS[k].label);
}

function install(base, rel) {
  const dest = path.join(base, rel, 'socratic-method');
  const existed = fs.existsSync(dest);
  fs.mkdirSync(dest, { recursive: true });
  for (const name of SKILL_FILES) {
    const src = path.join(PKG_ROOT, name);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(dest, name), { recursive: true, force: true });
  }
  return { dest, existed };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return help();
  if (opts.list) return list();

  // Guard: make sure we are running from an intact package.
  if (!fs.existsSync(path.join(PKG_ROOT, 'SKILL.md'))) {
    fail('could not find SKILL.md next to the installer. The package looks incomplete.');
  }

  const scope = opts.global ? 'global' : 'project';
  const base = opts.global ? os.homedir() : process.cwd();

  const results = opts.dir
    ? [{ ...install(path.resolve(opts.dir), ''), tools: ['custom directory'] }]
    : planDirs(opts, scope).map((rel) => ({ ...install(base, rel), tools: servedBy(rel, scope) }));

  const verb = results.every((r) => r.existed) ? 'updated' : 'installed';
  const width = Math.max(...results.map((r) => prettyPath(r.dest).length));

  const lines = [
    '',
    `  ${out.greenBold('✓')} ${out.bold('socratic-method')} ${out.dim('· ' + verb)}`,
    '',
  ];
  for (const r of results) {
    lines.push(`    ${out.cyan(prettyPath(r.dest).padEnd(width))}  ${out.dim('·  ' + r.tools.join(', '))}`);
  }
  lines.push(
    '',
    `    Your agent will now cross-examine its own work before it ships,`,
    `    ${out.dim('activating when you debug, plan, or touch something irreversible.')}`
  );
  if (!opts.dir) {
    lines.push(`    ${out.dim('Most tools also let you invoke it with')} ${out.cyan('/socratic-method')}${out.dim('.')}`);
  }
  lines.push('', `    ${out.dim('→ ' + REPO)}`, '');
  console.log(lines.join('\n'));
}

main();
