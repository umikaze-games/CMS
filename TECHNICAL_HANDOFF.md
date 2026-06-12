# CMS作成 プロジェクト引き継ぎ資料

このドキュメントは、技術者または別環境のCodexが本プロジェクトをすぐ理解し、サーバー設置後も継続して機能追加・修正できるようにするための引き継ぎ資料です。

## プロジェクト概要

ゲーム公式サイト向けの「お知らせ表示」と、バックオフィス側の「お知らせ投稿・管理CMS」を分けたNext.jsアプリです。

主な用途:

- フロント側でお知らせ一覧を表示する
- フロント側でお知らせ詳細を表示する
- 管理画面でゲームタイトル別にお知らせを作成・編集・削除する
- カテゴリー、公開状態、予約公開、NEWバッジ、TOP固定、画像バナー、本文装飾を管理する

## 技術構成

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Storage
- lucide-react

## 起動コマンド

開発環境:

```bash
npm install
npm run dev
```

Windows PowerShellで `npm` が実行できない場合:

```bash
npm.cmd install
npm.cmd run dev
```

ビルド確認:

```bash
npm run build
```

本番起動:

```bash
npm run build
npm run start
```

## 主要URL

フロント側:

- `/notices`: お知らせ一覧
- `/notices/[id]`: お知らせ詳細

バックオフィス側:

- `/admin/login`: 管理者ログイン画面
- `/admin/notices`: お知らせ管理一覧
- `/admin/notices/new`: お知らせ新規作成
- `/admin/notices/[id]/edit`: お知らせ編集
- `/admin/settings`: 設定画面

API:

- `POST /api/admin/notices`: お知らせ作成
- `PUT /api/admin/notices/[id]`: お知らせ更新
- `PATCH /api/admin/notices/[id]`: 状態変更
- `DELETE /api/admin/notices/[id]`: お知らせ削除

## 環境変数

`.env.example` を `.env.local` または本番環境の環境変数に設定してください。

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

注意:

- `SUPABASE_SERVICE_ROLE_KEY` は管理APIで使用します。
- ブラウザに公開してはいけません。
- 本番環境では必ずサーバー側の環境変数として設定してください。

## Supabaseセットアップ

1. Supabaseプロジェクトを作成する
2. `supabase/schema.sql` をSupabase SQL Editorで実行する
3. Storage bucket `notice-banners` が作成されていることを確認する
4. `.env.local` または本番環境変数を設定する
5. `npm run build` で接続確認する

## DBテーブル

### `notices`

お知らせ本体です。

主な項目:

- `id`
- `game_id`
- `category_id`
- `title`
- `body`
- `banner_image`
- `status`: `draft` / `published` / `hidden`
- `is_pinned`
- `publish_at`
- `new_badge_start_at`
- `new_badge_end_at`
- `sort_order`
- `created_at`
- `updated_at`

### `notice_categories`

お知らせカテゴリーです。

主な項目:

- `id`
- `name`
- `color`
- `sort_order`
- `created_at`
- `updated_at`

### `game_titles`

管理対象のゲームタイトルです。

主な項目:

- `id`
- `name`
- `created_at`
- `updated_at`

## ファイル構成

### 画面

- `app/notices/page.tsx`
  - フロント側お知らせ一覧
  - カテゴリー絞り込み
  - 1ページ20件のページ切り替え

- `app/notices/[id]/page.tsx`
  - フロント側お知らせ詳細
  - バナー画像、本文、公開日、更新日を表示

- `app/admin/notices/page.tsx`
  - バックオフィス側お知らせ一覧
  - ゲームタイトル別表示
  - カテゴリー・状態フィルター
  - 1ページ20件のページ切り替え

- `app/admin/notices/new/page.tsx`
  - お知らせ新規作成

- `app/admin/notices/[id]/edit/page.tsx`
  - お知らせ編集

- `app/admin/settings/page.tsx`
  - 設定画面

### コンポーネント

- `components/admin-shell.tsx`
  - 管理画面の左サイドバー
  - ゲームタイトル切り替え
  - 新規作成・設定・ログアウト導線

- `components/admin-notices-table.tsx`
  - 管理画面のお知らせ一覧
  - 状態変更
  - 非公開行のグレー表示
  - カテゴリー・状態フィルター
  - ページ切り替え
  - 編集・非表示・削除ボタン

- `components/admin-notice-form.tsx`
  - お知らせ作成・編集フォーム
  - ゲームタイトル、カテゴリー、状態、予約公開日時、NEWバッジ期間、画像バナー、本文、TOP固定を扱う
  - 保存前プレビューあり

