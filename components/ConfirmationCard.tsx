import { formatCurrency, formatBusinessDateTime } from "@/lib/format";
import type { BookingResponse, Business, BusinessSettings } from "@/types";

type ConfirmationCardProps = {
  booking: BookingResponse;
  settings?: BusinessSettings | null;
  business?: Business | null;
};

export function ConfirmationCard({ booking, settings, business }: ConfirmationCardProps) {
  const businessName = cleanText(settings?.business_display_name || business?.name, "Hawkins Pro Mounting");
  const address = [booking.address_street, booking.address_city, booking.address_state, booking.address_zip].filter(Boolean).join(", ");
  const hours = settings ? `${formatHour(settings.business_start_hour)} - ${formatHour(settings.business_end_hour)}${settings.sunday_enabled ? " daily" : ", Monday through Saturday"}` : "Business hours will be confirmed shortly.";
  const contact = cleanText(business?.phone) || cleanText(business?.email) || cleanText(business?.website_url) || "A team member will share contact details during confirmation.";

  return (
    <section className="rounded border border-line bg-white p-5 shadow-soft">
      <div className="rounded border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-800">Your request has been received.</p>
        <p className="mt-2 text-sm leading-6 text-emerald-900">A member of the {businessName} team will review your details and confirm your appointment. Please keep your booking reference for your records.</p>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">Booking reference</p>
      <p className="mt-1 rounded border border-line bg-slate-50 px-4 py-3 text-3xl font-semibold tracking-normal text-ink">{booking.booking_ref}</p>
      <div className="mt-5 grid gap-3 text-sm">
        <Detail label="Customer" value={cleanText(booking.customer_name, "Customer to confirm")} />
        <Detail label="Service" value={cleanText(booking.service_type, "Service to confirm")} />
        <Detail label="Scheduled time" value={formatBusinessDateTime(booking.scheduled_start)} />
        <Detail label="Address" value={address || "Address not provided"} />
        <Detail label="Status" value={booking.status.replaceAll("_", " ")} />
        <Detail label="Deposit required" value={formatCurrency(booking.deposit_required_amount)} />
        <Detail label="Estimated duration" value={booking.duration_minutes ? `${booking.duration_minutes} minutes` : "To be confirmed"} />
      </div>
      <div className="mt-5 grid gap-3 rounded bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <p>{statusMessage(booking.status)}</p>
        <p>A deposit may be required before the appointment is fully confirmed.</p>
        <p>You can expect appointment and follow-up reminders as your service date gets closer.</p>
        <p>A member of the team will confirm your appointment details shortly.</p>
        <div className="rounded border border-line bg-white p-3">
          <p className="font-medium text-ink">Business hours</p>
          <p>{hours}</p>
        </div>
        <div className="rounded border border-line bg-white p-3">
          <p className="font-medium text-ink">Cancellation policy</p>
          <p>{settings?.cancellation_policy ?? "Cancellation details will be shared during confirmation."}</p>
        </div>
        <div className="rounded border border-line bg-white p-3">
          <p className="font-medium text-ink">Business contact</p>
          <p>{contact}</p>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded bg-slate-50 p-3">
      <span className="text-xs font-medium uppercase tracking-normal text-slate-500">{label}</span>
      <span className="font-medium capitalize text-slate-800">{value}</span>
    </div>
  );
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}:00 ${suffix}`;
}

function statusMessage(status: string) {
  if (status === "pending_deposit") return "Your request is pending deposit review.";
  if (status === "deposit_paid") return "Your deposit is recorded and the booking is awaiting confirmation.";
  if (status === "booking_confirmed") return "Your booking is confirmed.";
  return "Your booking status will update as the job moves forward.";
}


function cleanText(value: string | null | undefined, fallback = "") {
  if (!value || value.trim().toLowerCase() === "string") return fallback;
  return value;
}
