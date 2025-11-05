<script setup lang="ts">
import { mockGameConfig } from '~/utils/mockData'

const gameStore = useGameStore()
const stageRunner = useStageRunner()
const localStore = useLocalStore()
import { ref } from 'vue'

// 控制主持人面板顯示
const showAdmin = ref(false)
const toggleAdmin = () => { showAdmin.value = !showAdmin.value }

// 初始化 store 和音效
onMounted(() => {
  gameStore.initialize()
  
  const audio = useAudio()
  audio.preloadAll()
})

// 頁面資訊
const hasExistingData = computed(() => {
  return gameStore.config.players.length > 0
})

// 載入假資料
const loadMockData = () => {
  gameStore.config = mockGameConfig
  gameStore.state.scores = {}
  gameStore.config.players.forEach(p => {
    gameStore.state.scores[p.id] = 0
  })
  gameStore.save()
  alert('已載入假資料！')
}

// 開始遊戲
const startGame = () => {
  if (gameStore.config.players.length === 0) {
    if (confirm('尚未設定玩家！是否前往管理頁面？')) {
      stageRunner.goToManage()
    }
    return
  }
  stageRunner.goToCurrentStage()
}

// 重置遊戲
const resetGame = () => {
  if (confirm('確定要重置所有資料嗎？')) {
    gameStore.reset()
    localStore.clear()
    alert('已重置遊戲資料！')
  }
}

// 匯入資料
const importData = () => {
  const json = prompt('請貼上 JSON 資料：')
  if (json) {
    if (localStore.importJSON(json)) {
      gameStore.initialize()
      alert('匯入成功！')
    } else {
      alert('匯入失敗，請檢查 JSON 格式！')
    }
  }
}

// 匯出資料
const exportData = () => {
  const json = localStore.exportJSON()
  navigator.clipboard.writeText(json).then(() => {
    alert('已複製到剪貼簿！')
  }).catch(() => {
    // 備用方案：顯示在 alert
    alert('請手動複製：\n' + json)
  })
}
</script>

<template>

  <div class="main-bg min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
  <!-- 暫不放背景照片，等功能完成後再調整 UI -->

    <!-- settings icon (top-right) -->
    <button @click="toggleAdmin" class="settings-btn absolute top-6 right-6 z-20" aria-label="主持人設定">⚙️</button>

    <!-- 標題區塊 -->
    <div class="w-full flex flex-col items-center mt-8 mb-10 z-10">
      <h1 class="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight animate-fadein">聖誕派對遊戲</h1>
      <p class="text-xl md:text-2xl text-white/80 mt-3 font-medium animate-fadein2">三個刺激的關卡等你來挑戰</p>
    </div>

    <!-- 三關卡平均分配卡片 -->
    <div class="stage-cards flex flex-row gap-8 w-full max-w-5xl justify-center items-stretch z-10">
      <!-- 第一關 -->
      <div class="stage-card bg-gradient-to-br from-red-500 via-pink-400 to-yellow-200 shadow-xl rounded-2xl flex-1 flex flex-col items-center justify-between py-8 px-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-pink-200/40" @click="stageRunner.goTo('/game/luck-board')">
        <div class="flex flex-col items-center w-full">
          <span class="text-3xl mb-3 mt-1">🎁</span>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide">第一關</h2>
          <p class="text-base text-white/80 mb-8">(點擊以進入下一步說明)</p>
        </div>
        <button class="btn btn-primary w-28 text-lg rounded-full shadow hover:scale-105 transition" @click.stop="stageRunner.goTo('/game/luck-board')">前往</button>
      </div>
      <!-- 第二關 -->
      <div class="stage-card bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-300 shadow-xl rounded-2xl flex-1 flex flex-col items-center justify-between py-8 px-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-orange-200/40" @click="stageRunner.goTo('/game/quiz')">
        <div class="flex flex-col items-center w-full">
          <span class="text-3xl mb-3 mt-1">🤔</span>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide">第二關</h2>
          <p class="text-base text-white/80 mb-8">(點擊以進入下一步說明)</p>
        </div>
        <button class="btn btn-primary w-28 text-lg rounded-full shadow hover:scale-105 transition" @click.stop="stageRunner.goTo('/game/quiz')">前往</button>
      </div>
      <!-- 第三關 -->
      <div class="stage-card bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-300 shadow-xl rounded-2xl flex-1 flex flex-col items-center justify-between py-8 px-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-purple-200/40" @click="stageRunner.goTo('/game/guess')">
        <div class="flex flex-col items-center w-full">
          <span class="text-3xl mb-3 mt-1">🎭</span>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide">第三關</h2>
          <p class="text-base text-white/80 mb-8">(點擊以進入下一步說明)</p>
        </div>
        <button class="btn btn-primary w-28 text-lg rounded-full shadow hover:scale-105 transition" @click.stop="stageRunner.goTo('/game/guess')">前往</button>
      </div>
    </div>

    <!-- 頁尾資訊 -->
    <div class="text-center mt-16 text-white/70 text-base z-10">
      <p>Nuxt 4 + Tailwind CSS + Pinia</p>
      <p class="mt-1">Made with ❤️ for Christmas Party 2025</p>
    </div>

    <!-- Admin overlay panel -->
    <transition name="fade">
      <div v-if="showAdmin" class="admin-overlay">
        <div class="admin-panel bg-white/6 backdrop-blur rounded-lg p-6">
          <div class="flex justify-between items-center">
            <h3 class="admin-title">主持人工具</h3>
            <button @click="toggleAdmin" class="close-btn">✕</button>
          </div>
          <p class="admin-sub">簡潔操作：管理、榜單與資料匯入</p>

          <div class="admin-actions mt-4 space-y-3">
            <button @click="stageRunner.goToManage" class="w-full btn-admin">⚙️ 管理設定</button>
            <button @click="stageRunner.goToLeaderboard" class="w-full btn-admin">🏆 排行榜</button>
            <button @click="importData" class="w-full btn-admin">📥 匯入 JSON</button>
            <button @click="exportData" class="w-full btn-admin">📤 匯出 JSON</button>
            <button @click="resetGame" class="w-full btn-admin danger">🗑️ 重置資料</button>
          </div>

          <div class="mt-6 text-sm text-white/70">
            <p>玩家：{{ gameStore.config.players.length }}</p>
            <p>關卡：{{ gameStore.config.stages.length }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.hero {
  padding: 2rem 0;
  display: grid;
  grid-template-columns: 1fr; /* mobile default */
  gap: 2rem;
  align-items: start;
}

  .game-card {
  display: grid;
  gap: 1rem;
  grid-auto-rows: minmax(120px, auto);
}

.tile { position: relative; color: white; border-radius: 1rem; padding: 1.5rem; cursor: pointer; display: flex; align-items: center; }
.tile-large { min-height: 220px; }
.tile-medium { min-height: 140px; }
.tile-content { display: flex; flex-direction: column; gap: 0.5rem; max-width: 520px; }
.tile-icon { font-size: 2.5rem; }
.tile-title { font-size: 1.75rem; font-weight: 800; }
.tile-desc { opacity: 0.95; }
.tile-cta { margin-top: auto; align-self: start; background: rgba(255,255,255,0.15); border: none; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 700; }
.tile-cta:hover { background: rgba(255,255,255,0.25); }

.admin-card { color: white; display: flex; flex-direction: column; justify-content: space-between; align-self: start; }
.admin-title { font-size: 1.25rem; font-weight: 800; }
.admin-sub { font-size: 0.9rem; opacity: 0.9; }
.btn-admin { width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.06); color: white; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.08); font-weight: 700; }
.btn-admin:hover { background: rgba(255,255,255,0.12); }
.btn-admin.danger { background: rgba(239,68,68,0.14); }