- `components/admin-date-time-picker.tsx`
  - Windows標準UIではなく独自カレンダー・時間選択
  - 日本の祝日、土日表示を扱う

- `components/admin-rich-text-editor.tsx`
  - 本文エディター
  - 文字色、セル色、太字、取り消し線、整列、表作成、セル選択などを扱う

- `components/admin-settings-panel.tsx`
  - 設定画面
  - アカウント発行UI、ゲーム登録UI、カテゴリー編集UI、テンプレート編集UI

- `components/category-badge.tsx`
  - フロント・バック共通のカテゴリーバッジ

- `components/notice-card.tsx`
  - フロント側お知らせ一覧カード

- `components/notice-body.tsx`
  - お知らせ本文表示
  - HTML本文と通常テキストの表示を吸収

### データ・ユーティリティ

- `lib/notices.ts`
  - フロント・管理画面のお知らせ取得
  - Supabase接続がある場合はSupabaseから取得
  - Supabase接続がない場合はローカルJSONから取得

- `lib/local-notice-store.ts`
  - Supabase未設定時のローカル保存
  - `.local-notices.json` を使用
  - 本番運用では使用しない想定

- `lib/mock-data.ts`
  - 初期ゲームタイトル、カテゴリー、サンプルお知らせ

- `lib/notice-form.ts`
  - フォームデータ読み取り
  - 画像ファイル名変換

- `lib/date.ts`
  - 日付表示、NEWバッジ期間判定

- `lib/admin-game-titles.ts`
  - 設定画面のゲームタイトル管理
  - 現状はブラウザのlocalStorage利用

- `lib/notice-templates.ts`
  - カテゴリー別テンプレート管理
  - 現状はブラウザのlocalStorage利用

## 現在の主な機能

フロント側:

- お知らせ一覧
- お知らせ詳細
- カテゴリー絞り込み
- 画像バナー表示
- TOP固定表示
- NEWバッジ表示
- 公開日・更新日表示
- 1ページ20件のページ切り替え

バックオフィス側:

- ゲームタイトル切り替え
- お知らせ作成
- お知らせ編集
- お知らせ削除
- お知らせ非表示
- カテゴリー選択
- タイトル入力
- 本文入力
- 画像バナーアップロード
- 画像アップロード済みプレビュー
- 公開 / 非公開 / 下書き
- 予約公開
- NEWバッジ表示期間設定
- TOP固定
- 保存前レビュー
- カテゴリー・状態フィルター
- 1ページ20件のページ切り替え
- 非公開行のグレー表示

## 本番設置時の重要注意点

### 1. 管理者ログインは本番認証ではない

`app/admin/login/page.tsx` は現在UIのみです。

現状:

- 入力値の検証なし
- 認証セッションなし
- ログインボタンは `/admin/notices` へ移動するだけ

本番化する場合は、以下のいずれかを実装してください。

- Supabase Auth
- NextAuth
- 独自のID / パスワード認証
- Basic認証
- 管理画面全体のmiddleware保護

最低限、以下のパスは認証必須にしてください。

- `/admin/*`
- `/api/admin/*`

### 2. 設定画面の一部はlocalStorage保存

以下は現状、ブラウザlocalStorage保存です。

- 設定画面のゲーム登録
- カテゴリーテンプレート
- アカウント発行UI

本番で複数人・複数端末から使う場合はDB保存へ移行してください。

移行候補:

- `game_titles` テーブルへゲーム登録を保存
- `notice_categories` テーブルへカテゴリー編集を保存
- 新規 `notice_templates` テーブルを作成
- 新規 `admin_accounts` またはSupabase Authへ管理アカウントを保存

### 3. ローカル保存ファイルは本番用途ではない

Supabase未設定時は `.local-notices.json` に保存します。

これは開発・デモ用です。

本番では必ずSupabaseへ接続してください。

### 4. 画像保存

Supabase接続あり:

- Supabase Storage `notice-banners` にアップロード
- `banner_image` には公開URLを保存

Supabase接続なし:

- Data URLとして `.local-notices.json` に保存
- 本番では非推奨

### 5. TOP固定はゲームごとに1件

DB側に以下のユニークインデックスがあります。

```sql
create unique index if not exists notices_one_pinned_per_game
  on public.notices (game_id)
  where is_pinned = true;
```

API側でも新しいTOP固定を保存する時、同じゲーム内の他のお知らせの固定を解除しています。

