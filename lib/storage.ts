import type { BookingResponse, QuoteResponse } from "@/types";

const QUOTE_KEY = "noviq:lastQuote";
const BOOKING_KEY = "noviq:lastBooking";

export function saveQuote(quote: QuoteResponse) {
  window.localStorage.setItem(QUOTE_KEY, JSON.stringify(quote));
}

export function loadQuote(): QuoteResponse | null {
  const value = window.localStorage.getItem(QUOTE_KEY);
  return value ? (JSON.parse(value) as QuoteResponse) : null;
}

export function saveBooking(booking: BookingResponse) {
  window.localStorage.setItem(BOOKING_KEY, JSON.stringify(booking));
}

export function loadBooking(): BookingResponse | null {
  const value = window.localStorage.getItem(BOOKING_KEY);
  return value ? (JSON.parse(value) as BookingResponse) : null;
}
