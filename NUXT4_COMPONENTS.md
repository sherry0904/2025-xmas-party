# Nuxt 4 組件自動匯入規則

## 🔍 問題說明

在 Nuxt 4 中，巢狀資料夾的組件會自動加上**資料夾名稱前綴**。

## 📂 命名規則

### 目錄結構 → 組件名稱

```
app/components/
├── Button.vue              → <Button>
├── luck-board/
│   ├── Cell.vue           → <LuckBoardCell>
│   └── GridBoard.vue      → <LuckBoardGridBoard>
└── quiz/
    └── Question.vue        → <QuizQuestion>
```

### 規則說明

1. **單層組件**：直接使用檔名
   - `app/components/Button.vue` → `<Button>`

2. **巢狀組件**：使用 `資料夾名-檔名` (Pascal Case)
   - `app/components/luck-board/Cell.vue` → `<LuckBoardCell>`
   - `app/components/luck-board/GridBoard.vue` → `<LuckBoardGridBoard>`

3. **多層巢狀**：所有資料夾名稱都會加入前綴
   - `app/components/game/luck-board/Cell.vue` → `<GameLuckBoardCell>`

## ✅ 已修正的檔案

### 1. `app/pages/game/luck-board.vue`
```vue
<!-- ❌ 錯誤 -->
<GridBoard />

<!-- ✅ 正確 -->
<LuckBoardGridBoard />
```

### 2. `app/components/luck-board/GridBoard.vue`
```vue
<!-- ❌ 錯誤 -->
<Cell />

<!-- ✅ 正確 -->
<LuckBoardCell />
```

## 💡 替代方案

如果不想使用長前綴，有兩種方式：

### 方案 1: 明確匯入
```vue
<script setup>
import Cell from '~/components/luck-board/Cell.vue'
import GridBoard from '~/components/luck-board/GridBoard.vue'
</script>

<template>
  <GridBoard>
    <Cell />
  </GridBoard>
</template>
```

### 方案 2: 扁平化組件結構
```
app/components/
├── LuckBoardCell.vue       → <LuckBoardCell>
└── LuckBoardGrid.vue       → <LuckBoardGrid>
```

## 🎯 最佳實踐

建議使用 Nuxt 的自動匯入（即當前方式），因為：
- ✅ 無需手動 import
- ✅ 自動 tree-shaking
- ✅ 更好的命名空間管理
- ✅ 避免組件名稱衝突

## 📚 參考資料

- [Nuxt Components Directory](https://nuxt.com/docs/guide/directory-structure/components)
- [Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports)