.hero {
  /* default already set for mobile; larger breakpoints override below */
}

@media (min-width: 1024px) {
  /* Horizontal-first layout for host screens */
  .hero {
    grid-template-columns: 2fr 360px; /* main area + fixed admin column */
    gap: 2.5rem;
  }

  /* evenly split three tiles, content centered */
  .game-card {
    grid-column: 1 / 2;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3rem;
    align-items: stretch;
  }

  .tile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 320px;
    padding: 2.5rem 1.5rem;
    box-sizing: border-box;
  }

  .admin-card {
    grid-column: 2 / 3;
    position: sticky;
    top: 40px;
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}

/* Tile visual enhancements */
.tile {
  overflow: hidden;
  transition: transform .28s cubic-bezier(.2,.9,.2,1), box-shadow .28s;
  will-change: transform;
}
.tile:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 40px rgba(2,6,23,0.45); }
.tile::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 10% 10%, rgba(255,255,255,0.03), transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.02), transparent 40%);
  pointer-events: none;
}
.tile .tile-icon { font-size: 2.25rem; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25)); }
.tile-title { letter-spacing: -0.5px; font-size: 1.875rem; }
.tile-desc { opacity: 0.95; margin-bottom: 0.75rem; }
.tile .tile-cta { background: rgba(255,255,255,0.12); }

/* decorative image placeholder (top-right) */
.tile .decor { position: absolute; right: 18px; top: 18px; opacity: 0.95; transform: translateZ(0); }


/* wide screen tile widths when .game-card is flex-row */
@media (min-width: 1024px) {
  .tile-large { flex: 0 0 60%; max-width: 60%; }
  .tile-medium { flex: 0 0 20%; max-width: 20%; }
  .tile { display: flex; }
}

@media (max-width: 1023px) {
  .tile-large, .tile-medium { flex: 0 0 auto; max-width: 100%; }
}

@media (max-width: 767px) {
  .hero { grid-template-columns: 1fr; }
  .tile-large { min-height: 180px; }
  .tile-medium { min-height: 110px; }
}

/* settings button (top-right) */
.settings-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
  padding: 0.5rem 0.65rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
}

/* admin overlay */
.admin-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.45);
  z-index: 60;
}

.admin-panel { width: min(760px, 95%); }
.close-btn { background: transparent; border: none; color: white; font-size: 1.25rem; cursor: pointer; }

.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
