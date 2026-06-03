"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TokenPublicLinkRedirectProps = {
  token: string;
  kind: "booking" | "invoice" | "quote";
  resolveRecord: (token: string) => Promise<{ id: string }>;
};

export function TokenPublicLinkRedirect({ token, kind, resolveRecord }: TokenPublicLinkRedirectProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setError(null);
    resolveRecord(token)
      .then((record) => {
        if (isMounted) router.replace(`/${kind}/${record.id}?token=${encodeURIComponent(token)}`);
      })
      .catch((caughtError) => {
        if (isMounted) setError(caughtError instanceof Error ? caughtError.message : "This customer link is unavailable.");
      });
    return () => {
      isMounted = false;
    };
  }, [kind, resolveRecord, router, token]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
        <section className="w-full rounded border border-line bg-white p-6 shadow-soft">
          {error ? (
            <>
              <p className="text-lg font-semibold text-ink">Customer link unavailable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
              <Link className="mt-4 inline-flex h-10 items-center rounded border border-line px-4 text-sm font-semibold text-slate-700" href="/customer">
                Return to customer access
              </Link>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-ink">Opening your {kind}...</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">We are validating your secure customer link.</p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
