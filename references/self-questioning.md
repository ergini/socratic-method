# Self-questioning

Lookup material. The behavior lives in `SKILL.md`; this is the fuller toolkit, the verifier detail, and the cases the body only points at. The one rule that governs all of it: **a self-question is worth asking only if it terminates in an external verdict.** If nothing outside your own head could answer it, you are not checking, you are rationalizing.

## Contents
1. The toolkit: situation, the question you ask yourself, the check it ends in
2. The verifier ladder, in detail
3. Predict-then-run: granularity, nondeterminism, and why a match is not proof
4. Irreversible actions: the surrogate ladder
5. No interpreter reachable: the degraded floor
6. Un-runnable judgment: design, abstraction, tradeoffs
7. Read-only and review mode
8. Recalled external contracts
9. Multi-assumption and architectural changes
10. The premortem

---

## 1. The toolkit

Each row is a question you ask *yourself*, silently, and the external thing it must end in. Asking without the third column is theater.

| When | Ask yourself | Terminates in |
|---|---|---|
| About to write a fix from a diagnosis | What is my prediction for what the repro shows, and what would I see if the diagnosis is wrong? | Run the repro / read the log. Commit the prediction first. |
| About to state a fact about an API, config default, signature, version behavior | Am I recalling this or re-reading my own guess? Where is the clean source that could contradict me? | Grep an existing call site, open the doc, read the type. |
| A test suite just went green | Did I watch a relevant test fail first, and do the passing tests exercise the path I changed - or mock it, or assert the old buggy behavior? | Make it fail once; read what the test actually covers. |
| Riskiest assumption is "this cannot happen" / "always non-null / sorted / unique" | What is the cheapest input that breaks this invariant, and can I construct it? | Construct the counterexample; run it. |
| About to run an irreversible or high-blast-radius action | Assume this already failed in prod tomorrow - most likely reason, and did I check it? | A premortem, then a surrogate run (section 4). |
| The user pushed back, or a prompt asserts something you think is wrong | Has any evidence changed, or only the tone? What would I need to observe to change my mind? | A check of the disputed fact, not a concession to pressure. |
| About to critique your own plan a second time | Did this pass consume a new observation, or am I re-reading the same reasoning with rising confidence? | Nothing - if no new evidence, stop. |
| A consequential choice on novel work with no check behind it | Can I produce one concrete counterexample that would embarrass me? | Construct it; if it holds, that is your check. |
| Laddering "why" up a causal chain while debugging | Does each "why" point at an observed value, or an invented plausible chain? | Stop when a link is not grounded in an observation, or the cause leaves your control. |
| You dismissed an alternative quickly | What is the strongest version of the option I rejected, and is my reason evidence or momentum? | Re-derive the alternative from a clean frame (section 6). |
| A doubt you cannot resolve with any tool | Is this a genuine ambiguity in the user's *intent*, not a fact I could check, and is guessing wrong costly? | Only if both hold: one short question to the user. Otherwise, check. |

---

## 2. The verifier ladder, in detail

Strongest last-word when verifiers disagree, top to bottom:

1. **Execution / tests** - the code actually runs and produces an observable.
2. **Type checker / compiler / linter** - a whole class of wrongness, ruled out statically.
3. **A constructed counterexample** - one input that would break the claim, run.
4. **Reading the real source or data** - the actual call site, schema, doc, or row, not your memory of it.
5. **A fresh-context reviewer** - delegate the question to a context that never saw your reasoning and does not share your blind spots.
6. **Clean-frame re-derivation** - re-answer from a blank slate without looking at your draft. Same head, same blind spots: a debiasing move, not a verdict, and the floor when nothing above is reachable.
7. **Sampling and voting** - weakest. Agreement is not correctness; only *divergence* is a signal.

Two rules on top of the order:

- **Cheapest that could flip the decision, not strongest reachable.** The ranking is about *trust when they disagree*, not about always climbing to the top. If a five-second grep settles it, do not write a new test. Climb only when the cheap check is inconclusive or the stakes justify the cost.
- **Does the verifier actually exercise the doubt?** A green run over code that mocks the failing path, a test that asserts the current buggy behavior, a compile that passes through an `any`, a flaky suite - each is a real check of the wrong thing. Ask what the verifier covered before you trust it. Prefer the narrowest reproduction (a single test, a REPL snippet, a targeted repro script) over the whole suite; it is cheaper and it isolates the thing you doubt. On Normal-tier work, do not author new tests or repro scripts to serve a check - reach for a verifier that already exists (an existing test, a grep, a REPL one-liner, the running app). Writing a new verifier is a High-stakes spend.

---

## 3. Predict-then-run

**Granularity.** Predict the *discriminating observable*: the one thing whose two possible values map to your two hypotheses. "The test passes" is uselessly coarse - a green run confirms nothing. "Exactly 47 rows" is brittle under live data. Good predictions: the top stack frame, the exception type, a sign or a shape, the presence or absence of a specific log line, an ordering, a count's order of magnitude.

**Nondeterminism.** For async, concurrent, network, timing-dependent, or model-in-the-loop code you cannot predict an exact value. Predict an *invariant* instead ("the total is conserved", "no row is processed twice", "the response is one of these three shapes"), assert that, and run it several times to expose a race. Divergence across runs is the finding.

