# Lenses

A lens is a real practitioner's operating principle, turned into a question you ask **yourself** about your own work.

These are for the un-runnable judgment calls - is this the right shape, am I over-building, does this have a point of view - where there is no compiler verdict (see `self-questioning.md`, section 6). A lens does not settle such a question by authority; it sharpens it, and the external check remains the clean frame: re-derive the answer from a blank slate, or hand it to a fresh-context reviewer, and see if it survives.

**The rule that makes this work:** reason from the principle, never from the aura. A lens is a thinking tool you hold, not an authority you cite. Never write "Apple would hate this" - you do not have access to Apple. Use the lens to *generate the question*, then let the question stand on its own.

- Bad: "Steve Jobs would remove the sidebar."
- Good: "If I shipped this with one fewer surface, which one goes, and why is it not the sidebar?"

Never invent a principle to fit an argument. If you do not know what someone actually stood for, do not invoke them. The point is to put the work on trial, not to decorate a decision you already made.

## Contents
1. Subtraction
2. Craft and the invisible
3. Point of view and sacrifice
4. Working backwards from the end
5. Truth and evidence
6. Constraint as the design
7. Critique
8. How to pick a lens

---

## 1. Subtraction

**Dieter Rams (Braun).** Ten principles for good design; the tenth is *as little design as possible*. "Less, but better." Good design is unobtrusive: a product is a tool, not a decoration, and it should be neutral enough to leave room for the user's self-expression.
> "What is the least design that would still work? What here is decoration wearing the costume of a feature?"

**Steve Jobs / Apple.** Focus means saying no to the thousand other good ideas. Jobs said he was as proud of the things they had not done as of the things they had. Subtraction as the primary act.
> "What are the thousand things you are saying no to? Name three you are secretly still saying yes to."

**Antoine de Saint-Exupéry.** Perfection is reached not when there is nothing left to add, but when there is nothing left to take away.
> "Take one thing away. Which one, and what breaks?"

**Muji / Kenya Hara.** The aim is not "this is the one I want" but "this will do," in the fullest sense: an object so unassertive it does not compete with your life. Emptiness as a vessel the user fills.
> "Is this object trying to be admired, or trying to be used?"

**Rick Rubin.** Strip until only the essential remains. What is the source of this? What is it actually about?
> "If you cut this in half, what half do you keep?"

---

## 2. Craft and the invisible

**Hermès.** A single craftsperson makes the bag from start to finish and signs it. Saddle-stitched by hand, a technique that is slower and stronger than machine stitching. Repairable for decades. The excellence is largely invisible to a passerby and entirely felt by the owner.
> "What would you add that 95% of people would never notice, and the other 5% would never forget?"
> "What in this will still be good in ten years?"

**Christopher Alexander.** The quality without a name: buildings and towns are alive when their patterns resolve real forces rather than imposing an arbitrary form. Design is the resolution of conflicting forces, not the imposition of style.
> "What forces are actually in conflict here? Which one did you quietly ignore?"

**Toyota (jidoka, the andon cord).** Any worker can stop the entire production line when they see a defect. Quality is built in at the point of work, not inspected in at the end.
> "What is the thing you know is wrong and are planning to fix later? Why is that acceptable?"

**Linear.** Speed is a feature and craft is a strategy. Opinionated defaults over configuration. The tool should feel like it is ahead of you.
> "Where does this make the user wait? Where does it ask them a question it should have answered itself?"

---

## 3. Point of view and sacrifice

**Positioning (Ries & Trout; Porter on strategy).** Strategy is choosing what *not* to do. A position that requires no sacrifice is not a position, it is a wish.
> "What are you willing to be actively worse at than the competition? If the answer is nothing, you have no strategy."

**Patagonia.** Ran a full-page ad on Black Friday reading "Don't Buy This Jacket," and built a repair and resale business that reduces new sales. A position expensive enough to be credible.
> "What would this brand do that costs it money, and would prove it means what it says?"

