import Link from "next/link";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <nav className="mb-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-brand text-sm font-bold text-white">HP</div>
          <div>
            <span className="block text-sm font-semibold text-ink">Hawkins Pro Mounting</span>
            <span className="block text-xs text-slate-500">Powered by Noviq</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Link href="/quote" className="rounded px-3 py-2 hover:bg-slate-100">Quote</Link>
          <Link href="/book" className="rounded px-3 py-2 hover:bg-slate-100">Book</Link>
        </div>
      </nav>
      <h1 className="text-3xl font-semibold tracking-normal text-ink">{title}</h1>
      {description ? <p className="mt-3 text-base leading-7 text-slate-600">{description}</p> : null}
    </header>
  );
}
