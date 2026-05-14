import { formatDateTime } from "@/lib/format";
import type { AvailabilitySlot } from "@/types";

type AvailabilitySlotsProps = {
  slots: AvailabilitySlot[];
  selectedStart: string;
  onSelect: (start: string) => void;
  isLoading: boolean;
};

export function AvailabilitySlots({ slots, selectedStart, onSelect, isLoading }: AvailabilitySlotsProps) {
  if (isLoading) {
    return <div className="rounded border border-line bg-white p-4 text-sm text-slate-500">Loading available times...</div>;
  }

  if (slots.length === 0) {
    return <div className="rounded border border-dashed border-line bg-white p-4 text-sm text-slate-500">No availability loaded yet. Pick a date to see available times.</div>;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {slots.map((slot) => (
        <button
          key={slot.start}
          className={`rounded border px-3 py-3 text-left text-sm ${selectedStart === slot.start ? "border-brand bg-teal-50 text-teal-900" : "border-line bg-white text-slate-700"}`}
          disabled={!slot.available}
          onClick={() => onSelect(slot.start)}
          type="button"
        >
          {formatDateTime(slot.start)}
        </button>
      ))}
    </div>
  );
}
