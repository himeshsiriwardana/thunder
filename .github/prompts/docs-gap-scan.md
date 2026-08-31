You are running a **documentation architecture scan** for the ThunderID monorepo. You do
not just check whether things are documented; you assess how well the documentation is
architected: what *kind* of page exists for each capability (Diataxis), how *deep* coverage
goes (an L0-L5 maturity level), plus config coverage and stale references.

You are read-only. Do NOT edit, create, or delete any file except the two output files named
at the end. Do not open pull requests or push commits.

## Start here: read the baked inventory

A deterministic build step has already extracted the source-of-truth lists into
`docs-scan-inventory.md` at the repository root. **Read that file first.** It contains:

- the purpose of every `api/*.yaml` spec (title + description),
- the list of `backend/internal/*/` service directories,
- the full `deployment.yaml` config, and
- an index of every `docs/content/` page, each line prefixed with its **Diataxis quadrant**
  in `[BRACKETS]` (derived from its path).

Treat these as the **complete** inventories. Keeping this scan cheap depends on it:

- Do NOT read whole `api/*.yaml` specs or whole doc pages to rebuild what the inventory
  already gives you.
- To check coverage, **Grep** `docs/content/` for the specific capability, endpoint, or
  config-key name (Grep returns only matching lines). Read a targeted section of a single
  page only when a Grep hit is genuinely ambiguous.

## The framework: Diataxis

Every doc page is one of four types. The inventory tags each page with its quadrant:

- **TUTORIAL** (`getting-started/`) - learning-oriented, gets a newcomer to a first win.
- **HOWTO** (`guides/`) - task-oriented, solves one real problem.
- **EXPLANATION** (`key-concepts/`, `working-with-ai/`) - understanding-oriented, the what/why.
- **REFERENCE** (`apis`, `sdks/`) - information-oriented, largely auto-generated here.
- Plus JOURNEY (`use-cases/`, an end-to-end path above the quadrants), OPERATIONS
  (`deployment/`), and COMMUNITY (`community/`).

NOTE: `docs/content/apis.mdx` is auto-generated from the specs, so REFERENCE is never
"missing" for an API. Never report a missing endpoint/parameter description as a gap.

## The measurable spine: maturity level (L0-L5)

For each **capability**, determine which Diataxis quadrants cover it by grepping
`docs/content/`, then assign a level. Draw capabilities from every source in the inventory,
not just API specs:

- each user-facing `api/*.yaml` spec,
- each user-facing `backend/internal/*` service,
- each user-facing `backend/internal/system/*` subpackage (these are cross-cutting features
  that often have NO API spec, e.g. post-quantum crypto lives in `system/cryptolib`; this is
  where undocumented, code-only features hide, so check them),
- each "specless service" listed in the inventory (a service with no matching `api/<name>.yaml`,
  verify against docs by grepping, since some are covered under a differently-named spec).

For any code-only capability (no spec), if it is user-relevant and has zero prose in
`docs/content/`, that is an L0/L1 undocumented-feature finding, grounded in the code path.
Assign a level:

- **L0 Undocumented** - no page and no reference anywhere.
- **L1 Reference only** - an auto-generated spec / SDK reference exists, but no prose.
- **L2 + Explanation** - an EXPLANATION page explains what it is and why it matters.
- **L3 + How-to** - at least one HOWTO guide walks through using it.
- **L4 + Tutorial/Journey** - an end-to-end TUTORIAL or JOURNEY path covers it.
- **L5 Architected** - L4 plus cross-linked, example-backed, SDK/audience parity, verified
  current. You usually cannot fully verify L5 mechanically; cap your mechanical assignment
  at L4 and list any L5 *candidates* separately rather than asserting L5.

Levels are cumulative-ish: assign the highest level whose requirement is met, but call out
in Notes when a lower quadrant is skipped (e.g. an L3 how-to with no L2 explanation).

