export const ADMIN_SESSION_COOKIE = "notice_cms_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

type AdminAuthEnv = {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
};

type SessionTokenOptions = {
  email: string;
  secret: string;
  now?: number;
  maxAgeSeconds?: number;
};

type VerifyTokenOptions = {
  secret?: string;
  now?: number;
};

type SessionPayload = {
  email: string;
  exp: number;
};

export function isAdminAuthConfigured(env: AdminAuthEnv = process.env as AdminAuthEnv) {
  return Boolean(env.ADMIN_EMAIL && env.ADMIN_PASSWORD && env.ADMIN_SESSION_SECRET);
}

export function verifyAdminCredentials(
  email: string,
  password: string,
  env: AdminAuthEnv = process.env as AdminAuthEnv
) {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    return false;
  }

  return email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD;
}

export async function createAdminSessionToken({
  email,
  secret,
  now = currentUnixTime(),
  maxAgeSeconds = ADMIN_SESSION_MAX_AGE_SECONDS
}: SessionTokenOptions) {
  const payload = encodeString(JSON.stringify({ email, exp: now + maxAgeSeconds }));
  const signature = await sign(payload, secret);

  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined, options: VerifyTokenOptions) {
  if (!token || !options.secret) {
    return false;
  }

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) {
    return false;
  }

  const expectedSignature = await sign(payload, options.secret);
  if (!constantTimeEqual(signature, expectedSignature)) {
    return false;
  }

  const session = readPayload(payload);
  if (!session) {
    return false;
  }

  return session.exp > (options.now ?? currentUnixTime());
}

function currentUnixTime() {
  return Math.floor(Date.now() / 1000);
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));

  return encodeBytes(new Uint8Array(signature));
}

function readPayload(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(decodeString(value)) as Partial<SessionPayload>;
    if (typeof parsed.email !== "string" || typeof parsed.exp !== "number") {
      return null;
    }

    return { email: parsed.email, exp: parsed.exp };
  } catch {
    return null;
  }
}

function encodeString(value: string) {
  return encodeBytes(new TextEncoder().encode(value));
}

function decodeString(value: string) {
  return new TextDecoder().decode(decodeBytes(value));
}

function encodeBytes(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function decodeBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function constantTimeEqual(left: string, right: string) {
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return diff === 0;
}
