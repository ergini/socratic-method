# Socratic

**A skill that makes your AI agent cross-examine its own work before it ships.**
When it commits to a plan, a diagnosis, a refactor, or a confident claim, it
turns Socratic elenchus inward: name the load-bearing assumption, then refute it
against something outside its own head - run it, test it, grep the real source,
construct a counterexample - before building on it. The spine is
**predict-then-run**: commit an expected result, then check, and treat the gap
as the finding.

It is a portable [Agent Skill](https://agentskills.io) (a single `SKILL.md` plus
references). It works in Claude Code, Cursor, Windsurf, Codex, and any other tool
that reads the format.

---

## Why this and not "just reflect more"

Because "reflect more" does not work, and the research is blunt about it: an
agent that only doubts *itself*, with no external signal, is net neutral-to-
negative on reasoning - it grades its own homework, shares its own blind spots,
and talks correct answers into wrong ones about as often as the reverse. Telling
a model to "be more careful" mostly buys you longer, more confident
rationalizations.

So the skill is built on one rule, not a vibe:

> **Every self-question must terminate in an external verdict - a run, a test,
> the type checker, a constructed counterexample, the real source - or it gets
> dropped, not narrated.**

Coding is the ideal home for it because the interpreter is a truth oracle the
agent can query cheaply. Instead of arguing itself into a fix, it commits a
prediction ("the top stack frame is a null-pointer in `render`"), runs the
repro, and lets the gap redirect the work. The doubt is empirical, not
introspective.

---

## Read this first: it stays out of the way

The most common way a "more careful AI" fails is by turning every task into a
ceremony. This one is gated, and the default is speed.

- **Trivial work** (a rename, a format, a fact it knows) gets **zero** extra
  scrutiny. Skipping the loop there is the correct move, not laziness.
- **Normal work** gets **one** prediction-backed check on the single riskiest
  assumption, then ships.
- **High-stakes / irreversible work** (a migration, a delete, a prod deploy)
  gets the full loop - and because you cannot safely run the real action, it
  tests a *surrogate*: a dry-run, a transaction it rolls back, a staging clone,
  a canary.
- **Incidents** get exactly one fast reversibility-and-blast-radius check, then
  action. No philosophy while production is down.

And it is **mostly silent**. The cross-examination happens in the agent's
reasoning; you see the result - a plan it changed because a check moved it, or a
decision only you can make - not a play-by-play of it doubting itself. If your
transcript fills up with "let me question myself," the skill is failing, not
working.

And it is smart about which questions are yours. Facts get checked: an API shape
or a config default is a grep, not a question. Intent gets asked: when what
"done" means, or which tradeoff to take, survives every check and a wrong guess
is costly, it brings you one sharp question with the options laid out.

---

## The loop: Surface, Test, Reconcile

- **SURFACE** - name the load-bearing assumptions, pick the one whose being
  wrong would most cheaply sink the plan, and pre-commit the check to a decision
  ("if the trace is not an NPE, this fix is dead"). If no result would change the
  plan, don't run the check.
- **TEST** - turn that assumption into the cheapest action that could *prove it
  wrong*. Predict the discriminating observable first, then run. Reach for the
  cheapest verifier that could flip the decision; for irreversible actions, run
  a reversible surrogate; when nothing can run, look it up from a clean source or
  hand it to a fresh-context reviewer - never re-read your own output for reasons
  it was right.
- **RECONCILE** - the prediction-vs-reality gap updates the plan. A match only
  rules out the one way you thought you were wrong; it is not proof. Iterate only
  on new evidence; surface only what changed or what needs a human decision.

---

## Install

The skill lives at the root of this repo (`SKILL.md` plus `references/` and
`assets/`), so installing it is just putting this folder where your agent looks
for skills. Clone it once and let the agent activate it on its own.

### Claude Code

Available in every project (personal skills directory):

```bash
git clone https://github.com/ergini/socratic-method.git ~/.claude/skills/socratic-method
```

Or scoped to a single project (run from the repo root):

```bash
git clone https://github.com/ergini/socratic-method.git .claude/skills/socratic-method
```

Then start Claude Code. It reads the skill's description and activates it on its
own when you are debugging, planning a change, or about to do something
irreversible.

### Cursor

```bash
git clone https://github.com/ergini/socratic-method.git .cursor/skills/socratic-method
```

Cursor also scans `.claude/skills/`, so a project already set up for Claude Code
needs nothing extra. Invoke with `/socratic-method` or `@` for on-demand use.

### Windsurf

```bash
git clone https://github.com/ergini/socratic-method.git .windsurf/skills/socratic-method
```

### Codex CLI

```bash
git clone https://github.com/ergini/socratic-method.git .codex/skills/socratic-method
```

### Any other agent that reads SKILL.md

The format is an open standard. Clone the repo into that tool's skills directory
(commonly one of `.claude/skills/`, `.cursor/skills/`, `.codex/skills/`) and it
will pick up `SKILL.md` and its references.

### Claude.ai, ChatGPT, Gemini, or any chat UI (no filesystem)

Paste the contents of [`SKILL.md`](SKILL.md) into a Project's custom
instructions or a saved style. Predict-then-run still works whenever the chat can
run code; where it cannot, the skill degrades honestly - it lowers its confidence
and names the check that would settle a claim rather than faking a verdict.

---

## What is in this repo

```
socratic-method/
|- SKILL.md                     # the skill: the gate, the Surface/Test/Reconcile loop, anti-theater rules, when to ask the user
|- references/
|  |- self-questioning.md       # the full toolkit: verifier ladder, surrogate verifiers, degraded/read-only mode, nondeterminism
|  |- lenses.md                 # real practitioners' operating principles, turned into questions you ask your own work
|  \- interviews.md             # when a question is genuinely the user's, how to ask it well, plus domain intent question sets
|- assets/
|  \- PROJECT.template.md       # the slim record: intent + live, re-checkable assumptions
|- evals/
|  \- evals.json                # behavioral evals that read the tool trace, not just the prose
\- docs/
   \- build-plan.md             # the research this skill was designed from, cited qualitatively
```

`references/` and `assets/` load only when the skill needs them (progressive
disclosure), so the always-in-context part stays small.

---

## Evals

The behavior is mostly internal, so the evals score what is actually observable:
the **tool trace** (did a real check precede the claim it verified, and did a
committed prediction precede the run?) and the **output delta** (did the check
change the plan or recalibrate confidence?). A transcript full of narrated doubt
is a failure, not a pass. See [`evals/evals.json`](evals/evals.json).

---

## The reasoning behind it

The design is grounded in real, checkable work - Feynman on not fooling yourself,
the finding that intrinsic self-correction is net-negative (Huang et al.), the
self-verification limits of language models (Stechly, Valmeekam, Kambhampati),
execution-grounded self-debugging (Chen et al.), chain-of-verification
(Dhuliawala et al.), Popper on falsification, Klein's premortem, Beck's
red-green, Simon's satisficing. Every finding is cited qualitatively, with no
invented numbers, in [`docs/build-plan.md`](docs/build-plan.md).

---

## License

MIT. See [LICENSE](LICENSE). Use it, fork it, adapt the lenses to your own craft.

Built by [Ergini](https://ergini.com).