**Basecamp / Shape Up (Ryan Singer).** Fixed time, variable scope. The "appetite" is decided first: how much is this worth? Then the solution is shaped to fit, not the other way around.
> "What is this actually worth to you? Now build the version that fits inside that."

**Nintendo (Miyamoto).** A good idea is one that solves several problems at once.
> "Which of your problems does this single change solve? If it is only one, is it worth the complexity?"

---

## 4. Working backwards from the end

**Amazon (working backwards, the PR/FAQ).** Write the press release and the customer FAQ *before* building anything. If the press release is not exciting, do not build the product. Also: distinguish one-way doors (irreversible, decide slowly) from two-way doors (reversible, decide fast).
> "Write the launch announcement. One paragraph. If it is boring, why are we building this?"
> "Is this a one-way door or a two-way door? You are treating it like the other one."

**Amazon (the six-pager).** No slides. A narrative memo, read in silence at the start of the meeting. Because prose forces the thinking that bullets let you skip.
> "Write it as a paragraph, not a list. If it does not survive as prose, the thinking is not done."

**Jobs to be Done (Christensen).** People do not buy a product, they hire it to make progress in a situation. The milkshake is hired for the boring commute.
> "What is the situation someone is in, ten seconds before they reach for this? What are they firing to hire you?"

---

## 5. Truth and evidence

**Toyota (five whys).** Ask why five times to reach the cause rather than the symptom.
> "That is the symptom. Why did that happen? ...and why did *that* happen?"

**Feynman.** The first principle is that you must not fool yourself, and you are the easiest person to fool. Also: if you cannot explain it simply, you do not understand it.
> "Explain it to me as if I have never seen this codebase. Where did you get vague? That is the part you do not understand."

**Richard Hamming.** What are the important problems in your field, and why are you not working on them?
> "Is this the most important thing you could be doing this week? What is, and why are you avoiding it?"

**Alan Kay.** A change in perspective is worth 80 IQ points.
> "What is the reframing that makes this problem trivial? Have you looked for it, or did you start solving immediately?"

---

## 6. Constraint as the design

**IKEA.** The price is decided first. The designer receives the price tag as a constraint and designs backwards from it.
> "If this had to cost half as much, or ship in half the time, what design would you have chosen instead? Is that one actually worse?"

**Kelly Johnson (Skunk Works).** Keep it simple. Small teams, few people, radical delegation, short reporting chains.
> "What is the smallest team that could ship this? What is stopping you from being that team?"

**Bauhaus.** Form follows function; the object should be honest about what it is and how it is made.
> "Is this shape doing work, or is it doing marketing?"

---

## 7. Critique

**Pixar (the Braintrust; Ed Catmull, *Creativity, Inc.*).** Candour without authority. The Braintrust has no power to mandate changes; it identifies problems and does not prescribe solutions. The director decides. Also: "plussing," where a criticism must come attached to an improvement.
> "I am going to tell you what is not working, and I am not going to tell you how to fix it. That is your job."

**Ogilvy.** The consumer is not a moron. The headline does most of the work. Write to be understood, not admired.
> "Read your first line aloud. Would you keep reading? Be honest."

---

## 8. How to pick a lens

Match the lens to the failure you suspect in your own work. That is the skill.

| Symptom in the work | Lens |
|---|---|
| It is bloated, and I am attached to every part | Subtraction (Rams, Jobs, Saint-Exupéry) |
| It works, and it is forgettable | Craft (Hermès), point of view (positioning) |
| It is trying to serve every case | Sacrifice (Porter), the knife ("what is this not for?") |
| I cannot say why it matters | Working backwards (Amazon PR/FAQ) |
| I am fixing symptoms | Five whys, Feynman |
| I am gold-plating and will not ship | Appetite (Shape Up), IKEA's price tag |
| My plan is a list of bullets with no argument | The six-pager |
| I want to be handed the answer | Braintrust (name the problem, not the fix) |
| I am confidently sure | Predict, then run |

If no lens fits, do not force one. A forced lens is name-dropping in your own head, which is worse than saying nothing. And a lens is never the last word: if the judgment is load-bearing, it still owes a clean-frame re-derivation or a fresh reviewer.
