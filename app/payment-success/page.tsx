import Link from "next/link";

type PaymentReturnPageProps = {
  searchParams?: {
    session_id?: string;
    invoice_id?: string;
    booking_id?: string;
    related_type?: string;
    related_id?: string;
    mode?: string;
  };
};

export default function PaymentSuccessPage({ searchParams }: PaymentReturnPageProps) {
  const returnLink = buildReturnLink(searchParams);
  const sessionId = searchParams?.session_id;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto max-w-2xl rounded border border-line bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">Stripe test mode</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-normal text-ink">Payment completed in Stripe test mode</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Stripe returned a successful test checkout result. Noviq will reflect the final invoice or deposit status after verified webhook processing is configured and received.
        </p>
        {sessionId ? (
          <p className="mt-4 break-words rounded border border-line bg-slate-50 p-3 text-xs text-slate-600 [overflow-wrap:anywhere]">
            Checkout session: {sessionId}
          </p>
        ) : null}
        <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap">
          {returnLink ? (
            <Link className="inline-flex h-11 items-center justify-center rounded bg-teal-700 px-4 text-sm font-semibold text-white" href={returnLink.href}>
              Return to {returnLink.label}
            </Link>
          ) : null}
          <Link className="inline-flex h-11 items-center justify-center rounded border border-line px-4 text-sm font-semibold text-slate-700" href="/customer">
            Customer access hub
          </Link>
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-500">
          This page is for controlled local Stripe test-mode validation only. Live payments remain blocked.
        </p>
      </section>
    </main>
  );
}

function buildReturnLink(searchParams: PaymentReturnPageProps["searchParams"]) {
  const invoiceId = searchParams?.invoice_id || (searchParams?.related_type === "invoice" ? searchParams.related_id : null);
  if (invoiceId) return { href: `/invoice/${invoiceId}`, label: "invoice" };
  const bookingId = searchParams?.booking_id || (searchParams?.related_type === "booking" ? searchParams.related_id : null);
  if (bookingId) return { href: `/booking/${bookingId}`, label: "booking" };
  return null;
}
