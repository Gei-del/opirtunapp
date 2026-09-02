"use client";

import { forwardRef, ReactNode, useEffect, useRef } from "react";

export function Icon({ name }: { name: "search" | "spark" | "profile" | "check" | "clock" | "arrow" | "close" | "agent" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    spark: <><path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2 2-7Z"/><path d="m19 3 .5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2Z"/></>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    agent: <><rect x="4" y="6" width="16" height="13" rx="3"/><path d="M12 2v4M8 11h.01M16 11h.01M8 15h8"/></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: "primary" | "secondary" | "ghost"; busy?: boolean }>(function Button({ children, variant = "primary", busy, ...props }, ref) {
  return <button ref={ref} className={`button button--${variant}`} disabled={busy || props.disabled} aria-busy={busy} {...props}>{busy ? <span className="spinner" aria-hidden="true" /> : children}</button>;
});

export function ScoreRing({ score }: { score: number }) {
  return <div className="score-ring" style={{ "--score": score } as React.CSSProperties} aria-label={`${score}% profile match`}><strong>{score}</strong><span>%</span></div>;
}

export function ConfirmDialog({ open, title, description, onCancel, onConfirm, busy }: { open: boolean; title: string; description: string; onCancel: () => void; onConfirm: () => void; busy: boolean }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);
  if (!open) return null;
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
      <div className="dialog__mark"><Icon name="check" /></div>
      <p className="eyebrow">Human checkpoint</p>
      <h2 id="dialog-title">{title}</h2>
      <p id="dialog-description">{description}</p>
      <div className="dialog__actions">
        <Button ref={cancelRef} variant="secondary" onClick={onCancel}>Keep as draft</Button>
        <Button busy={busy} onClick={onConfirm}>Confirm submission</Button>
      </div>
    </section>
  </div>;
}
