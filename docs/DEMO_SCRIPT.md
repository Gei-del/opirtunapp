# Demo script — target: 2 minutes 30 seconds

## 0:00–0:20 — The problem

“Applying to an opportunity should not require opening ten tabs and decoding
every requirement alone. OpirtunApp gives candidates one workspace
where an AI agent can prepare the repetitive work without taking away the final
decision.”

## 0:20–0:42 — Human interface

Show the opportunity ledger, filters, candidate profile, and explainable match.

“The interface includes synthetic opportunities and one candidate profile. Each
score is backed by requirement-level evidence, so it never becomes a mysterious
AI recommendation.”

## 0:42–1:35 — Agent workflow

Prompt the agent:

> Find remote opportunities related to AI. Check the candidate's eligibility,
> open the strongest match, and prepare an application draft. Do not submit it.

Show calls to `get_candidate_profile`, `search_opportunities`,
`check_opportunity_eligibility`, `open_opportunity_review`, and
`stage_application`.

“These are imperative WebMCP tools registered by the page. The agent does not
guess which card or button to click. It receives typed inputs, stable IDs, and
concise results. When it opens the match, the page updates visibly for me.”

## 1:35–2:05 — Human checkpoint

Edit one sentence, select **Review and submit**, and show the confirmation dialog.

“The agent can create a reviewable draft, but it cannot submit. I can edit the
statement, see the evidence it used, and provide explicit consent. That boundary
is intentional.”

## 2:05–2:25 — Architecture

Briefly show the tool table in the README and the Supabase schema.

“The product uses Next.js and TypeScript, with Supabase persistence and Row Level
Security when configured. A local-first adapter keeps the judging experience
reliable without credentials.”

## 2:25–2:40 — Close

“WebMCP turns this from a website an agent can try to click into a workspace a
person and agent can understand together. The agent prepares. The person decides.”

End on the application trail with the **Submitted** status visible.
