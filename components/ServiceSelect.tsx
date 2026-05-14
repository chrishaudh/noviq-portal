import type { ServiceType } from "@/types";

export const serviceOptions: ServiceType[] = [
  "TV Mounting",
  "Picture & Art Hanging",
  "Floating Shelves",
  "Closet Shelving",
  "Curtains & Blinds",
];

type ServiceSelectProps = {
  value: ServiceType;
  onChange: (value: ServiceType) => void;
};

export function ServiceSelect({ value, onChange }: ServiceSelectProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-slate-700">Service</span>
      <select
        className="h-12 rounded border border-line bg-white px-3 text-base outline-none ring-brand/20 focus:ring-4"
        value={value}
        onChange={(event) => onChange(event.target.value as ServiceType)}
      >
        {serviceOptions.map((service) => (
          <option key={service} value={service}>{service}</option>
        ))}
      </select>
    </label>
  );
}
