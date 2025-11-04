<script setup lang="ts">
import { mockGameConfig } from '~/utils/mockData'

const gameStore = useGameStore()
const stageRunner = useStageRunner()
const localStore = useLocalStore()

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
    alert('請先設定玩家或載入假資料！')
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
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 標題 -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-white mb-4">
        🎄 聖誕派對遊戲 🎅
      </h1>
      <p class="text-xl text-green-200">
        歡迎來到 2025 聖誕派對！
      </p>
    </div>

    <!-- 功能卡片 -->
    <div class="grid gap-6 md:grid-cols-2">
      <!-- 遊戲狀態 -->
      <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
        <h2 class="text-2xl font-bold mb-4">🎮 遊戲狀態</h2>
        <div v-if="hasExistingData" class="space-y-2">
          <p>👥 玩家人數：{{ gameStore.config.players.length }}</p>
          <p>🎯 關卡數量：{{ gameStore.config.stages.length }}</p>
          <p>📍 當前關卡：{{ gameStore.state.currentStageIndex + 1 }}</p>
        </div>
        <div v-else class="text-yellow-200">
          <p>⚠️ 尚未設定遊戲資料</p>
          <p class="text-sm mt-2">請載入假資料或前往管理頁面設定</p>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
        <h2 class="text-2xl font-bold mb-4">⚡ 快速操作</h2>
        <div class="space-y-3">
          <button 
            @click="startGame"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            ▶️ 開始遊戲
          </button>
          <NuxtLink
            to="/game/luck-board"
            class="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition text-center"
          >
            🎁 幸運盤面（新！）
          </NuxtLink>
          <button 
            @click="stageRunner.goToManage"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            ⚙️ 管理設定
          </button>
          <button 
            @click="stageRunner.goToLeaderboard"
            class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            🏆 排行榜
          </button>
        </div>
      </div>

      <!-- 資料管理 -->
      <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
        <h2 class="text-2xl font-bold mb-4">💾 資料管理</h2>
        <div class="space-y-3">
          <button 
            @click="loadMockData"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            📦 載入假資料（測試用）
          </button>
          <button 
            @click="importData"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            📥 匯入 JSON
          </button>
          <button 
            @click="exportData"
            class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            📤 匯出 JSON
          </button>
          <button 
            @click="resetGame"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            🗑️ 重置遊戲
          </button>
        </div>
      </div>

      <!-- 遊戲規則 -->
      <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
        <h2 class="text-2xl font-bold mb-4">📖 遊戲規則</h2>
        <ul class="space-y-2 text-sm">
          <li>🎲 <strong>幸運盤面：</strong>點擊格子，綠格得分！</li>
          <li>🤔 <strong>熟人問答：</strong>考驗彼此的了解程度</li>
          <li>🎭 <strong>你比我猜：</strong>表情動作傳達題目</li>
          <li>🏆 <strong>最終排名：</strong>分數最高者獲勝！</li>
        </ul>
        <p class="text-xs text-gray-300 mt-4">
          ※ 詳細規則請參考各關卡說明
        </p>
      </div>
    </div>

    <!-- 頁尾資訊 -->
    <div class="text-center mt-12 text-white/60 text-sm">
      <p>Nuxt 3 + Tailwind CSS + Pinia</p>
      <p class="mt-1">Made with ❤️ for Christmas Party 2025</p>
    </div>
  </div>
</template>
