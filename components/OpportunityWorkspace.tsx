"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { demoCandidate, demoOpportunities } from "@/data/demo";
import { useWebMCP } from "@/hooks/useWebMCP";
import { calculateMatch } from "@/lib/matching";
import { listApplications, saveApplication } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ApplicationDraft, OpportunityType } from "@/types/domain";
import { Button, ConfirmDialog, Icon, ScoreRing } from "@/components/ui";

function matchesQuery(text: string, query: string) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const normalizedText = text.toLowerCase();
  return tokens.every((token) => normalizedText.includes(token));
}

const typeFilters: Array<"All" | OpportunityType> = ["All", "Scholarship", "Fellowship", "Internship", "Hackathon"];

export function OpportunityWorkspace() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof typeFilters)[number]>("All");
  const [selectedId, setSelectedId] = useState(demoOpportunities[0].id);
  const [applications, setApplications] = useState<ApplicationDraft[]>([]);
  const [activeDraft, setActiveDraft] = useState<ApplicationDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState("Ready for human + agent collaboration.");

  useEffect(() => { listApplications().then(setApplications).catch(() => setNotice("Draft storage is unavailable. Reload to try again.")); }, []);

  const selected = demoOpportunities.find((item) => item.id === selectedId) ?? demoOpportunities[0];
  const match = useMemo(() => calculateMatch(demoCandidate, selected), [selected]);
  const filtered = useMemo(() => {
    return demoOpportunities.filter((item) => {
      const text = `${item.title} ${item.organization} ${item.summary}`.toLowerCase();
      return matchesQuery(text, query) && (type === "All" || item.type === type);
    });
  }, [query, type]);

  const stageApplication = useCallback(async (opportunityId: string, motivation?: string) => {
    const opportunity = demoOpportunities.find((item) => item.id === opportunityId);
    if (!opportunity) throw new Error("Opportunity not found.");
    const result = calculateMatch(demoCandidate, opportunity);
    const draft: ApplicationDraft = {
      id: applications.find((item) => item.opportunityId === opportunityId)?.id ?? crypto.randomUUID(),
      opportunityId,
      candidateId: demoCandidate.id,
      status: "ready",
      motivation: motivation ?? `I am applying to ${opportunity.title} to bring my software engineering experience into a program focused on practical, inclusive technology. My work combines full-stack development, data, and responsible AI with a commitment to making digital opportunities easier to access.`,
      evidence: result.results.filter((item) => item.matched).map((item) => item.evidence),
      createdAt: new Date().toISOString(),
    };
    const saved = await saveApplication(draft);
    setApplications((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
    setSelectedId(opportunityId);
    setActiveDraft(saved);
    setNotice(`Draft prepared for ${opportunity.title}. Human review is required.`);
    return { id: saved.id, status: saved.status };
  }, [applications]);

  const actionsRef = useRef({ selectOpportunity: setSelectedId, stageApplication, listApplications: async () => applications });
  actionsRef.current = { selectOpportunity: setSelectedId, stageApplication, listApplications: async () => applications };
  const webMCPStatus = useWebMCP(demoCandidate, demoOpportunities, actionsRef);

  const handleStage = async () => {
    setBusy(true);
    try { await stageApplication(selected.id); }
    catch { setNotice("The draft could not be prepared. Try again."); }
    finally { setBusy(false); }
  };

  const handleSubmit = async () => {
    if (!activeDraft) return;
    setBusy(true);
    const submitted = { ...activeDraft, status: "submitted" as const, submittedAt: new Date().toISOString() };
    try {
      await saveApplication(submitted);
      setApplications((current) => current.map((item) => item.id === submitted.id ? submitted : item));
      setActiveDraft(submitted);
      setConfirming(false);
      setNotice("Application submitted in the demo workspace. Consent recorded.");
    } catch { setNotice("Submission was not completed. Your draft is still safe."); }
    finally { setBusy(false); }
  };

  const handleReview = async () => {
    if (!activeDraft || activeDraft.motivation.trim().length < 20) {
      setNotice("Add at least 20 characters before reviewing this application.");
      return;
    }
    setBusy(true);
    try {
      const saved = await saveApplication(activeDraft);
      setApplications((current) => current.map((item) => item.id === saved.id ? saved : item));
      setConfirming(true);
    } catch {
      setNotice("Your latest edits could not be saved. Try again before submitting.");
    } finally {
      setBusy(false);
    }
  };

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#workspace" aria-label="OpirtunApp home">
        <span className="brand__mark" aria-hidden="true">O<span>+</span></span>
        <span><strong>OpirtunApp</strong><small>human-led applications</small></span>
      </a>
      <div className="topbar__status">
        <span className={`status-dot status-dot--${webMCPStatus}`} />
        <span>WebMCP {webMCPStatus}</span>
        <span className="divider" />
        <span>{isSupabaseConfigured() ? "Supabase connected" : "Secure demo mode"}</span>
      </div>
      <a className="avatar" href="#profile" aria-label="Open candidate profile">LP</a>
    </header>

    <aside className="rail" aria-label="Workspace navigation">
      <div className="rail__chapter"><span>01</span><strong>Discover</strong></div>
      <a className="rail__item rail__item--active" href="#workspace"><Icon name="search" />Opportunities</a>
      <a className="rail__item" href="#profile"><Icon name="profile" />My evidence</a>
      <a className="rail__item" href="#drafts"><Icon name="clock" />Applications <span>{applications.length}</span></a>
      <div className="rail__agent">
        <Icon name="agent" />
        <strong>Agent-ready</strong>
        <p>Six explicit tools share this workspace with your assistant.</p>
      </div>
    </aside>

    <section className="workspace" id="workspace">
      <div className="workspace__intro">
        <div>
          <p className="eyebrow">Your opportunity ledger</p>
          <h1>Find the door.<br/><em>Keep the decision.</em></h1>
        </div>
        <p className="intro-copy">Ask an agent to search and prepare the work. You review the evidence and decide what leaves your hands.</p>
      </div>

      <div className="search-row">
        <label className="search-field"><span className="sr-only">Search opportunities</span><Icon name="search"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by skill, field, or organization"/>{query && <button onClick={() => setQuery("")} aria-label="Clear search"><Icon name="close"/></button>}</label>
        <div className="filter-group" aria-label="Filter by opportunity type">
          {typeFilters.map((filter) => <button key={filter} className={type === filter ? "active" : ""} onClick={() => setType(filter)} aria-pressed={type === filter}>{filter}</button>)}
        </div>
      </div>

      <div className="ledger-layout">
        <div className="ledger" aria-label="Opportunity results">
          <div className="ledger__heading"><span>{filtered.length} opportunities</span><span>Sorted by fit</span></div>
          {filtered.length === 0 ? <div className="empty-state"><strong>No matching opportunities</strong><p>Try a broader keyword or clear the active type filter.</p><Button variant="secondary" onClick={() => { setQuery(""); setType("All"); }}>Clear filters</Button></div> : filtered.map((opportunity) => {
            const itemMatch = calculateMatch(demoCandidate, opportunity);
            return <button key={opportunity.id} className={`opportunity-row ${selected.id === opportunity.id ? "opportunity-row--selected" : ""}`} onClick={() => { setSelectedId(opportunity.id); setActiveDraft(null); }}>
              <span className={`opportunity-row__accent accent--${opportunity.accent}`} />
              <span className="opportunity-row__body"><span className="opportunity-row__meta"><span>{opportunity.type}</span><span>{opportunity.remote ? "Remote" : opportunity.location}</span></span><strong>{opportunity.title}</strong><small>{opportunity.organization}</small><span className="deadline"><Icon name="clock"/>Due {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(`${opportunity.deadline}T12:00:00`))}</span></span>
              <ScoreRing score={itemMatch.score}/>
            </button>;
          })}
        </div>

        <aside className="review" aria-label="Selected opportunity review">
          <div className="review__top"><div><span className="pill">{selected.type}</span><h2>{selected.title}</h2><p>{selected.organization} · {selected.location}</p></div><ScoreRing score={match.score}/></div>
          <p className="review__summary">{selected.summary}</p>
          <div className="evidence-path">
            <div className="evidence-path__head"><span>Profile evidence</span><strong>{match.eligible ? "Required criteria met" : "Review required"}</strong></div>
            {match.results.map((result) => <div className="evidence" key={result.requirementId}>
              <span className={`evidence__icon ${result.matched ? "evidence__icon--yes" : "evidence__icon--no"}`}>{result.matched ? <Icon name="check"/> : "!"}</span>
              <span><strong>{result.label}</strong><small>{result.evidence}</small></span>
              <em>{result.required ? "Required" : "Helpful"}</em>
            </div>)}
          </div>
          {activeDraft?.opportunityId === selected.id ? <div className="draft-panel">
            <div className="draft-panel__heading"><span><Icon name="spark"/></span><div><p className="eyebrow">Prepared with agent support</p><h3>Application draft</h3></div></div>
            <label>Motivation statement<textarea value={activeDraft.motivation} onChange={(event) => setActiveDraft({ ...activeDraft, motivation: event.target.value })} rows={6} minLength={20} maxLength={600} aria-describedby="motivation-help"/></label>
            <p className="draft-panel__help" id="motivation-help">{activeDraft.motivation.length}/600 characters · minimum 20</p>
            <p className="consent-note"><Icon name="check"/>The agent prepared this draft. Only you can confirm submission.</p>
            <Button busy={busy} onClick={handleReview} disabled={activeDraft.status === "submitted" || activeDraft.motivation.trim().length < 20}>{activeDraft.status === "submitted" ? "Submitted" : <>Review and submit <Icon name="arrow"/></>}</Button>
          </div> : <div className="review__action"><Button busy={busy} onClick={handleStage}><Icon name="spark"/>Prepare application</Button><small>Creates a draft. Nothing is submitted yet.</small></div>}
        </aside>
      </div>

      <section className="profile-strip" id="profile">
        <div><p className="eyebrow">Evidence owner</p><h2>{demoCandidate.name}</h2><p>{demoCandidate.headline}</p></div>
        <dl><div><dt>Program</dt><dd>{demoCandidate.education}</dd></div><div><dt>Progress</dt><dd>Semester {demoCandidate.semester}</dd></div><div><dt>Verified skills</dt><dd>{demoCandidate.skills.length}</dd></div></dl>
      </section>

      <section className="drafts" id="drafts">
        <div><p className="eyebrow">Application trail</p><h2>Your prepared work</h2></div>
        {applications.length === 0 ? <p className="drafts__empty">No drafts yet. Choose an opportunity and prepare the first one.</p> : applications.map((application) => <button key={application.id} onClick={() => { setSelectedId(application.opportunityId); setActiveDraft(application); }}><span className={`status-tag status-tag--${application.status}`}>{application.status}</span><strong>{demoOpportunities.find((item) => item.id === application.opportunityId)?.title}</strong><span>Open review <Icon name="arrow"/></span></button>)}
      </section>
    </section>

    <div className="live-region" role="status" aria-live="polite">{notice}</div>
    <ConfirmDialog open={confirming} title={`Submit to ${selected.title}?`} description="This records the application as submitted in the demo workspace. Review the motivation statement before continuing." onCancel={() => setConfirming(false)} onConfirm={handleSubmit} busy={busy}/>
  </main>;
}
