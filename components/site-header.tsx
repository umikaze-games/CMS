import Link from "next/link";
import { LayoutDashboard, Newspaper } from "lucide-react";

const brandTitle = "\u516c\u5f0f\u30b5\u30a4\u30c8";
const listLabel = "\u4e00\u89a7";
const adminLabel = "\u7ba1\u7406\u753b\u9762";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/86 shadow-[0_10px_36px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/notices" className="flex items-center gap-3 text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-[0_10px_28px_rgba(8,145,178,0.16)]">
            <Newspaper size={20} />
          </span>
          <span>
            <span className="block text-base font-black leading-tight tracking-normal">{brandTitle}</span>
            <span className="block text-xs font-bold text-cyan-700">GAME NEWS HUB</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-bold">
          <Link className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950" href="/notices">
            {listLabel}
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-700 shadow-[0_10px_28px_rgba(79,70,229,0.12)] hover:bg-indigo-100"
            href="/admin/notices"
          >
            <LayoutDashboard size={16} />
            {adminLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
