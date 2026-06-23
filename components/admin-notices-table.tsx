"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, GripVertical, Edit, EyeOff, Trash2, Pin, Sparkles } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog";
import { CategoryBadge } from "@/components/category-badge";
import { formatDateWithTime, getNewBadgeRange, isNoticeNew } from "@/lib/date";
import type { GameTitle, NoticeStatus, NoticeWithCategory } from "@/lib/types";

const labels = {
  title: "\u30bf\u30a4\u30c8\u30eb",
  gameTitle: "\u30b2\u30fc\u30e0",
  category: "\u30ab\u30c6\u30b4\u30ea\u30fc",
  status: "\u72b6\u614b",
  publishAt: "\u4e88\u7d04\u516c\u958b",
  updatedAt: "\u66f4\u65b0\u65e5",
  newBadge: "NEW",
  newActive: "\u8868\u793a\u4e2d",
  newInactive: "-",
  pinned: "TOP",
  actions: "\u64cd\u4f5c",
  edit: "\u7de8\u96c6",
  hide: "\u975e\u8868\u793a",
  show: "\u8868\u793a\u306b\u623b\u3059",
  delete: "\u524a\u9664",
  hideTitle: "\u304a\u77e5\u3089\u305b\u3092\u975e\u8868\u793a\u306b\u3057\u307e\u3059\u304b\uff1f",
  hideDescription:
    "\u975e\u8868\u793a\u306b\u3059\u308b\u3068\u30d5\u30ed\u30f3\u30c8\u5074\u306e\u304a\u77e5\u3089\u305b\u4e00\u89a7\u304b\u3089\u8868\u793a\u3055\u308c\u306a\u304f\u306a\u308a\u307e\u3059\u3002",
  showTitle: "\u304a\u77e5\u3089\u305b\u3092\u8868\u793a\u306b\u623b\u3057\u307e\u3059\u304b\uff1f",
  showDescription:
    "\u8868\u793a\u306b\u623b\u3059\u3068\u3001\u516c\u958b\u65e5\u6642\u4ee5\u964d\u306b\u30d5\u30ed\u30f3\u30c8\u5074\u3078\u8868\u793a\u3055\u308c\u307e\u3059\u3002",
  deleteTitle: "\u304a\u77e5\u3089\u305b\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f",
  deleteDescription:
    "\u524a\u9664\u3059\u308b\u3068\u5fa9\u5143\u3067\u304d\u307e\u305b\u3093\u3002\u5fc5\u8981\u306a\u5834\u5408\u306f\u975e\u8868\u793a\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002",
  hideConfirm: "\u975e\u8868\u793a\u306b\u3059\u308b",
  showConfirm: "\u8868\u793a\u306b\u623b\u3059",
  deleteConfirm: "\u524a\u9664\u3059\u308b",
  statusTitle: "\u516c\u958b\u72b6\u614b\u3092\u5909\u66f4\u3057\u307e\u3059\u304b\uff1f",
  statusConfirm: "\u5909\u66f4\u3059\u308b",
  statusError: "\u516c\u958b\u72b6\u614b\u306e\u5909\u66f4\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  orderSaved: "\u8868\u793a\u9806\u3092\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002",
  orderError: "\u8868\u793a\u9806\u306e\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  pinnedLocked: "TOP\u56fa\u5b9a\u4e2d",
  insertHere: "\u3053\u3053\u306b\u633f\u5165",
  dragging: "\u79fb\u52d5\u4e2d",
  prevPage: "\u524d\u306e\u30da\u30fc\u30b8",
  nextPage: "\u6b21\u306e\u30da\u30fc\u30b8",
  pageStatus: "\u30da\u30fc\u30b8",
  jumpPage: "\u79fb\u52d5",
  pageInput: "\u30da\u30fc\u30b8\u756a\u53f7",
  allCategories: "\u3059\u3079\u3066",
  allStatuses: "\u3059\u3079\u3066"
};

const statusLabels = {
  draft: "\u4e0b\u66f8\u304d",
  published: "\u516c\u958b\u4e2d",
  hidden: "\u975e\u516c\u958b"
};

