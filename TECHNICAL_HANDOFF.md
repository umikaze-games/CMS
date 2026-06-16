# Notice CMS 技术交接文档

最后更新: 2026-06-16

本文档用于继续开发、服务器维护、故障排查和新成员接手。

## 1. 项目现状

这是一个基于 Next.js 的游戏公告 CMS。

当前已经完成:

- 前台公告列表和公告详情页
- 后台公告创建、编辑、删除、隐藏、发布
- 后台管理员账号密码登录
- `/admin/*` 和 `/api/admin/*` 登录保护
- 公告分类、发布状态、预约公开、NEW 标签、TOP 固定
- 图片 Banner 上传
- 正文富文本编辑
- 正文内图片上传
- 东京时间显示和筛选
- 腾讯云服务器部署
- Nginx 反向代理
- HTTPS 证书
- PM2 常驻和开机自启
- GitHub 仓库同步部署

当前线上地址:

- 前台: `https://notice.alesgames.com/notices`
- 后台登录: `https://notice.alesgames.com/admin/login`
- 后台管理: `https://notice.alesgames.com/admin/notices`

GitHub:

- `https://github.com/umikaze-games/CMS.git`
- 主分支: `main`

服务器:

- 云厂商: 腾讯云
- 地域: 东京
- 系统用户: `ubuntu`
- 项目目录: `/var/www/notice-cms`
- PM2 进程名: `notice-cms`
- Next.js 默认监听: `127.0.0.1:3000`
- Nginx 对外域名: `notice.alesgames.com`

## 2. 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Node.js 20
- PM2
- Nginx
- Certbot / Let's Encrypt
- Supabase SDK
- lucide-react

服务器已确认安装:

- Node.js `v20.20.2`
- npm `10.8.2`
- Nginx `1.18.0`
- PM2 `7.0.1`

## 3. 本地开发

安装依赖:

```bash
npm install
```

开发启动:

```bash
npm run dev
```

Windows PowerShell 如遇到执行策略问题，用:

```bash
npm.cmd install
npm.cmd run dev
```

测试:

```bash
npm test
```

生产构建:

```bash
npm run build
```

生产启动:

```bash
npm run start
```

## 4. 环境变量

`.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
ADMIN_COOKIE_SECURE=false
```

### 必填项

后台登录至少需要:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

`ADMIN_SESSION_SECRET` 应使用长随机字符串，不要使用默认示例文本。

线上 HTTPS 环境建议:

```env
ADMIN_COOKIE_SECURE=true
```

如果设置为 `false`，HTTPS 下通常也能用，但 cookie 安全性较低。

### Supabase 相关

如果以下三项为空:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

系统会进入本地文件模式:

- 公告保存到 `.local-notices.json`
- 游戏标题保存到 `.local-game-titles.json`
- 图片保存到 `public/uploads/notices/`

如果三项都配置完整:

- 前台读取 Supabase
- 后台管理 API 使用 `SUPABASE_SERVICE_ROLE_KEY`
- 图片可以上传到 Supabase Storage `notice-banners`

## 5. 主要 URL 和 API

前台:

- `/`: redirect 到 `/notices`
- `/notices`: 公告列表
- `/notices/[id]`: 公告详情

后台:

- `/admin/login`: 管理员登录
- `/admin/notices`: 公告管理
- `/admin/notices/new`: 新建公告
- `/admin/notices/[id]/edit`: 编辑公告
- `/admin/settings`: 设置页面

API:

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `POST /api/admin/notices`
- `PUT /api/admin/notices/[id]`
- `PATCH /api/admin/notices/[id]`
- `DELETE /api/admin/notices/[id]`
- `POST /api/admin/uploads`
- `GET/PUT /api/admin/game-titles`
- `/uploads/notices/[file]`

## 6. 文件结构说明

### 页面

- `app/page.tsx`
  - 访问根路径时跳转到 `/notices`

- `app/notices/page.tsx`
  - 前台公告列表
  - 分类筛选
  - TOP 固定
  - NEW 标签

- `app/notices/[id]/page.tsx`
  - 前台公告详情
  - Banner 和正文渲染

- `app/admin/login/page.tsx`
  - 后台登录页面

- `app/admin/notices/page.tsx`
  - 后台公告列表

- `app/admin/notices/new/page.tsx`
  - 新建公告

- `app/admin/notices/[id]/edit/page.tsx`
  - 编辑公告

- `app/admin/settings/page.tsx`
  - 设置页面

### API

- `app/api/admin/auth/login/route.ts`
  - 校验 `.env.local` 中的管理员账号密码
  - 写入 `notice_cms_session` httpOnly cookie

- `app/api/admin/auth/logout/route.ts`
  - 清除登录 cookie

- `app/api/admin/notices/route.ts`
  - 创建公告
  - 根据 Supabase 配置决定写入 DB 或本地 JSON

- `app/api/admin/notices/[id]/route.ts`
  - 更新、隐藏、删除公告

