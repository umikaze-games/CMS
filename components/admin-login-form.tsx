"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(data?.message ?? "ログインに失敗しました。");
      setIsSubmitting(false);
      return;
    }

    const next = searchParams.get("next");
    router.replace(next && next.startsWith("/admin") ? next : "/admin/notices");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4"
    >
      <label className="grid gap-2 text-sm font-bold text-ink">
        メールアドレス
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-line bg-white px-4 py-3 outline-none focus:border-ink focus:ring-4 focus:ring-slate-200"
          placeholder="admin@example.com"
          autoComplete="username"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        パスワード
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-md border border-line bg-white px-4 py-3 outline-none focus:border-ink focus:ring-4 focus:ring-slate-200"
          placeholder="password"
          autoComplete="current-password"
          required
        />
      </label>
      {message ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-md bg-ink px-5 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}
