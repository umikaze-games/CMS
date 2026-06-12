"use client";

import { ChevronLeft, ChevronRight, CalendarDays, Clock3 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const labels = {
  previous: "\u524d\u306e\u6708",
  next: "\u6b21\u306e\u6708",
  holiday: "\u795d\u65e5",
  hour: "\u6642",
  minute: "\u5206",
  weekdays: ["\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"]
};

type AdminDateTimePickerProps = {
  label: ReactNode;
  name: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  reserveHelp?: boolean;
  labelAside?: string;
  disabled?: boolean;
};

export function AdminDateTimePicker({
  label,
  name,
  value,
  onChange,
  help,
  reserveHelp = false,
  labelAside,
  disabled = false
}: AdminDateTimePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = parseLocalValue(value);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selected ?? new Date());
  const holidays = useMemo(() => getJapaneseHolidays(new Date().getFullYear(), 10), []);
  const days = getCalendarDays(viewDate);
  const selectedDateKey = selected ? toDateKey(selected) : "";
  const timeValue = value?.slice(11, 16) || "12:00";
  const [selectedHour = "12", selectedMinute = "00"] = timeValue.split(":");

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectDate(date: Date) {
    if (disabled) {
      return;
    }
    onChange(`${toDateKey(date)}T${timeValue}`);
  }

  function selectTime(nextTime: string) {
    if (disabled) {
      return;
    }
    const dateKey = selectedDateKey || toDateKey(new Date());
    onChange(`${dateKey}T${nextTime}`);
  }

  function selectHour(hour: string) {
    selectTime(`${hour}:${selectedMinute}`);
  }

  function selectMinute(minute: string) {
    selectTime(`${selectedHour}:${minute}`);
  }

  return (
    <div ref={rootRef} className="relative grid gap-2">
      <span className="flex min-h-[20px] items-center justify-between gap-3 text-sm font-bold text-ink">
        {label}
        {labelAside ? (
          <span className="text-xs font-semibold text-muted">{labelAside}</span>
        ) : null}
      </span>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
        className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm font-bold text-ink shadow-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 shadow-none"
            : open
              ? "border-cyan-400 ring-4 ring-cyan-100"
              : "border-line hover:border-slate-300"
        }`}
      >
        <span>{formatDisplayValue(value)}</span>
        <CalendarDays size={18} className={disabled ? "text-slate-300" : "text-slate-500"} />
      </button>
      {help || reserveHelp ? (
        <span className={`min-h-[16px] text-xs font-semibold text-muted ${help ? "" : "invisible"}`}>
          {help ?? "-"}
        </span>
      ) : null}

      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_22px_70px_rgba(15,23,42,0.18)]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(addMonths(viewDate, -1))}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label={labels.previous}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-sm font-black text-slate-950">
              {viewDate.getFullYear()} / {String(viewDate.getMonth() + 1).padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label={labels.next}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-black">
            {labels.weekdays.map((weekday, index) => (
              <span
                key={weekday}
                className={
                  index === 0
                    ? "text-rose-500"
                    : index === 6
                      ? "text-blue-500"
                      : "text-slate-400"
                }
              >
                {weekday}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dateKey = toDateKey(day);
              const holiday = holidays.get(dateKey);
              const isSelected = dateKey === selectedDateKey;
              const isOutsideMonth = day.getMonth() !== viewDate.getMonth();
              const isSunday = day.getDay() === 0;
              const isSaturday = day.getDay() === 6;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => selectDate(day)}
                  title={holiday ? `${labels.holiday}: ${holiday}` : undefined}
                  className={`relative h-10 rounded-xl text-sm font-black transition ${
                    isSelected
                      ? "bg-cyan-600 text-white shadow-[0_10px_22px_rgba(8,145,178,0.24)]"
                      : holiday
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        : isSunday
                          ? "bg-rose-50/55 text-rose-600 hover:bg-rose-100"
                          : isSaturday
                            ? "bg-blue-50/60 text-blue-600 hover:bg-blue-100"
                            : "text-slate-700 hover:bg-slate-100"
                  } ${isOutsideMonth ? "opacity-35" : ""}`}
                >
                  {day.getDate()}
                  {holiday || isSunday || isSaturday ? (
                    <span
                      className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                        holiday || isSunday ? "bg-rose-500" : "bg-blue-500"
                      }`}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                  <Clock3 size={15} className="text-cyan-600" />
                  {timeValue}
                </div>
                <div className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-slate-500 shadow-sm">
                  {labels.hour} / {labels.minute}
                </div>
              </div>
              <div className="mx-auto grid max-w-72 grid-cols-2 gap-2">
                <TimeColumn
                  label={labels.hour}
                  value={selectedHour}
                  options={createNumberOptions(24)}
                  onChange={selectHour}
                />
                <TimeColumn
                  label={labels.minute}
                  value={selectedMinute}
                  options={createNumberOptions(60)}
                  onChange={selectMinute}
                />
              </div>
            </div>
            {selectedDateKey && holidays.get(selectedDateKey) ? (
              <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-600">
                {holidays.get(selectedDateKey)}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TimeColumn({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-1">
      <div className="text-center text-[11px] font-black text-slate-500">{label}</div>
      <div className="max-h-28 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`block h-7 w-full rounded-md text-xs font-black transition ${
                active
                  ? "bg-cyan-600 text-white shadow-[0_6px_14px_rgba(8,145,178,0.18)]"
                  : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function createNumberOptions(length: number) {
  return Array.from({ length }, (_, index) => String(index).padStart(2, "0"));
}

export function defaultLocalDateTime() {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);
  return `${toDateKey(date)}T${String(date.getHours()).padStart(2, "0")}:00`;
}

function parseLocalValue(value: string) {
  if (!value) return null;
  const [date, time = "00:00"] = value.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

function formatDisplayValue(value: string) {
  const date = parseLocalValue(value);
  if (!date) return "----/--/-- --:--";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getCalendarDays(viewDate: Date) {
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getJapaneseHolidays(startYear: number, years: number) {
  const map = new Map<string, string>();
  for (let year = startYear; year < startYear + years; year += 1) {
    addBaseHolidays(map, year);
    addSubstituteAndCitizenHolidays(map, year);
  }
  return map;
}

function addBaseHolidays(map: Map<string, string>, year: number) {
  addHoliday(map, year, 1, 1, "\u5143\u65e5");
  addHoliday(map, year, 2, 11, "\u5efa\u56fd\u8a18\u5ff5\u306e\u65e5");
  addHoliday(map, year, 2, 23, "\u5929\u7687\u8a95\u751f\u65e5");
  addHoliday(map, year, 4, 29, "\u662d\u548c\u306e\u65e5");
  addHoliday(map, year, 5, 3, "\u61b2\u6cd5\u8a18\u5ff5\u65e5");
  addHoliday(map, year, 5, 4, "\u307f\u3069\u308a\u306e\u65e5");
  addHoliday(map, year, 5, 5, "\u3053\u3069\u3082\u306e\u65e5");
  addHoliday(map, year, 8, 11, "\u5c71\u306e\u65e5");
  addHoliday(map, year, 11, 3, "\u6587\u5316\u306e\u65e5");
  addHoliday(map, year, 11, 23, "\u52e4\u52b4\u611f\u8b1d\u306e\u65e5");
  addNthMonday(map, year, 1, 2, "\u6210\u4eba\u306e\u65e5");
  addNthMonday(map, year, 7, 3, "\u6d77\u306e\u65e5");
  addNthMonday(map, year, 9, 3, "\u656c\u8001\u306e\u65e5");
  addNthMonday(map, year, 10, 2, "\u30b9\u30dd\u30fc\u30c4\u306e\u65e5");
  addHoliday(map, year, 3, springEquinoxDay(year), "\u6625\u5206\u306e\u65e5");
  addHoliday(map, year, 9, autumnEquinoxDay(year), "\u79cb\u5206\u306e\u65e5");
}

function addHoliday(map: Map<string, string>, year: number, month: number, day: number, name: string) {
  map.set(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, name);
}

function addNthMonday(map: Map<string, string>, year: number, month: number, nth: number, name: string) {
  const date = new Date(year, month - 1, 1);
  const firstMondayOffset = (8 - date.getDay()) % 7;
  addHoliday(map, year, month, 1 + firstMondayOffset + (nth - 1) * 7, name);
}

function addSubstituteAndCitizenHolidays(map: Map<string, string>, year: number) {
  const dates = Array.from(map.keys()).filter((key) => key.startsWith(`${year}-`)).sort();
  for (const key of dates) {
    const date = parseLocalValue(`${key}T00:00`);
    if (date?.getDay() === 0) {
      let substitute = new Date(date);
      do {
        substitute.setDate(substitute.getDate() + 1);
      } while (map.has(toDateKey(substitute)));
      map.set(toDateKey(substitute), "\u632f\u66ff\u4f11\u65e5");
    }
  }

  for (let month = 0; month < 12; month += 1) {
    for (let day = 2; day <= 30; day += 1) {
      const date = new Date(year, month, day);
      if (date.getMonth() !== month) continue;
      const key = toDateKey(date);
      if (map.has(key)) continue;
      const previous = new Date(date);
      previous.setDate(date.getDate() - 1);
      const next = new Date(date);
      next.setDate(date.getDate() + 1);
      if (map.has(toDateKey(previous)) && map.has(toDateKey(next))) {
        map.set(key, "\u56fd\u6c11\u306e\u4f11\u65e5");
      }
    }
  }
}

function springEquinoxDay(year: number) {
  return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

function autumnEquinoxDay(year: number) {
  return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}
