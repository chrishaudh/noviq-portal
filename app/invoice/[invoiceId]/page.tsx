"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { getPublicInvoice } from "@/lib/api";
import { SupportRequestForm } from "@/components/SupportRequestForm";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { PublicInvoice } from "@/types";

type InvoicePageProps = {
  params: { invoiceId: string };
};

export default function PublicInvoicePage({ params }: InvoicePageProps) {
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    getPublicInvoice(params.invoiceId)
      .then((data) => {
        if (isMounted) setInvoice(data);
      })
      .catch((caughtError) => {
        if (isMounted) setError(caughtError instanceof Error ? caughtError.message : "Could not load invoice.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [params.invoiceId]);

  const brand = useMemo(() => ({
    primary: invoice?.business.primary_color || "#0f766e",
    secondary: invoice?.business.secondary_color || "#0f172a",
  }), [invoice]);

  if (isLoading) {
    return <Shell><div className="mx-auto max-w-3xl rounded border border-line bg-white p-6 shadow-soft"><p className="text-sm font-medium text-slate-600">Loading invoice...</p></div></Shell>;
  }

  if (error || !invoice) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl rounded border border-red-100 bg-white p-6 shadow-soft">
          <p className="text-lg font-semibold text-ink">Invoice unavailable</p>
          <p className="mt-2 text-sm text-slate-600">{error || "We could not find this invoice."}</p>
          <Link href="/" className="mt-4 inline-flex h-10 items-center rounded border border-line px-4 text-sm font-semibold text-slate-700">Return to portal</Link>
        </div>
      </Shell>
    );
  }

  const depositDue = Number(invoice.deposit_balance_due ?? 0) > 0 && invoice.status !== "paid";

  return (
    <Shell>
      <main className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded border border-line bg-white shadow-soft">
          <div className="p-6 text-white sm:p-8" style={{ background: brand.primary }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  {invoice.business.logo_url ? <img src={invoice.business.logo_url} alt="" className="h-11 w-11 rounded bg-white/20 object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded bg-white/20 text-sm font-bold">{initials(invoice.business.name)}</div>}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold opacity-90">{invoice.business.name}</p>
                    <p className="text-xs opacity-80">Powered by Noviq</p>
                  </div>
                </div>
                <h1 className="mt-6 text-3xl font-semibold tracking-normal">Invoice {invoice.invoice_number}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">Review your service invoice, deposit credit, balance due, and future online payment placeholder.</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-normal">{invoice.status.replaceAll("_", " ")}</span>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Subtotal" value={formatCurrency(invoice.subtotal)} />
            <Metric label="Deposit Status" value={(invoice.deposit_status || "not required").replaceAll("_", " ")} />
            <Metric label="Paid" value={formatCurrency(invoice.amount_paid)} />
            <Metric label="Balance Due" value={formatCurrency(invoice.balance_due)} strong />
          </div>

          <div className="grid gap-4 border-t border-line p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded border border-line p-4">
              <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Invoice Details</h2>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Detail label="Customer" value={invoice.customer_name || "Customer"} />
                <Detail label="Due date" value={formatDateTime(invoice.due_date)} />
                <Detail label="Deposit required" value={formatCurrency(invoice.deposit_required_amount ?? invoice.deposit_amount)} />
                <Detail label="Deposit paid" value={formatCurrency(invoice.deposit_paid_amount ?? invoice.deposit_amount)} />
                <Detail label="Deposit due" value={formatCurrency(invoice.deposit_balance_due ?? 0)} />
                <Detail label="Booking ref" value={invoice.booking?.booking_ref || "-"} />
                <Detail label="Scheduled time" value={formatDateTime(invoice.booking?.scheduled_start)} />
                <Detail label="Service" value={invoice.booking?.service_type || invoice.line_items[0]?.service_type || "Service"} />
                <Detail label="Address" value={invoice.booking?.address || "To be confirmed"} />
              </div>
            </section>

            <section className="rounded border border-line bg-slate-50 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Payment Placeholder</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Online payments are coming soon. Deposit and balance buttons are placeholders only; no payment will be processed.</p>
              <div className="mt-4 grid gap-2">
                {depositDue ? <button className="h-11 rounded px-4 text-sm font-semibold text-white" style={{ background: brand.primary }} onClick={() => setPaymentMessage("Online payments coming soon.")} type="button">Pay Deposit</button> : null}
                <button className="h-11 rounded px-4 text-sm font-semibold text-white" style={{ background: brand.secondary }} onClick={() => setPaymentMessage("Online payments coming soon.")} type="button">Pay Balance</button>
              </div>
              {paymentMessage ? <p className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">{paymentMessage}</p> : null}
            </section>
          </div>

          <section className="border-t border-line p-6">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Line Items</h2>
            <div className="mt-4 grid gap-2">
              {invoice.line_items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 rounded border border-line p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{item.description}</p>
                    <p className="mt-1 text-xs text-slate-500">Qty {item.quantity} x {formatCurrency(item.unit_price)}</p>
                  </div>
                  <p className="font-semibold text-ink">{formatCurrency(item.line_total)}</p>
                </div>
              ))}
            </div>
          </section>

          {invoice.notes ? <section className="border-t border-line p-6"><h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Notes</h2><p className="mt-3 rounded bg-slate-50 p-4 text-sm leading-6 text-slate-700">{invoice.notes}</p></section> : null}

          <section className="border-t border-line p-6">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-slate-500">Need Help?</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Placeholder title="Call" body={invoice.business.phone || "Business phone coming soon."} />
                <Placeholder title="Email" body={invoice.business.email || "Business email coming soon."} />
              </div>
              <SupportRequestForm businessId={invoice.business.id} customerName={invoice.customer_name || ""} email={invoice.customer_email || ""} phone={invoice.customer_phone || ""} relatedType="invoice" relatedId={invoice.id} defaultRequestType="invoice_question" defaultSubject={`Question about invoice ${invoice.invoice_number}`} />
            </div>
          </section>
        </section>

        <footer className="py-6 text-center text-xs text-slate-500">
          {invoice.business.powered_by_noviq_enabled !== false ? <p>Powered by Noviq</p> : null}
          <p className="mt-1">Public invoice links are currently a placeholder for local demo use.</p>
        </footer>
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50 px-4 py-6 text-ink sm:px-6 lg:px-8">{children}</div>;
}

function Metric({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="rounded border border-line bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p><p className={`mt-1 text-xl font-semibold ${strong ? "text-ink" : "text-slate-700"}`}>{value}</p></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-medium text-ink">{value}</p></div>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "NV";
}

function Placeholder({ title, body }: { title: string; body: string }) { return <div className="rounded border border-line bg-slate-50 p-4"><p className="text-sm font-semibold text-ink">{title}</p><p className="mt-2 break-words text-sm leading-6 text-slate-600">{body}</p></div>; }
