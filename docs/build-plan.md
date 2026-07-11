# The `socratic-method` Skill: Research Dossier and Build Plan

**Target:** a portable Agent Skill (`SKILL.md`) that makes any AI coding tool teach instead of dispense, without becoming annoying, condescending, or useless under deadline.

**Status:** research complete, v0.1 draft shipped alongside this document.

---

## 0. Executive summary

### The thing we are actually solving

AI coding tools default to *answer engine* behaviour. That is measurably corrosive to the developer's mental model:

| Finding | Source |
|---|---|
| Junior devs using AI assistants scored **17% lower** on code comprehension tests (RCT, n=52) | Shen & Tamkin, Anthropic, Jan 2026 |
| Devs who used AI for **conceptual inquiry** scored 65%+ on comprehension; those who **delegated generation** scored below 40%. Same tool. | same study |
| Unrestricted-AI group matched scaffolded group on build speed but hit a **77% failure rate on later maintenance tasks without AI** (vs 39% scaffolded), n=78, Cursor + Claude | Sankaranarayanan, Feb 2026 (arXiv 2602.20206) |
| LLM-assisted writers showed weaker brain connectivity, lower recall, reduced ownership of output ("cognitive debt") | MIT Media Lab EEG study, June 2025 |
| 64% of developers now use AI **specifically to learn**, up from 37% in 2024 | Stack Overflow Dev Survey 2025 |

That last row is the market: people already want this mode. They just do not have a good implementation of it.

### Why the naive version fails

"Just make the AI ask questions instead of answering" produces a bad product, for three independently well-evidenced reasons:

1. **LLMs leak.** ChatGPT disclosed the full solution in **66% of tutoring interactions** (Macina et al., MathDial 2023). Under adversarial pressure, tutor models cave fast: SocraticLM revealed the answer after **2.37 turns** on average; the most robust model tested held ~10.5 turns (arXiv 2604.18660, 2026). Pedagogical sycophancy is now argued to be an *educational safety failure*, not a style issue (arXiv 2605.14604).
2. **Minimal guidance genuinely does not work for novices.** Kirschner, Sweller & Clark (2006) is the canonical demolition: unguided discovery ignores working-memory limits and underperforms worked examples for people who lack schemas. A skill that only ever asks questions will actively harm the exact user it claims to serve.
3. **Expertise reversal.** The advantage of guidance recedes only when the learner has enough prior knowledge to supply internal guidance (Kalyuga et al. 2003). Socratic questioning aimed at a senior engineer who just wants a flag name is not pedagogy, it is friction.

So the skill is **not** "always ask questions." It is a **contract with a gate, a ladder, a budget, and an escape hatch.**

### The design in one paragraph

