# SSD（Copilot 可讀）— 聖誕派對遊戲 Nuxt 4 靜態版 v1

> 目的：讓 GitHub Copilot 能理解並產生專案骨架、關鍵元件、狀態管理與資料結構。以 **Nuxt 4**、**純前端／全靜態**、**LocalStorage 持久化** 為前提。

## 0. 專案定位
- **框架**：Nuxt 4（SSR 關閉，產出純靜態）
- **UI**：Tailwind（或 Bootstrap，預設 Tailwind）
- **狀態**：Pinia + 自製 LS 持久化 composable
- **部署**：任一靜態主機（Vercel/GitHub Pages 等）
- **裝置**：以 **桌機／投影** 為主；支援手機但非首要

---

## 1. 功能概覽（Feature List）
1) **首頁**：歡迎＋規則、上傳/設定玩家資料、照片區
2) **Luck Board（幸運盤面）**：可設定盤面大小（預設 4×4；輪抽建議 10×6）、兩種抽法（A 連抽 / B 輪抽）、左側 A.. 與上方 1.. 座標顯示、滑鼠點格操作、音效回饋
3) **Familiar Quiz（熟人問答）**：每人 6–10 題題庫；上一關高分者先挑他人題庫；答對 +1；固定兩題投票「最難送/最好送」於結算加減分；**逐人揭曉**投票結果
4) **Expression Guess（表情你猜我猜）**：選類別→10 題→60 秒→每猜中 +1，可跳題
5) **排行榜**：即時排序；第三名旁顯示神秘 icon（不實作交換操作）
6) **主持人分數頁（/host/score）**：大字版加減分，快捷鍵操作
7) **管理設定（/manage）**：人數、人名、頭像、Luck Board 設定、題庫匯入/匯出、投票揭曉順序、音效、色弱模式
8) **隱藏玩法說明**：純說明頁，交換由主持人現場執行

> **關卡順序可調**：不以 round1/2/3 命名，統一稱為 **Stages**，可在 /manage 以拖拉排序。

---

## 2. 目錄結構（File Tree）
```text
xmas-party/
├─ app.config.ts
├─ nuxt.config.ts
├─ composables/
│  ├─ useLocalStore.ts        # 封裝 localStorage 讀寫與命名空間
│  ├─ useAudio.ts             # 音效播放（支援靜音/音量）
│  └─ useStageRunner.ts       # 依 stages 順序控制導航與狀態
├─ stores/
│  └─ useGameStore.ts         # Pinia 狀態，含 players/scores/stages 等
├─ assets/
│  ├─ sounds/                 # 點格、命中、答對、揭曉、結束
│  └─ images/avatars/         # 玩家頭像（可空）
├─ components/
│  ├─ core/
│  │  ├─ ScoreBoard.vue
│  │  ├─ PlayerPicker.vue
│  │  ├─ PhotoGallery.vue
│  │  ├─ SoundToggle.vue
│  │  └─ StageHeader.vue      # 顯示當局玩家、剩餘次數、快捷鍵提示
│  ├─ luck-board/
│  │  ├─ GridBoard.vue        # 可配置 rows/cols，顯示 A.. / 1..
│  │  └─ Cell.vue
│  ├─ quiz/
│  │  ├─ QuizChooser.vue
│  │  └─ QuizPlayer.vue
│  ├─ votes/
│  │  └─ VoteReveal.vue       # 逐人揭曉動畫
│  └─ guess/
│     └─ GuessRunner.vue      # 題卡顯示、計時、已答記錄
├─ pages/
│  ├─ index.vue               # 歡迎＋規則＋玩家設定＋照片
│  ├─ game/
│  │  ├─ luck-board.vue
│  │  ├─ familiar-quiz.vue
│  │  └─ expression-guess.vue
│  ├─ host/
│  │  └─ score.vue
│  ├─ manage.vue
│  ├─ leaderboard.vue
│  ├─ rules/
│  │  └─ secret.vue
│  └─ votes.vue
└─ types/
   └─ game.ts                 # 全域型別定義
```

---

