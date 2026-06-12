import Link from "next/link";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#eef3f8,#ffffff_44%,#f8efe4)] px-5">
      <form className="w-full max-w-md rounded-lg border border-white/80 bg-white/86 p-8 shadow-soft backdrop-blur">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white shadow-soft">
            <Lock size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-ink">管理者ログイン</h1>
            <p className="text-sm font-semibold text-muted">お知らせ CMS</p>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-ink">
            メールアドレス
            <input
              type="email"
              className="rounded-md border border-line bg-white px-4 py-3 outline-none focus:border-ink focus:ring-4 focus:ring-slate-200"
              placeholder="admin@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink">
            パスワード
            <input
              type="password"
              className="rounded-md border border-line bg-white px-4 py-3 outline-none focus:border-ink focus:ring-4 focus:ring-slate-200"
              placeholder="password"
            />
          </label>
          <Link
            href="/admin/notices"
            className="mt-2 rounded-md bg-ink px-5 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-slate-700"
          >
            ログイン
          </Link>
        </div>
      </form>
    </main>
  );
}
