"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, KeyRound, Pencil, Plus, Save, ShieldCheck, Trash2, UserPlus, X } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog";
import { AdminSelect } from "@/components/admin-select";
import {
  createGameId,
  dedupeGames,
  hasGameName,
  saveGameTitles
} from "@/lib/admin-game-titles";
import { getNoticeTemplate, setNoticeTemplate } from "@/lib/notice-templates";
import type { GameTitle, NoticeCategory } from "@/lib/types";

const labels = {
  accounts: "\u30a2\u30ab\u30a6\u30f3\u30c8\u767a\u884c",
  accountId: "ID",
  password: "\u30d1\u30b9\u30ef\u30fc\u30c9",
  role: "\u6a29\u9650",
  issue: "\u767a\u884c",
  issuedAccounts: "\u767a\u884c\u6e08\u307f\u30a2\u30ab\u30a6\u30f3\u30c8",
  changePassword: "\u30d1\u30b9\u30ef\u30fc\u30c9\u4fee\u6b63",
  changeRole: "\u6a29\u9650\u8a2d\u5b9a",
  accountExists: "\u540c\u3058ID\u306e\u30a2\u30ab\u30a6\u30f3\u30c8\u306f\u767a\u884c\u3067\u304d\u307e\u305b\u3093\u3002",
  games: "\u30b2\u30fc\u30e0\u767b\u9332",
  gameName: "\u30b2\u30fc\u30e0\u540d",
  addGame: "\u30b2\u30fc\u30e0\u3092\u8ffd\u52a0",
  addGameTitle: "\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb\u3092\u8ffd\u52a0\u3057\u307e\u3059\u304b\uff1f",
  addGameDescription:
    "\u8ffd\u52a0\u3059\u308b\u3068\u3001\u3053\u306e\u30bf\u30a4\u30c8\u30eb\u306e\u304a\u77e5\u3089\u305b\u3092\u7ba1\u7406\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3059\u3002",
  addGameConfirm: "\u8ffd\u52a0\u3059\u308b",
  editGame: "\u30b2\u30fc\u30e0\u540d\u3092\u7de8\u96c6",
  editGameTitle: "\u30b2\u30fc\u30e0\u540d\u7de8\u96c6",
  editGameSave: "\u5909\u66f4\u3092\u4fdd\u5b58",
  duplicateGame:
    "\u540c\u3058\u30b2\u30fc\u30e0\u540d\u306f\u767b\u9332\u3067\u304d\u307e\u305b\u3093\u3002",
  gameSaveError:
    "\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb\u306e\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  categories: "\u304a\u77e5\u3089\u305b\u30ab\u30c6\u30b4\u30ea\u30fc\u7de8\u96c6",
  categoryName: "\u30ab\u30c6\u30b4\u30ea\u30fc\u540d",
  color: "\u8272",
  addCategory: "\u30ab\u30c6\u30b4\u30ea\u30fc\u8ffd\u52a0",
  template: "\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8",
  templateTitle: "\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u7de8\u96c6",
  templateLead:
    "\u3053\u306e\u30ab\u30c6\u30b4\u30ea\u30fc\u3067\u4f7f\u3046\u304a\u77e5\u3089\u305b\u306e\u30bf\u30a4\u30c8\u30eb\u3068\u672c\u6587\u3092\u767b\u9332\u3067\u304d\u307e\u3059\u3002",
  templateVariableHelp:
    "\u300c\u30bf\u30a4\u30c8\u30eb\u540d\u300d\u3068\u66f8\u304f\u3068\u3001\u8aad\u307f\u8fbc\u307f\u6642\u306b\u9078\u629e\u4e2d\u306e\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb\u3078\u81ea\u52d5\u5909\u63db\u3055\u308c\u307e\u3059\u3002",
  templateNoticeTitle: "\u30bf\u30a4\u30c8\u30eb",
  templateBody: "\u672c\u6587",
  templateSave: "\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u3092\u4fdd\u5b58",
  deleteTitle: "\u9805\u76ee\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f",
  deleteDescription:
    "\u3053\u306e\u64cd\u4f5c\u306f\u753b\u9762\u4e0a\u306e\u8a2d\u5b9a\u30ea\u30b9\u30c8\u304b\u3089\u9805\u76ee\u3092\u524a\u9664\u3057\u307e\u3059\u3002",
  deleteGameTitle: "\u30b2\u30fc\u30e0\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f",
  deleteGameCascadeDescription:
    "\u3053\u306e\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb\u3068\u3001\u3053\u306e\u30b2\u30fc\u30e0\u306b\u7d10\u3065\u304f\u304a\u77e5\u3089\u305b\u3092\u3059\u3079\u3066\u524a\u9664\u3057\u307e\u3059\u3002\u5143\u306b\u623b\u305b\u307e\u305b\u3093\u3002\u524a\u9664\u3059\u308b\u306b\u306f\u4e0b\u306e\u5165\u529b\u6b04\u306b\u300c\u78ba\u8a8d\u524a\u9664\u300d\u3068\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  deleteGameConfirmationLabel: "\u78ba\u8a8d\u6587\u5b57",
  deleteConfirm: "\u524a\u9664\u3059\u308b",
  deleteCancel: "\u30ad\u30e3\u30f3\u30bb\u30eb"
};