- `app/api/admin/uploads/route.ts`
  - 正文图片上传
  - 最大 10MB
  - Supabase 未配置时保存到本地 public 目录

- `app/uploads/notices/[file]/route.ts`
  - 访问本地上传图片

### 重要组件

- `components/admin-shell.tsx`
  - 后台左侧布局、游戏切换、导航、登出

- `components/admin-login-form.tsx`
  - 登录表单
  - 调用 `/api/admin/auth/login`

- `components/admin-notices-table.tsx`
  - 后台公告列表
  - 状态变更、隐藏、删除、编辑

- `components/admin-notice-form.tsx`
  - 公告创建和编辑表单
  - 处理标题、分类、时间、Banner、正文、TOP 固定

- `components/admin-rich-text-editor.tsx`
  - 正文富文本编辑器
  - 支持太字、删除线、对齐、表格、文字颜色、单元格颜色、emoji、正文图片
  - 弹窗交互规则: 点击工具按钮打开，点击正文或外部关闭

- `components/notice-card.tsx`
  - 前台公告列表卡片

- `components/notice-body.tsx`
  - 前台详情正文渲染
  - 支持富文本 HTML

### 数据和工具

- `middleware.ts`
  - 保护 `/admin/*` 和 `/api/admin/*`
  - 已登录访问 `/admin/login` 会跳到 `/admin/notices`
  - 未登录访问后台会跳到 `/admin/login`

- `lib/admin-auth.ts`
  - 登录凭据校验
  - session token 创建和验证
  - cookie secure 判断

- `lib/notices.ts`
  - 前台和后台公告读取
  - Supabase 有配置时读 DB
  - Supabase 没配置时读 `.local-notices.json`

- `lib/local-notice-store.ts`
  - 本地公告 JSON 存取

- `lib/local-banner-store.ts`
  - 本地图片保存

- `lib/local-upload-path.ts`
  - 本地上传图片路径生成和校验

- `lib/date.ts`
  - 东京时间解析、显示、NEW 标签判定

- `lib/notice-body.ts`
  - 富文本摘要处理
  - 避免前台露出 `<span>` 等 HTML 源码

- `lib/admin-upload.ts`
  - 图片大小限制

## 7. 数据模式

### 本地文件模式

当 Supabase 环境变量未配置时:

- 公告文件: `/var/www/notice-cms/.local-notices.json`
- 游戏标题文件: `/var/www/notice-cms/.local-game-titles.json`
- 图片目录: `/var/www/notice-cms/public/uploads/notices/`

这两个路径都不提交 Git。

备份命令示例:

```bash
cd /var/www/notice-cms
cp .local-notices.json .local-notices.json.bak
cp .local-game-titles.json .local-game-titles.json.bak
tar -czf uploads-notices-backup.tar.gz public/uploads/notices
```

### Supabase 模式

需要先执行:

```sql
supabase/schema.sql
```

主要表:

- `notices`
- `notice_categories`
- `game_titles`

图片 bucket:

- `notice-banners`

注意: 当前线上如果还没有配置 Supabase，就仍然依赖本地文件模式。

## 8. 服务器部署和同步

### 首次部署已完成

已完成事项:

- `/var/www/notice-cms` 克隆 GitHub 仓库
- `npm ci`
- `npm run build`
- `pm2 start npm --name notice-cms -- run start`
- `pm2 save`
- `pm2 startup`
- Nginx 反向代理到 `127.0.0.1:3000`
- Certbot 配置 HTTPS

### 日常更新流程

本地改完并推送 GitHub 后，服务器执行:

```bash
cd /var/www/notice-cms
git pull --ff-only
npm run build
pm2 restart notice-cms --update-env
pm2 save
```

确认版本:

```bash
git rev-parse --short HEAD
pm2 status
```

如果浏览器显示旧页面:

1. 先确认服务器 commit 是否最新。
2. 再按 `Ctrl + F5` 强制刷新。
3. 如果仍旧，检查 PM2 是否真的重启。

```bash
pm2 logs notice-cms --lines 50 --nostream
```

### Nginx 注意事项

当前建议只保留应用自身登录。

不要再给 `/admin` 叠加 Nginx Basic Auth，原因:

- 用户会看到浏览器原生登录弹窗
- 然后还要再登录 CMS
- 新手使用时容易误以为密码错误

如果曾经添加过 Basic Auth，需要从 Nginx 配置中移除:

```nginx
auth_basic ...
auth_basic_user_file ...
```

修改后检查并重载:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 9. HTTPS 和域名

域名:

- `notice.alesgames.com`

DNS:

- `notice` 子域名 A 记录指向服务器公网 IP `43.130.234.21`

证书:

- Let's Encrypt
- 由 Certbot 管理

常用检查:

```bash
sudo nginx -t
sudo certbot certificates
systemctl is-enabled pm2-ubuntu
```

安全组:

- 22: SSH
- 80: HTTP，主要用于跳转 HTTPS 和证书续期
- 443: HTTPS

