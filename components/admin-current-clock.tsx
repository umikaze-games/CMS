"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminCurrentClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dateText = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replaceAll("/", ".");
  const weekday = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    weekday: "short"
  }).format(now);
  const timeText = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  return (
    <div className="inline-flex min-w-[230px] items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50/70 px-3 py-2 text-sm font-black text-cyan-800 shadow-sm">
      <Clock3 size={16} />
      <span>
        {dateText}（{weekday}） {timeText}
      </span>
    </div>
  );
}
