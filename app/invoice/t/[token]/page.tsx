"use client";

import { TokenPublicLinkRedirect } from "@/components/TokenPublicLinkRedirect";
import { getPublicInvoiceByToken } from "@/lib/api";

export default function TokenInvoicePage({ params }: { params: { token: string } }) {
  return <TokenPublicLinkRedirect kind="invoice" token={params.token} resolveRecord={getPublicInvoiceByToken} />;
}