## 10. 已修复的问题记录

### 后台登录

旧状态:

- 登录页面只是 UI
- 点击后直接跳后台

当前状态:

- 使用 `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- 成功后写入 httpOnly session cookie
- middleware 保护后台页面和后台 API

### 公告前台不显示

原因:

- 预约公开时间和服务器时间存在时区解释差异

当前状态:

- 未带时区的公告时间按东京时间处理
- 前台只显示 `published` 且 `publishAt <= now` 的公告

### 正文露出 HTML

原因:

- 富文本摘要直接截取 HTML

当前状态:

- 摘要会转纯文本
- `<span>` 等 HTML 标签不会直接显示在公告列表

### 图片过大和 base64 卡顿

原因:

- 图片以 data URL/base64 进入公告数据，导致 JSON 变大和页面卡顿

当前状态:

- 正文图片通过 `/api/admin/uploads` 上传
- 图片最大 10MB
- 本地模式保存为 `/uploads/notices/...`
- 不再把图片 base64 存进正文

### 图片不显示

原因:

- 本地上传文件需要稳定 URL 和路由

当前状态:

- `public/uploads/notices/` 保存本地图片
- `/uploads/notices/[file]` 提供访问

### 富文本弹窗交互

已处理:

- emoji 弹窗不会反复开关
- 点击正文或外部会关闭 emoji / 颜色 / 表格弹窗
- B、对齐等按钮有选中态
- emoji 和图片入口已经合并到右侧工具栏

如果线上仍看到左侧 `絵文字OK` / `画像貼り付け対応` 胶囊按钮，说明服务器还在跑旧版本，需要执行日常更新流程。

## 11. 测试覆盖

当前测试命令:

```bash
npm test
```

现有测试覆盖:

- 管理员账号校验
- session token 签名和过期
- middleware 登录保护相关逻辑
- 图片大小限制
- 上传错误提示
- 本地图片路径生成
- data URL 图片迁移
- 东京时间解析和格式化
- NEW 标签时间判断
- 富文本 HTML 摘要转纯文本
- 富文本工具栏弹窗交互
- emoji 和图片工具按钮位置

每次修改后至少运行:

```bash
npm test
npm run build
```

## 12. 当前风险和后续开发建议

### 高优先级

1. 备份服务器本地数据
   - `.local-notices.json`
   - `.local-game-titles.json`
   - `public/uploads/notices/`

2. 决定是否正式接入 Supabase
   - 如果只是单服务器小规模使用，本地文件模式可以继续短期使用
   - 如果要长期运营、多人协作、可迁移，建议接入 Supabase

3. 确认线上 `.env.local`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `ADMIN_COOKIE_SECURE=true`

### 中优先级

1. 设置页面 DB 化
   - 分类
   - 模板
   - 管理员账号

2. 图片清理
   - 删除公告时清理不用的上传图片
   - 替换图片时清理旧图片

3. 权限细分
   - 管理员
   - 编辑者
   - 只读查看者

### 低优先级

1. 公告排序拖拽后持久化
2. 前台页面视觉微调
3. 多语言公告
4. 操作日志

## 13. 常见故障排查

### 后台登录卡住

检查:

```bash
cd /var/www/notice-cms
grep '^ADMIN_' .env.local
pm2 logs notice-cms --lines 50 --nostream
```

注意不要把密码发到公开聊天或截图里。

### 页面打不开

检查:

```bash
pm2 status
curl http://127.0.0.1:3000
sudo nginx -t
sudo systemctl status nginx --no-pager
```

### HTTPS 有问题

检查:

```bash
sudo certbot certificates
sudo nginx -t
sudo systemctl reload nginx
```

### 前台看不到后台发布的公告

检查:

```bash
cd /var/www/notice-cms
node -e "const fs=require('fs'); const items=JSON.parse(fs.readFileSync('.local-notices.json','utf8')); console.log(items.length); console.log(items.slice(0,3).map(x=>({title:x.title,status:x.status,publishAt:x.publishAt,gameId:x.gameId})))"
```

需要满足:

- `status` 是 `published`
- `publishAt` 早于当前东京时间
- 前台所选 `gameId` 一致

### 服务器没有更新到最新代码

检查:

```bash
cd /var/www/notice-cms
git pull --ff-only
git rev-parse --short HEAD
npm run build
pm2 restart notice-cms --update-env
```

浏览器再按 `Ctrl + F5`。

## 14. 给后续 Codex 的提示

开始任何修改前先读:

```text
README.md
TECHNICAL_HANDOFF.md
```

改代码后必须验证:

```bash
npm test
npm run build
```

推送后提醒用户服务器执行:

```bash
cd /var/www/notice-cms
git pull --ff-only
npm run build
pm2 restart notice-cms --update-env
pm2 save
```

不要提交:

- `.env.local`
- `.local-notices.json`
- `public/uploads/`
- `node_modules/`
- `.next/`
