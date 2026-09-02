# Design direction

## North Star

An opportunity desk that feels like a trusted application dossier: calm enough
for a high-stakes decision, vivid enough to make progress feel possible.

## Audience and job

The product serves students and early-career applicants who need to compare
eligibility requirements and prepare applications without losing control of
their personal information. Its primary job is to turn a scattered opportunity
search into one reviewable, consent-based workflow.

## Visual system

- Canvas — `#F4F7FB`: quiet blue-white working surface.
- Paper — `#FFFFFF`: records and review surfaces.
- Ink — `#17243D`: primary text and structural lines.
- Cobalt — `#1F4FD1`: primary action and active status.
- Saffron — `#F2B84B`: deadlines, highlights, and the signature path.
- Mint — `#DDF4E8`: positive eligibility evidence.
- Display type — Georgia, used only for the product thesis and section titles.
- Body type — Inter/system sans-serif for readable controls and explanations.
- Utility type — ui-monospace for agent tools, identifiers, and audit events.

The runtime source of truth is the custom-property block in `app/globals.css`.
This document names the stable semantic decisions; components only consume the
runtime tokens.

## Layout and signature

Desktop uses a narrow navigation rail, a central opportunity ledger, and a
contextual review panel. Mobile collapses to a single reading column. The
signature element is the **evidence path**: a saffron line connects profile
facts to matched requirements and ends at a human consent checkpoint.

## Interaction

Controls use compact, descriptive verbs. State-changing agent actions prepare
work but never impersonate human consent. Motion is limited to one entrance
sequence and short state transitions, with reduced-motion support.

## Anti-references

Avoid neon-on-black AI styling, glass cards, gradient headlines, oversized
metric tiles, decorative charts, and unexplained scores.