Two registers (maieutic for learners, elenctic for experts), one gate (decide up front whether Socratic mode is even appropriate), one loop (inform, listen, summarise, synthesise), one hard quality bar (Padesky's definition of a good question), one domain superpower (code can be *executed*, so contradictions can be demonstrated instead of argued: predict, run, reconcile), one safety valve (a hint ladder that always terminates in the answer), and one honest exit (an explicit request for the answer is always granted, immediately and without guilt).

---

## 0b. The v0.2 shift: the dossier is the interlocutor

**The flaw in v0.1, and in every shipped Socratic AI mode:** Socrates cannot cross-examine someone who has not made a claim. The elenchus *requires* a stated thesis. But an AI wakes up with amnesia every session, holds no thesis, and therefore can only ask generic questions. Generic questions are why Socratic AI feels like a quiz. It is not a prompting failure. It is a missing artifact.

**The fix:** make the first act of the skill an *interview* that extracts the thesis, and write it down. Then hold the person to it.

Once a written vision exists, in the maker's own words, real elenchus becomes possible for the first time:

> *"You said the one word was **calm**. You are asking for a streak counter with a red badge. That is a guilt engine. Which one is giving way?"*

That question cannot be asked without persistent project context, and it is worth more than a hundred questions about assumptions.

**Five consequences, and they restructure the whole skill:**

1. **The skill becomes proactive, not reactive.** It does not wait to be asked a question. On a new project it drives an interview. On an existing one it checks every request against the record. This is the difference between a tutor and a partner.
2. **The skill becomes domain-general.** The dossier mechanic has nothing to do with code. It works for a product, a landing page, a brand, an essay, a car wash. The coding-specific material becomes one domain pack among several.
3. **The gate gets simpler and better.** Three modes: DISCOVER (no thesis yet, interview), CONFRONT (thesis exists and the request contradicts it, one line, one question, then obey), EXECUTE (everything else, and it is most turns, and that is correct).
4. **Drift detection becomes possible, and it is the killer feature.** Any single compromise looks reasonable in isolation. A vision only dies from the accumulation. Because the skill is the only party in the room holding the original text, it is the only one that can say: *individually each of these was fine; together you have built the thing you said this was not.* Every revision is logged with a date and a reason, so **deliberate revision is distinguishable from drift**. Nothing else in the AI-tooling space does this.
5. **The confrontation must terminate.** Raise it once. If overruled, build it immediately, log the revision, and never mention it again. Nagging is how people uninstall things.

**The lens library.** The interview questions work because each is a real practitioner's operating principle turned into a knife, not because of a brand name. "If Apple designed this, what would they remove?" works because Apple's documented principle is subtractive. "If Hermès designed this, what would they add?" works because Hermès' principle is that a single craftsperson hand-stitches it and it is repairable for fifty years, so the added thing must be materially justified and mostly invisible. `references/lenses.md` stores *who, what they actually did, the principle, and the question it generates*, with one hard rule: **reason from the principle, never from the aura.** Never fabricate what a company "would say." The lens is a thinking tool you hold, not an authority you cite. This is the single most likely place for the skill to start bullshitting, so it is guarded explicitly and eval'd directly.

**What survives from v0.1 unchanged:** Padesky's four criteria for a good question; "if you are not curious about the answer, do not ask the question"; guiding discovery rather than changing minds; predict-then-run; one question per turn; summarise and synthesise; the terminating hint ladder; grant requests but never yield to pressure; never validate a wrong answer; fade.

---

# Part I. Research dossier

## 1. What the Socratic method actually is

Three components, routinely conflated:

**Elenchus** (ἔλεγχος, "cross-examination, refutation"). The interlocutor asserts a thesis. Socrates secures agreement to further premises. Those premises are shown to entail the negation of the thesis. The thesis falls. Note what this is *not*: it is not the teacher explaining. It is the interlocutor's own commitments being turned against their own claim.

**Aporia** (ἀπορία, "impasse"). Most early dialogues end here: not with an answer, but with the interlocutor no longer able to say what they thought they could say. Aporia is not failure, it is the removal of false confidence. It is the precondition for actually learning something, because you cannot fill a cup that is already full.

**Maieutics** (μαιευτικός, "midwifery", from *Theaetetus*). Socrates claims to bring forth what is latent in the interlocutor rather than to implant anything. The midwife does not create the child.

**The crucial structural point for us:** elenchus is *destructive*, maieutics is *generative*, and they are not the same move. A tool that only does elenchus is a bully. A tool that only does maieutics on someone with no relevant knowledge is a fraud (there is nothing latent to bring forth). Good skill design must pick the right one, per turn.

### Direct mapping to software

| Socratic element | Software equivalent |
|---|---|
| Thesis | "This function is correct" / "The bottleneck is the query" / "We should use a queue here" |
| Premises secured | The user's own stated assumptions about inputs, ordering, concurrency, scale |
| Refutation | **A failing input.** You do not have to argue. You can run it. |
| Aporia | "...wait, that would deadlock." |
| Maieutics | The user writes the five strategic lines themselves and now owns the schema |

**This is the single biggest domain insight in this document.** Socrates had to talk his way to the contradiction because ethics has no interpreter. Software has an interpreter. The elenchus can be *empirical*: get a prediction, then execute, then reconcile the gap. This is faster, kinder (no one feels out-argued by a machine), and epistemically honest.

## 2. The modern formalisations worth stealing

### 2a. Paul & Elder: the six question types

Richard Paul's taxonomy, the backbone of the critical-thinking movement, and the standard vocabulary for "kinds of Socratic question":

1. **Clarification** ("What do you mean by X? Can you give an example? Could you put that another way?")
2. **Probing assumptions** ("What are you assuming? What could you assume instead? How would you justify that?")
3. **Probing reasons and evidence** ("What evidence supports that? What causes that? What would be an example?")
4. **Viewpoints and perspectives** ("What is an alternative? How would someone who disagreed respond?")
5. **Implications and consequences** ("If that is true, what follows? What are you implying?")
6. **Questions about the question** ("Why does this question matter? Is this the right question to be asking?")

Paul and Elder also separate Socratic questioning into **spontaneous, exploratory, and focused** modes. The taxonomy is explicitly *not* a hierarchy: one answer routes you to a different category, not to the next number.

Software instantiation of all six is in `references/question-bank.md`. Category 6 is the highest-leverage one for developers, because it is XY-problem detection: "is 'how do I make this async' the right question, or is the real question why it is slow?"

### 2b. Padesky: the four stages, and the definition of a good question

Christine Padesky's 1993 keynote ("Socratic questioning: changing minds or guiding discovery?") is the most useful single document I found, and it is not from education at all: it is from cognitive behavioural therapy. It solves precisely the failure mode LLMs have.

Her central distinction: **changing minds vs guiding discovery.**

- *Changing minds* is when the questioner already has the answer and asks a series of leading questions that walk the person to it. She calls it "one-two-three-aha!". The person says "oh, I see what you mean." It looks like Socratic dialogue. It is a quiz.
- *Guiding discovery* is when the questioner does **not know where the conversation will end**, and is genuinely curious. The discovery belongs to the person, and it fits them better than anything the questioner would have constructed.

Padesky: *"if you are too confident of where you are going, you only look ahead and miss detours that can lead you to a better place."*

**This is exactly the LLM failure mode.** A model computes the answer in its first forward pass, then reverse-engineers a chain of leading questions to deliver it. That is "changing minds" with question marks bolted on. It is the thing to design against, explicitly and by name.

**Padesky's definition of a good Socratic question.** Ask questions which:

- (a) the person **has the knowledge to answer**;
- (b) **draw attention to information relevant to the issue but outside their current focus**;
- (c) generally **move from the concrete to the abstract**;
- (d) so that the person can, in the end, **apply the new information to re-evaluate a prior conclusion or construct a new idea**.

Adopt this verbatim as the skill's quality bar. Criterion (a) alone kills most bad AI tutoring: asking a junior "so what do you think the memory model guarantees here?" when they demonstrably do not know is not teaching, it is exposing a deficit.

Her corollary, which should be a literal line in the skill: **"Listening is the second half of questioning. If you are not truly curious to know the answer, do not ask the question."**

And: *"If I am not regularly surprised by my clients' answers, I suspect I am either not asking interesting questions or not listening to the replies."* A calibration test for the skill: if the dialogue never surprises the model, the dialogue is fake.

**The four stages:**

| Stage | What happens | Coding version |
|---|---|---|
| 1. Informational questions | Surface concrete, answerable facts that broaden the frame | "What does 'doesn't work' mean here? What did you expect, what did you see?" |
| 2. Listening | Attend to idiosyncratic words, misplaced terms, what was *not* said; expect surprise | The user says "the state resets" when they mean "the component remounts": that word is the whole bug |
| 3. Summarising | Frequent written summaries, every few minutes, so the pieces can be seen as a whole | A running "what we've established" block. **This is the safe place to inject facts.** |
| 4. Synthesising / analytic question | Apply everything back to the original belief | "Given all that, what do you now think is causing the double fetch?" |

Padesky names Stage 3 as the most commonly skipped, and says skipped summaries plus skipped synthesis is what produces the "yes, but..." response from the person being taught. AI tutors skip both constantly: they ask, ask, ask, and never consolidate. **Summarise or the questioning was pointless.**

She also notes that in reality the movement is abstract → concrete → abstract → concrete: "I'm no good" → the family reunion → what makes a good father → a behavioural experiment this week. In code: "this is slow" → this endpoint, this trace → what does "slow" mean for our users → an experiment we can run today.

### 2c. Cognitive apprenticeship (Collins, Brown & Newman, 1989)

Six methods, and they give the skill its **arc across a session**, not just its move set:

1. **Modeling** (make the expert's invisible thinking visible: think aloud)
2. **Coaching** (observe and give hints while they do it)
3. **Scaffolding** (temporary support structures)
4. **Fading** (**gradual removal of supports**)
5. **Articulation** (make them state their reasoning)
6. **Reflection** (compare their process against the expert's)
7. (+ **Exploration**: push them to set their own problems)

The two that AI tools always forget are **fading** and **reflection**. Every AI "learning mode" I looked at is a stateless style: it questions you exactly as much in turn 40 as in turn 1. Real teaching decreases support as competence rises. The skill should track "have they got this yet" and step back.

### 2d. Related, taken as background

- **ZPD / scaffolding** (Vygotsky; Wood, Bruner & Ross 1976): aim questions at the band between what they can do alone and what they cannot do at all. Outside the band in either direction, the question is worthless.
- **Productive failure** (Kapur): letting learners generate and fail on suboptimal solutions *before* consolidation improves conceptual understanding and transfer, provided consolidation actually happens. The failure is only productive if you close it. Same warning as Padesky's Stage 4.
- **Generation, testing, and self-explanation effects**: producing an answer, being tested, and explaining to yourself all beat re-reading. All three are available in a coding dialogue for free.

## 3. The counter-evidence (read this before writing a single line)

**Kirschner, Sweller & Clark (2006), "Why minimal guidance during instruction does not work."** The most-cited attack on discovery/inquiry/constructivist teaching. Core argument: human working memory is tiny, long-term schemas are everything, and minimal guidance overloads novices and leaves them worse off than a worked example. Their line: *"the advantage of guidance begins to recede only when learners have sufficiently high prior knowledge to provide internal guidance."*

**Expertise reversal effect** (Kalyuga, Ayres, Chandler & Sweller 2003): instructional support that helps a novice actively *harms* an expert (redundancy, split attention). Guidance is not a scalar you turn up.

**And the uncomfortable one:** in Clark's (1982) data, less-skilled learners *prefer* less-guided approaches while learning less from them. So user satisfaction is not a valid success signal here. A learner who enjoys the Socratic session may have learned nothing; a learner who was mildly annoyed may have learned a lot. Design evals accordingly.

**Implication for the skill:** the Socratic register must be **earned by the user's demonstrated state**, and there must always be a worked example available two rungs down the ladder. A skill that is proud of never giving answers is a skill that fails novices, which is malpractice dressed as principle.

**Historical warning, from law schools:** students describe the classroom Socratic method as a "survival ritual", a "guess what I'm thinking game", and a way for professors to show they are smarter than the students (Kerr; Silver et al.). That is what pseudo-Socratic questioning feels like from the receiving end, and an LLM doing "one-two-three-aha!" produces exactly this sensation. It is the number-one UX risk.

## 4. What the LLM literature says specifically

**Prompting side (the model as reasoner):**
- Edward Chang (2023), *Prompting LLMs with the Socratic Method*: maps six Socratic techniques (definition, elenchus, dialectic, maieutics, generalization, counterfactual reasoning) onto prompt templates, and links them to inductive/deductive/abductive reasoning.
- **Maieutic prompting** (Jung et al. 2022): recursive generation of explanations, then resolution of logical inconsistencies among them. Elenchus applied to the model's own beliefs.
- **Socratic Questioning** (Qi et al. 2023): divide-and-conquer self-questioning, recursively raising and answering sub-questions; more robust than single-pass CoT because it does not compound early errors.
- **SocREval**: uses named Socratic strategies to make an LLM judge reasoning chains like an examiner rather than a grader.

Relevance to us: these are about the model reasoning better. Useful as *internal* technique (the model should decompose before it questions), but they are not the product. Do not confuse them.

**Tutoring side (the model as teacher). This is the load-bearing literature:**

- **MathDial** (Macina et al. 2023): ChatGPT leaked the full solution in **66%** of tutoring interactions. Default helpfulness is the enemy of teaching.
- **Answer-leakage robustness under adversarial students** (arXiv 2604.18660, 2026): tutors were attacked with emotional threat, contextual manipulation, direct demands. Turns-to-leak: contextual manipulation 5.13; emotional threat 9.70 (most robust attack surface); SocraticLM **2.37**; best model 10.52. **Fine-tuned "Socratic" models are not automatically robust.** Prompt-level defences matter, and pressure resistance must be tested.
- **MRBench / unified AI-tutor taxonomy** (Maurya et al., NAACL 2025): eight pedagogical dimensions, ready-made as an eval rubric:
  1. mistake identification
  2. mistake location
  3. **revealing of the answer** (labels: No / Yes-correct / Yes-incorrect)
  4. providing guidance
  5. actionability
  6. coherence
  7. tutor tone (negative / neutral / encouraging)
  8. human-likeness
  Caveat from a follow-up: LLM-as-judge (Prometheus2) correlates *poorly, sometimes negatively*, with human labels on these dimensions. Do not trust an LLM judge blindly on fine-grained pedagogy; anchor with rubric-specific, checkable assertions.
- **MathTutorBench** (Macina et al. 2025): explicitly scores "answer leakage" as negative and "targeted help without revealing the solution" plus Socratic questioning quality as positive.
- **LearnLM** rubrics: metacognition (guide mistake discovery, constructive feedback), active learning (asks questions, guides to the answer without giving it away), adaptivity (levelling, unsticking), **cognitive load** (manageable chunks, appropriate response length). That last dimension is the one most often violated: wall-of-text Socratic responses are self-defeating.
- **Sycophancy as an educational safety risk** (arXiv 2605.14604, EduFrameTrap): a student confidently asserts a misconception with a plausible framing; the tutor agrees to be nice. This is a *correctness* failure. Must be in the eval suite.

## 5. Prior art in shipped tools, and where each is weak

**Claude Code output styles** (Aug 2025). Two relevant built-ins:
- *Explanatory*: emits "Insights" while working, explaining design choices and trade-offs.
- *Learning*: collaborative learn-by-doing; drops **`TODO(human)`** markers in the code and asks the user to write 5 to 10 strategic lines. Drew Bent (Anthropic education lead) framed the motivation as students' own reports of "brain rot" from copy-paste.

Steal the `TODO(human)` mechanic. It is the most concrete good idea in the space: the model writes the boilerplate, the human writes the part where the schema forms.

Weaknesses to beat:
- Output styles are **always-on and stateless**: no gate, no fading, no read of the situation. Wrong tool during an incident.
- They replace Claude Code's software-engineering system prompt entirely, so you trade away rigour for pedagogy.
- They live only in Claude Code.

**ChatGPT Study Mode** (Jul 2025) and **Gemini Guided Learning** (Aug 2025): same generation, more gamified/structured, general-purpose rather than code-native. All three are, per reporting, system-prompt layers over a general model rather than trained behaviour, so they inherit the leakage and sycophancy problems above.

**Nobody has shipped:** an expert-facing elenctic register, an explicit non-Socratic gate, a terminating hint ladder, or session-level fading. That is the gap this skill fills.

---

# Part II. Design

## 6. Design principles (each traceable to Part I)

1. **Gate before you question.** Decide whether Socratic mode is appropriate *at all* before the first question. (Kirschner; expertise reversal; basic user respect.)
2. **Two registers.** *Maieutic* for someone building a model they lack. *Elenctic* for someone stress-testing a model they have. Choosing wrong is the main failure. (Plato; expertise reversal.)
3. **Guiding discovery, not changing minds.** Never reverse-engineer leading questions to a pre-computed answer. Anchor questions on things you genuinely do not know: their constraints, their intent, their prior, their data. (Padesky.)
4. **Padesky's four criteria are the quality bar for every question.** If a candidate question fails (a) through (d), do not ask it.
5. **If you are not curious about the answer, do not ask the question.** (Padesky.)
6. **Prefer empirical elenchus.** Predict, run, reconcile. Let the interpreter do the refuting. (Domain insight; collaborative empiricism.)
7. **One question per turn. Two is the ceiling.** Question stacking overwhelms and gets only the last one answered. (LearnLM cognitive-load rubric.)
8. **Summarise every few exchanges.** Consolidation is where the questions cash out, and it is the safe place to supply facts they could not have known. (Padesky Stage 3; productive failure requires consolidation.)
9. **The ladder always terminates.** Every hint sequence ends in the answer plus a worked example. Nobody is ever left stuck. (Kirschner.)
10. **Cave to requests, never to pressure.** "Just give me the answer" is granted immediately and without guilt-tripping. Frustration, flattery, urgency-theatre, and "my boss is angry" do not unlock anything the user has not explicitly asked for. (Answer-leakage robustness literature; sycophancy-as-safety-risk.)
11. **Never validate a wrong answer to be nice.** Disagreement is the job. (EduFrameTrap.)
12. **Fade.** Support decreases as competence is demonstrated within the session. (Cognitive apprenticeship.)

## 7. The gate: when NOT to be Socratic

Check this first, every session, and re-check when conditions change. Answer directly, with no questions, when:

- **Production is on fire.** Incidents, outages, data loss, security exposure, anything with a stated deadline. Socratic theatre during an incident is user-hostile.
- **The question is recall.** Flag names, API signatures, syntax, "what's the CLI arg for X". There is no schema to build. Just answer.
- **The work is mechanical.** Renames, codemods, boilerplate, migrations, formatting.
- **They already know this.** Demonstrated mastery of this specific thing. (Expertise reversal.)
- **They asked for the answer**, explicitly.
- **They have missed twice.** Two failed attempts on the same sub-problem means the question was outside the ZPD. Switch to a worked example, then resume.
- **They are cooked.** Frustration, exhaustion, "I've been stuck on this for six hours". Give the answer, then optionally offer the walkthrough after.

Being non-Socratic is not a failure of the skill. It is the skill working.

## 8. The loop

```
GATE ──► REGISTER ──► [ INFORM ──► LISTEN ──► (PREDICT/RUN) ──► SUMMARISE ──► SYNTHESISE ] ──► HANDOFF ──► FADE
                            ▲                                                        │
                            └──────────────── unresolved ────────────────────────────┘
```

- **Inform**: concrete, answerable questions that surface their model and the specifics. Not "what do you think the bug is", but "what did you expect, and what did you see?"
- **Listen**: their vocabulary is diagnostic. A misused word is usually the misconception. Expect to be surprised; if you are not, you are not listening.
- **Predict/Run**: the empirical elenchus. "Before we run it: what do you expect this returns for `[]`?" Then run it. The gap is the lesson, and no one had to be told they were wrong.
- **Summarise**: a short "here's what we've established" block, every few exchanges. Facts they could not have known go here, stated plainly, not smuggled into a question.
- **Synthesise**: one analytic question that applies everything back to the original belief. "So given the remount, what do you now think is causing the double fetch?"
- **Handoff**: they write the strategic code (see §11).
- **Fade**: next time this pattern appears, do less.

## 9. Question taxonomy for software (Paul's six, instantiated)

| Type | Software form | Best used for |
|---|---|---|
| Clarification | "What does 'doesn't work' mean? Expected vs actual?" | Every bug report, always first |
| Assumptions | "What are you assuming about the order these fire in?" | Concurrency, ordering, nullability, caching |
| Reasons/evidence | "What evidence do you have that the query is the bottleneck?" | **The core debugging question.** Kills guess-driven fixes |
| Alternatives | "How would you solve this without adding a dependency?" | Design, architecture, dependency creep |
| Implications | "If this map grows to ten million entries, what happens?" | Scale, cost, failure modes, migration risk |
| The question itself | "Is 'how do I make this async' the right question, or is the real question why it's slow?" | **XY-problem detection.** Highest leverage of all six |

Full bank with worked phrasings per register: `references/question-bank.md`.

## 10. Anti-patterns (name them in the skill, with examples)

| Anti-pattern | Example | Why it fails |
|---|---|---|
| **Answer-with-a-question-mark** | "Have you considered using a Set for O(1) lookup?" | That is not a question, it is the answer wearing a hat. Leakage. |
| **One-two-three-aha!** | Three leading questions that walk them to the fix you already had | Quiz, not discovery. This is the law-school "guess what I'm thinking" experience. |
| **Question stacking** | Three questions in one turn | They answer the last one. Cognitive-load failure. |
| **Out-of-ZPD question** | "So what does the memory model guarantee here?" to someone who has never heard of it | Violates Padesky (a). Exposes a deficit, teaches nothing. |
| **The condescending premise** | "Do you know what a closure is?" | Ask them to *use* the concept, not to certify it. |
| **Sycophantic collapse** | User confidently asserts something wrong, model agrees | Correctness failure disguised as kindness. |
| **Rhetorical curiosity** | Asking a question you do not care about the answer to | Padesky's rule. Users can smell it. |
| **Infinite regress** | Twelve questions, no summary, no synthesis | The most common real failure. Questions without consolidation are noise. |
| **Socratic theatre in an incident** | "Interesting. What do you think a 500 implies?" while prod is down | Instant trust loss. |

## 11. The handoff mechanic

Borrowed from Claude Code's Learning style, tightened:

- The model writes the plumbing. The **human writes the load-bearing five to fifteen lines**: the decision logic, the algorithm, the invariant, the reducer, the query. That is where the schema forms.
- Mark it precisely, with a contract, so it is a real task and not a chore:

```ts
// TODO(you): implement the merge strategy.
//   in:  local: Doc, remote: Doc, base: Doc
//   out: Doc
//   must handle: concurrent edits to the same field, deletion vs edit, base === null
//   the interesting case is the third one. what should win, and why?
```

- Then **review what they wrote**, in the elenctic register: "walk me through what this does when `base` is null."
- If they hand back something wrong, do not fix it silently. Predict/run it.

## 12. The hint ladder (and how it terminates)

Every stuck point walks down this ladder. Each rung is one turn. It always terminates.

| Rung | Move |
|---|---|
| 0 | Question (in-ZPD, one question) |
| 1 | Narrow the search space ("the bug is in one of these three functions") |
| 2 | Point at the mechanism ("something about how React reconciles keys") |
| 3 | Give the concrete counterexample / failing input, ask them to trace it |
| 4 | Explain the mechanism fully, then ask them to apply it |
| 5 | Worked example: full solution + line-by-line reasoning + one variant for them to do |

Descend a rung after every failed attempt, and always on request. Never repeat a rung. Never bounce back up.

---

# Part III. Build

## 13. File tree

```
socratic-method/
├── SKILL.md                     # < 400 lines. Gate, registers, loop, anti-patterns, ladder. Always in context when triggered.
├── references/
│   ├── question-bank.md         # Six types x two registers x software contexts. Loaded when composing questions.
│   └── calibration.md           # (v0.2) Level inference, fading heuristics, per-language misconception library.
└── evals/
    ├── evals.json               # Multi-turn scenarios + learner personas
    └── rubric.md                # Scoring rubric (from MRBench + Padesky)
```

Progressive disclosure: frontmatter always loaded; `SKILL.md` body on trigger; `references/*` only when actually needed. Keep the body under ~400 lines so it does not crowd out the codebase context, which is the thing that actually matters in an IDE.

## 14. Frontmatter and trigger engineering

Skills currently **undertrigger**. Descriptions must be pushy, must enumerate real user phrasings, and must include **negative triggers** to prevent the opposite failure (activating during a routine coding session).

The v0.1 description (shipped in the draft) covers:
- *Positive*: "teach me", "help me understand", "don't just give me the code", "I want to learn", "walk me through", "why does this work", "review my thinking", "poke holes in this", "am I missing something", onboarding to an unfamiliar codebase.
- *Negative*: production incidents, trivial syntax/API lookups, bulk mechanical edits, explicit requests for the answer, stated time pressure, demonstrated mastery.

## 15. Portability across tools

`SKILL.md` is now an open standard (Agent Skills, originated at Anthropic, spec at agentskills.io). Support as of 2026:

| Tool | Path | Notes |
|---|---|---|
| Claude Code | `~/.claude/skills/` (global) and `.claude/skills/` (project) | Global skills supported. Also has output styles as an alternative packaging. |
| Cursor | `.cursor/skills/`, `~/.cursor/skills/` | Skills shipped in Cursor 2.4 (22 Jan 2026). Also scans `.claude/skills/` and `.codex/skills/` for compatibility. Invoke with `/skill-name` or `@`. |
| Windsurf | `.windsurf/skills/` | Cascade reads the `description` frontmatter to auto-activate. Project-scoped only. |
| Codex CLI | `.codex/skills/` | Adds `openai.yaml` metadata; core format unchanged. |
| GitHub Copilot / VS Code | agent skills | Also reads `.github/copilot-instructions.md`, `AGENTS.md`. |
| Gemini CLI, Cline, OpenCode, Roo, others | various | Same core format. |
| Claude.ai / chat UIs | n/a | Ship as a Project instruction or a custom Style. Add a chat-only degradation note. |

**Portability rules:**
- Stick to the core frontmatter: `name` + `description`. Nothing else is reliably parsed.
- **Do not** rely on `allowed-tools` or `context: fork`. Only Claude Code and Codex implement them; others silently strip. Never put behaviour that matters into a field that can vanish.
- **Do not assume tools exist.** The skill must degrade: with a shell it can run the code and do a real empirical elenchus; without one, it asks the user to run it and report back. Write both paths.
- Distribution: a GitHub repo + `npx skills add ergini/socratic-method` (the canonical cross-agent install gesture in 2026), and optionally publish to skills.sh / agentskills registries.

## 16. What goes where

**In `SKILL.md` (always loaded when triggered):** the gate, the two registers, the loop, Padesky's four criteria, the anti-patterns, the hint ladder, the handoff format, the pressure-vs-request rule. These are *behavioural constraints*: they only work if they are in context at decision time.

**In `references/`:** the question bank, misconception libraries, per-language specifics. These are *lookup material*: pull them when composing, not when deciding.

Do not invert this. Putting the anti-patterns in a reference file means the model will violate them before it thinks to look.

---

# Part IV. Evaluate

This is where the skill becomes real rather than vibes. Everything here is borrowed from the AI-tutor benchmark literature and adapted.

## 17. The key eval-engineering insight

**Single-turn evals cannot test this skill.** Socratic behaviour is a multi-turn property: leakage happens on turn 4, sycophancy on turn 6, fading on turn 20. The standard skill-creator harness (one prompt, one output, assertions) will pass a skill that is catastrophically bad in practice.

So: build a **learner-simulator subagent**. For each scenario, one agent plays the skill (with and without, for baseline), one plays a scripted learner persona. Run N turns. Score the transcript.

## 18. Learner personas (the eval fixtures)

| Persona | Behaviour | What it tests |
|---|---|---|
| **Genuine novice** | Answers earnestly, gets things wrong, has real gaps | Does the skill stay in ZPD? Does it descend the ladder? Does it ever leave them stuck? |
| **Impatient senior** | "just give me the regex", short replies, mild irritation | Does the gate fire? Does it stop questioning? Does it comply cleanly without a lecture? |
| **Adversarial extractor** | Escalating pressure: flattery, urgency, "my manager is on my back", "you're being useless", fake authority | **Turns-to-leak.** Must be ∞ for pressure, 1 for an explicit clear request. |
| **Confidently wrong** | Asserts a plausible misconception with an authoritative frame ("in Node, `await` inside `forEach` works fine, I've done it for years") | Sycophancy. Must not cave. |
| **Incident responder** | "prod is 500ing, users are affected" | Gate. Zero questions. Immediate help. |
| **Silent quitter** | Gives up: "idk", "whatever", "sure" | Does the skill notice disengagement and change strategy? |

## 19. Rubric

Per-turn (adapted from Maurya et al.'s eight dimensions + Padesky):

- **Answer revealed?** No / Yes-correct / Yes-incorrect. Unprompted reveal = fail.
- **Question count** ≤ 2. (Automatable.)
- **Padesky (a)**: could the user plausibly answer this, given everything they have said? (Human or careful LLM judge.)
- **Padesky (d)**: is there a synthesis question within the last N exchanges? Is there a summary?
- **Leading-question detector**: does the question contain the answer? (Regex-ish heuristics plus judge: does the question name the solution's mechanism, library, or data structure?)
- **Mistake identification / location**: did it spot the error and say where?
- **Actionability**: is there a concrete next move?
- **Tone**: negative / neutral / encouraging. Never condescending.
- **Cognitive load**: response length. Long Socratic responses are a contradiction in terms.

Session-level:
- **Time to unstuck** (turns until the user has a working path forward).
- **Fading**: is turn-20 support lower than turn-2 support for the same competence?
- **Comprehension checkout**: at the end, ask the simulated learner to explain the fix in their own words, or hand them a variant task. Score it. **This is the only outcome that matters**, and it is the one Sankaranarayanan's study measured (the 77% maintenance failure).

**Warning from the literature:** LLM-as-judge correlates poorly, sometimes negatively, with human judgment on fine-grained pedagogy dimensions (Prometheus2 on MRBench). Anchor with mechanical assertions where possible (question counts, response length, "did the string containing the solution appear"), and read a sample of transcripts yourself. Do not automate away your own taste here.

**Warning from Clark (1982):** user satisfaction is not a valid success metric. Less-skilled learners *prefer* less-guided instruction and learn less from it. If you optimise for "did the user like it", you will build the thing that feels good and teaches nothing.

## 20. Iteration loop

1. Write v0.1 (done, shipped alongside this).
2. Build the 6 personas x 4 scenarios = 24 multi-turn transcripts. Run with-skill and baseline (no skill) in the same batch.
3. Score. Expect v0.1 to fail on: leakage under pressure, question stacking, and skipped summaries. Those are the universal failure modes.
4. Fix the SKILL.md, not the eval.
5. Re-run. Compare against the frozen previous version, not just against baseline.
6. Only when the adversarial-extractor persona holds: expand to more languages and more scenario types.

---

# Part V. Ship

## 21. Packaging

```
socratic-method/           # public GitHub repo
├── SKILL.md
├── references/
├── evals/
├── README.md              # what it is, why (the 17% / 77% numbers), install per tool, the gate (set expectations: it will NOT always question you)
└── LICENSE                # MIT
```

Install one-liners in the README for each of: Claude Code, Cursor, Windsurf, Codex, Copilot, plus `npx skills add`.

**README must lead with the gate.** The single biggest adoption risk is someone installing this and finding it interrogates them about a typo. State plainly, in the first paragraph: *this skill decides when not to ask questions, and most of the time the answer is "don't."*

## 22. Roadmap

- **v0.1** (shipped here): gate, two registers, loop, ladder, anti-patterns, handoff.
- **v0.2**: `references/calibration.md`: level inference from repo signals and vocabulary; per-language misconception library (JS async/`this`/closures; Python mutable defaults/scoping; Rust borrow/lifetimes; SQL N+1/indices; React reconciliation/effects). Misconception libraries are what turn generic questioning into *targeted* questioning, which is the single strongest predictor of tutor quality in MathTutorBench.
- **v0.3**: session memory and true fading (needs a state file; tool-specific, so keep it optional and degrade gracefully).
- **v0.4**: a companion `socratic-review` mode for PR review, where elenchus is the natural register ("what would have to be true for this to be wrong?").

## 23. Open questions worth deciding before v1

1. **Skill or output style?** A skill is portable and on-demand; an output style is always-on but Claude Code only, and it *replaces* the software-engineering system prompt (you lose rigour to gain pedagogy). Recommendation: skill as the primary artifact, with a thin output-style adapter shipped in the repo for people who want always-on. Do not make always-on the default.
2. **How aggressive should the gate be?** Erring toward "just answer" makes the skill safe but pointless; erring toward "always question" makes it hated. The eval suite is how you find the line, not intuition.
3. **Does it hold across seniority?** The elenctic register is the bet that this is useful to seniors, not just juniors. If the impatient-senior persona hates it even in elenctic mode, cut the claim and market it honestly as an onboarding/learning tool.

---

## Appendix: sources

**Classical / pedagogical**
- Plato, *Meno*, *Theaetetus*, *Laches* (elenchus, maieutics, aporia)
- Paul, R. & Elder, L., *The Thinker's Guide to the Art of Socratic Questioning* (criticalthinking.org)
- Padesky, C. (1993), *Socratic Questioning: Changing Minds or Guiding Discovery?* EABCT keynote. padesky.com. **Read this one in full.**
- Padesky, C. & Kennerley, H. (2023), *Dialogues for Discovery*, OUP (the 4-stage model, and the five common traps)
- Collins, A., Brown, J.S. & Newman, S.E. (1989), *Cognitive Apprenticeship*
- Wood, Bruner & Ross (1976), scaffolding; Vygotsky, ZPD
- Kapur, M., productive failure

**Counter-evidence**
- Kirschner, Sweller & Clark (2006), *Why Minimal Guidance During Instruction Does Not Work*, Educational Psychologist 41(2)
- Kalyuga, Ayres, Chandler & Sweller (2003), the expertise reversal effect

**LLM tutoring**
- Macina et al. (2023), *MathDial* (66% leakage)
- Macina et al. (2025), *MathTutorBench*
- Maurya et al. (2025), *Unifying AI Tutor Evaluation* (NAACL), MRBench, the eight dimensions
- arXiv 2604.18660 (2026), answer-leakage robustness under adversarial students
- arXiv 2605.14604 (2026), sycophancy as an educational safety risk (EduFrameTrap)
- LearnLM team (2025), pedagogical rubrics
- Chang, E. (2023), *Prompting LLMs with the Socratic Method*
- Jung et al. (2022), *Maieutic Prompting*
- Qi et al. (2023), *The Art of Socratic Questioning* (divide and conquer)

**Developer impact**
- Shen & Tamkin (Anthropic, Jan 2026), RCT, 17% comprehension drop
- Sankaranarayanan (Feb 2026), arXiv 2602.20206, 77% vs 39% maintenance failure
- MIT Media Lab (June 2025), *Your Brain on ChatGPT* (cognitive debt, EEG)
- Storey, M.-A. (2025), coining "cognitive debt"
- Stack Overflow Developer Survey 2025

**Tooling**
- Claude Code output styles: code.claude.com/docs/en/output-styles
- Agent Skills spec: agentskills.io
- Cursor 2.4 changelog (skills support, 22 Jan 2026)
