# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

# 🎄 聖誕派對遊戲 2025

一個基於 Nuxt 3 的靜態聖誕派對互動遊戲系統，支援幸運盤面、熟人問答、表情你猜我猜等多種遊戲模式。

## ✨ 特色功能

- 🎮 **多種遊戲模式** - 幸運盤面、熟人問答、表情你猜我猜
- 🏆 **即時排行榜** - 自動計分與排名
- 💾 **資料持久化** - LocalStorage 自動儲存
- 📱 **響應式設計** - 支援桌機與手機
- 🎨 **聖誕主題** - 精美的視覺設計
- 🔊 **音效支援** - 可自訂遊戲音效
- 📤 **匯入匯出** - JSON 格式資料交換
- ⚙️ **完整管理** - 玩家、關卡、題庫設定

## 🚀 快速開始

### 安裝相依套件

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:3001`

### 第一次使用

1. 在首頁點擊「📦 載入假資料（測試用）」
2. 點擊「🏆 排行榜」查看玩家列表
3. 開始開發或測試功能！

📖 **詳細說明請參考 [QUICKSTART.md](./QUICKSTART.md)**

## 📦 技術棧

- **框架**: [Nuxt 3](https://nuxt.com) (Vue 3)
- **狀態管理**: [Pinia](https://pinia.vuejs.org)
- **樣式**: [Tailwind CSS](https://tailwindcss.com)
- **語言**: TypeScript
- **構建工具**: Vite
- **部署**: 靜態輸出 (SSR 關閉)

## 📂 專案結構

```
xmas-party/
├── types/              # TypeScript 型別定義
├── stores/             # Pinia 狀態管理
├── composables/        # Vue Composables
├── components/         # Vue 元件
├── pages/              # 頁面路由
├── utils/              # 工具函式
└── public/             # 靜態資源
```

## 📋 開發進度

查看 [PROGRESS.md](./PROGRESS.md) 了解詳細開發進度。

### ✅ 已完成
- 核心架構（型別、Store、Composables）
- 首頁與排行榜
- 資料持久化與匯入匯出
- 測試資料

### 🚧 開發中
- 遊戲頁面（Luck Board、Quiz、Expression Guess）
- 管理設定頁面
- 主持人工具
- 投票揭曉系統

## 🎮 遊戲模式

### 1. 幸運盤面 (Luck Board)
點擊格子抽獎，綠格得分、紅格落空。支援兩種模式：
- **A 模式（連抽）**: 每位玩家連續抽多次
- **B 模式（輪抽）**: 玩家輪流抽取

### 2. 熟人問答 (Familiar Quiz)
回答關於其他玩家的問題，答對得分。
- 單選題與簡答題
- 投票最難送/最好送

### 3. 表情你猜我猜 (Expression Guess)
用肢體動作表達題目，隊友猜題得分。
- 60 秒計時
- 可跳題不扣分

## 🛠️ 開發指令

```bash
# 開發伺服器
npm run dev

# 建立生產版本
npm run build

# 產生靜態檔案
npm run generate

# 預覽靜態檔案
npm run preview
```

## 📖 文件

- [快速開始](./QUICKSTART.md) - 立即上手指南
- [開發進度](./PROGRESS.md) - 詳細開發進度
- [SSD 規格](./ssd（copilot可讀）_聖誕派對遊戲_nuxt_4_靜態版_v_1.md) - 完整系統設計文件

## 🎯 核心 API

### Composables

```typescript
// 狀態管理
const gameStore = useGameStore()

// 資料持久化
const localStore = useLocalStore()

// 音效播放
const audio = useAudio()

// 關卡導航
const stageRunner = useStageRunner()
```

### Store Actions

```typescript
// 玩家管理
gameStore.setPlayers(players)
gameStore.addPlayer(player)

// 分數管理
gameStore.addScore(playerId, delta)
gameStore.setScore(playerId, score)

// 關卡控制
gameStore.nextStage()
gameStore.goToStage(index)

// 投票結果
gameStore.applyVotes()
```

## 🎨 自訂配置

### 音效檔案
將音效檔案放在 `public/sounds/` 目錄：
- `click.mp3` - 點擊音效
- `hit.mp3` - 命中音效
- `miss.mp3` - 落空音效
- `correct.mp3` - 答對音效
- `reveal.mp3` - 揭曉音效
- `finish.mp3` - 結束音效

### 色彩主題
編輯 `tailwind.config.js` 自訂主題色彩。

## 🚀 部署

### 產生靜態檔案

```bash
npm run generate
```

檔案會輸出到 `.output/public/` 目錄。

### 部署平台

支援任何靜態網站託管服務：
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

## 🤝 貢獻

歡迎提出 Issue 或 Pull Request！

## 📄 授權

MIT License

## 🎉 致謝

感謝所有參與聖誕派對的朋友們！

---

Made with ❤️ for Christmas Party 2025

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
# 2025-xmas-party
