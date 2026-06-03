"use client";

import { TokenPublicLinkRedirect } from "@/components/TokenPublicLinkRedirect";
import { getPublicQuoteByToken } from "@/lib/api";

export default function TokenQuotePage({ params }: { params: { token: string } }) {
  return <TokenPublicLinkRedirect kind="quote" token={params.token} resolveRecord={getPublicQuoteByToken} />;
}
