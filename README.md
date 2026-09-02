# OpirtunApp

**A human-led application workspace built for the agent-native web.**

**Live demo:** [opirtunapp.vercel.app](https://opirtunapp.vercel.app/)

OpirtunApp helps students and early-career candidates discover
opportunities, understand why they qualify, prepare a strong application, and
retain control of the final decision. It is a working Next.js application with
an imperative WebMCP tool surface and Supabase-ready persistence.

> Built by ByteNova for The WebMCP Challenge.

## Why WebMCP

Applying for a scholarship, internship, fellowship, or hackathon usually means
opening many pages, interpreting inconsistent requirements, and completing
repetitive forms. A general browser agent can attempt this through visual
clicks, but every UI step introduces ambiguity.

This app exposes explicit capabilities with `document.modelContext.registerTool`.
The agent searches and prepares; the person sees the same state, reviews the
evidence, edits the draft, and provides final consent.

## WebMCP tool surface

| Tool | Class | Purpose |
| --- | --- | --- |
| `get_candidate_profile` | Read | Returns the visible synthetic candidate profile |
| `search_opportunities` | Read | Searches by text, type, and remote availability |
| `check_opportunity_eligibility` | Read | Returns an explainable requirement-level match |
| `open_opportunity_review` | Navigate | Opens the same review surface for person and agent |
| `list_application_drafts` | Read | Returns the application trail and avoids duplicates |
| `stage_application` | Prepare | Creates an editable draft without submitting it |

The final **Confirm submission** action intentionally remains human-only. This
is a product decision, not a missing tool: an agent may prepare consequential
work but cannot impersonate consent.

## Product experience

- Six synthetic opportunities spanning scholarships, fellowships, internships,
  and hackathons.
- Explainable matching instead of a mysterious score.
- Shared visible state when an agent opens an opportunity.
- Editable motivation statement with a consent checkpoint.
- Application trail with safe retry behavior.
- Responsive, keyboard-accessible interface designed toward WCAG 2.2 AA.
- Local demo persistence with optional Supabase production persistence.

## Technology

- Next.js 15 App Router
- React 19 and TypeScript
- Imperative WebMCP API
- Supabase/PostgreSQL with Row Level Security
- CSS design system without a component framework

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app automatically enters secure demo mode when Supabase variables are not
present. Demo mode is fully functional and persists drafts in local storage.

## Connect Supabase

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add your project URL and anonymous key:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The included anonymous policies are limited to the synthetic hackathon profile.
Replace them with authenticated per-user policies before using real applicant
data.

## Test WebMCP

### ChatGPT

Open the deployed URL in ChatGPT's in-app browser, then ask:

> Find remote opportunities related to AI, check which one fits this candidate,
> open the best match, and prepare an application draft. Do not submit anything.

### Chrome

1. Use a Chrome version with WebMCP testing support.
2. Enable `chrome://flags/#enable-webmcp-testing` and relaunch Chrome.
3. Install the official WebMCP testing extension if needed.
4. Open the application and inspect the six registered tools.

## Quality checks

```bash
npm run typecheck
npm run build
```

## Repository map

```text
app/                 Next.js route, metadata, and runtime design tokens
components/          Product workspace and shared UI primitives
data/                Synthetic opportunity and candidate records
hooks/               WebMCP registration and lifecycle
lib/                 Explainable matching and persistence adapters
supabase/            PostgreSQL schema and demo RLS policies
types/               Domain and browser API declarations
PRODUCT.md           Product, safety, and business decisions
DESIGN.md            Durable visual direction
UX-CONTRACT.md        Interaction, recovery, and consent contract
```

## Business model

The candidate tier is free for limited matches and one active draft. Candidate
Pro adds unlimited drafts, reminders, and a reusable evidence vault. Universities
and workforce organizations can license cohort support. Opportunity providers
may pay for verified listings, but payment never affects eligibility or ranking.

See [`docs/BUSINESS_MODEL.md`](docs/BUSINESS_MODEL.md) for the full model.

## Privacy and scope

All included data is synthetic. This prototype does not submit to external
organizations. A production release would require authentication, encrypted
document storage, provider integrations, retention controls, and jurisdiction-
appropriate privacy review.

## License

[MIT](LICENSE)
