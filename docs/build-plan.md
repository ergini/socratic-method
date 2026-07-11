# The `socratic-method` skill: research dossier and build plan

**Target:** a portable Agent Skill (`SKILL.md`) that makes an AI coding agent
cross-examine its *own* work before it ships, instead of committing to its first
plausible plan. The interlocutor is the model's work-in-progress, not the user.

**Status:** v0.3.2. This document is the reasoning behind the skill. A note on
honesty, which is also the skill's thesis: every empirical finding below is cited
**qualitatively**. Where a source reports a specific number, this document does
not repeat it as though it were a coding benchmark. If you want the number, read
the source. No figures here are invented.

---

## 0. What changed from v0.2, and why

v0.2 of this skill did something different: it *interviewed the user* on a new
project, wrote their vision into a dossier, and confronted them when a later
request contradicted it. That is a good skill for capturing intent. It is not
what this one is for.

The owner's redirect was simple: make the model question **itself** while
working; interviewing the user should be occasional, not the main goal. That
turns out to be a better fit for what actually goes wrong in agentic coding. An
agent does not usually fail because it misunderstood the request. It fails
because it committed to the first plan that looked right, never checked the
assumption underneath it, and then rationalized. The highest-leverage
intervention is not more questions for the human. It is the model turning the
elenchus on its own work.

So v0.3 keeps the Socratic frame and inverts its target. Asking the user
survives, aimed precisely at what is genuinely theirs (Section 6). Everything
else is new.

---

## 1. The core problem, and the counter-evidence that shapes the fix

The naive version of this skill - "tell the model to double-check itself" - is
not just weak, it can be **net harmful**, and the design has to start from that.

- **Intrinsic self-correction, with no external signal, does not reliably help
  reasoning.** Huang et al., *Large Language Models Cannot Self-Correct Reasoning
  Yet* (ICLR 2024), found that when a model revises its own answer using only its
  own judgment, performance is flat to negative. The model that made the error
  shares the blind spot that would catch it.
- **Models are weak verifiers of their own reasoning and plans.** Stechly,
  Valmeekam & Kambhampati, on the self-verification limitations of LLMs, show
  that a *sound external verifier* beats self-critique; the model's own
  "is this right?" pass is unreliable exactly where it matters.
- **Undirected doubt behaves like self-inflicted pushback.** The "Are You Sure?"
  / FlipFlop line of work shows that challenging a model - even challenging a
  *correct* answer - lowers its confidence and flips right answers to wrong. A
  skill that simply injects doubt will do this to itself.
- **Confidence is least trustworthy where it matters most.** The hard-easy
  effect (Lichtenstein & Fischhoff) and Kadavath et al. (*Language Models
  (Mostly) Know What They Know*) together say: models are reasonably calibrated
  in-distribution and poorly calibrated on novel, hard, off-distribution work -
  which is precisely where a consequential mistake lives. So "I feel confident"
  is not a usable signal.
- **Chain-of-thought is often post-hoc.** Turpin et al. and Lanham et al. show a
  model's stated reasoning is frequently a rationalization of an answer it
  reached another way, not the cause of it. Self-examination that trusts its own
  narrated reasoning is examining a story.

The through-line: **the model cannot be its own verifier.** Every one of these
failures is the same failure - grading your own homework. The fix is not to
doubt harder. It is to route every doubt to something outside the model's own
head.

---

## 2. The design in one rule

> Every self-question must terminate in an **external verdict** - a run, a test,
> the type checker, a constructed counterexample, the real source, an
> independent re-derivation - or it is dropped, not narrated.

This single rule is what separates v0.3 from performative-doubt-as-a-service. It
makes silent rationalization structurally uncountable as verification: if a doubt
did not end in something external, it does not count, and it does not get voiced.

The reason coding is the ideal home: software has an **interpreter**, a cheap
truth oracle. Socrates had to argue his way to a contradiction because ethics has
no interpreter. A coding agent can *run the thing*. So the flagship move is
empirical, not rhetorical.

**Predict-then-run.** Commit the expected observable *before* executing, then
execute; the gap is the finding. This is the mechanic behind Chen et al.,
*Teaching Large Language Models to Self-Debug* (ICLR 2024): the gain comes from
the **execution signal**, not from the model musing about its code. The
prediction has to be committed first, or the model retrofits its "expectation" to
whatever it observed and learns nothing (the "running without a prediction"
anti-pattern).

**When there is no interpreter**, the external verdict degrades gracefully but
must stay external: read the real source you have not yet read (a genuine new
observation), re-derive from a clean frame, or delegate to a fresh-context
reviewer that does not share your blind spots (the practical answer to the
correlated-errors problem). Re-reading your own output for reasons it was right
is *not* a check - it is the exact rationalization loop Huang et al. describe.

---

## 3. The gate: scrutiny is a cost, spend it deliberately