## 3. 型別定義（types/game.ts）
```ts
export type PlayerId = string; // uuid

export interface Player {
  id: PlayerId;
  name: string;
  avatarUrl?: string;
}

export type StageKind = 'luck-board' | 'familiar-quiz' | 'expression-guess';

export interface StageConfigBase {
  id: string;          // uuid
  kind: StageKind;     // 決定載入哪個頁面/元件
  enabled: boolean;    // 可被跳過
  title?: string;
}

export interface LuckBoardConfig extends StageConfigBase {
  kind: 'luck-board';
  rows: number;        // 4 或 10
  cols: number;        // 4 或 6
  mode: 'A'|'B';       // A 連抽 / B 輪抽
  picksPerPlayer: number; // 每人抽幾次（A 模式使用）
}

export interface QuizItem {
  id: string;
  q: string;
  type: 'single'|'text';
  options?: string[];  // type=single 使用
  a?: number|string;   // 正解（單選索引或簡答字串）
}

export interface FamiliarQuizConfig extends StageConfigBase {
  kind: 'familiar-quiz';
  banks: Record<PlayerId, QuizItem[]>; // 每人題庫
  perPlayerMax?: number;               // 每人最多作答題數，預設 5
}

export interface GuessCard { id: string; text: string; category: string; }
export interface ExpressionGuessConfig extends StageConfigBase {
  kind: 'expression-guess';
  durationSec: number;  // 60
  count: number;        // 10
  categories: string[]; // 可選類別
  cards: GuessCard[];   // 題庫（含類別屬性）
}

export interface VotesSummary {
  hardest: Record<PlayerId, number>; // 最難送 票數
  easiest: Record<PlayerId, number>; // 最好送 票數
}

export interface RevealMode = 'suspense' | 'random' | 'by-score-asc';

export interface GameConfig {
  players: Player[];
  stages: (LuckBoardConfig | FamiliarQuizConfig | ExpressionGuessConfig)[];
  votes: VotesSummary;
  revealMode: RevealMode;  // 投票揭曉策略
  sound: { on: boolean; volume: number };
  accessibility: { colorBlindMode: boolean };
}

export interface GameState {
  scores: Record<PlayerId, number>;
  currentStageIndex: number;
  currentPlayerId?: PlayerId; // 每關開始前由主持人指定
  round1Stats?: { greenHits: Record<PlayerId, number> }; // 用於平手
}
```

---

## 4. LS Schema（LocalStorage Keys）
- `xmasGame/config` → `GameConfig`
- `xmasGame/state` → `GameState`
- `xmasGame/snapshots/*` → 重要節點快照（進入新關卡前自動存一份）

提供 **匯入/匯出 JSON**（/manage 與 /host/score 均可讀寫）。

---

## 5. 狀態邏輯（Pinia）
```ts
// stores/useGameStore.ts（要點）
export const useGameStore = defineStore('game', {
  state: (): { config: GameConfig; state: GameState } => ({ ... }),
  getters: {
    playersByScore: (s) => sortByScore(s.state.scores, s.config.players),
    currentStage: (s) => s.config.stages[s.state.currentStageIndex],
  },
  actions: {
    setPlayers(players: Player[]) { ... },
    setCurrentPlayer(id: PlayerId) { this.state.currentPlayerId = id },
    addScore(id: PlayerId, delta = 1) { this.state.scores[id] = (this.state.scores[id]||0) + delta },
    nextStage() { this.state.currentStageIndex++ },
    applyVotes() { // 難送 −1/票；好送 +1/票
      for (const id in this.config.votes.hardest) this.addScore(id, -this.config.votes.hardest[id]);
      for (const id in this.config.votes.easiest) this.addScore(id,  this.config.votes.easiest[id]);
    },
    snapshot(label: string) { /* 存到 xmasGame/snapshots/label-<ts>.json */ },
  }
});
```

---

## 6. 路由與頁面（語義化命名）
- `/`：首頁（玩家設定、照片上傳、規則）
- `/game/luck-board`：幸運盤面
- `/game/familiar-quiz`：熟人問答
- `/game/expression-guess`：表情你猜我猜
- `/host/score`：主持人大字加減分
- `/manage`：管理設定
- `/leaderboard`：排行榜
- `/rules/secret`：隱藏玩法說明
- `/votes`：投票揭曉流程

> 關卡順序由 `config.stages` 決定；`useStageRunner` 依 `currentStageIndex` 導頁。

---

## 7. 元件契約（Props/Emits）
### GridBoard.vue（幸運盤面）
```ts
props: {
  rows: number, cols: number,
  mode: 'A'|'B',
  board: { id:number; type:'G'|'R'; pickedBy?: PlayerId|null }[],
  labels: { rows: string[]; cols: (string|number)[] }
}
emits: {
  pick: (cellId:number) => void
}
```

### ScoreBoard.vue
```ts
props: { players: Player[], scores: Record<PlayerId,number>, projection?: boolean }
```

### QuizChooser.vue / QuizPlayer.vue
```ts
// Chooser：選擇要作答的「目標玩家」題庫
emits: { choose: (targetId: PlayerId) => void }

// Player：出題與作答
props: { questions: QuizItem[], currentIndex: number }
emits: { answer: (qid:string, correct:boolean) => void }
```

### VoteReveal.vue（逐人揭曉）
```ts
props: { players: Player[], votes: VotesSummary, mode: RevealMode }
emits: { next: () => void, done: () => void }
```

### GuessRunner.vue（表情你猜我猜）
```ts
props: { durationSec:number, count:number, cards: GuessCard[], category:string }
emits: { correct: (id:string)=>void, skip:(id:string)=>void, done:()=>void }
```

