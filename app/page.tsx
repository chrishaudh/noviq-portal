"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBusiness, getBusinessSettings } from "@/lib/api";
import { ServicePlanOptions } from "@/components/ServicePlanOptions";
import type { Business, BusinessSettings } from "@/types";

export default function HomePage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    getBusiness().then(setBusiness).catch(() => setBusiness(null));
    getBusinessSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const businessName = cleanBusinessName(settings?.business_display_name) ?? cleanBusinessName(business?.name) ?? "Hawkins Pro Mounting";
  const bookingTitle = settings?.public_booking_title || `Book trusted home services with ${businessName}.`;
  const bookingSubtitle = settings?.public_booking_subtitle || "Request a quote, choose an available appointment window, and send service details directly to the team.";
  const poweredByEnabled = settings?.powered_by_noviq_enabled ?? true;
  const hours = settings ? `${formatHour(settings.business_start_hour)} - ${formatHour(settings.business_end_hour)}` : "Business hours available during booking";

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-between px-4 py-6 sm:px-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-brand text-sm font-bold text-white">HP</div>
            <div>
              <span className="block font-semibold text-ink">{businessName}</span>
              {poweredByEnabled ? <span className="block text-xs text-slate-500">Powered by Noviq</span> : null}
            </div>
          </div>
          <Link href="/book" className="rounded border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft">Book</Link>
        </nav>

        <div className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-brand">Service booking made simple</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-ink sm:text-5xl">{bookingTitle}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">{bookingSubtitle}</p>
            <div className="mt-8 grid gap-3 sm:max-w-md sm:grid-cols-2">
              <Link href="/quote" className="flex h-12 items-center justify-center rounded bg-brand px-5 text-base font-semibold text-white">Get a Quote</Link>
              <Link href="/book" className="flex h-12 items-center justify-center rounded border border-line bg-white px-5 text-base font-semibold text-slate-800">Book Now</Link>
            </div>
          </div>
          <div className="rounded border border-line bg-white p-5 shadow-soft">
            <div className="flex aspect-[4/3] items-center justify-center rounded bg-slate-100 p-8 text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded bg-brand text-xl font-bold text-white">HP</div>
                <p className="mt-4 text-lg font-semibold text-ink">Hawkins Pro Mounting</p>
                <p className="mt-2 text-sm text-slate-500">Mounting, hanging, shelving, curtains, and blinds</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-slate-600">
              <p className="font-medium text-ink">What you can do here</p>
              <p>Request a service estimate.</p>
              <p>Pick an available appointment window.</p>
              <p>Receive a booking reference for follow-up.</p>
              <p>Hours: {hours}</p>
              <p>{settings?.cancellation_policy ?? "Cancellation policy is shown before confirmation."}</p>
            </div>
          </div>
        </div>
        <ServicePlanOptions />
      </section>
    </main>
  );
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}:00 ${suffix}`;
}


function cleanBusinessName(value: string | null | undefined) {
  if (!value || value.trim().toLowerCase() === "string") return null;
  return value;
}
