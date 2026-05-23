"use client";

import { FormEvent, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { BUSINESS_ID, lookupCustomerRecords } from "@/lib/api";
import { SupportRequestForm } from "@/components/SupportRequestForm";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { PublicCustomerLookup, PublicLookupRecord } from "@/types";

export default function CustomerAccessHubPage() {
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [lookup, setLookup] = useState<PublicCustomerLookup | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const brand = useMemo(() => ({ primary: lookup?.business.primary_color || "#0f766e", secondary: lookup?.business.secondary_color || "#0f172a" }), [lookup]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLookup(null);
    if (!email.trim() || !reference.trim()) {
      setMessage("Enter the email and booking, quote, or invoice reference from your message.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await lookupCustomerRecords({ email: email.trim(), reference: reference.trim() });
      setLookup(data);
      const count = data.bookings.length + data.invoices.length + data.quotes.length;
      setMessage(count > 0 ? "Records found." : "No matching records were found for that email and reference.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not look up records.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Shell>
      <main className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded border border-line bg-white shadow-soft">
          <div className="p-6 text-white sm:p-8" style={{ background: brand.primary }}>
            <p className="text-sm font-semibold opacity-90">Customer Access</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal">Find Your Noviq Service Records</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">Use a shared link, or look up a booking, quote, or invoice with your email and reference number. Full customer accounts are coming later.</p>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded border border-line p-4">
              <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Lookup</h2>
              <form className="mt-4 grid gap-3" onSubmit={submit}>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="h-11 rounded border border-line px-3 text-sm outline-none focus:border-brand" placeholder="you@example.com" /></label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">Reference<input value={reference} onChange={(event) => setReference(event.target.value)} className="h-11 rounded border border-line px-3 text-sm outline-none focus:border-brand" placeholder="Booking ref, quote number, or invoice number" /></label>
                <button disabled={isLoading} className="h-11 rounded px-4 text-sm font-semibold text-white disabled:opacity-60" style={{ background: brand.primary }} type="submit">{isLoading ? "Looking up..." : "Find Records"}</button>
              </form>
              {message ? <p className="mt-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p> : null}
              <p className="mt-4 text-xs leading-5 text-slate-500">This account-lite lookup is a local demo placeholder. Future customer access should use secure tokenized links or customer authentication.</p>
            </section>

            <section className="rounded border border-line bg-slate-50 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Access Hub</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <AccessCard title="View Quote" href="/customer" body="Open a shared quote link or search with a quote reference." />
                <AccessCard title="View Invoice" href="/customer" body="Open a shared invoice link or search with an invoice reference." />
                <AccessCard title="View Booking" href="/customer" body="Search with your booking reference to see appointment details." />
              </div>
              <div className="mt-4 rounded border border-line bg-white p-4">
                <p className="text-sm font-semibold text-ink">Future Account Features</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Service history, recurring service plans, support messages, and saved customer preferences will live here once customer accounts are added.</p>
              </div>
            </section>
          </div>

          {lookup ? <LookupDashboard lookup={lookup} brand={brand} /> : null}

          <section className="border-t border-line p-6">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Need Help?</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Placeholder title="Call Business" body={lookup?.business.phone || "Business phone appears after lookup when available."} />
                <Placeholder title="Email Business" body={lookup?.business.email || "Business email appears after lookup when available."} />
              </div>
              <SupportRequestForm businessId={lookup?.business.id || BUSINESS_ID} customerName={lookup?.email ? lookup.email.split("@")[0] : ""} email={lookup?.email || ""} defaultSubject="Customer portal support request" />
            </div>
          </section>
        </section>

        <footer className="py-6 text-center text-xs text-slate-500">Powered by Noviq<p className="mt-1">Customer account-lite access is placeholder/dev-only.</p></footer>
      </main>
    </Shell>
  );
}

function LookupDashboard({ lookup, brand }: { lookup: PublicCustomerLookup; brand: { primary: string; secondary: string } }) {
  return <section className="border-t border-line p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-normal text-slate-500">Lightweight Dashboard</p><h2 className="mt-1 text-xl font-semibold text-ink">Records for {lookup.email}</h2></div><span className="w-fit rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: brand.secondary }}>{lookup.business.name}</span></div><div className="mt-5 grid gap-4 lg:grid-cols-3"><RecordGroup title="Bookings" kind="booking" records={lookup.bookings} empty="No matching bookings found." /><RecordGroup title="Invoices" kind="invoice" records={lookup.invoices} empty="No matching invoices found." /><RecordGroup title="Quotes" kind="quote" records={lookup.quotes} empty="No matching quotes found." /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Placeholder title="Past Services" body={lookup.service_history_placeholder} /><Placeholder title="Recurring Services" body="Recurring service plan access is coming later." /></div><p className="mt-4 rounded bg-slate-50 p-3 text-xs leading-5 text-slate-500">{lookup.security_note}</p></section>;
}

function RecordGroup({ title, kind, records, empty }: { title: string; kind: "booking" | "invoice" | "quote"; records: PublicLookupRecord[]; empty: string }) {
  return <div className="rounded border border-line bg-slate-50 p-4"><p className="text-sm font-semibold text-ink">{title}</p><div className="mt-3 grid gap-2">{records.length === 0 ? <p className="text-sm text-slate-600">{empty}</p> : records.map((record) => <RecordLink key={`${title}-${record.id || record.label}`} kind={kind} record={record} />)}</div></div>;
}

function RecordLink({ kind, record }: { kind: "booking" | "invoice" | "quote"; record: PublicLookupRecord }) {
  const href = record.id ? `/${kind}/${encodeURIComponent(record.id)}` : null;
  const actionLabel = kind === "booking" ? "View Booking" : kind === "invoice" ? "View Invoice" : "View Quote";
  const detail = `${record.service_type ? `${record.service_type} · ` : ""}${record.scheduled_start ? `${formatDateTime(record.scheduled_start)} · ` : ""}${record.balance_due != null ? `Balance ${formatCurrency(record.balance_due)} · ` : ""}${record.status.replaceAll("_", " ")}`;

  const content = <><span className="break-words">{record.label}</span><span className="mt-1 block text-xs font-medium text-slate-500">{detail}</span><span className="mt-3 inline-flex rounded bg-brand px-3 py-2 text-xs font-semibold text-white">{actionLabel}</span></>;
  if (!href) {
    return <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900"><span className="break-words">{record.label || "Record"}</span><span className="mt-1 block text-xs font-medium text-amber-800">Link unavailable.</span></div>;
  }
  return <Link href={href} className="rounded border border-line bg-white p-3 text-sm font-semibold text-ink transition hover:border-brand">{content}</Link>;
}

function AccessCard({ title, href, body }: { title: string; href: string; body: string }) { return <Link href={href} className="rounded border border-line bg-white p-4"><p className="text-sm font-semibold text-ink">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></Link>; }
function Placeholder({ title, body }: { title: string; body: string }) { return <div className="rounded border border-line bg-white p-4"><p className="text-sm font-semibold text-ink">{title}</p><p className="mt-2 break-words text-sm leading-6 text-slate-600">{body}</p></div>; }
function Shell({ children }: { children: ReactNode }) { return <div className="min-h-screen bg-slate-50 px-4 py-6 text-ink sm:px-6 lg:px-8">{children}</div>; }