type ConfirmAction =
  | {
      type: "add-game";
      name: string;
    }
  | {
      type: "delete-game";
      index: number;
      name: string;
    }
  | {
      type: "delete-category";
      id: string;
    }
  | {
      type: "delete-account";
      index: number;
      id: string;
    };

type AdminAccount = {
  id: string;
  password: string;
  role: string;
};

type AdminSettingsPanelProps = {
  games: GameTitle[];
  categories: NoticeCategory[];
};

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Editor", value: "Editor" },
  { label: "Viewer", value: "Viewer" }
];
const deleteGameConfirmationText = "\u78ba\u8a8d\u524a\u9664";

export function AdminSettingsPanel({ games, categories }: AdminSettingsPanelProps) {
  const router = useRouter();
  const [gameItems, setGameItems] = useState(() => dedupeGames(games));
  const [categoryItems, setCategoryItems] = useState(categories);
  const [accountItems, setAccountItems] = useState<AdminAccount[]>([
    { id: "admin", password: "********", role: "Admin" }
  ]);
  const [accountId, setAccountId] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [gameName, setGameName] = useState("");
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#0891b2");
  const [role, setRole] = useState("Admin");
  const [editingTemplateCategory, setEditingTemplateCategory] = useState<NoticeCategory | null>(
    null
  );
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [editingGame, setEditingGame] = useState<null | { index: number; name: string }>(null);
  const [editingPassword, setEditingPassword] = useState<null | { index: number; value: string }>(
    null
  );
  const [editingRole, setEditingRole] = useState<null | { index: number; value: string }>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    const nextGames = dedupeGames(games);
    setGameItems(nextGames);
    saveGameTitles(nextGames);
  }, [games]);

  async function persistGameItems(nextGames: GameTitle[]) {
    const previousGames = gameItems;
    const normalizedGames = dedupeGames(nextGames);
    setGameItems(normalizedGames);
    saveGameTitles(normalizedGames);

    try {
      const response = await fetch("/api/admin/game-titles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ games: normalizedGames })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? labels.gameSaveError);
      }

      router.refresh();
    } catch (error) {
      setGameItems(previousGames);
      saveGameTitles(previousGames);
      setGameMessage(error instanceof Error ? error.message : labels.gameSaveError);
    }
  }

  function handleConfirmAction() {
    if (!confirmAction) {
      return;
    }

    if (confirmAction.type === "add-game") {
      if (hasGameName(gameItems, confirmAction.name)) {
        setGameMessage(labels.duplicateGame);
      } else {
        void persistGameItems([
          ...gameItems,
          { id: createGameId(confirmAction.name), name: confirmAction.name }
        ]);
        setGameName("");
        setGameMessage(null);
      }
    }

    if (confirmAction.type === "delete-game") {
      void persistGameItems(gameItems.filter((_, index) => index !== confirmAction.index));
      setGameMessage(null);
    }

    if (confirmAction.type === "delete-category") {
      setCategoryItems((current) => current.filter((item) => item.id !== confirmAction.id));
    }

    if (confirmAction.type === "delete-account") {
      setAccountItems((current) => current.filter((_, index) => index !== confirmAction.index));
      setAccountMessage(null);
    }

    setConfirmAction(null);
  }

  function issueAccount() {
    const nextId = accountId.trim();
    const nextPassword = accountPassword.trim();
    if (!nextId || !nextPassword) {
      return;
    }

    if (accountItems.some((account) => account.id.toLowerCase() === nextId.toLowerCase())) {
      setAccountMessage(labels.accountExists);
      return;
    }

    setAccountItems((current) => [
      ...current,
      { id: nextId, password: nextPassword, role }
    ]);
    setAccountId("");
    setAccountPassword("");
    setAccountMessage(null);
  }

  function saveEditingPassword() {
    if (!editingPassword || !editingPassword.value.trim()) {
      return;
    }

    setAccountItems((current) =>
      current.map((item, index) =>
        index === editingPassword.index ? { ...item, password: editingPassword.value } : item
      )
    );
    setEditingPassword(null);
  }

  function saveEditingRole() {
    if (!editingRole) {
      return;
    }

    setAccountItems((current) =>
      current.map((item, index) =>
        index === editingRole.index ? { ...item, role: editingRole.value } : item
      )
    );
    setEditingRole(null);
  }

  function requestAddGame() {
    const nextName = gameName.trim();
    if (!nextName) {
      return;
    }

    if (hasGameName(gameItems, nextName)) {
      setGameMessage(labels.duplicateGame);
      return;
    }

    setGameMessage(null);
    setConfirmAction({ type: "add-game", name: nextName });
  }

  function saveEditingGame() {
    if (!editingGame) {
      return;
    }

    const nextName = editingGame.name.trim();
    if (!nextName) {
      return;
    }

    if (hasGameName(gameItems, nextName, editingGame.index)) {
      setGameMessage(labels.duplicateGame);
      return;
    }

    void persistGameItems(
      gameItems.map((item, index) =>
        index === editingGame.index ? { ...item, name: nextName } : item
      )
    );
    setEditingGame(null);
    setGameMessage(null);
  }

  function openTemplateEditor(category: NoticeCategory) {
    const template = getNoticeTemplate(category.id);
    setEditingTemplateCategory(category);
    setTemplateTitle(template?.title ?? "");
    setTemplateBody(template?.body ?? "");
  }

  function saveTemplate() {
    if (!editingTemplateCategory) {
      return;
    }

    setNoticeTemplate(editingTemplateCategory.id, templateTitle, templateBody);
    setEditingTemplateCategory(null);
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <h2 className="mb-5 text-xl font-black text-ink">{labels.accounts}</h2>
          <div className="grid gap-3">
            <input
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
              className="h-12 rounded-xl border border-line bg-white px-4 text-sm font-bold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder={labels.accountId}
            />
            <input
              value={accountPassword}
              onChange={(event) => setAccountPassword(event.target.value)}
              className="h-12 rounded-xl border border-line bg-white px-4 text-sm font-bold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder={labels.password}
              type="password"
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <AdminSelect
                name="role"
                value={role}
                onChange={setRole}
                options={roleOptions}
              />
              <button
                type="button"
                onClick={issueAccount}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(8,145,178,0.22)] hover:from-cyan-500 hover:to-blue-500"
              >
                <UserPlus size={17} />
                {labels.issue}
              </button>
            </div>
          </div>
          {accountMessage ? (
            <div className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              {accountMessage}
            </div>
          ) : null}
          <h3 className="mt-6 text-sm font-black text-slate-500">{labels.issuedAccounts}</h3>
          <div className="mt-2 divide-y divide-slate-100">
            {accountItems.map((account, index) => (
              <div key={`${account.id}-${index}`} className="flex h-14 items-center justify-between gap-3 px-1">
                <div className="min-w-0">
                  <p className="truncate font-bold text-ink">{account.id}</p>
                  <p className="text-xs font-black text-cyan-700">{account.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingPassword({ index, value: "" })}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                    aria-label={labels.changePassword}
                    title={labels.changePassword}
                  >
                    <KeyRound size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingRole({ index, value: account.role })}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                    aria-label={labels.changeRole}
                    title={labels.changeRole}
                  >
                    <ShieldCheck size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction({ type: "delete-account", index, id: account.id })}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50"
                    aria-label={labels.deleteConfirm}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <h2 className="mb-5 text-xl font-black text-ink">{labels.games}</h2>
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={gameName}
              onChange={(event) => setGameName(event.target.value)}
              className="h-12 rounded-xl border border-line bg-white px-4 text-sm font-bold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder={labels.gameName}
            />
            <button
              type="button"
              onClick={requestAddGame}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] hover:bg-slate-800"
            >
              <Plus size={17} />
              {labels.addGame}
            </button>
          </div>
          {gameMessage ? (
            <div className="mb-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              {gameMessage}
            </div>
          ) : null}
          <div className="divide-y divide-slate-100">
            {gameItems.map((game, index) => (
              <div key={`${game.id}-${index}`} className="flex h-14 items-center justify-between px-1">
                <span className="font-bold text-ink">{game.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGame({ index, name: game.name })}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                    aria-label={labels.editGame}
                    title={labels.editGame}
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction({ type: "delete-game", index, name: game.name })}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50"
                    aria-label={labels.deleteConfirm}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <h2 className="mb-5 text-xl font-black text-ink">{labels.categories}</h2>
        <div className="mb-4 grid gap-3 md:grid-cols-[minmax(260px,1fr)_48px_auto]">
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            className="h-12 rounded-xl border border-line bg-white px-4 text-sm font-bold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            placeholder={labels.categoryName}
          />
          <ColorPicker
            value={categoryColor}
            label={labels.color}
            size="large"
            onChange={setCategoryColor}
          />
          <button
            type="button"
            onClick={() => {
              if (!categoryName.trim()) return;
              setCategoryItems((current) => [
                ...current,
                {
                  id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  name: categoryName,
                  color: categoryColor,
                  sortOrder: current.length + 1
                }
              ]);
              setCategoryName("");
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] hover:bg-slate-800"
          >
            <Plus size={17} />
            {labels.addCategory}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {categoryItems.map((category) => (
            <div
              key={category.id}
              className="grid h-14 items-center gap-3 px-1 md:grid-cols-[minmax(260px,1fr)_44px_44px_36px]"
            >
              <input
                value={category.name}
                onChange={(event) =>
                  setCategoryItems((current) =>
                    current.map((item) =>
                      item.id === category.id ? { ...item, name: event.target.value } : item
                    )
                  )
                }
                className="h-10 rounded-lg border border-line px-3 text-sm font-bold text-ink outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
              <ColorPicker
                value={category.color}
                label={labels.color}
                onChange={(value) =>
                  setCategoryItems((current) =>
                    current.map((item) =>
                      item.id === category.id ? { ...item, color: value } : item
                    )
                  )
                }
              />
              <button
                type="button"
                onClick={() => openTemplateEditor(category)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-cyan-700 hover:bg-cyan-50"
                aria-label={labels.template}
                title={labels.template}
              >
                <FileText size={17} />
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction({ type: "delete-category", id: category.id })}
                className="inline-flex h-9 w-9 items-center justify-center justify-self-end rounded-md text-rose-600 hover:bg-rose-50"
                aria-label={labels.deleteConfirm}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <AdminConfirmDialog
        open={confirmAction !== null}
        tone={confirmAction?.type === "add-game" ? "warning" : "danger"}
        title={
          confirmAction?.type === "add-game"
            ? labels.addGameTitle
            : confirmAction?.type === "delete-game"
              ? labels.deleteGameTitle
              : labels.deleteTitle
        }
        description={
          confirmAction?.type === "add-game"
            ? `${labels.addGameDescription}\n${confirmAction.name}`
            : confirmAction?.type === "delete-game"
              ? `${labels.deleteGameCascadeDescription}\n${confirmAction.name}`
            : labels.deleteDescription
        }
        confirmLabel={
          confirmAction?.type === "add-game" ? labels.addGameConfirm : labels.deleteConfirm
        }
        confirmationLabel={labels.deleteGameConfirmationLabel}
        confirmationRequiredText={
          confirmAction?.type === "delete-game" ? deleteGameConfirmationText : undefined
        }
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
      {editingGame ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-black text-cyan-700">GAME TITLE</p>
                <h3 className="mt-1 text-xl font-black text-ink">{labels.editGameTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingGame(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label={labels.deleteCancel}
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-5 py-5">
              <input
                value={editingGame.name}
                onChange={(event) =>
                  setEditingGame((current) =>
                    current ? { ...current, name: event.target.value } : current
                  )
                }
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-bold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                placeholder={labels.gameName}
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setEditingGame(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                {labels.deleteCancel}
              </button>
              <button
                type="button"
                onClick={saveEditingGame}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(8,145,178,0.22)]"
              >
                <Save size={17} />
                {labels.editGameSave}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {editingPassword ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-black text-cyan-700">ACCOUNT</p>
                <h3 className="mt-1 text-xl font-black text-ink">{labels.changePassword}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPassword(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label={labels.deleteCancel}
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-5 py-5">
              <input
                value={editingPassword.value}
                onChange={(event) =>
                  setEditingPassword((current) =>
                    current ? { ...current, value: event.target.value } : current
                  )
                }
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-bold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                placeholder={labels.password}
                type="password"
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setEditingPassword(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                {labels.deleteCancel}
              </button>
              <button
                type="button"
                onClick={saveEditingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(8,145,178,0.22)]"
              >
                <Save size={17} />
                {labels.editGameSave}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {editingRole ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-black text-cyan-700">ACCOUNT</p>
                <h3 className="mt-1 text-xl font-black text-ink">{labels.changeRole}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label={labels.deleteCancel}
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-5 py-5">
              <AdminSelect
                name="edit_account_role"
                value={editingRole.value}
                onChange={(value) =>
                  setEditingRole((current) => (current ? { ...current, value } : current))
                }
                options={roleOptions}
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                {labels.deleteCancel}
              </button>
              <button
                type="button"
                onClick={saveEditingRole}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(8,145,178,0.22)]"
              >
                <Save size={17} />
                {labels.editGameSave}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {editingTemplateCategory ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 px-4 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-black text-cyan-700">{editingTemplateCategory.name}</p>
                <h3 className="mt-1 text-xl font-black text-ink">{labels.templateTitle}</h3>
                <p className="mt-1 text-sm text-muted">{labels.templateLead}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTemplateCategory(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-4 px-5 py-5">
              <label className="grid gap-2 text-sm font-bold text-ink">
                {labels.templateNoticeTitle}
                <input
                  value={templateTitle}
                  onChange={(event) => setTemplateTitle(event.target.value)}
                  className="h-12 rounded-xl border border-line bg-white px-4 text-sm font-bold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink">
                {labels.templateBody}
                <textarea
                  value={templateBody}
                  onChange={(event) => setTemplateBody(event.target.value)}
                  rows={8}
                  className="resize-y rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold leading-7 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
                <span className="text-xs font-bold text-cyan-700">
                  {labels.templateVariableHelp}
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setEditingTemplateCategory(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                {labels.deleteCancel}
              </button>
              <button
                type="button"
                onClick={saveTemplate}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(8,145,178,0.22)]"
              >
                <Save size={17} />
                {labels.templateSave}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ColorPicker({
  value,
  label,
  onChange,
  size = "default"
}: {
  value: string;
  label: string;
  onChange: (value: string) => void;
  size?: "default" | "large";
}) {
  const sizeClass = size === "large" ? "h-12 w-12" : "h-10 w-10";

  return (
    <label
      className={`relative inline-flex ${sizeClass} cursor-pointer items-center justify-center justify-self-start rounded-lg`}
      aria-label={label}
      title={value}
    >
      <span
        className="block h-7 w-7 rounded-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55),0_8px_18px_rgba(15,23,42,0.12)]"
        style={{ backgroundColor: value }}
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="color"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label={label}
      />
    </label>
  );
}