The counter-evidence cuts both ways. If undirected doubt is harmful and
confidence is unreliable, then running the loop on everything is not caution, it
is damage: latency, wasted tokens, and a real risk of flipping correct simple
answers. So the first thing the skill does is decide *how much* to scrutinize,
cheaply, once.

This maps to Kahneman's System 1 / System 2 as a **model** (not a literal claim
about the model's internals): fast, cheap default; expensive deliberation spent
only when a trigger fires. And to Simon's **satisficing**: stop when the riskiest
assumption survives its cheapest falsifying check; do not seek a certainty that
costs more than it is worth.

Four tiers - trivial (zero checks; skipping is *correct*), normal (one
prediction-backed check on the single riskiest assumption), high-stakes (the full
loop plus a premortem and surrogate verifiers), incident (one fast
reversibility/blast-radius check) - with the enumerated triggers in `SKILL.md`.
Three design decisions inside the gate came directly from stress-testing:

1. **Escalate on observable proxies, not felt confidence.** Because confidence is
   least reliable on novel work, the triggers are things visible in the
   transcript: novelty, a claim backed by no executed check, "always/never"
   language, a plan written without reading the code, a recalled external
   contract about to be load-bearing. "I feel sure" is explicitly *not* a
   trigger.
2. **The gate is re-entrant.** Debugging and refactoring only reveal their true
   stakes mid-task (you learn the export bug touches billing after you read the
   code). So new evidence about blast radius re-triggers the gate at a higher
   tier; RECONCILE can escalate.
3. **Precedence and override.** High-stakes overrides fade (a destructive action
   late in a well-understood session still gets the full loop). Incident beats
   irreversible (an emergency prod migration: minimize blast radius and prefer a
   reversible mitigation first; skip the ceremony).

---

## 4. The verifier ladder, and its honest floor

Not all external verdicts are equal, and the strongest reachable one is not
always the right one. The ranking (execution/tests > type checker > constructed
counterexample > reading the real source > a fresh-context reviewer > clean-frame
re-derivation > sampling-and-voting) is about **trust when verifiers
disagree**. The *selection* rule is different: reach for the **cheapest verifier
that could still flip the decision**, and climb only when it is inconclusive or
the stakes justify the cost.

Two hazards the ladder has to name:

- **A verifier can be real but wrong for the doubt.** Green-run-as-proof is the
  headline case (the test mocks the path, asserts the current buggy behavior,
  passes through an `any`, or is flaky). Beck's red-green discipline - watch it
  fail first so you know it *can* - is the guard. The general question is "does
  this verifier actually exercise the thing I doubt?"
- **Sometimes nothing can adjudicate.** Genuine design tradeoffs and un-runnable
  claims have no oracle. The honest move (and the one consistent with the whole
  thesis) is not to manufacture a confident second opinion from the same model -
  it is to lower stated confidence, name the single check that *would* settle it,
  and for high-stakes work hand it back. This is where property-based thinking
  (Popper's falsifiability; Claessen & Hughes' QuickCheck: state an invariant,
  hunt a counterexample) and, for irreversible actions, the *surrogate* ladder
  (dry-run, `EXPLAIN`, staging, a rolled-back transaction, a canary,
  snapshot-first) do the work the real action cannot.

---

## 5. Anti-theater: the part that keeps it honest

The single biggest risk in v0.3 is that it produces more words and more tool
calls without better outputs - performed rigor. The mitigations are deliberately
biased toward things **checkable in the transcript**, because the model is an
unreliable judge of its own compliance:

- **Pre-commit the branch.** Before running a check, name the decision its
  outcome would flip. If none, do not run it. This converts "cut the useless
  doubt silently" from a post-hoc filter (which the model cannot reliably apply
  to itself) into a *pre-*commitment that is cheap and predictive.
- **No narration** and **no verification claim without a preceding tool verdict**
  are bright-line and inspectable, unlike "was my doubt valuable."
- **Cap iteration on evidence, then on a hard count.** "Iterate only on a new
  external observation" is the principle; "at most two cycles per assumption,
  then escalate or ship-with-a-flagged-unknown" is the enforceable backstop
  against degeneration-of-thought.
- **No hedge-spraying.** Blanket caveats are the passive form of theater and they
  bury the answer; a caveat is earned only by a specific, load-bearing,
  unresolved unknown, paired with the check that would close it.

An explicit limitation, stated because the skill's own thesis demands honesty:
these are rules the model applies to itself, and a `SKILL.md` cannot *guarantee*
a model obeys rules about its own cognition. The design leans on the
transcript-observable rules for exactly this reason, and treats the introspective
ones as strong nudges, not guarantees.

---

## 6. Asking the user: facts get checked, intent gets asked

