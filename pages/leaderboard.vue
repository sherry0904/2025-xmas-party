<script setup lang="ts">
const gameStore = useGameStore()
const stageRunner = useStageRunner()

// 排序後的玩家
const rankedPlayers = computed(() => gameStore.playersByScore)

// 取得排名圖示
const getRankIcon = (index: number): string => {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return `${index + 1}`
}

// 取得排名顏色
const getRankColor = (index: number): string => {
  if (index === 0) return 'text-yellow-400'
  if (index === 1) return 'text-gray-400'
  if (index === 2) return 'text-orange-600'
  return 'text-white'
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 標題 -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white mb-2">
        🏆 排行榜 🏆
      </h1>
      <p class="text-green-200">
        當前積分排名
      </p>
    </div>

    <!-- 排行榜 -->
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
      <div v-if="rankedPlayers.length > 0" class="space-y-4">
        <div 
          v-for="(player, index) in rankedPlayers" 
          :key="player.id"
          class="flex items-center gap-4 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition"
        >
          <!-- 排名 -->
          <div class="text-3xl font-bold w-16 text-center" :class="getRankColor(index)">
            {{ getRankIcon(index) }}
            <span v-if="index === 2" class="ml-2">🎁</span>
          </div>

          <!-- 玩家資訊 -->
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <!-- 頭像 -->
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                {{ player.name.charAt(0) }}
              </div>
              
              <!-- 名字 -->
              <div>
                <p class="text-xl font-bold text-white">
                  {{ player.name }}
                </p>
                <p v-if="gameStore.state.round1Stats?.greenHits[player.id]" class="text-sm text-green-300">
                  綠格命中：{{ gameStore.state.round1Stats.greenHits[player.id] }}
                </p>
              </div>
            </div>
          </div>

          <!-- 分數 -->
          <div class="text-right">
            <p class="text-3xl font-bold text-white">
              {{ gameStore.getScore(player.id) }}
            </p>
            <p class="text-sm text-gray-300">分</p>
          </div>
        </div>
      </div>

      <!-- 無資料提示 -->
      <div v-else class="text-center text-white/60 py-8">
        <p class="text-xl">尚未有玩家資料</p>
        <p class="text-sm mt-2">請先在首頁載入資料</p>
      </div>
    </div>

    <!-- 關卡資訊 -->
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 text-white">
      <h2 class="text-xl font-bold mb-3">📊 關卡進度</h2>
      <div class="flex items-center gap-3">
        <div class="flex-1 bg-white/20 rounded-full h-4 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all"
            :style="{ width: `${((gameStore.state.currentStageIndex + 1) / gameStore.config.stages.length * 100)}%` }"
          ></div>
        </div>
        <span class="text-sm whitespace-nowrap">
          {{ gameStore.state.currentStageIndex + 1 }} / {{ gameStore.config.stages.length }}
        </span>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="grid gap-4 md:grid-cols-3">
      <button 
        @click="stageRunner.goToHome"
        class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        🏠 返回首頁
      </button>
      <button 
        @click="stageRunner.goToManage"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        ⚙️ 管理設定
      </button>
      <button 
        v-if="gameStore.hasNextStage"
        @click="stageRunner.goToNextStage"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        ▶️ 下一關
      </button>
      <button 
        v-else
        class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        🎉 遊戲結束
      </button>
    </div>

    <!-- 說明 -->
    <div class="mt-8 text-center text-white/60 text-sm">
      <p>※ 第三名旁的 🎁 代表神秘獎品（由主持人現場宣布）</p>
    </div>
  </div>
</template>
