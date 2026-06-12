"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type AdminSelectOption = {
  label: string;
  value: string;
};

type AdminSelectProps = {
  label?: string;
  name: string;
  value: string;
  options: AdminSelectOption[];
  onChange?: (value: string) => void;
  help?: string;
  reserveHelp?: boolean;
};

export function AdminSelect({
  label,
  name,
  value,
  options,
  onChange,
  help,
  reserveHelp = false
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative grid gap-2">
      {label ? <span className="min-h-[20px] text-sm font-bold text-ink">{label}</span> : null}
      <input type="hidden" name={name} value={selected?.value ?? ""} />
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm font-bold text-ink shadow-sm outline-none transition ${
          open ? "border-cyan-400 ring-4 ring-cyan-100" : "border-line hover:border-slate-300"
        }`}
      >
        <span>{selected?.label}</span>
        <ChevronDown
          size={18}
          className={`text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {help || reserveHelp ? (
        <span className={`min-h-[16px] text-xs font-semibold text-muted ${help ? "" : "invisible"}`}>
          {help ?? "-"}
        </span>
      ) : null}
      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
          {options.map((option) => {
            const active = option.value === selected?.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold ${
                  active ? "bg-cyan-50 text-cyan-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.label}
                {active ? <Check size={16} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
