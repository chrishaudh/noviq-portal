"use client";

import { FormEvent, useState } from "react";
import { BUSINESS_ID, createPublicSupportRequest } from "@/lib/api";

type SupportRequestFormProps = {
  businessId?: string | null;
  customerName?: string | null;
  email?: string | null;
  phone?: string | null;
  relatedType?: "booking" | "invoice" | "quote" | "customer" | null;
  relatedId?: string | null;
  defaultRequestType?: string;
  defaultSubject?: string;
};

const requestTypes = [
  "booking_question",
  "invoice_question",
  "quote_question",
  "reschedule_request",
  "service_issue",
  "general_support",
];

export function SupportRequestForm({ businessId, customerName, email, phone, relatedType, relatedId, defaultRequestType = "general_support", defaultSubject = "Support request" }: SupportRequestFormProps) {
  const [nameValue, setNameValue] = useState(customerName ?? "");
  const [emailValue, setEmailValue] = useState(email ?? "");
  const [phoneValue, setPhoneValue] = useState(phone ?? "");
  const [requestType, setRequestType] = useState(defaultRequestType);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ kind: "success" | "error"; text: string; id?: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    if (!nameValue.trim() || !emailValue.trim() || !subject.trim() || !message.trim()) {
      setResult({ kind: "error", text: "Name, email, subject, and message are required." });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createPublicSupportRequest({
        business_id: businessId ?? BUSINESS_ID,
        customer_name: nameValue.trim(),
        email: emailValue.trim(),
        phone: phoneValue.trim() || null,
        related_type: relatedType ?? null,
        related_id: relatedId ?? null,
        request_type: requestType,
        subject: subject.trim(),
        message: message.trim(),
      });
      setMessage("");
      setResult({ kind: "success", text: response.message, id: response.id });
    } catch (err) {
      setResult({ kind: "error", text: err instanceof Error ? err.message : "Could not submit support request." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded border border-line bg-white p-4" onSubmit={submit}>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-ink">Send a Support Request</h3>
        <p className="text-xs leading-5 text-slate-500">This creates a follow-up item for the business. No email or SMS is sent yet.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Name" value={nameValue} onChange={setNameValue} />
        <Field label="Email" type="email" value={emailValue} onChange={setEmailValue} />
        <Field label="Phone optional" value={phoneValue} onChange={setPhoneValue} />
        <label className="grid gap-1 text-sm font-medium text-slate-700">Request type<select className="h-10 rounded border border-line px-3 text-sm" value={requestType} onChange={(event) => setRequestType(event.target.value)}>{requestTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
      </div>
      <label className="mt-3 grid gap-1 text-sm font-medium text-slate-700">Subject<input className="h-10 rounded border border-line px-3 text-sm" value={subject} onChange={(event) => setSubject(event.target.value)} /></label>
      <label className="mt-3 grid gap-1 text-sm font-medium text-slate-700">Message<textarea className="min-h-28 rounded border border-line px-3 py-2 text-sm" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell the business what you need help with." /></label>
      <button className="mt-3 h-10 rounded bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Submitting..." : "Submit Support Request"}</button>
      {result ? <p className={`mt-3 rounded px-3 py-2 text-sm ${result.kind === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "border border-red-200 bg-red-50 text-red-700"}`}>{result.text}{result.id ? <span className="mt-1 block text-xs font-semibold">Request reference: {result.id}</span> : null}</p> : null}
    </form>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="grid gap-1 text-sm font-medium text-slate-700">{label}<input className="h-10 rounded border border-line px-3 text-sm" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
