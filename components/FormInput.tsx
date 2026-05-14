type FormInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
};

export function FormInput({ label, name, value, onChange, type = "text", placeholder, required, multiline }: FormInputProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {multiline ? (
        <textarea
          className="min-h-28 rounded border border-line bg-white px-3 py-3 text-base outline-none ring-brand/20 placeholder:text-slate-400 focus:ring-4"
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          className="h-12 rounded border border-line bg-white px-3 text-base outline-none ring-brand/20 placeholder:text-slate-400 focus:ring-4"
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </label>
  );
}