Asking the user remains part of the craft; v0.3 aims it precisely. A question
goes to the user when **both** hold: a genuine ambiguity in the user's *intent*
(not a fact, which is checked), and a wrong guess that is costly and hard to
reverse. "Check, don't ask" is the governing rule for everything checkable. When
a question does go to the user, it is one question offering the concrete
decision and its tradeoff, asked well.

The one place user-contact and self-questioning interact is pressure. The
sycophancy literature (Sharma et al.) and FlipFlop say models cave to pushback;
the rule is **concede to evidence, never to tone.** A user's bare asserted fact
is a claim to check, not to obey and not to dismiss. And Dunning & Kruger justify
a real escalation trigger: when repeated checks keep contradicting the model in
an unfamiliar area, that is observable evidence of being out of depth - a
principled reason to ask the human, rather than spin.

---

## 7. The slim record

The written artifact survives, slimmed from an interview transcript into memory
for self-questioning: intent plus a list of the currently-live load-bearing
assumptions, each as a re-checkable assertion marked verified-vs-unverified with
the command and date. This is Reflexion (Shinn et al.) in spirit - store what a
real failure taught you so a later session does not re-make the guess - not a
plan document. To avoid dossier rot: re-check lazily, only when the current task
touches the code an assumption covers; treat any entry without a verify-command
or past a short horizon as unverified regardless of its label; keep it local per
worktree unless the team opts in. The skill works fully without it.

---

## 8. Portability and scope

Coding-first is intentional: the execution oracle is what makes external
refutation cheap, and it is where the skill has real teeth. But the posture
generalizes, and the skill says so - for research, ops, or writing, the external
verdict becomes the real data or the primary source, and predict-then-run becomes
predict-then-look-it-up. The degraded-mode floor (Section 2) is what keeps it from
collapsing into self-verification where no interpreter is reachable, including the
read-only / PR-review case, where the terminus is a flagged, counterexample-backed
finding rather than a run.

Portability across tools is unchanged from v0.2: stick to the core `name` +
`description` frontmatter; do not rely on tool-specific fields; degrade
gracefully when a shell or a private reasoning channel is absent.

---

## 9. Evaluating it

Single-turn evals cannot see this skill, and - more subtly - an eval that rewards
visible self-critique measures the wrong thing, because visible self-critique is
the failure mode. The suite (`evals/evals.json`) scores two observable things:
the **tool trace** (did a real external check precede the claim it verified; did a
committed prediction precede the run) and the **output delta** (did the check
change the plan or recalibrate confidence). Narrated doubt that changed nothing is
a hard fail. User satisfaction and transcript fluency are explicitly *not* success
metrics, because performed diligence scores well on vibes and teaches nothing.

---

## Appendix: sources, cited qualitatively

**Self-correction and its limits**
- Huang, Chen et al., *Large Language Models Cannot Self-Correct Reasoning Yet*
  (ICLR 2024)
- Stechly, Valmeekam & Kambhampati, on self-verification limitations of LLMs in
  reasoning and planning
- Madaan et al., *Self-Refine: Iterative Refinement with Self-Feedback*
- Shinn et al., *Reflexion: Language Agents with Verbal Reinforcement Learning*
- Wang et al., *Self-Consistency Improves Chain-of-Thought Reasoning* (agreement
  is not correctness)

**Grounded checking**
- Chen, Lin, Scharli & Zhou, *Teaching Large Language Models to Self-Debug*
  (ICLR 2024)
- Dhuliawala et al., *Chain-of-Verification Reduces Hallucination in LLMs*
- Kadavath et al. (Anthropic), *Language Models (Mostly) Know What They Know*

**Sycophancy, pushback, faithfulness**
- Sharma et al. (Anthropic), *Towards Understanding Sycophancy in Language Models*
- Laban et al., the "Are You Sure?" / FlipFlop effect
- Turpin et al., *Language Models Don't Always Say What They Think*; Lanham et
  al., *Measuring Faithfulness in Chain-of-Thought Reasoning*

**Calibration and metacognition**
- Lichtenstein & Fischhoff, the hard-easy effect
- Kruger & Dunning (1999), *Unskilled and Unaware of It*
- Kahneman, *Thinking, Fast and Slow* (System 1 / 2 as a model)
- Simon, bounded rationality and satisficing

**Thinking tools and engineering discipline**
- Feynman, *Cargo Cult Science* ("you are the easiest person to fool")
- Popper, *Conjectures and Refutations* (falsifiability)
- Klein, *Performing a Project Premortem* (prospective hindsight)
- Beck, *Test-Driven Development: By Example* (red-green-refactor)
- Claessen & Hughes, QuickCheck (property-based testing)
- Zeller, *Why Programs Fail* (hypothesis-driven debugging)
- Five Whys (Toyota Production System); inversion (Jacobi, popularized by Munger);
  Kernighan & Plauger, *The Elements of Programming Style*; Hunt & Thomas, *The
  Pragmatic Programmer* (rubber-duck debugging)

**Format**
- Agent Skills spec: agentskills.io
