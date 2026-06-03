"use client";

import { TokenPublicLinkRedirect } from "@/components/TokenPublicLinkRedirect";
import { getPublicBookingByToken } from "@/lib/api";

export default function TokenBookingPage({ params }: { params: { token: string } }) {
  return <TokenPublicLinkRedirect kind="booking" token={params.token} resolveRecord={getPublicBookingByToken} />;
}
