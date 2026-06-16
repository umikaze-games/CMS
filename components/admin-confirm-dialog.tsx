"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const cancelLabel = "\u30ad\u30e3\u30f3\u30bb\u30eb";

type AdminConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  confirmationLabel?: string;
  confirmationRequiredText?: string;
  tone?: "danger" | "warning";
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminConfirmDialog({
  title,
  description,
  confirmLabel,
  confirmationLabel,
  confirmationRequiredText,
  tone = "danger",
  open,
  onCancel,
  onConfirm
}: AdminConfirmDialogProps) {
  const [confirmationValue, setConfirmationValue] = useState("");

  useEffect(() => {
    if (open) {
      setConfirmationValue("");
    }
  }, [open, confirmationRequiredText]);

  if (!open) {
    return null;
  }

  const isDanger = tone === "danger";
  const canConfirm = confirmationRequiredText
    ? confirmationValue === confirmationRequiredText
    : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/38 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.24)]">
        <div className="flex items-start gap-4 border-b border-slate-100 p-5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isDanger ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            <AlertTriangle size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
              {description}
            </p>
            {confirmationRequiredText ? (
              <label className="mt-4 grid gap-2 text-sm font-black text-slate-700">
                {confirmationLabel ?? confirmationRequiredText}
                <input
                  value={confirmationValue}
                  onChange={(event) => setConfirmationValue(event.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  placeholder={confirmationRequiredText}
                />
              </label>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label={cancelLabel}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex justify-end gap-3 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmationRequiredText ? !canConfirm : false}
            className={`rounded-xl px-4 py-2.5 text-sm font-black text-white shadow-sm ${
              isDanger ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700"
            } disabled:cursor-not-allowed disabled:opacity-45`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
