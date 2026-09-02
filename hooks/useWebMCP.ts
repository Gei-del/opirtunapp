"use client";

import { RefObject, useEffect, useState } from "react";
import { CandidateProfile, Opportunity } from "@/types/domain";
import { calculateMatch } from "@/lib/matching";

type Actions = {
  selectOpportunity: (id: string) => void;
  stageApplication: (id: string, motivation?: string) => Promise<{ id: string; status: string }>;
  listApplications: () => Promise<unknown[]>;
};

function objectInput(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Input must be an object.");
  return input as Record<string, unknown>;
}

function matchesQuery(text: string, query: string) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const normalizedText = text.toLowerCase();
  return tokens.every((token) => normalizedText.includes(token));
}

export function useWebMCP(profile: CandidateProfile, opportunities: Opportunity[], actionsRef: RefObject<Actions>) {
  const [status, setStatus] = useState<"checking" | "available" | "unavailable" | "error">("checking");

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) { setStatus("unavailable"); return; }
    const lifecycle = new AbortController();
    const register = (tool: WebMCPTool) => Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal }));
    const findOpportunity = (id: string) => {
      const opportunity = opportunities.find((item) => item.id === id);
      if (!opportunity) throw new Error(`Unknown opportunity_id: ${id}`);
      return opportunity;
    };

    Promise.all([
      register({
        name: "get_candidate_profile",
        title: "Get candidate profile",
        description: "Read the synthetic candidate profile currently visible in the workspace. Use it before checking eligibility.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => profile,
      }),
      register({
        name: "search_opportunities",
        title: "Search opportunities",
        description: "Search the visible opportunity catalog by keywords, opportunity type, or remote availability. Returns concise records with stable IDs.",
        inputSchema: { type: "object", properties: { query: { type: "string" }, type: { type: "string", enum: ["Scholarship", "Fellowship", "Internship", "Hackathon"] }, remote_only: { type: "boolean" } }, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: (input) => {
          const values = objectInput(input);
          const query = typeof values.query === "string" ? values.query : "";
          return opportunities.filter((item) => {
            const haystack = `${item.title} ${item.organization} ${item.summary}`.toLowerCase();
            return matchesQuery(haystack, query) && (!values.type || item.type === values.type) && (!values.remote_only || item.remote);
          }).map(({ id, title, organization, type, deadline, remote }) => ({ id, title, organization, type, deadline, remote }));
        },
      }),
      register({
        name: "check_opportunity_eligibility",
        title: "Check opportunity eligibility",
        description: "Compare the visible candidate profile with one opportunity. Returns an explainable score and requirement-level evidence; it never changes application state.",
        inputSchema: { type: "object", properties: { opportunity_id: { type: "string", description: "Stable ID returned by search_opportunities." } }, required: ["opportunity_id"], additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: (input) => {
          const id = objectInput(input).opportunity_id;
          if (typeof id !== "string") throw new Error("opportunity_id must be a string.");
          return calculateMatch(profile, findOpportunity(id));
        },
      }),
      register({
        name: "open_opportunity_review",
        title: "Open opportunity review",
        description: "Navigate the shared workspace to an opportunity so the person can review its match evidence. This changes visible selection only.",
        inputSchema: { type: "object", properties: { opportunity_id: { type: "string" } }, required: ["opportunity_id"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => {
          const id = objectInput(input).opportunity_id;
          if (typeof id !== "string") throw new Error("opportunity_id must be a string.");
          findOpportunity(id); actionsRef.current?.selectOpportunity(id);
          return { opportunity_id: id, visible_state: "review_open" };
        },
      }),
      register({
        name: "list_application_drafts",
        title: "List application drafts",
        description: "Read the candidate's application trail, including draft, ready, and submitted demo records. Use it to avoid preparing duplicate applications.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: async () => actionsRef.current?.listApplications() ?? [],
      }),
      register({
        name: "stage_application",
        title: "Stage application draft",
        description: "Create or update a reviewable application draft for an opportunity. This does not submit the application; final submission always requires a visible human confirmation.",
        inputSchema: { type: "object", properties: { opportunity_id: { type: "string" }, motivation: { type: "string", minLength: 20, maxLength: 600 } }, required: ["opportunity_id"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: async (input) => {
          const values = objectInput(input);
          if (typeof values.opportunity_id !== "string") throw new Error("opportunity_id must be a string.");
          findOpportunity(values.opportunity_id);
          return actionsRef.current?.stageApplication(values.opportunity_id, typeof values.motivation === "string" ? values.motivation : undefined);
        },
      }),
    ]).then(() => setStatus("available")).catch(() => setStatus("error"));
    return () => lifecycle.abort();
  }, [actionsRef, opportunities, profile]);

  return status;
}
