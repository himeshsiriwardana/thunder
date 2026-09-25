# ThunderID Use-Case Documentation

A use-case page (`docs/content/use-cases/**`) answers one question: "is this my problem, and if so, how do I
solve it with ThunderID?" This reference defines how to write the part that answers the first half of that
question, the problem statement, and the traps that turn it into something only an insider can follow. It does
not replace `new-page.md` (scaffolding), `edit.md` (verified writing), or `review.md` (structure/style/tech).
Those handle each page's mechanics; this handles how to write the problem a reader recognizes as their own.

## Usage

Read when asked to create, restructure, or audit a use-case page or section, or write its opening problem
statement. If unclear whether it's a build or a review, ask.

---

## The Core Idea: Earn Every Word

A reader lands on a use-case page before they know or care what ThunderID calls anything. The page's entire job,
in its opening, is to make that reader say "yes, that is exactly my problem," using words they already had
before they ever heard of this product. Every domain term the page introduces has to be *earned* by first
establishing, in plain language, the raw situation that term exists to solve. Nothing is assumed, nothing is
named before its need is obvious.

This means the opening of a use-case page contains **no product or domain vocabulary at all**: not the
product's own terms, and not even generic industry terms that feel basic to someone who already works in this
space. Words like "sign in," "log in," "account," "password," "recovery," "authentication," "authorization,"
"identity," "credential," and "verification" are all off-limits in the opening problem statement, no exceptions.
If a sentence needs one of these words to make sense, the sentence has skipped ahead of the reader. Rewrite it
around what is actually happening instead: not "the app needs to authenticate the user," but "the app has no
way to tell who is asking."

This is not about writing down to the reader. A product manager with no technical background should follow
every sentence, but so should an engineer. The goal is to skip nothing, not to talk slowly. Plain language and
sophistication are not in tension; condescension only shows up when the writing *comments* on how simple or hard
something is, not when it stays concrete. See Voice and Tone below.

---

## Shape the Problem as a Story, Not a Template

Ground the problem statement in one concrete, named example: a person, and something they built or are trying
to protect. Let the shape of a user story (who they are, what they want, what is stopping them) emerge from the
narrative itself. Never write out the scaffolding in the open: no "As a developer, I want to..." on the page,
no headings like "Persona" or "Goal" or "Obstacle." The reader should feel the shape without ever seeing its
skeleton.

**A worked example**, showing the full arc from raw problem to crystallized statement:

> Maya built Doodle, a small app for tracking tasks. Right now, anyone who finds the link can open it and use
> it, exactly like anyone else. Maya does not want that. She wants only certain people, herself and the handful
> of people she invites, to be able to get in. Everyone else should be turned away.
>
> Doodle, on its own, has no way to tell who is knocking. A request to open the app looks exactly the same
> whether it comes from Maya or from a complete stranger, because nothing in that request carries a name or a
> face.
>
> That is why Doodle cannot act on Maya's wish yet. Waving one person through and turning another away both
> depend on knowing who is asking first, and right now, every visitor looks identical to it.
>
> That is the problem Maya actually has to solve before anything else: not what her invited people should be
> able to do once they are in, but telling one person from another, reliably, every time someone shows up.

Notice what this does: names a person and a concrete thing they built (not an abstract role, not "you," not a
faceless "an app"); states a plain-language goal (restrict who gets in); states the obstacle as a fact about the
world, not a lecture; and ends on one crystallized sentence that names the real problem without naming any
solution. Nothing here could be swapped for "authentication" or "access control" without losing precision, but
nothing here uses either term either.

### Each paragraph must move, not restate

The most common failure at this stage is circling the same insight two or three times in slightly different
words, because it feels like reinforcement. It reads as padding instead. A reader who understood the first
sentence gets nothing from the second and third beyond confirmation they were right, which is a worse use of
their attention than moving forward. Before adding a paragraph, ask what new fact, consequence, or stake it
introduces that the previous paragraph did not already establish. If the honest answer is "the same thing, said
another way," cut it or merge it into the paragraph it repeats.

### Keep it short, not blocky

Prefer several short paragraphs (two to four sentences) over a few long ones. A wall of continuous prose reads
as heavy regardless of how plain the words are. If a paragraph is doing two jobs (stating a fact and drawing out
its consequence, say), consider splitting it at that seam.

---

## Voice and Tone

- **Never comment on difficulty.** Cut any sentence that tells the reader whether something is easy or hard
  before showing it to them: "That is simple to say, but hard to actually do," "This might sound
  straightforward, but..." These frame the reader as needing reassurance rather than just stating the next
  fact. State the obstacle directly and let its difficulty speak for itself.
- **No condescension markers.** Cut "simply," "just," "easily," "all you need to do is," "obviously." These
  appear naturally in the middle of ordinary sentences, so check every stray "just" and "simply" specifically,
  not only sentence openers.
- **Third-person, concretely named.** Ground the story in one named person and one named thing they made or
  use, never a bare "you," an abstract "a developer," or a faceless "an application." A name and a concrete
  noun ("Maya," "Doodle") do more work than any amount of explanation.
- **State the scenario; do not announce it.** Open on the fact itself ("Maya built Doodle...") rather than
  narrating that you are about to give an example ("Imagine a developer who...", "Consider the following
  scenario:").
- **No filler, no AI-vocabulary, no em dashes, no rhetorical scaffolding.** These rules are not specific to
  use-case pages; they apply to all ThunderID docs and are covered in full in `style.md`. Apply them here too.

---

## Diagrams: Avoid Unless Truly Necessary

Default to prose. A diagram is justified only when a reader genuinely cannot follow the relationship between
several moving parts from a sentence or two, not because a diagram is available or expected at this point in a
use-case page. In particular:

- **Never diagram the problem statement.** The opening problem is a single-thread story about one person and
  one obstacle; there is nothing structural to diagram yet. If you find yourself reaching for a box-and-arrow
  diagram here, the paragraph needs tightening instead.
- **If a diagram is later justified** (for example, once the page introduces a real architecture with several
  interacting parts), use a fenced ` ```mermaid ` block, never raw SVG or ASCII art, and never override the
  site's shared color theme (`docusaurus.config.ts` → `themeConfig.mermaid`) with per-diagram styling.
- **When genuinely unsure**, do not add one on your own judgment: say what you think the diagram would show and
  why, and ask before drawing it.

---

## Structure and Placement (Mechanical)

These are the parts of `new-page.md`'s and `check.md`'s job that are specific to use-case pages:

- **Title states the problem, not the solution's name.** "Secure a New Application," not "Access Control."
- **Sidebar labels must stand on their own and imply order.** A reader should be able to infer the reading
  sequence of a section from its sidebar labels alone, without opening any page.
- **Register every new page in the sidebar in the same change that creates it.** An unregistered page is an
  orphan CI flags.
- **No dead-end routing.** If a page recommends a sibling use-case for a different scenario, link to a real
  existing page. Omit the recommendation entirely rather than naming a pattern that has no page yet.
- **Every link's visible text matches its target page's real title.**

For a page's later sections (once the problem statement is established and the page moves on to naming a
solution), keep applying the same discipline: introduce a term only once the reader has seen why it is needed,
verify every technical claim against the codebase (`edit.md`'s standard), and keep prose calibrated to the same
plain, unhedged voice established in the opening.
