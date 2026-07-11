# Socratic

**A proactive thinking partner for your AI agent.** It interviews you until it
understands what you are actually building, writes that vision down in your own
words, and then holds you to it. When a later request contradicts something you
committed to, it says so before writing a line of code, then does what you
decide.

It is a portable [Agent Skill](https://agentskills.io) (a single `SKILL.md`
plus references). It works in Claude Code, Cursor, Windsurf, Codex, and any
other tool that reads the `SKILL.md` format, and it degrades gracefully into a
chat UI as a Project instruction or custom style.

---

## Read this first: it will not always ask you questions

The most common way a "Socratic AI" fails is by interrogating you about a typo.
This one is built to not do that.

It decides, up front, which of three modes it is in, and **most of the time the
answer is "just do the work."**

- **DISCOVER** - you are starting something real and there is no vision on file
  yet. It runs a short interview (8 questions, 10 to 20 minutes) and writes the
  result down.
- **CONFRONT** - a vision exists and your new request contradicts it. It names
  the contradiction in one line, asks one question, then obeys either way.
- **EXECUTE** - everything else. It just does the work. Quietly. No teaching, no
  questions, no lecture. This is most turns, and that is correct.

Errands (a regex, a color code, a lookup) get answered immediately. Production
incidents get help, not philosophy. If you ask for the answer, you get the
answer, instantly and with no guilt trip.

---

## The one idea

Socrates could not cross-examine someone who had not made a claim. Neither can
an AI. An assistant wakes up with amnesia every session, holds no thesis, and so
can only ask generic questions. Generic questions are why Socratic AI feels like
a quiz.

So the first artifact this skill produces is not code, a plan, or a design. It
is **the dossier**: a short written record of what you are actually trying to
make, in your words, including the things you refuse to compromise. Once that
exists, real questions become possible:

> "You said the one word was **calm**. You are asking for a streak counter with
> a red badge. That is a guilt engine. Which one is giving way?"

That question is unaskable without the dossier. It is also worth more than a
hundred questions about assumptions. The dossier is the interlocutor.
Everything else hangs off it.

The dossier is a single markdown file (default: `.socratic/PROJECT.md`) written
in your own words, with every decision dated. A vision that changes on purpose,
in writing, with a reason, is a vision maturing. A vision that changes silently,
one reasonable compromise at a time, is a product dying. The skill is the only
thing in the room holding the original text, so it is the only thing that can
tell the difference. That is the feature.

---

## The vision interview

Eight questions, domain-general, one at a time. The full domain variants
(product, design, code, writing, business) are in
[`references/interviews.md`](references/interviews.md).

1. In one word, what should someone feel using this?
2. If a ruthless minimalist designed this, what would they delete?
3. If an obsessive craftsman made this, what would they add that 95% of people
   would never notice?
4. What is the one thing they must remember after they close it?
5. What exists today that is closest, and what are you willing to be worse at?
6. What would make this look amateur?
7. What will you not compromise, even if it costs you users?
8. Who is this explicitly not for?

It reacts to your answers instead of marching down a script, refuses hedges like
"clean and modern," and reads the whole thing back to you at the end so you can
correct it. The correction is the most valuable moment in the interview.

---

## Install

The skill lives at the root of this repo (`SKILL.md` plus `references/` and
`assets/`), so installing it is just putting this folder where your agent looks
for skills.

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
own when you begin something new or say things like "help me think through this"
or "poke holes in this." You never have to invoke it by hand.

### Cursor

```bash
git clone https://github.com/ergini/socratic-method.git .cursor/skills/socratic-method
```

Cursor also scans `.claude/skills/`, so a project already set up for Claude Code
needs nothing extra. Invoke with `/socratic-method` or `@` if you want it on
demand.

### Windsurf

```bash
git clone https://github.com/ergini/socratic-method.git .windsurf/skills/socratic-method
```

Cascade reads the `description` frontmatter and auto-activates.

### Codex CLI

```bash
git clone https://github.com/ergini/socratic-method.git .codex/skills/socratic-method
```

### Any other agent that reads SKILL.md

The format is an open standard. Clone the repo into that tool's skills directory
(commonly one of `.claude/skills/`, `.cursor/skills/`, `.codex/skills/`) and it
will pick up `SKILL.md` and its references.

### Claude.ai, ChatGPT, Gemini, or any chat UI (no filesystem)

There is no skills directory in a plain chat, so paste the contents of
[`SKILL.md`](SKILL.md) into a Project's custom instructions or a saved
style/persona. It will look for the dossier in the conversation or the Project
context instead of on disk. Keeping the dossier text pinned in the Project is
what gives it memory across chats.

---

## What is in this repo

```
socratic-method/
|- SKILL.md                     # the skill: gate, three modes, the interview, confrontation, craft
|- references/
|  |- interviews.md             # the eight questions, per domain (product, design, code, writing, business)
|  \- lenses.md                 # real practitioners' operating principles turned into questions
|- assets/
|  \- PROJECT.template.md       # the dossier template
|- evals/
|  \- evals.json                # multi-turn, multi-session eval scenarios and personas
\- docs/
   \- build-plan.md             # the research dossier this skill was designed from
```

`references/` and `assets/` load only when the skill actually needs them
(progressive disclosure), so the always-in-context part stays small.

---

## Why it works, briefly

This is not "make the AI ask questions instead of answering." That naive version
fails for well-documented reasons: assistants leak the answer under the mildest
pressure, minimal guidance genuinely harms people who lack the schema to fill it
in, and questioning an expert who just wants a flag name is friction, not
teaching. The skill is designed around those failure modes, not in ignorance of
them: a gate that decides when not to be Socratic, a confrontation that fires
once and never nags, a hint ladder that always terminates in a real answer, and
a hard rule against fabricating what a person or company "would say."

The reasoning, the sources, and the eval design are in
[`docs/build-plan.md`](docs/build-plan.md).

---

## Evals

Socratic behavior is a multi-turn, multi-session property. A single-shot eval
will happily pass a skill that is catastrophic in practice: leakage happens on
turn 4, sycophancy on turn 6, drift across a whole session. So the scenarios in
[`evals/evals.json`](evals/evals.json) run as dialogues, some of them across a
fresh session with only the dossier carried over, and they score the things that
actually matter: did it catch a real contradiction, did it leave a false one
alone, did it obey after being overruled, did it invent an authority it does not
have.

---

## License

MIT. See [LICENSE](LICENSE). Use it, fork it, adapt the lenses to your own craft.

Built by [Ergini](https://ergini.com).
