import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminCookieSecure } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isAdminCookieSecure(),
    maxAge: 0,
    path: "/"
  });

  return response;
}
