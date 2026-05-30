"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { getPublicBooking } from "@/lib/api";
import { SupportRequestForm } from "@/components/SupportRequestForm";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { PublicBooking } from "@/types";

export default function PublicBookingPage({ params }: { params: { bookingId: string } }) {
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const brand = useMemo(() => ({ primary: booking?.business.primary_color || "#0f766e", secondary: booking?.business.secondary_color || "#0f172a" }), [booking]);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    setError(null);
    getPublicBooking(params.bookingId)
      .then((data) => { if (alive) setBooking(data); })
      .catch((err) => { if (alive) setError(err instanceof Error ? err.message : "Could not load booking."); })
      .finally(() => { if (alive) setIsLoading(false); });
    return () => { alive = false; };
  }, [params.bookingId]);

  if (isLoading) return <Shell><Panel><p className="text-sm font-medium text-slate-600">Loading booking...</p></Panel></Shell>;
  if (error || !booking) return <Shell><Panel><p className="text-lg font-semibold text-ink">Booking unavailable</p><p className="mt-2 text-sm text-slate-600">{error || "We could not find this booking."}</p><Link href="/customer" className="mt-4 inline-flex h-10 items-center rounded border border-line px-4 text-sm font-semibold text-slate-700">Go to customer access</Link></Panel></Shell>;
  const hasRealTestCheckout = Boolean(booking.deposit_checkout_session_id?.startsWith("cs_test_") && !booking.deposit_checkout_session_id.includes("placeholder"));

  return (
    <Shell>
      <main className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded border border-line bg-white shadow-soft">
          <div className="p-6 text-white sm:p-8" style={{ background: brand.primary }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  {booking.business.logo_url ? <img src={booking.business.logo_url} alt="" className="h-11 w-11 rounded bg-white/20 object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded bg-white/20 text-sm font-bold">{initials(booking.business.name)}</div>}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold opacity-90">{booking.business.name}</p>
                    <p className="text-xs opacity-80">Powered by Noviq</p>
                  </div>
                </div>
                <h1 className="mt-6 text-3xl font-semibold tracking-normal">Booking {booking.booking_ref}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">Review your service appointment, status, and related quote or invoice links.</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-normal">{booking.status.replaceAll("_", " ")}</span>
            </div>
          </div>

          <CustomerNav booking={booking} />

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Service" value={booking.service_type || "Service"} />
            <Metric label="Scheduled" value={formatDateTime(booking.scheduled_start)} />
            <Metric label="Duration" value={booking.duration_minutes ? `${booking.duration_minutes} min` : "To confirm"} />
            <Metric label="Status" value={booking.status.replaceAll("_", " ")} strong />
          </div>

          <div className="grid gap-4 border-t border-line p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded border border-line p-4">
              <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Appointment Details</h2>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Detail label="Customer" value={booking.customer_name || "Customer"} />
                <Detail label="Address" value={booking.address || "To be confirmed"} />
                <Detail label="Contractor" value={booking.assigned_contractor?.display_name || booking.assigned_contractor?.first_name || "To be assigned"} />
                <Detail label="Ladder required" value={booking.ladder_required ? "Yes" : "No"} />
                <Detail label="Business phone" value={booking.business_contact.phone || "Contact business"} />
                <Detail label="Business email" value={booking.business_contact.email || "Contact business"} />
              </div>
            </section>

            <section className="rounded border border-line bg-slate-50 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Deposit Payment</h2>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <Detail label="Deposit status" value={(booking.deposit_status || "not required").replaceAll("_", " ")} />
                <Detail label="Deposit required" value={formatCurrency(booking.deposit_required_amount ?? 0)} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{booking.deposit_payment_link ? (hasRealTestCheckout ? "A Stripe test-mode deposit checkout link is available. Use test cards only; live payments are not active. Status may update after webhook processing." : "A sandbox deposit payment link placeholder is available. No live payment will be processed.") : "Deposit payment link not available yet."}</p>
              {booking.deposit_payment_link ? <p className="mt-2 break-words rounded border border-line bg-white p-3 text-xs text-slate-600">{booking.deposit_payment_link}</p> : null}
              <button className="mt-4 h-11 w-full rounded px-4 text-sm font-semibold text-white sm:w-auto" style={{ background: brand.primary }} onClick={() => booking.deposit_payment_link ? window.open(booking.deposit_payment_link, "_blank", "noopener,noreferrer") : alert("Deposit payment link not available yet.")} type="button">Pay Deposit</button>
            </section>

            <section className="rounded border border-line bg-slate-50 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Related Records</h2>
              <div className="mt-4 grid gap-2">
                {booking.invoice ? <Link href={`/invoice/${booking.invoice.id}`} className="rounded border border-line bg-white p-3 text-sm font-semibold text-ink">Invoice {booking.invoice.invoice_number}<span className="mt-1 block text-xs font-medium text-slate-500">Balance {formatCurrency(booking.invoice.balance_due)} · {booking.invoice.status.replaceAll("_", " ")}</span></Link> : <p className="rounded border border-dashed border-line bg-white p-3 text-sm text-slate-600">No invoice is linked yet.</p>}
                {booking.quote ? <Link href={`/quote/${booking.quote.id}`} className="rounded border border-line bg-white p-3 text-sm font-semibold text-ink">Quote {booking.quote.quote_number || booking.quote.id}<span className="mt-1 block text-xs font-medium text-slate-500">{formatCurrency(booking.quote.estimated_price)} · {booking.quote.status.replaceAll("_", " ")}</span></Link> : <p className="rounded border border-dashed border-line bg-white p-3 text-sm text-slate-600">No quote is linked yet.</p>}
              </div>
            </section>
          </div>

          <section className="border-t border-line p-6">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Service History Preview</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Placeholder title="Past Services" body="Past service history will appear here when customer accounts are added." />
              <Placeholder title="Recurring Services" body="Recurring service plan access is coming later." />
              <Placeholder title="Past Invoices & Quotes" body="Use shared links or the customer access hub for now." />
            </div>
          </section>

          <section className="border-t border-line p-6">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Notes</h2>
            <p className="mt-3 rounded bg-slate-50 p-4 text-sm leading-6 text-slate-700">{booking.notes_placeholder}</p>
          </section>

          <Support booking={booking} business={booking.business} contact={booking.business_contact} />
        </section>

        <footer className="py-6 text-center text-xs text-slate-500">
          {booking.business.powered_by_noviq_enabled !== false ? <p>Powered by Noviq</p> : null}
          <p className="mt-1">Public booking links are currently a placeholder for local demo use.</p>
        </footer>
      </main>
    </Shell>
  );
}

