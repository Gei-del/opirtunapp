# Devpost submission draft

## Project name

OpirtunApp

## Live demo

[https://opirtunapp.vercel.app/](https://opirtunapp.vercel.app/)

## Source code

[https://github.com/Gei-del/opirtunapp](https://github.com/Gei-del/opirtunapp)

## One-line description

A WebMCP-native workspace where agents prepare opportunity applications and
people keep control of the evidence and final decision.

## Inspiration

Students and early-career applicants often miss scholarships, internships, and
programs because requirements are scattered across websites and every form asks
for the same information in a different way. The burden is highest for people
with limited time, limited connectivity, or little access to career guidance.

## What it does

The app gives a candidate one visible workspace for discovering opportunities,
checking eligibility, reviewing requirement-level evidence, and preparing an
editable application draft. An agent can do the repetitive comparison and
preparation work through six explicit WebMCP tools. The final submission remains
a visible human action.

## Why WebMCP is essential

Without WebMCP, an agent must infer meaning from cards, filters, and buttons. In
this project, the website declares exactly what the agent may read or prepare.
Tool inputs use JSON Schema, results use stable IDs, and state updates appear in
the same interface the person is viewing. This makes the workflow more reliable,
inspectable, and consent-aware than visual browser automation.

## How we built it

The application uses Next.js, React, TypeScript, and the imperative WebMCP API.
`useWebMCP` registers page-scoped tools once and cleans them up with an
`AbortController`. A deterministic matching engine maps profile evidence to
requirements. Drafts persist through a repository adapter that supports
Supabase/PostgreSQL with Row Level Security and a zero-setup local-first mode.

## Challenges

The most important design challenge was deciding what an agent should not do.
We separated read, navigate, and prepare actions, then kept final consent outside
the tool surface. We also made every score explainable at the requirement level.

## Accomplishments

- A working, non-trivial six-tool WebMCP implementation.
- Shared visible state between the user interface and agent actions.
- Explainable matching and duplicate-aware draft preparation.
- A complete responsive product experience, not only a protocol experiment.
- Supabase-ready persistence with safe synthetic sample data.

## Testing instructions

1. Open the live URL in ChatGPT's in-app browser or Chrome 149+ with WebMCP
   testing enabled.
2. Confirm that the page exposes six tools.
3. Ask the agent: “Find remote opportunities related to AI, check the best
   match, open it, and prepare an application draft. Do not submit anything.”
4. Verify that the selected opportunity and prepared draft appear in the same
   visible workspace.
5. Edit the motivation statement and use the human-only checkpoint to mark the
   application as submitted. Reload the page to confirm the application trail
   persists.

## What we learned

Agent-ready design is not the same as adding chat to a website. The strongest
experience comes from exposing narrow, well-named capabilities and making the
human checkpoint part of the product architecture.

## What's next

Next steps include authenticated evidence profiles, encrypted documents,
calendar reminders, real provider integrations, Spanish localization, and a
university cohort pilot in Colombia.
