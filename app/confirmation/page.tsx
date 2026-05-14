"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmationCard } from "@/components/ConfirmationCard";
import { getBusiness, getBusinessSettings } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { loadBooking } from "@/lib/storage";
import type { BookingResponse, Business, BusinessSettings } from "@/types";

export default function ConfirmationPage() {
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    setBooking(loadBooking());
    getBusinessSettings().then(setSettings).catch(() => setSettings(null));
    getBusiness().then(setBusiness).catch(() => setBusiness(null));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Confirmation" description="Your booking request details are below." />
        {booking ? (
          <ConfirmationCard booking={booking} settings={settings} business={business} />
        ) : (
          <section className="rounded border border-line bg-white p-5 text-center shadow-soft">
            <p className="font-semibold text-ink">No booking details found.</p>
            <p className="mt-2 text-sm text-slate-500">Submit a booking request to see confirmation details here.</p>
            <Link href="/book" className="mt-5 inline-flex h-12 items-center justify-center rounded bg-brand px-5 text-base font-semibold text-white">Book Now</Link>
          </section>
        )}
      </div>
    </main>
  );
}
