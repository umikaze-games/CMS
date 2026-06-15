import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  isAdminAuthConfigured,
  verifyAdminCredentials
} from "@/lib/admin-auth";

const invalidCredentials = "メールアドレスまたはパスワードが正しくありません。";
const missingConfig = "管理者ログイン設定が不足しています。";

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ message: missingConfig }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: unknown; password?: unknown }
    | null;
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ message: invalidCredentials }, { status: 401 });
  }

  const token = await createAdminSessionToken({
    email,
    secret: process.env.ADMIN_SESSION_SECRET ?? "",
    maxAgeSeconds: ADMIN_SESSION_MAX_AGE_SECONDS
  });
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: "/"
  });

  return response;
}
