export const ADMIN_BANNER_MAX_BYTES = 10 * 1024 * 1024;
export const adminBannerTooLargeMessage =
  "画像サイズが大きすぎます。10MB以下の画像を選択してください。";

type FileLike = {
  size: number;
};

export function validateAdminBannerFile(file: FileLike | null) {
  if (!file || file.size <= ADMIN_BANNER_MAX_BYTES) {
    return null;
  }

  return adminBannerTooLargeMessage;
}