### The standard to grade against
- **No user-facing capability may sit below L2.** Every one below L2 is a "below-standard"
  finding, the headline metric.
- **The four product pillars must reach L4+**: Agent-native Identity, Post-quantum-safe by
  Design, Decentralized Identity, Lightweight Runtime with GitOps Support.
- Internal plumbing (e.g. `runtimestore`, `attributecache`) is not user-facing; exclude it
  from the maturity assessment and say so, rather than scoring it L0.

## Staying grounded

The failure mode is inventing plausible gaps. Avoid it:
- Every finding MUST cite a concrete source path as evidence.
- Before claiming a quadrant is missing, actually Grep `docs/content/` for the capability.
  Report only absence you verified.
- Prefer fewer, well-substantiated findings over a long speculative list.

## Also assess (non-maturity dimensions)

- **Config coverage**: `deployment.yaml` keys a user would set that are not documented under
  `docs/content/deployment/` (OPERATIONS).

### Accuracy and staleness (drift detection)

Catch documentation that is not just missing but **wrong**: a reader following it would get
a broken or incorrect result. This is the most token-hungry check, so it is deliberately
bounded. Two tiers:

**Tier A - Dangling references** (cheap, run across the whole doc set):
Docs that reference endpoints, config keys, fields, or identifiers that no longer exist.
Grep the identifier in `api/`, `backend/`, or `deployment.yaml`; flag references with no match.

**Tier B - Drift candidates** (targeted, hard-capped):
The inventory gives each doc page's last-commit date and each source area's last-commit date.
A page is a **drift risk** when its subject's source changed *after* the page did. Rank pages
by drift risk (largest source-newer-than-doc gap first) and **deep-check only the top 12.**
For each, extract the concrete, checkable claims (documented values, enums, endpoint paths,
field names, ports, defaults) and verify each against the current spec/config via Grep, not
by reading the whole page.
- Rate a mismatch **HIGH** severity when a user following the doc would get a wrong result
  (wrong value, removed endpoint, renamed field, changed default).
- Rate it **MEDIUM** when outdated but not breaking.
- Do NOT exceed 12 deep-checked pages. Record how many drift candidates went unchecked so the
  cap is never mistaken for "everything is accurate."

### Product signals (docs-as-diagnostic)

When documentation is hard to write, that is often a **product** signal, not a writing
problem. Derive these from data you already have (maturity quadrants, per-spec endpoint
counts, the config) so they cost almost nothing. Frame every item as a **hypothesis for the
product team to weigh, not a verdict**, cite the concrete evidence, and keep confidence
LOW-to-MEDIUM. Report a signal only when the evidence is unambiguous.

- **Exposed as plumbing**: a user-facing capability with REFERENCE present but no HOWTO and no
  JOURNEY. Hypothesis: users get a raw API with no task-level path; consider a guided flow or
  higher-level abstraction. (Pure reuse of the quadrant data, zero extra cost.)
- **High surface complexity**: a capability whose spec has a large endpoint count relative to
  peers (the inventory lists each) while sitting at low maturity. Hypothesis: broad surface
  area is hard to learn; consider consolidation or sensible presets.
- **Onboarding friction from config**: keys in `deployment.yaml` that look required but have no
  safe default (empty, placeholder, or a secret with no value). Hypothesis: heavy required
  setup raises time-to-first-success; consider better defaults.
- **Terminology inconsistency**: the same concept named differently across specs (e.g. an org
  identifier as `org_id` in one spec and `organizationId` in another). **Bounded check**: pick
  at most 5 recurring concepts (identifiers, pagination params, timestamps, error fields) and
  Grep them across `api/` to spot drift. Do not exceed 5 concepts. Hypothesis: inconsistent
  naming is a DX defect worth fixing at the product level.

Never present a hypothesis as a confirmed product bug.

### Reader demand (priority weighting)

