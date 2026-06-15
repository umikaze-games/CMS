import { Lock } from "lucide-react";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#eef3f8,#ffffff_44%,#f8efe4)] px-5">
      <div className="w-full max-w-md rounded-lg border border-white/80 bg-white/86 p-8 shadow-soft backdrop-blur">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white shadow-soft">
            <Lock size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-ink">管理者ログイン</h1>
            <p className="text-sm font-semibold text-muted">お知らせ CMS</p>
          </div>
        </div>
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
