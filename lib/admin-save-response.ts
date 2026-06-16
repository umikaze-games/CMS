const fallbackSaveError = "保存に失敗しました。時間をおいてもう一度お試しください。";
const requestTooLargeError =
  "サーバーのアップロード上限を超えました。管理者にNginxのclient_max_body_size設定を確認してください。";

type ErrorPayload = {
  message?: unknown;
};

export async function getSaveResponseMessage(response: Response) {
  if (response.status === 413) {
    return requestTooLargeError;
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