If `docs-demand-signals.md` exists at the repo root, read it. It lists the top **no-result**
searches and top searches from the live docs site, i.e. real reader intent. Use it to
**weight everything above into a priority order**, so the team fixes what readers actually
need first:

- A frequent **no-result** search that maps to a capability/topic with a coverage, maturity,
  or accuracy gap is the **highest** priority: readers are actively asking and getting
  nothing. Grep the docs index for each such query; if nothing matches, it is a
  demand-backed gap.
- A **popular** search landing on a thin or low-maturity page is next.
- A gap with no matching demand signal ranks lower.

Match queries to capabilities and doc paths by their terms. Do NOT invent demand; use only
what the file contains. If the file says no data is available, note that demand weighting was
unavailable and fall back to severity-only ordering.

## Scoring: the Documentation Health Score (0-100)

Compute one objective, reproducible score so runs can be compared over time. Show the four
components so the number is transparent, do not hand-wave it.

- **Coverage (0-50)** - how completely features are documented. For each user-facing
  capability, `ratio = min(level / target, 1)`. `Coverage = round(mean(ratio) * 50)`.
- **Pillars (0-20)** - whether the four flagship capabilities meet their target (all target
  L4): Agent-native Identity, Post-quantum-safe by Design, Decentralized Identity, Lightweight
  Runtime with GitOps Support. `Pillars = round(pillars_meeting_target / 4 * 20)`.
- **Accuracy (0-20)** - whether docs match the product. Start at 20; subtract 4 per HIGH
  inaccuracy, 2 per MEDIUM, 3 per dangling reference; floor at 0.
- **Config (0-10)** - whether settings are documented.
  `Config = round(documented_applicable_keys / total_applicable_keys * 10)`.
- **Health Score = Coverage + Pillars + Accuracy + Config.**
- **Grade:** A = 90+, B = 75-89, C = 60-74, D = 40-59, F = below 40.

## Write for someone who will act, not an architect

The report is read by a documentation manager assigning work, not by whoever built the scanner.
So:

- **No internal jargon in the reader-facing sections.** Do not write "L2", "L3", "Diataxis",
  or "quadrant". Use plain terms: **Explainer** (a page explaining what it is and why it
  matters), **How-to** (step-by-step instructions for one task), **Walkthrough** (a
  start-to-finish worked example), **Reference** (the API spec, mostly auto-generated).
- **Every gap becomes a concrete action.** The Action Plan is the point of the report: a
  writer should be able to pick up any row and start. Name the page to create or edit, and say
  the reader impact in one plain sentence.

## Output: two files at the repository root

Run `date -u '+%Y-%m-%d %H:%M UTC'` for the timestamp and `git rev-parse --short HEAD` for
the commit.

### 1. `docs-gap-metrics.json` (machine-readable, for trend tracking)

Exact shape, integers only:

```json
{
  "generated": "<timestamp>",
  "commit": "<short sha>",
  "health_score": 0,
  "grade": "<A-F>",
  "score_breakdown": { "coverage": 0, "pillars": 0, "accuracy": 0, "config": 0 },
  "capabilities_assessed": 0,
  "maturity": { "L0": 0, "L1": 0, "L2": 0, "L3": 0, "L4": 0, "L5": 0 },
  "below_standard": 0,
  "actions": { "high": 0, "medium": 0, "low": 0 },
  "action_items": [
    {
      "id": "post-quantum-cryptography",
      "priority": "high",
      "points": 7,
      "effort": "L",
      "title": "Document post-quantum signing end to end",
      "why": "A flagship pillar the product ships is completely undocumented.",
      "where": "new key-concepts/post-quantum-cryptography.mdx + guides/crypto/post-quantum-signing.mdx"
    }
  ],
  "config_gaps": 0,
  "dangling_refs": 0,
  "inaccuracies_high": 0,
  "inaccuracies_medium": 0,
  "drift_unchecked": 0,
  "unmet_search_intents": 0
}
```

