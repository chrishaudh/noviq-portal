"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { EstimateCard } from "@/components/EstimateCard";
import { FormInput } from "@/components/FormInput";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ServiceSelect } from "@/components/ServiceSelect";
import { ServicePlanOptions } from "@/components/ServicePlanOptions";
import { BUSINESS_ID, createQuoteRequest, getServices } from "@/lib/api";
import { saveQuote } from "@/lib/storage";
import type { QuoteResponse, Service, ServiceType } from "@/types";

export default function QuotePage() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("TV Mounting");
  const [message, setMessage] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const estimateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getServices().then(setServices).catch(() => setServices([]));
  }, []);

  const selectedService = services.find((service) => service.name === serviceType);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await createQuoteRequest({
        business_id: BUSINESS_ID,
        customer_name: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service_type: serviceType,
        message: message.trim(),
        address_zip: addressZip.trim(),
      });
      saveQuote(response);
      setQuote(response);
      window.setTimeout(() => estimateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not submit quote request.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Get a Quote" description="Tell Hawkins Pro Mounting what you need and we will estimate the service price." />
        <form className="grid gap-4 rounded border border-line bg-white p-4 shadow-soft" onSubmit={handleSubmit}>
          <FormInput label="Name" name="customer_name" value={customerName} onChange={setCustomerName} placeholder="Jane Customer" required />
          <FormInput label="Email" name="email" type="email" value={email} onChange={setEmail} placeholder="jane@example.com" required />
          <FormInput label="Phone" name="phone" type="tel" value={phone} onChange={setPhone} placeholder="(555) 123-4567" required />
          <ServiceSelect value={serviceType} onChange={setServiceType} />
          {selectedService ? (
            <div className="rounded border border-line bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-medium text-ink">Service info</p>
              <p>Starting price: ${Number(selectedService.base_price ?? 0).toFixed(2)}</p>
              <p>Estimated duration: {selectedService.estimated_duration_minutes ?? selectedService.duration_minutes ?? 120} minutes</p>
              {selectedService.description ? <p>{selectedService.description}</p> : null}
            </div>
          ) : null}
          <FormInput label="ZIP code" name="address_zip" value={addressZip} onChange={setAddressZip} placeholder="28202" required />
          <FormInput label="Message" name="message" value={message} onChange={setMessage} placeholder="Tell us about the wall type, item size, or any special instructions." multiline />
          {error ? <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          <PrimaryButton isLoading={isLoading} disabled={!customerName.trim() || !email.trim() || !phone.trim() || !addressZip.trim()} type="submit">Submit Quote Request</PrimaryButton>
          {quote ? <div ref={estimateRef} className="rounded border-2 border-teal-300 bg-teal-50 p-1 shadow-soft"><EstimateCard quote={quote} service={selectedService} /></div> : null}
        </form>
        <div className="mt-5"><ServicePlanOptions /></div>
      </div>
    </main>
  );
}