## 継続開発で触る場所

### フロント一覧のデザイン変更

- `app/notices/page.tsx`
- `components/notice-card.tsx`
- `components/category-badge.tsx`

### フロント詳細のデザイン変更

- `app/notices/[id]/page.tsx`
- `components/notice-body.tsx`

### 管理一覧の変更

- `components/admin-notices-table.tsx`
- `app/admin/notices/page.tsx`

### 作成・編集フォームの変更

- `components/admin-notice-form.tsx`
- `components/admin-date-time-picker.tsx`
- `components/admin-rich-text-editor.tsx`
- `components/admin-notice-review-dialog.tsx`

### 設定画面の変更

- `components/admin-settings-panel.tsx`
- `lib/admin-game-titles.ts`
- `lib/notice-templates.ts`

### DB連携の変更

- `lib/notices.ts`
- `app/api/admin/notices/route.ts`
- `app/api/admin/notices/[id]/route.ts`
- `supabase/schema.sql`

## データ取得の流れ

フロント一覧:

1. `app/notices/page.tsx`
2. `getPublicCategories()`
3. `getPublicNotices(categoryId)`
4. Supabaseが設定されていればSupabaseから取得
5. Supabaseが未設定なら `.local-notices.json` から取得
6. `NoticeCard` で表示

フロント詳細:

1. `app/notices/[id]/page.tsx`
2. `getNoticeById(id)`
3. `NoticeBody` で本文表示

管理一覧:

1. `app/admin/notices/page.tsx`
2. `getAdminNotices(currentGameId)`
3. `AdminNoticesTable` で表示

保存:

1. `AdminNoticeForm`
2. 保存前レビュー
3. `POST /api/admin/notices` または `PUT /api/admin/notices/[id]`
4. SupabaseまたはローカルJSONへ保存

## デプロイ手順例

### Vercelの場合

1. GitHubなどにリポジトリを配置
2. VercelでNext.jsプロジェクトとしてImport
3. Environment Variablesに以下を登録
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Supabaseで `supabase/schema.sql` を実行
5. Deploy

### VPSまたは専用サーバーの場合

1. Node.js 20以上をインストール
2. プロジェクトを配置
3. `.env.local` または環境変数を設定
4. 依存関係をインストール

```bash
npm install
```

5. ビルド

```bash
npm run build
```

6. 起動

```bash
npm run start
```

7. 必要に応じてPM2などで常駐

```bash
npm install -g pm2
pm2 start npm --name notice-cms -- run start
pm2 save
```

8. Nginxなどでリバースプロキシ設定

## デプロイ前チェックリスト

- [ ] `npm run build` が成功する
- [ ] Supabase URL / anon key / service role key が設定されている
- [ ] `supabase/schema.sql` が実行済み
- [ ] Storage bucket `notice-banners` が存在する
- [ ] 管理画面の認証が実装されている
- [ ] `/api/admin/*` が認証保護されている
- [ ] 設定画面のlocalStorage依存を本番DB保存へ移行するか方針決定済み
- [ ] サンプルデータを本番データに差し替え済み
- [ ] 画像アップロードが本番URLで表示できる

## 既知の課題・今後の改善候補

本番運用前に優先度高めで確認してください。

1. 管理者ログインを本番認証へ変更する
2. 設定画面のゲーム登録・カテゴリー編集・テンプレート登録をDB保存へ変更する
3. アカウント発行機能を実際の認証システムと連携する
4. お知らせのドラッグ&ドロップ順序変更をDBへ永続保存する
5. カテゴリー追加・削除・名称変更をSupabaseへ保存するAPIを追加する
6. 画像削除や差し替え時にSupabase Storage上の不要ファイルを整理する
7. API入力値のバリデーションを強化する
8. 権限ごとの操作制限を追加する

## Codexに依頼する時の例

次のCodexや技術者へ依頼する場合は、このように伝えると進めやすいです。

```text
TECHNICAL_HANDOFF.mdを読んで、このCMSの構成を理解してください。
まず本番運用に向けて管理画面の認証と、設定画面のDB保存化を実装してください。
既存のUIデザインは維持し、変更後はnpm run buildで確認してください。
```

```text
TECHNICAL_HANDOFF.mdを読んで、Supabase本番接続に必要な不足テーブルとAPIを整理してください。
設定画面のゲーム登録、カテゴリー編集、テンプレート登録をDB保存へ移行してください。
```

## 最終更新

2026-06-12