const statusClasses = {
  draft: "bg-slate-100 text-slate-600",
  published: "bg-emerald-50 text-emerald-700",
  hidden: "bg-rose-50 text-rose-700"
};

const statusOptions: NoticeStatus[] = ["draft", "published", "hidden"];
const pageSize = 15;

type AdminNoticesTableProps = {
  notices: NoticeWithCategory[];
  currentGameId: string;
  games: GameTitle[];
};

type DropHint = {
  id: string;
  position: "before" | "after";
};

type FilterOption = {
  label: string;
  value: string;
  color?: string;
};

export function AdminNoticesTable({ notices, currentGameId, games }: AdminNoticesTableProps) {
  const router = useRouter();
  const [items, setItems] = useSortableNotices(notices);
  const [now, setNow] = useState(Date.now());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropHint, setDropHint] = useState<DropHint | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);
  const [filterMenu, setFilterMenu] = useState<"category" | "status" | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<NoticeStatus | "all">("all");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [confirmAction, setConfirmAction] = useState<null | {
    type: "hide" | "delete" | "status";
    notice: NoticeWithCategory;
    status?: NoticeStatus;
  }>(null);
  const showGameTitle = currentGameId === "all";
  const gameNameById = new Map(games.map((game) => [game.id, game.name]));

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const categoryOptions = items.reduce<FilterOption[]>((options, notice) => {
    if (!options.some((option) => option.value === notice.category.id)) {
      options.push({
        label: notice.category.name,
        value: notice.category.id,
        color: notice.category.color
      });
    }
    return options;
  }, []);
  const statusFilterOptions: FilterOption[] = statusOptions.map((status) => ({
    label: statusLabels[status],
    value: status
  }));
  const filteredItems = items.filter((notice) => {
    const matchesCategory = categoryFilter === "all" || notice.category.id === categoryFilter;
    const matchesStatus = statusFilter === "all" || notice.status === statusFilter;
    return matchesCategory && matchesStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filteredItems.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    setPageInputValue(String(safePage));
  }, [safePage]);

  function jumpToPage() {
    const requestedPage = Math.max(1, Math.min(totalPages, Number(pageInputValue)));
    setCurrentPage(Number.isFinite(requestedPage) ? requestedPage : safePage);
  }

  function getNoticeEditHref(notice: NoticeWithCategory) {
    const gameId = currentGameId === "all" ? notice.gameId : currentGameId;
    return `/admin/notices/${notice.id}/edit?game=${gameId}`;
  }

  function handleRowClick(
    event: React.MouseEvent<HTMLTableRowElement>,
    notice: NoticeWithCategory
  ) {
    if (shouldIgnoreRowNavigation(event.target)) {
      return;
    }

    router.push(getNoticeEditHref(notice));
  }

  function handleRowKeyDown(
    event: React.KeyboardEvent<HTMLTableRowElement>,
    notice: NoticeWithCategory
  ) {
    if (event.key !== "Enter" || shouldIgnoreRowNavigation(event.target)) {
      return;
    }

    event.preventDefault();
    router.push(getNoticeEditHref(notice));
  }

  async function saveNoticeOrder(nextItems: NoticeWithCategory[]) {
    const response = await fetch("/api/admin/notices/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: nextItems.map((item) => item.id) })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(payload?.message ?? labels.orderError);
    }
  }

  async function moveItem(fromId: string, toId: string, position: "before" | "after") {
    if (!fromId || !toId || fromId === toId) {
      return;
    }

    const fromNotice = items.find((item) => item.id === fromId);
    const targetNotice = items.find((item) => item.id === toId);
    if (fromNotice?.isPinned || targetNotice?.isPinned) {
      return;
    }

    const nextItems = reorderNoticeItems(items, fromId, toId, position);
    if (!nextItems) {
      return;
    }

    setFeedbackMessage(null);
    setItems(nextItems);

    try {
      await saveNoticeOrder(nextItems);
      setFeedbackMessage(labels.orderSaved);
    } catch (error) {
      setItems(items);
      setFeedbackMessage(error instanceof Error ? error.message : labels.orderError);
    }
  }

  function updateDropHint(event: React.DragEvent<HTMLTableRowElement>, id: string) {
    const targetNotice = items.find((item) => item.id === id);
    const sourceNotice = draggingId ? items.find((item) => item.id === draggingId) : null;
    if (!draggingId || draggingId === id || targetNotice?.isPinned || sourceNotice?.isPinned) {
      setDropHint(null);
      return;
    }

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const position = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
    setDropHint({ id, position });
  }

  function clearDragState() {
    setDraggingId(null);
    setDropHint(null);
  }

  function requestStatusChange(notice: NoticeWithCategory, status: NoticeStatus) {
    setFeedbackMessage(null);
    setStatusMenuId(null);
    if (notice.status === status) {
      return;
    }
    setConfirmAction({ type: "status", notice, status });
  }

  function getVisibilityToggleStatus(notice: NoticeWithCategory) {
    return notice.status === "hidden" ? "published" : "hidden";
  }

  async function updateNoticeStatus(notice: NoticeWithCategory, status: NoticeStatus) {
    const response = await fetch(`/api/admin/notices/${notice.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(labels.statusError);
    }

    setItems((current) =>
      current.map((item) =>
        item.id === notice.id ? { ...item, status, updatedAt: new Date().toISOString() } : item
      )
    );
  }

  async function deleteNotice(notice: NoticeWithCategory) {
    const response = await fetch(`/api/admin/notices/${notice.id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(labels.deleteDescription);
    }

    setItems((current) => current.filter((item) => item.id !== notice.id));
  }

  async function handleConfirmAction() {
    if (!confirmAction) {
      return;
    }

    try {
      if (confirmAction.type === "status" && confirmAction.status) {
        await updateNoticeStatus(confirmAction.notice, confirmAction.status);
        setFeedbackMessage("\u516c\u958b\u72b6\u614b\u3092\u5909\u66f4\u3057\u307e\u3057\u305f\u3002");
      }
      if (confirmAction.type === "hide") {
        await updateNoticeStatus(confirmAction.notice, confirmAction.status ?? "hidden");
        setFeedbackMessage(
          confirmAction.status === "published"
            ? "\u304a\u77e5\u3089\u305b\u3092\u8868\u793a\u306b\u623b\u3057\u307e\u3057\u305f\u3002"
            : "\u304a\u77e5\u3089\u305b\u3092\u975e\u516c\u958b\u306b\u5909\u66f4\u3057\u307e\u3057\u305f\u3002"
        );
      }
      if (confirmAction.type === "delete") {
        await deleteNotice(confirmAction.notice);
        setFeedbackMessage("\u304a\u77e5\u3089\u305b\u3092\u524a\u9664\u3057\u307e\u3057\u305f\u3002");
      }
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : labels.statusError);
    } finally {
      setConfirmAction(null);
    }
  }

  return (
    <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      {feedbackMessage ? (
        <div className="rounded-t-2xl border-b border-cyan-100 bg-cyan-50 px-5 py-3 text-sm font-bold text-cyan-800">
          {feedbackMessage}
        </div>
      ) : null}
      <div className="overflow-visible rounded-2xl bg-white">
        <table className="w-full table-fixed border-collapse text-center text-sm">
          <thead className="sticky top-0 z-20 bg-slate-900 text-xs uppercase text-white shadow-sm">
            <tr>
              <th className="w-[4%] rounded-tl-2xl px-2 py-3" />
              <th className="w-[16%] px-3 py-3">{labels.title}</th>
              <th className="w-[14%] px-3 py-3">
                <FilterHeader
                  label={labels.category}
                  active={categoryFilter !== "all"}
                  open={filterMenu === "category"}
                  options={categoryOptions}
                  selectedValue={categoryFilter}
                  allLabel={labels.allCategories}
                  onToggle={() => setFilterMenu((current) => (current === "category" ? null : "category"))}
                  onClose={() => setFilterMenu(null)}
                  onSelect={(value) => {
                    setCategoryFilter(value);
                    setFilterMenu(null);
                  }}
                />
              </th>
              <th className="w-[13%] px-3 py-3">
                <FilterHeader
                  label={labels.status}
                  active={statusFilter !== "all"}
                  open={filterMenu === "status"}
                  options={statusFilterOptions}
                  selectedValue={statusFilter}
                  allLabel={labels.allStatuses}
                  onToggle={() => setFilterMenu((current) => (current === "status" ? null : "status"))}
                  onClose={() => setFilterMenu(null)}
                  onSelect={(value) => {
                    setStatusFilter(value as NoticeStatus | "all");
                    setFilterMenu(null);
                  }}
                />
              </th>
              <th className="w-[14%] px-3 py-3">{labels.publishAt}</th>
              <th className="w-[14%] px-3 py-3">{labels.updatedAt}</th>
              <th className="w-[12%] px-3 py-3">{labels.newBadge}</th>
              <th className="w-[8%] px-3 py-3">{labels.pinned}</th>
              <th className="w-[13%] rounded-tr-2xl px-3 py-3 text-center">{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((notice) => (
              <tr
                key={notice.id}
                role="link"
                tabIndex={0}
                aria-label={`${showGameTitle ? `${gameNameById.get(notice.gameId) ?? notice.gameId} ` : ""}${notice.title} ${labels.edit}`}
                draggable={!notice.isPinned}
                onClick={(event) => handleRowClick(event, notice)}
                onKeyDown={(event) => handleRowKeyDown(event, notice)}
                onDragStart={(event) => {
                  if (notice.isPinned) {
                    event.preventDefault();
                    return;
                  }

                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", notice.id);
                  setDraggingId(notice.id);
                }}
                onDragEnd={clearDragState}
                onDragOver={(event) => updateDropHint(event, notice.id)}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setDropHint((current) => (current?.id === notice.id ? null : current));
                  }
                }}
                onDrop={async (event) => {
                  event.preventDefault();
                  if (notice.isPinned) {
                    clearDragState();
                    return;
                  }

                  const fromId = event.dataTransfer.getData("text/plain");
                  await moveItem(fromId, notice.id, dropHint?.position ?? "before");
                  clearDragState();
                }}
                className={`relative border-t border-line transition ${
                  draggingId === notice.id
                    ? "bg-cyan-50/60 opacity-45"
                    : dropHint?.id === notice.id
                      ? "bg-cyan-50"
                      : notice.status === "hidden"
                        ? "cursor-pointer bg-slate-100/80 hover:bg-slate-100"
                        : "cursor-pointer hover:bg-surface/70"
                } ${
                  dropHint?.id === notice.id && dropHint.position === "before"
                    ? "shadow-[inset_0_3px_0_#06b6d4]"
                    : ""
                } ${
                  dropHint?.id === notice.id && dropHint.position === "after"
                    ? "shadow-[inset_0_-3px_0_#06b6d4]"
                    : ""
                }`}
              >
                <td className="relative px-3 py-4 text-center text-muted" data-row-action>
                  {dropHint?.id === notice.id ? (
                    <DropIndicator position={dropHint.position} />
                  ) : null}
                  {notice.isPinned ? (
                    <span
                      className="inline-flex cursor-not-allowed items-center gap-1 rounded-md px-1 py-1 text-rose-400"
                      data-row-action
                      title={labels.pinnedLocked}
                    >
                      <Pin size={16} />
                    </span>
                  ) : (
                    <span
                      className="inline-flex cursor-grab items-center gap-1 rounded-md px-1 py-1 active:cursor-grabbing"
                      data-row-action
                    >
                      <GripVertical size={18} />
                      {draggingId === notice.id ? (
                        <span className="sr-only">{labels.dragging}</span>
                      ) : null}
                    </span>
                  )}
                </td>
                <td className={`px-4 py-4 text-center font-bold ${notice.status === "hidden" ? "text-slate-500" : "text-ink"}`}>
                  <div className="flex min-w-0 flex-col items-center gap-1.5">
                    <span className="max-w-full break-words">{notice.title}</span>
                    {showGameTitle ? (
                      <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-600 ring-1 ring-slate-200">
                        <span className="shrink-0">{labels.gameTitle}</span>
                        <span className="max-w-[9rem] truncate text-slate-800">
                          {gameNameById.get(notice.gameId) ?? notice.gameId}
                        </span>
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <CategoryBadge category={notice.category} />
                </td>
                <td className="px-4 py-4" data-row-action>
                  <StatusSelect
                    notice={notice}
                    open={statusMenuId === notice.id}
                    onToggle={() =>
                      setStatusMenuId((current) => (current === notice.id ? null : notice.id))
                    }
                    onClose={() => setStatusMenuId(null)}
                    onChange={(status) => requestStatusChange(notice, status)}
                  />
                </td>
                <td className="px-4 py-4 font-semibold text-muted">
                  {formatDateWithTime(notice.publishAt)}
                </td>
                <td className="px-4 py-4 font-semibold text-muted">
                  {formatDateWithTime(notice.updatedAt)}
                </td>
                <td className="px-4 py-4">
                  <NewBadgeStatus notice={notice} now={now} />
                </td>
                <td className="px-4 py-4 font-semibold text-muted">
                  {notice.isPinned ? (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                      <Pin size={16} />
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-4" data-row-action>
                  <div className="flex justify-center gap-2">
                    <Link
                      href={getNoticeEditHref(notice)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-muted hover:text-ink"
                      aria-label={labels.edit}
                      title={labels.edit}
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: "hide",
                          notice,
                          status: getVisibilityToggleStatus(notice)
                        })
                      }
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                        notice.status === "hidden"
                          ? "border-rose-200 bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                          : "border-line bg-white text-muted hover:text-ink"
                      }`}
                      aria-label={notice.status === "hidden" ? labels.show : labels.hide}
                      title={notice.status === "hidden" ? labels.show : labels.hide}
                    >
                      <EyeOff size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmAction({ type: "delete", notice })}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-rose-600 hover:bg-rose-50"
                      aria-label={labels.delete}
                      title={labels.delete}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 ? (
        <nav
          className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4"
          aria-label="pagination"
        >
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-slate-50 px-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-slate-50"
          >
            <ChevronLeft size={15} />
            {labels.prevPage}
          </button>
          <form
            className="flex flex-wrap items-center justify-center gap-2 text-xs font-black text-slate-600"
            onSubmit={(event) => {
              event.preventDefault();
              jumpToPage();
            }}
          >
            <span>
              {labels.pageStatus} {safePage} / {totalPages}
            </span>
            <label className="sr-only" htmlFor="notice-page-input">
              {labels.pageInput}
            </label>
            <input
              id="notice-page-input"
              type="number"
              min={1}
              max={totalPages}
              value={pageInputValue}
              onChange={(event) => setPageInputValue(event.target.value)}
              className="h-9 w-20 rounded-lg border border-line bg-white px-3 text-center text-xs font-black text-ink outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-cyan-50 px-3 text-xs font-black text-cyan-700 shadow-sm transition hover:bg-cyan-100"
            >
              {labels.jumpPage}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={safePage === totalPages}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-slate-50 px-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-slate-50"
          >
            {labels.nextPage}
            <ChevronRight size={15} />
          </button>
        </nav>
      ) : null}
      <AdminConfirmDialog
        open={confirmAction !== null}
        tone={confirmAction?.type === "delete" ? "danger" : "warning"}
        title={
          confirmAction?.type === "delete"
            ? labels.deleteTitle
            : confirmAction?.type === "status"
              ? labels.statusTitle
              : confirmAction?.status === "published"
                ? labels.showTitle
                : labels.hideTitle
        }
        description={
          confirmAction?.type === "delete"
            ? labels.deleteDescription
            : confirmAction?.type === "status" && confirmAction.status
              ? `「${confirmAction.notice.title}」を「${statusLabels[confirmAction.status]}」に変更します。`
              : confirmAction?.status === "published"
                ? labels.showDescription
                : labels.hideDescription
        }
        confirmLabel={
          confirmAction?.type === "delete"
            ? labels.deleteConfirm
            : confirmAction?.type === "status"
              ? labels.statusConfirm
              : confirmAction?.status === "published"
                ? labels.showConfirm
                : labels.hideConfirm
        }
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}

function reorderNoticeItems(
  items: NoticeWithCategory[],
  fromId: string,
  toId: string,
  position: "before" | "after"
) {
  const fromIndex = items.findIndex((item) => item.id === fromId);
  const toIndex = items.findIndex((item) => item.id === toId);
  if (fromIndex < 0 || toIndex < 0) {
    return null;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  const targetIndex = next.findIndex((item) => item.id === toId);
  if (targetIndex < 0) {
    return null;
  }

  const insertIndex = position === "after" ? targetIndex + 1 : targetIndex;
  next.splice(insertIndex, 0, moved);
  return next.map((item, index) => ({ ...item, sortOrder: index + 1 }));
}

function shouldIgnoreRowNavigation(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return true;
  }

  return Boolean(
    target.closest(
      'a, button, input, select, textarea, [role="button"], [data-row-action]'
    )
  );
}

function FilterHeader({
  active,
  allLabel,
  label,
  onClose,
  onSelect,
  onToggle,
  open,
  options,
  selectedValue
}: {
  active: boolean;
  allLabel: string;
  label: string;
  onClose: () => void;
  onSelect: (value: string) => void;
  onToggle: () => void;
  open: boolean;
  options: FilterOption[];
  selectedValue: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuOptions = [{ label: allLabel, value: "all" }, ...options];

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose, open]);

  return (
    <div ref={rootRef} className="relative inline-flex justify-center">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition ${
          active
            ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200"
            : "text-white hover:bg-white/10"
        }`}
      >
        {label}
        <ChevronDown size={13} />
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full z-40 mt-2 w-40 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-700 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
          {menuOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-black hover:bg-cyan-50 hover:text-cyan-700"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                {option.color ? (
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                ) : null}
                <span className="truncate">{option.label}</span>
              </span>
              {selectedValue === option.value ? <Check size={14} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StatusSelect({
  notice,
  open,
  onToggle,
  onClose,
  onChange
}: {
  notice: NoticeWithCategory;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (status: NoticeStatus) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose, open]);

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex min-w-24 items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition hover:ring-2 hover:ring-cyan-100 ${statusClasses[notice.status]}`}
      >
        {statusLabels[notice.status]}
        <ChevronDown size={13} />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-30 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onChange(status)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-black text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
            >
              {statusLabels[status]}
              {notice.status === status ? <Check size={14} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function NewBadgeStatus({ notice, now }: { notice: NoticeWithCategory; now: number }) {
  if (!isNoticeNew(notice, new Date(now))) {
    return <span className="font-semibold text-muted">{labels.newInactive}</span>;
  }

  const range = getNewBadgeRange(
    notice.publishAt,
    notice.newBadgeStartAt,
    notice.newBadgeEndAt
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-black text-white shadow-[0_10px_22px_rgba(225,29,72,0.18)]">
        <Sparkles size={13} />
        NEW
      </span>
      <span className="text-xs font-black text-rose-600">
        {formatCountdown(range.end, now)}
      </span>
    </div>
  );
}

function formatCountdown(endAt: string, now: number) {
  const diff = new Date(endAt).getTime() - now;
  if (diff <= 0) {
    return "0d0h0m";
  }

  const totalMinutes = Math.ceil(diff / (60 * 1000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d${hours}h${minutes}m`;
}

function DropIndicator({ position }: { position: "before" | "after" }) {
  return (
    <div
      className={`pointer-events-none absolute left-3 z-10 whitespace-nowrap ${
        position === "before" ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2"
      }`}
    >
      <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-[11px] font-black text-white shadow-[0_8px_18px_rgba(8,145,178,0.25)]">
        {labels.insertHere}
      </span>
    </div>
  );
}

function useSortableNotices(initial: NoticeWithCategory[]) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  return [items, setItems] as const;
}
