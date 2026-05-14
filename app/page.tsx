"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBusiness, getBusinessSettings } from "@/lib/api";
import type { Business, BusinessSettings } from "@/types";

export default function HomePage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    getBusiness().then(setBusiness).catch(() => setBusiness(null));
    getBusinessSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const businessName = business?.name ?? "Noviq";
  const hours = settings ? `${formatHour(settings.business_start_hour)} - ${formatHour(settings.business_end_hour)}` : "Business hours available during booking";

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-between px-4 py-6 sm:px-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/noviq-logo.png" alt="Noviq" width={40} height={40} className="rounded" />
            <span className="font-semibold text-ink">{businessName}</span>
          </div>
          <Link href="/book" className="rounded border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft">Book</Link>
        </nav>

        <div className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-brand">Service booking made simple</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-ink sm:text-5xl">Book trusted home services with {businessName}.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              This Noviq-powered portal helps you review services, request quotes, choose available times, and submit booking requests from any device.
            </p>
            <div className="mt-8 grid gap-3 sm:max-w-md sm:grid-cols-2">
              <Link href="/quote" className="flex h-12 items-center justify-center rounded bg-brand px-5 text-base font-semibold text-white">Get a Quote</Link>
              <Link href="/book" className="flex h-12 items-center justify-center rounded border border-line bg-white px-5 text-base font-semibold text-slate-800">Book Now</Link>
            </div>
          </div>
          <div className="rounded border border-line bg-white p-5 shadow-soft">
            <div className="aspect-[4/3] overflow-hidden rounded bg-slate-100">
              <Image src="/noviq-logo.png" alt="Noviq service portal" width={640} height={480} className="h-full w-full object-contain p-10" priority />
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
      </section>
    </main>
  );
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}:00 ${suffix}`;
}
