"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AvailabilitySlots } from "@/components/AvailabilitySlots";
import { FormInput } from "@/components/FormInput";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ServiceSelect } from "@/components/ServiceSelect";
import { BUSINESS_ID, createBooking, getAvailability } from "@/lib/api";
import { loadQuote, saveBooking } from "@/lib/storage";
import type { AvailabilitySlot, ServiceType } from "@/types";

export default function BookPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("TV Mounting");
  const [serviceDate, setServiceDate] = useState("");
  const [scheduledStart, setScheduledStart] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [ladderRequired, setLadderRequired] = useState(false);
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const quote = loadQuote();
    if (quote) {
      setCustomerName(quote.customer_name);
      setEmail(quote.email ?? "");
      setPhone(quote.phone ?? "");
      setServiceType(quote.service_type);
      setAddressZip(quote.address_zip ?? "");
      setNotes(quote.message ?? "");
    }
  }, []);

  async function handleLoadAvailability(date: string) {
    setServiceDate(date);
    setScheduledStart("");
    setSlots([]);
    setAvailabilityError(null);
    if (!date) return;

    setIsLoadingSlots(true);
    try {
      const response = await getAvailability({ business_id: BUSINESS_ID, service_date: date, service_type: serviceType });
      setSlots(response);
    } catch (caughtError) {
      setAvailabilityError(caughtError instanceof Error ? caughtError.message : "Could not load availability.");
    } finally {
      setIsLoadingSlots(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        business_id: BUSINESS_ID,
        customer_name: customerName,
        email,
        phone,
        service_type: serviceType,
        scheduled_start: scheduledStart,
        address_street: addressStreet,
        address_city: addressCity,
        address_state: addressState,
        address_zip: addressZip,
        ladder_required: ladderRequired,
        notes,
      });
      saveBooking(booking);
      router.push(`/confirmation?booking_ref=${encodeURIComponent(booking.booking_ref)}`);
    } catch (caughtError) {
      setSubmitError(caughtError instanceof Error ? caughtError.message : "Could not create booking.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Book Service" description="Choose a service time and submit your booking request." />
        <form className="grid gap-4 rounded border border-line bg-white p-4 shadow-soft" onSubmit={handleSubmit}>
          <FormInput label="Name" name="customer_name" value={customerName} onChange={setCustomerName} required />
          <FormInput label="Email" name="email" type="email" value={email} onChange={setEmail} />
          <FormInput label="Phone" name="phone" type="tel" value={phone} onChange={setPhone} />
          <ServiceSelect value={serviceType} onChange={setServiceType} />
          <FormInput label="Service date" name="service_date" type="date" value={serviceDate} onChange={handleLoadAvailability} required />
          {availabilityError ? <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{availabilityError}</div> : null}
          <AvailabilitySlots slots={slots} selectedStart={scheduledStart} onSelect={setScheduledStart} isLoading={isLoadingSlots} />
          <FormInput label="Street address" name="address_street" value={addressStreet} onChange={setAddressStreet} />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput label="City" name="address_city" value={addressCity} onChange={setAddressCity} />
            <FormInput label="State" name="address_state" value={addressState} onChange={setAddressState} />
            <FormInput label="ZIP" name="address_zip" value={addressZip} onChange={setAddressZip} />
          </div>
          <label className="flex items-center gap-3 rounded border border-line bg-slate-50 p-3 text-sm text-slate-700">
            <input checked={ladderRequired} onChange={(event) => setLadderRequired(event.target.checked)} type="checkbox" />
            Ladder required
          </label>
          <FormInput label="Notes" name="notes" value={notes} onChange={setNotes} multiline />
          {submitError ? <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</div> : null}
          <PrimaryButton isLoading={isSubmitting} disabled={!customerName.trim() || !scheduledStart} type="submit">Submit Booking Request</PrimaryButton>
        </form>
      </div>
    </main>
  );
}