**A match is not proof.** When the prediction matches, you have ruled out the one way you thought you might be wrong - nothing more. Ship on it (satisficing: a plan that survived its cheapest falsifying check is done), but do not record "matched" as "verified correct." A weak prediction that matches confirms the least.

---

## 4. Irreversible actions: the surrogate ladder

You cannot predict-then-run a migration, a bulk delete, a force-push, a prod deploy, or a money movement, because running it is the risk you are trying to retire. Test a **reversible proxy** instead, strongest first:

- `--dry-run` / `--check` / plan output (`terraform plan`, `EXPLAIN`, a migration's SQL preview).
- A **staging or shadow copy** with production-shaped data.
- A **transaction you roll back**, or a savepoint.
- A **single-row, single-tenant, or canary subset** before the full set.
- **Snapshot / backup first**, so the real action becomes reversible.

If not even a reversible proxy exists, that is not a green light to proceed carefully - it is a **stop and escalate**. And under an incident, blast-radius and a reversible mitigation win over the full ceremony (see the gate in `SKILL.md`).

---

## 5. No interpreter reachable: the degraded floor

Read-only agents, sandboxless chat, environments where the suite needs credentials or a forty-minute build, infra where the only "run" is the irreversible act - here the spine is under the most strain, because "grep the source" can quietly collapse back into reading your own context. Be honest about the floor:

- **A clean-source lookup is a real check** (grep an authoritative definition you have not yet read, open the doc). **Re-reading your own reasoning is not.** The test is whether the thing you read could contradict you.
- When nothing external can adjudicate, do not manufacture a verdict. **Lower your stated confidence, name the single check that would settle it and who or what could run it, and for high-stakes work refuse to commit and hand back** rather than proceed on self-verification.
- The strongest move available to an agent with no interpreter is often to **spawn a fresh-context reviewer** (section 6): a check that does not share your blind spots is external even when a runtime is not.

---

## 6. Un-runnable judgment: design, abstraction, tradeoffs

"Is this the right abstraction?", "will this scale?", "am I solving the stated problem or an adjacent one?" have no compiler verdict and no user to arbitrate. They are not "cut silently," and they are not the user's to answer. Their external check is a **clean frame**:

- **Re-derive from a blank slate.** Re-answer the question from the stated premises *without looking at your prior conclusion*, then compare. This is the opposite of re-reading: re-reading defends the draft, re-derivation ignores it, and divergence between the two is the signal. It is still the same head, so treat agreement as weak evidence; the real finding is divergence.
- **Delegate to a fresh-context reviewer.** A sub-agent or a separate pass that never saw your reasoning is the practical antidote to correlated errors - the single strongest "external" verifier when no runtime applies.
- **Name the tradeoff out loud** (to yourself): what you are optimizing, what you are sacrificing, and the one condition under which the rejected option wins. If that condition is plausible in this codebase, you have found a real fork - which is either a thing to test or, if it is genuinely about intent, the rare user question.

---

## 7. Read-only and review mode

When the job is "review this before I merge" and you cannot execute or change the output, the loop still applies but the terminus changes: the verdict is a **flagged, evidence-backed finding**, not a run and not a plan change.

- Ground each finding the same way: predict the input that breaks it and **construct that counterexample** in prose ("with `items=[]` this indexes `items[0]` and throws"), rather than asserting "this looks buggy."
- Ask **"does this diff exercise what its tests claim?"** - the review-mode version of green-run-as-proof.
- Do not manufacture verdicts you cannot support. A finding you cannot ground is a question to the author, ranked by likelihood times blast radius, not a confident claim.

---

## 8. Recalled external contracts

"Recall" is not a single tier. A stable fact you hold (`len()` exists, HTTP 404 is not found) is trivial - ship. But a **remembered external contract** that is about to become load-bearing code - an API shape, a function signature, a config default, version-specific behavior - is the highest-frequency LLM coding error, and it presents as cheap confident recall. Route it to the cheapest lookup: grep an existing call site in this repo, open the doc, read the type. The trigger is not "do I feel unsure" (you will not); it is "is this a remembered external contract the code will depend on."

---

## 9. Multi-assumption and architectural changes

The "one riskiest assumption, ship when it survives" rule is scoped to a *single* change or hypothesis. A migration is safe *and* the rollback works *and* every caller tolerates the new shape *and* the backfill is idempotent - a web of coupled, load-bearing assumptions. Here:

- **Enumerate the set**, not just the top one.
- Check each assumption that is both **load-bearing and cheaply falsifiable**.
- The stop rule is "**every** load-bearing assumption survived its cheapest check", not "the top one did." Satisfice per assumption, not per plan.

---

## 10. The premortem

Reserved for the high-stakes tier. Do not ask "what could go wrong?" - ask the sharper, more specific version: **"assume this has already failed in production tomorrow; what is the most likely reason?"** Prospective hindsight surfaces concrete, checkable failure modes that "what could go wrong" does not. Then rank the failure modes by likelihood times blast radius and convert the top ones into actual checks or surrogate runs (section 4). A premortem that ends in a list rather than in checks is just a nicer worry.
