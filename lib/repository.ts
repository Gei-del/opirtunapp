import { createSupabaseBrowserClient } from "@/lib/supabase";
import { ApplicationDraft } from "@/types/domain";

const STORAGE_KEY = "opirtunapp:applications";

function readLocal(): ApplicationDraft[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as ApplicationDraft[];
  } catch {
    return [];
  }
}

function writeLocal(applications: ApplicationDraft[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export async function listApplications(): Promise<ApplicationDraft[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return readLocal();
  const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    opportunityId: row.opportunity_id,
    candidateId: row.candidate_id,
    status: row.status,
    motivation: row.motivation,
    evidence: row.evidence ?? [],
    createdAt: row.created_at,
    submittedAt: row.submitted_at ?? undefined,
  }));
}

export async function saveApplication(draft: ApplicationDraft): Promise<ApplicationDraft> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    const current = readLocal().filter((item) => item.id !== draft.id);
    writeLocal([draft, ...current]);
    return draft;
  }
  const { error } = await supabase.from("applications").upsert({
    id: draft.id,
    opportunity_id: draft.opportunityId,
    candidate_id: draft.candidateId,
    status: draft.status,
    motivation: draft.motivation,
    evidence: draft.evidence,
    created_at: draft.createdAt,
    submitted_at: draft.submittedAt ?? null,
  });
  if (error) throw error;
  return draft;
}
