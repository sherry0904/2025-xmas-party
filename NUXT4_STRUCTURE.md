# Nuxt 4 專案結構

## 📁 目錄結構

本專案已升級至 **Nuxt 4.2.0** 並採用新的目錄結構：

```
xmas-party/
├── app/                      # Nuxt 4 主應用目錄 (srcDir)
│   ├── app.vue              # 根組件（背景、全域樣式）
│   ├── router.options.ts    # 路由配置
│   ├── pages/               # 頁面路由
│   │   ├── index.vue        # 首頁
│   │   ├── leaderboard.vue  # 排行榜
│   │   └── game/
│   │       └── luck-board.vue  # 幸運盤面遊戲
│   ├── components/          # Vue 組件
│   │   └── luck-board/
│   │       ├── Cell.vue     # 格子組件
│   │       └── GridBoard.vue # 遊戲盤面
│   ├── composables/         # Composable 函數
│   │   ├── useAudio.ts      # 音效管理
│   │   ├── useLocalStore.ts # LocalStorage
│   │   ├── useLuckBoard.ts  # 幸運盤面邏輯
│   │   └── useStageRunner.ts # 關卡導航
│   ├── stores/              # Pinia 狀態管理
│   │   └── useGameStore.ts  # 遊戲狀態
│   ├── types/               # TypeScript 類型定義
│   │   └── game.ts          # 遊戲相關類型
│   └── utils/               # 工具函數
│       └── mockData.ts      # 測試資料
├── public/                  # 靜態資源
│   ├── favicon.ico
│   ├── robots.txt
│   └── sounds/              # 音效檔案（待加入）
├── nuxt.config.ts           # Nuxt 4 配置
├── tailwind.config.js       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 專案依賴

```

## 🔧 Nuxt 4 關鍵配置

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,  // 啟用 Nuxt 4 新功能
  },
  srcDir: 'app/',             // 主應用目錄設為 app/
  ssr: false,                 // 客戶端渲染（靜態部署）
  // ...其他配置
})
```

## 📝 Nuxt 4 主要變更

### 1. **目錄結構變更**
- ✅ 所有應用程式碼移至 `app/` 目錄
- ✅ `srcDir: 'app/'` 設定告訴 Nuxt 從 `app/` 讀取
- ✅ `public/` 保持在根目錄

### 2. **自動匯入**
Nuxt 4 會自動匯入以下目錄的內容：
- `app/components/` - Vue 組件
- `app/composables/` - Composable 函數
- `app/stores/` - Pinia stores
- `app/utils/` - 工具函數

使用時無需手動 import：
```vue
<script setup>
// ✅ 自動匯入，無需 import
const gameStore = useGameStore()
const audio = useAudio()
</script>
```

### 3. **路由系統**
- `app/pages/` 自動生成路由
- `app/app.vue` 使用 `<NuxtPage>` 渲染頁面
- 檔案系統路由：
  - `app/pages/index.vue` → `/`
  - `app/pages/game/luck-board.vue` → `/game/luck-board`

### 4. **PostCSS 配置**
- ❌ 不再使用 `postcss.config.js`
- ✅ Tailwind CSS 透過 `@nuxtjs/tailwindcss` 模組自動配置

## 🚀 開發指令

```bash
# 開發伺服器（port 3007）
npm run dev

# 建置靜態網站
npm run generate

# 預覽建置結果
npm run preview
```

## 📦 技術堆疊

- **Nuxt**: 4.2.0 (Vue 3.5.22, Vite 7.1.12)
- **狀態管理**: Pinia 3.0.3 + @pinia/nuxt 0.11.2
- **樣式**: Tailwind CSS 3.4.18 + @nuxtjs/tailwindcss 6.14.0
- **TypeScript**: 完整類型支援
- **Excel**: xlsx 0.18.5（用於問答題匯入）

## 🎯 當前功能狀態

### ✅ 已完成
- Nuxt 4 目錄結構遷移
- 幸運盤面遊戲（10×6 格子）
- Pinia 狀態管理 + LocalStorage 持久化
- 首頁、排行榜頁面
- 現代化背景 + 雪花動畫

### 🚧 待開發
- 管理頁面（玩家 CRUD、設定）
- 熟人問答遊戲
- 你比我猜遊戲
- 音效檔案整合
- 投票揭曉系統

## 📖 參考資料

- [Nuxt 4 官方文檔](https://nuxt.com/docs/4.x)
- [Nuxt 4 遷移指南](https://nuxt.com/docs/getting-started/upgrade)
- [目錄結構](https://nuxt.com/docs/guide/directory-structure/app)
