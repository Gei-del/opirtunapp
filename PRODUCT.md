# OpirtunApp — product brief

## Problem

Students and early-career applicants lose opportunities because requirements
are scattered, eligibility is hard to interpret, and long forms repeatedly ask
for the same information. Existing agents can attempt to click through pages,
but this is brittle and makes consent difficult to see.

## MVP promise

The application exposes a small, explicit WebMCP tool surface. A person and an
agent can search opportunities, compare requirements with a candidate profile,
stage an application, and review every field before the person submits it.

## Safety boundary

- Search and eligibility tools are read-only.
- `stage_application` creates an editable draft; it does not submit externally.
- Final submission is a visible human action in this MVP.
- Sample records are synthetic and contain no sensitive personal information.

## Business model

Candidates receive a free tier with limited matching and one active draft.
Candidate Pro adds deadline tracking, reusable evidence, and unlimited drafts.
Universities and workforce organizations license a cohort dashboard. Opportunity
providers can pay for verified listings, never for ranking or eligibility.

## Success measures

- A candidate reaches a reviewable draft in under three minutes.
- Every eligibility score includes requirement-level evidence.
- No application changes to submitted without a visible human confirmation.
