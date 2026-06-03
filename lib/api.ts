import type { AvailabilitySlot, BookingRequest, BookingResponse, Business, BusinessSettings, PublicBooking, PublicCustomerLookup, PublicInvoice, PublicQuote, PublicSupportRequestPayload, PublicSupportRequestResponse, QuoteRequest, QuoteResponse, Service } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? "development";
export const BUSINESS_ID = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID ?? "00000000-0000-0000-0000-000000000000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = friendlyApiMessage(body.detail ?? body, message);
    } catch {
      // Keep the default message.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

function friendlyApiMessage(detail: unknown, fallback: string) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return "Please review the required fields and try again.";
  if (detail && typeof detail === "object" && "message" in detail) {
    const value = (detail as { message?: unknown }).message;
    if (typeof value === "string") return value;
  }
  return fallback;
}

function tokenQuery(token?: string | null) {
  if (!token) return "";
  const search = new URLSearchParams({ token });
  return `?${search.toString()}`;
}

export function createQuoteRequest(payload: QuoteRequest) {
  return request<QuoteResponse>("/quote-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAvailability(params: { business_id: string; service_date: string; service_type?: string }) {
  const search = new URLSearchParams({
    business_id: params.business_id,
    service_date: params.service_date,
  });
  if (params.service_type) {
    search.set("service_type", params.service_type);
  }
  return request<AvailabilitySlot[]>(`/availability?${search.toString()}`);
}

export function createBooking(payload: BookingRequest) {
  return request<BookingResponse>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export function getServices() {
  const search = new URLSearchParams({ business_id: BUSINESS_ID });
  return request<Service[]>(`/services/?${search.toString()}`);
}

export function getBusinessSettings() {
  return request<BusinessSettings>(`/business-settings/${BUSINESS_ID}`);
}


export function getBusiness() {
  return request<Business>(`/businesses/${BUSINESS_ID}`);
}




export function createPublicSupportRequest(payload: PublicSupportRequestPayload) {
  return request<PublicSupportRequestResponse>("/public/support-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPublicBooking(bookingIdOrRef: string, token?: string | null) {
  return request<PublicBooking>(`/public/bookings/${encodeURIComponent(bookingIdOrRef)}${tokenQuery(token)}`);
}

export function getPublicBookingByToken(token: string) {
  return request<PublicBooking>(`/public/bookings/token/${encodeURIComponent(token)}`);
}

export function lookupCustomerRecords(params: { email: string; reference: string; business_id?: string }) {
  const search = new URLSearchParams({
    business_id: params.business_id ?? BUSINESS_ID,
    email: params.email,
    reference: params.reference,
  });
  return request<PublicCustomerLookup>(`/public/customers/lookup?${search.toString()}`);
}

export function getPublicInvoice(invoiceId: string, token?: string | null) {
  return request<PublicInvoice>(`/public/invoices/${encodeURIComponent(invoiceId)}${tokenQuery(token)}`);
}

export function getPublicInvoiceByToken(token: string) {
  return request<PublicInvoice>(`/public/invoices/token/${encodeURIComponent(token)}`);
}

export function getPublicQuote(quoteId: string, token?: string | null) {
  return request<PublicQuote>(`/public/quotes/${encodeURIComponent(quoteId)}${tokenQuery(token)}`);
}

export function getPublicQuoteByToken(token: string) {
  return request<PublicQuote>(`/public/quotes/token/${encodeURIComponent(token)}`);
}

export function approvePublicQuote(quoteId: string, token?: string | null) {
  return request<PublicQuote>(`/public/quotes/${encodeURIComponent(quoteId)}/approve${tokenQuery(token)}`, { method: "POST" });
}

export function rejectPublicQuote(quoteId: string, token?: string | null) {
  return request<PublicQuote>(`/public/quotes/${encodeURIComponent(quoteId)}/reject${tokenQuery(token)}`, { method: "POST" });
}