---

## 8. 互動規則（Acceptance Criteria）
- ✅ **Luck Board**
  - 顯示 A.. / 1.. 座標；格子 hover 顯示座標提示（如 B3）
  - **A 連抽**：主持人選定當局玩家後，可連續點格 `picksPerPlayer` 次
  - **B 輪抽**：由 `order` 逐人輪流，每次只能抽 1 格
  - `type='G'` 時 +1 分並播放命中音效；`'R'` 不加分播放落空音
  - 已抽格顯示玩家標記，不可重複

- ✅ **Familiar Quiz**
  - 上一關最高分者先選目標題庫
  - 單選題：選項高亮正誤、正確 +1；簡答題由主持人按「判對」
  - 可設定每人最多作答數（預設 5）
  - 投票揭曉頁支援 **懸念/隨機/依分數** 三種順序

- ✅ **Expression Guess**
  - 選擇類別→進入 60 秒倒數→10 題卡；`Correct` +1，`Skip` 不扣分

- ✅ **主持人分數頁**
  - 大字顯示；快捷鍵 `1..9` 選玩家、`+`/`-` 加減分、`N` 下一關

- ✅ **管理設定**
  - 可增減玩家、人名、頭像
  - 調整 Luck Board rows/cols、mode、picksPerPlayer
  - 匯入/匯出 JSON（含題庫/票數/階段順序）
  - 設定投票揭曉順序、音效與色弱模式

---

## 9. UI/UX 指南（給 Copilot 的設計要點）
- 色系：深綠、酒紅、金色點綴；避免僅用色彩傳達（加圖示）
- 觸控區 ≥ 44px；投影模式字體 ≥ 32px
- 照片區支援拖放上傳與 URL
- 音效可用 `<audio>` 每次 `currentTime=0; play()`

---

## 10. 假資料（fixtures）
```json
{
  "players": [
    {"id":"p1","name":"Alice"},
    {"id":"p2","name":"Bob"},
    {"id":"p3","name":"Carol"},
    {"id":"p4","name":"Dave"},
    {"id":"p5","name":"Eve"}
  ],
  "stages": [
    {"id":"s1","kind":"luck-board","enabled":true,"title":"幸運盤面","rows":4,"cols":4,"mode":"A","picksPerPlayer":6},
    {"id":"s2","kind":"familiar-quiz","enabled":true,"title":"熟人問答","banks":{}},
    {"id":"s3","kind":"expression-guess","enabled":true,"title":"你比我猜","durationSec":60,"count":10,"categories":["Xmas","Life"],"cards":[]}
  ],
  "votes": {"hardest":{},"easiest":{}},
  "revealMode": "suspense",
  "sound": {"on": true, "volume": 0.8},
  "accessibility": {"colorBlindMode": false}
}
```

---

## 11. 開發任務（Issues TODO for Copilot）
- [ ] Nuxt 4 專案初始化（關閉 SSR，啟用靜態輸出）
- [ ] Tailwind 設定（或 Bootstrap）
- [ ] `types/game.ts` 型別定義
- [ ] Pinia `useGameStore` 與 LS 持久化 `useLocalStore`
- [ ] `useStageRunner`：依 stages 導頁、`nextStage()` 邏輯
- [ ] 首頁：玩家 CRUD、照片區、規則
- [ ] Luck Board：`GridBoard.vue` + 座標軸 + 兩種抽法 + 音效
- [ ] Quiz：`QuizChooser`/`QuizPlayer` + 判對 + 計分
- [ ] VoteReveal：三種揭曉順序
- [ ] GuessRunner：60 秒流程與題卡狀態
- [ ] ScoreBoard（一般／投影模式）
- [ ] /host/score 快捷鍵 + 大字 UI
- [ ] /manage 管理設定 + 匯入匯出
- [ ] 排行榜頁 + 神秘 icon（不含交換操作）
- [ ] 快照機制（進入新關卡自動備份 JSON）

---

## 12. 非功能性需求（NFR）
- 可離線使用（選配 PWA）
- 錯誤保護：LocalStorage 空間不足或清除時，提供匯出提示
- 相容：Chrome/Edge/Safari 最新穩定版

---

## 13. 驗收測試（高層級）
- 進入 Luck Board，切換 A/B 模式與 4×4/10×6，座標正確渲染，點擊得分與音效正確
- 熟人問答流程可完整跑完，投票揭曉按所選策略逐人 reveal
- 你比我猜可完成 60 秒計時與分數統計
- /host/score 可使用快捷鍵加減分並即時反映到排行榜
- /manage 可成功匯出→重整→匯入→狀態復原

---

> 本 SSD 著重 **結構化契約** 與 **可自動化生成骨架**。如需補充 wireframe 或設計稿，可在此文件後續章節新增圖片或連結。

