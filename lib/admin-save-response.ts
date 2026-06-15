import { adminBannerTooLargeMessage } from "./admin-upload";

const fallbackSaveError = "保存に失敗しました。時間をおいてもう一度お試しください。";

type ErrorPayload = {
  message?: unknown;
};

export async function getSaveResponseMessage(response: Response) {
  if (response.status === 413) {
    return adminBannerTooLargeMessage;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const payload = (await response.json().catch(() => null)) as ErrorPayload | null;
    if (typeof payload?.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  }

  return fallbackSaveError;
}
