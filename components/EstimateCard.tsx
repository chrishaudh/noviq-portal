import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { QuoteResponse, Service } from "@/types";

type EstimateCardProps = {
  quote: QuoteResponse;
  service?: Service | null;
};

export function EstimateCard({ quote, service }: EstimateCardProps) {
  const duration = service?.estimated_duration_minutes ?? service?.duration_minutes;
  return (
    <section className="rounded border border-teal-200 bg-teal-50 p-4">
      <p className="text-sm font-medium text-teal-800">Estimated price</p>
      <p className="mt-2 text-3xl font-semibold text-teal-950">{formatCurrency(quote.estimated_price)}</p>
      {duration ? <p className="mt-2 text-sm text-teal-900">Estimated duration: {duration} minutes</p> : null}
      {service?.base_price ? <p className="mt-1 text-sm text-teal-900">Configured starting price: {formatCurrency(service.base_price)}</p> : null}
      <p className="mt-2 text-sm text-teal-800">This is a placeholder estimate. Final pricing may be confirmed before service.</p>
      <Link href="/book" className="mt-4 inline-flex h-12 w-full items-center justify-center rounded bg-brand px-4 text-base font-semibold text-white">
        Book This Service
      </Link>
    </section>
  );
}
