export const BUSINESS_TIME_ZONE = "America/New_York";

const hasTimezone = (value: string) => /(?:z|[+-]\d{2}:?\d{2})$/i.test(value.trim());

export function formatCurrency(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function parseServerDate(value: string | null | undefined) {
  if (!value) return null;
  const normalized = hasTimezone(value) ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseBusinessDate(value: string | null | undefined) {
  if (!value) return null;
  if (hasTimezone(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] ?? 0), Number(match[5] ?? 0), Number(match[6] ?? 0)));
}

export function formatDateTime(value: string | null | undefined) {
  const date = parseServerDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatBusinessDateTime(value: string | null | undefined) {
  const date = parseBusinessDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: hasTimezone(value ?? "") ? BUSINESS_TIME_ZONE : "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
