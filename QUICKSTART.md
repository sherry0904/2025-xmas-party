# 🎄 聖誕派對遊戲 - 快速開始

## 🚀 立即開始

開發伺服器已經在運行中！請開啟瀏覽器訪問：

**👉 http://localhost:3001**

## 📝 第一次使用步驟

### 1. 載入測試資料
- 開啟首頁
- 點擊「📦 載入假資料（測試用）」按鈕
- 系統會載入 5 位玩家和 3 個關卡

### 2. 查看排行榜
- 點擊「🏆 排行榜」按鈕
- 查看所有玩家和分數（初始為 0）

### 3. 測試資料匯出/匯入
- 在首頁點擊「📤 匯出 JSON」
- 點擊「🗑️ 重置遊戲」清除資料
- 點擊「📥 匯入 JSON」貼上剛才的資料
- 確認資料恢復

### 4. 測試持久化
- 重新整理頁面
- 資料會自動從 LocalStorage 載入

## ✨ 目前可用功能

### 首頁 (/)
- ✅ 遊戲狀態顯示
- ✅ 開始遊戲按鈕
- ✅ 管理設定入口
- ✅ 排行榜入口
- ✅ 載入假資料
- ✅ 匯入/匯出 JSON
- ✅ 重置遊戲

### 排行榜 (/leaderboard)
- ✅ 玩家排名（依分數）
- ✅ 前三名特殊圖示（🥇🥈🥉）
- ✅ 第三名神秘禮物標記 🎁
- ✅ 關卡進度條
- ✅ 返回首頁/管理/下一關

## 🎮 測試資料說明

載入假資料後會有：

### 玩家（5 位）
- Alice
- Bob
- Carol
- Dave
- Eve

### 關卡（3 個）
1. **幸運盤面** - 4×4 格，A 連抽模式，每人 6 次
2. **熟人問答** - 每人題庫，最多 5 題
3. **表情你猜我猜** - 60 秒，10 題，3 個類別

## 🎯 核心架構已完成

### 狀態管理
- ✅ Pinia Store 完整實作
- ✅ LocalStorage 自動持久化
- ✅ 匯入匯出功能

### Composables
- ✅ `useGameStore()` - 遊戲狀態
- ✅ `useLocalStore()` - 資料持久化
- ✅ `useAudio()` - 音效播放
- ✅ `useStageRunner()` - 關卡導航

### 型別系統
- ✅ 完整 TypeScript 型別定義
- ✅ Player, StageConfig, GameState 等

## 🔧 開發指令

```bash
# 啟動開發伺服器（已在運行）
npm run dev

# 建立生產版本
npm run build

# 產生靜態檔案
npm run generate

# 預覽靜態檔案
npm run preview
```

## 📂 核心檔案位置

```
├── types/game.ts              - 型別定義
├── stores/useGameStore.ts     - 狀態管理
├── composables/
│   ├── useLocalStore.ts       - 資料持久化
│   ├── useAudio.ts            - 音效
│   └── useStageRunner.ts      - 導航
├── pages/
│   ├── index.vue              - 首頁
│   └── leaderboard.vue        - 排行榜
└── utils/mockData.ts          - 測試資料
```

## 🎨 設計特色

- 🎄 聖誕主題配色（綠、紅、金）
- 💎 毛玻璃效果背景
- 📱 響應式設計
- ✨ 流暢動畫過渡
- 🎯 清晰的視覺階層

## 🐛 Debug 工具

### 瀏覽器開發工具
1. 開啟 Chrome DevTools (F12)
2. Application → Local Storage → `http://localhost:3001`
3. 查看 `xmasGame/config` 和 `xmasGame/state`

### Vue DevTools
- 安裝 [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/)
- 查看 Pinia Store 狀態
- 即時修改資料測試

### Nuxt DevTools
- 按 `Shift + Option + D` 開啟
- 查看路由、元件、API 等資訊

## ⚠️ 已知問題

1. **PostCSS 警告** - 可忽略，不影響功能
2. **音效檔案** - 尚未加入實際檔案，需自行準備或關閉音效
3. **遊戲頁面** - luck-board、quiz、guess 頁面尚未實作

## 📋 下一步建議

### 立即可做的
1. ✅ **測試首頁** - 載入假資料、查看排行榜
2. ✅ **測試持久化** - 重新整理頁面、匯入匯出
3. 🚧 **開發管理頁面** - 讓使用者可以新增/編輯玩家

### 關鍵功能開發順序
1. **管理頁面** (`/manage`) - 玩家管理、關卡設定
2. **Luck Board** (`/game/luck-board`) - 第一個遊戲關卡
3. **計分板元件** - 可重複使用的 ScoreBoard
4. **Quiz 頁面** - 熟人問答
5. **Expression Guess** - 你比我猜
6. **投票揭曉** - 最後結算

## 🎉 恭喜！

核心架構已經完成，接下來可以專注在開發各個遊戲頁面和元件！

---

**需要幫助？** 查看 `PROGRESS.md` 了解詳細進度
**了解更多？** 參考 `ssd（copilot可讀）_聖誕派對遊戲_nuxt_4_靜態版_v_1.md`