function CustomerNav({ booking }: { booking: PublicBooking }) {
  return <nav className="grid gap-2 border-b border-line bg-slate-50 p-4 text-sm sm:grid-cols-4"><Link href={booking.quote ? `/quote/${booking.quote.id}` : "/customer"} className="rounded border border-line bg-white px-3 py-2 font-semibold text-slate-700">Quotes</Link><Link href={`/booking/${booking.booking_ref}`} className="rounded border border-brand bg-white px-3 py-2 font-semibold text-brand">Bookings</Link><Link href={booking.invoice ? `/invoice/${booking.invoice.id}` : "/customer"} className="rounded border border-line bg-white px-3 py-2 font-semibold text-slate-700">Invoices</Link><a href="#support" className="rounded border border-line bg-white px-3 py-2 font-semibold text-slate-700">Support</a></nav>;
}

function Support({ booking, business, contact }: { booking: PublicBooking; business: PublicBooking["business"]; contact: PublicBooking["business_contact"] }) {
  return <section id="support" className="border-t border-line p-6"><h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Need Help?</h2><div className="mt-4 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><Placeholder title="Call" body={contact.phone || business.phone || "Business phone coming soon."} /><Placeholder title="Email" body={contact.email || business.email || "Business email coming soon."} /></div><SupportRequestForm businessId={business.id} customerName={booking.customer_name || ""} relatedType="booking" relatedId={booking.id} defaultRequestType="booking_question" defaultSubject={`Question about booking ${booking.booking_ref}`} /></div></section>;
}

function Shell({ children }: { children: ReactNode }) { return <div className="min-h-screen bg-slate-50 px-4 py-6 text-ink sm:px-6 lg:px-8">{children}</div>; }
function Panel({ children }: { children: ReactNode }) { return <div className="mx-auto max-w-3xl rounded border border-line bg-white p-6 shadow-soft">{children}</div>; }
function Metric({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <div className="min-w-0 rounded border border-line bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p><p className={`mt-1 break-words text-lg font-semibold ${strong ? "text-ink" : "text-slate-700"}`}>{value}</p></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-medium text-ink">{value}</p></div>; }
function Placeholder({ title, body }: { title: string; body: string }) { return <div className="rounded border border-line bg-slate-50 p-4"><p className="text-sm font-semibold text-ink">{title}</p><p className="mt-2 break-words text-sm leading-6 text-slate-600">{body}</p></div>; }
function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "NV"; }
