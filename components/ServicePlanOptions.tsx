const plans = [
  {
    title: "One-Time Service",
    description: "Book a single mounting, hanging, shelving, or blinds appointment.",
  },
  {
    title: "Monthly Maintenance",
    description: "Optional recurring check-ins for properties with frequent service needs.",
  },
  {
    title: "Quarterly Commercial Inspection",
    description: "Optional recurring inspections for offices, rentals, and commercial spaces.",
  },
  {
    title: "Recurring Handyman Support",
    description: "Optional ongoing support for small repairs, mounting, and punch-list work.",
  },
];

export function ServicePlanOptions() {
  return (
    <section className="rounded border border-line bg-white p-4 shadow-soft">
      <div className="mb-3">
        <p className="text-sm font-semibold text-ink">Optional service plan options</p>
        <p className="mt-1 text-sm text-slate-500">Choose a one-time service today, or mention a recurring need in your request.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.title} className="rounded border border-line bg-slate-50 p-3">
            <h3 className="text-sm font-semibold text-ink">{plan.title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{plan.description}</p>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">No payment or subscription is required here. These options simply help Hawkins Pro Mounting understand what kind of service you need.</p>
    </section>
  );
}
