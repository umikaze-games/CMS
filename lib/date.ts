export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(new Date(value))
    .replaceAll("/", ".");
}

export function formatDateWithTime(value: string) {
  const date = new Date(value);
  const dateText = formatDate(value);
  const timeText = new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);

  return `${dateText} ${timeText}`;
}

export function formatDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function addDaysLocalDateTime(value: string, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function getNewBadgeRange(publishAt: string, startAt?: string | null, endAt?: string | null) {
  const start = startAt || publishAt;
  const end = endAt || addDaysLocalDateTime(start, 7);
  return { start, end };
}

export function isNoticeNew(
  notice: {
    status?: string;
    publishAt: string;
    newBadgeStartAt?: string | null;
    newBadgeEndAt?: string | null;
  },
  now = new Date()
) {
  const publishTime = new Date(notice.publishAt).getTime();
  const currentTime = now.getTime();

  if (notice.status && notice.status !== "published") {
    return false;
  }

  if (publishTime > currentTime) {
    return false;
  }

  const range = getNewBadgeRange(notice.publishAt, notice.newBadgeStartAt, notice.newBadgeEndAt);
  return new Date(range.start).getTime() <= currentTime && currentTime < new Date(range.end).getTime();
}