`below_standard` = user-facing capabilities that lack even an explainer. `actions` = count of
Action Plan items per priority. `action_items` = one object per Action Plan row, in the same
Points order, with a **stable `id`**: a kebab-case slug of the feature (e.g.
`post-quantum-cryptography`, `server-configuration-api`). The `id` must stay the same across
runs for the same gap so downstream automation can track it without duplicating; derive it from
the feature, never from the wording. `priority` is `high` / `medium` / `low`. `dangling_refs` /
`inaccuracies_*` feed the Accuracy score. `unmet_search_intents` = frequent no-result searches
with no matching page (0 if demand signals were unavailable).

### 2. `docs-gap-report.md` (the human-readable report)

Use exactly this structure:

```
# Documentation Health Report

_Generated: <timestamp> - commit: <short sha>_

## Health Score: <N>/100 (Grade <A-F>)

<One plain sentence on what the score means for the reader experience.>

| Component | Score | What it measures |
|---|---|---|
| Coverage | <c>/50 | How completely each feature is documented |
| Pillars | <p>/20 | Whether the four flagship capabilities are fully documented |
| Accuracy | <a>/20 | Whether the docs still match the product |
| Config | <w>/10 | Whether every setting is documented |

## In plain terms

<3 to 5 short sentences, zero jargon: what is solid, what is missing, and the single most
important thing to do first. For someone assigning the work.>

## Action plan

The complete, prioritized list of what to do, most important first. Every gap found anywhere in
this scan appears here as one concrete task.

The **Points** column is how many Health Score points the action recovers when done, computed
from the score formula (a pillar going to full depth is worth ~5 Pillar points; a feature going
from reference-only to fully documented is worth about `(1 - current_ratio) / capabilities * 50`
Coverage points; fixing a wrong/broken item restores its Accuracy penalty). Round to whole
points. **Order the whole plan by Points, highest first** (this, not just severity, is the
priority), and within the same Points band keep the higher-impact item first.

Effort key: S = a few hours, M = about a day, L = several days.

### High priority

| # | Points | What to do | Why it matters | Effort | Where |
|---|---|---|---|---|---|
| 1 | +N | <plain task, e.g. "Write an explainer and a how-to for post-quantum signing"> | <reader impact in one sentence> | S/M/L | <page to create or edit> |

### Medium priority

(same columns, continue numbering)

### Low priority

(same columns, continue numbering)

At the end of the Action Plan, add one line: "Completing all High-priority items would raise the
score from `<current>` to about `<projected>`." so the payoff of the top items is explicit.

## Scorecard (the detail behind the score)

"Explainer" = a what/why page. "How-to" = task steps. "Walkthrough" = a worked example.
"Reference" = the API spec.

| Feature | Explainer | How-to | Walkthrough | Reference | Complete | Target | What is missing |
|---|---|---|---|---|---|---|---|
| ... | yes / no | yes / no | yes / no | yes / no | <pct> | <pct> | ... |

(One row per user-facing feature, least complete first. "Complete" = level / target as a
percentage, e.g. reference-only against a full target = 25%.)

## Accuracy check

- **Broken references** (docs mention something that no longer exists): <count or "none found">
- **Wrong information** (docs that would give a wrong result): <count or "none found">

<If any, a table: | Page | What it says | What is actually true | Severity | Evidence |. >

_Checked the <n> most at-risk pages of <total>; <n> not yet checked, so this is not a clean
bill of health for the whole site._

## For the product team (optional)

<Only if the scan surfaced product friction (a capability exposed as a raw API with no task
path, an over-complex surface, config with no safe default, inconsistent naming). Plain
hypotheses, not confirmed bugs. Omit the section entirely if nothing solid surfaced.>

## How this was measured

<One or two lines: the score formula, whether reader-demand data was available, and the caps
applied (e.g. accuracy deep-checked at most 12 pages).>
```

If a section has no findings, keep its heading and write "None found." underneath. The two
files are the deliverable; do not print them to stdout beyond what the tools require.
