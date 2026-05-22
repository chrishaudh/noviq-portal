"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { approvePublicQuote, getPublicQuote, rejectPublicQuote } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { PublicQuote } from "@/types";

export default function PublicQuotePage({ params }: { params: { quoteId: string } }) {
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const brand = useMemo(() => ({ primary: quote?.business.primary_color || "#0f766e", secondary: quote?.business.secondary_color || "#0f172a" }), [quote]);

  useEffect(() => { let alive = true; getPublicQuote(params.quoteId).then((data) => { if (alive) setQuote(data); }).catch((err) => { if (alive) setError(err instanceof Error ? err.message : "Could not load quote."); }).finally(() => { if (alive) setIsLoading(false); }); return () => { alive = false; }; }, [params.quoteId]);
  async function act(kind: "approve" | "reject") { try { const updated = kind === "approve" ? await approvePublicQuote(params.quoteId) : await rejectPublicQuote(params.quoteId); setQuote(updated); setMessage(kind === "approve" ? "Quote approved. The team has been notified." : "Quote rejected. The team has been notified."); } catch (err) { setMessage(err instanceof Error ? err.message : "Could not update quote."); } }

  if (isLoading) return <Shell><Panel><p>Loading quote...</p></Panel></Shell>;
  if (error || !quote) return <Shell><Panel><p className="font-semibold text-ink">Quote unavailable</p><p className="mt-2 text-sm text-slate-600">{error || "We could not find this quote."}</p><Link href="/" className="mt-4 inline-flex rounded border border-line px-4 py-2 text-sm">Return to portal</Link></Panel></Shell>;

  return <Shell><main className="mx-auto max-w-4xl"><section className="overflow-hidden rounded border border-line bg-white shadow-soft"><div className="p-6 text-white sm:p-8" style={{ background: brand.primary }}><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold opacity-90">{quote.business.name}</p><h1 className="mt-4 text-3xl font-semibold tracking-normal">Quote {quote.quote_number || quote.id}</h1><p className="mt-2 text-sm opacity-90">Review this estimate and approve, reject, or request changes.</p></div><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase">{quote.status.replaceAll("_", " ")}</span></div></div>
    <div className="grid gap-4 p-6 sm:grid-cols-3"><Metric label="Estimate" value={formatCurrency(quote.estimated_price)} /><Metric label="Duration" value={quote.estimated_duration ? `${quote.estimated_duration} min` : "To confirm"} /><Metric label="Expires" value={formatDateTime(quote.expiration_date)} /></div>
    <section className="border-t border-line p-6"><h2 className="text-sm font-semibold uppercase text-slate-500">Service Details</h2><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Detail label="Customer" value={quote.customer_name} /><Detail label="Service" value={quote.service_type} /><Detail label="Email" value={quote.email || "-"} /><Detail label="Phone" value={quote.phone || "-"} /></div></section>
    <section className="border-t border-line p-6"><h2 className="text-sm font-semibold uppercase text-slate-500">Line Items / Options</h2><div className="mt-4 grid gap-2">{(quote.line_items ?? []).map((item, index) => <div key={index} className="flex justify-between gap-3 rounded border border-line p-4 text-sm"><span>{item.description}{item.optional_add_on ? " · optional" : ""}</span><strong>{formatCurrency(item.line_total ?? item.unit_price)}</strong></div>)}</div>{quote.customer_message || quote.notes ? <p className="mt-4 rounded bg-slate-50 p-4 text-sm text-slate-700">{quote.customer_message || quote.notes}</p> : null}</section>
    <section className="border-t border-line p-6"><h2 className="text-sm font-semibold uppercase text-slate-500">Quote Response</h2><p className="mt-2 text-sm text-slate-600">No e-signature is collected yet. These actions notify the business in Noviq only.</p><div className="mt-4 flex flex-wrap gap-2"><button className="rounded px-4 py-2 text-sm font-semibold text-white" style={{ background: brand.primary }} onClick={() => act("approve")}>Approve Quote</button><button className="rounded border border-line px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => act("reject")}>Reject Quote</button><button className="rounded border border-line px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => setMessage("Request changes placeholder recorded locally. Messaging workflow coming later.")}>Request Changes</button></div>{message ? <p className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p> : null}</section>
  </section><footer className="py-6 text-center text-xs text-slate-500">{quote.business.powered_by_noviq_enabled !== false ? "Powered by Noviq" : null}<p className="mt-1">Public quote links are currently a placeholder for local demo use.</p></footer></main></Shell>;
}
function Shell({ children }: { children: ReactNode }) { return <div className="min-h-screen bg-slate-50 px-4 py-6 text-ink sm:px-6 lg:px-8">{children}</div>; }
function Panel({ children }: { children: ReactNode }) { return <div className="mx-auto max-w-3xl rounded border border-line bg-white p-6 shadow-soft">{children}</div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded border border-line bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold text-ink">{value}</p></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 break-words font-medium text-ink">{value}</p></div>; }
