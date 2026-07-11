# PROJECT

> Memory for self-questioning, not documentation and not an interview transcript.
> Two things only: what this is trying to be, and the assumptions I am currently
> standing on. Read it at a glance at session start; re-check an assumption only
> when the task in front of me touches the code it covers.

---

## Intent
One or two lines. What this project is trying to be, and the few constraints and
non-goals that are expensive to rediscover.

- Building: ___
- Must not: ___ (the non-goals that are easy to violate by accident)

## Live assumptions
The load-bearing beliefs the current work rests on, each as a re-checkable
assertion. Mark how and when it was last verified. Anything with no
verify-command, or older than a few working sessions, is UNVERIFIED no matter
what the label says - re-check it before you build on it.

```
ASSUMES: <assertion>   (verified: <command or file you checked>, <date>)
ASSUMES: <assertion>   (UNVERIFIED - guessing)
```

Example:

```
ASSUMES: exports run synchronously in the request   (verified: grep ReportController, 2026-07-11)
ASSUMES: author is never null on published reports  (UNVERIFIED - guessing)
ASSUMES: the staging DB schema matches prod          (verified: migration log diff, 2026-07-09)
```

## Corrections
When reality contradicts an assumption, note what you learned, so a future
session does not re-make the same wrong guess. Keep it to one line each.

- 2026-07-11: the export crash was an upstream timeout, not a null bug. The
  synchronous-export assumption is the real risk, not author-null.

---

<!--
Notes on use, delete before committing:
- This file is an accelerant. The skill works fully without it.
- Keep it short enough that staleness is visible at a glance.
- Prefer git-ignored / local per worktree unless your team opts in, so
  stale UNVERIFIED entries do not travel across branches and get trusted.
- It records which of your own beliefs still owe a check. Questions of intent
  still go to the user when they are genuinely theirs.
-->
