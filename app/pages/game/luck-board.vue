<script setup lang="ts">
const gameStore = useGameStore()
const luckBoard = useLuckBoard()
const stageRunner = useStageRunner()

// 當前玩家
const currentPlayer = ref(gameStore.state.currentPlayerId || null)

// 玩家列表
const players = computed(() => gameStore.config.players)

// 排序後的玩家（用於排行榜）
const rankedPlayers = computed(() => gameStore.playersByScore)

// 選擇玩家
const selectPlayer = (playerId: string) => {
  currentPlayer.value = playerId
  gameStore.setCurrentPlayer(playerId)
}

// 處理格子被抽取
const handleCellPicked = () => {
  // 可以在這裡加入自動切換到下一位玩家的邏輯
  // 目前由主持人手動選擇
}

// 重新洗牌
const resetBoard = () => {
  if (confirm('確定要重新洗牌嗎？這將清除所有已抽取的格子！')) {
    luckBoard.resetBoard()
  }
}

// 切換透視模式
const toggleXRay = () => {
  luckBoard.toggleXRayMode()
}

// 快捷鍵監聽
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Alt + V: 切換透視模式
    if (e.altKey && e.key.toLowerCase() === 'v') {
      e.preventDefault()
      toggleXRay()
    }
    
    // 數字鍵 1-9: 快速選擇玩家
    const num = parseInt(e.key)
    if (num >= 1 && num <= players.value.length) {
      selectPlayer(players.value[num - 1].id)
    }
  }
  
  window.addEventListener('keydown', handleKeyPress)
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })
})

// 取得玩家代表色
const getPlayerColor = (playerId: string) => {
  return luckBoard.getPlayerColor(playerId)
}

// 取得當前玩家資訊
const currentPlayerInfo = computed(() => {
  if (!currentPlayer.value) return null
  return players.value.find(p => p.id === currentPlayer.value)
})
</script>

<template>
  <div class="luck-board-page">
    <div class="container">
      <!-- 標題列 -->
      <div class="header">
        <h1 class="title">🎄 幸運盤面 🎁</h1>
        <p class="subtitle">點擊格子，看看是禮物還是便便！</p>
      </div>

      <div class="game-layout">
        <!-- 左側：玩家選擇 -->
        <div class="left-panel">
          <div class="panel-card">
            <h2 class="panel-title">👥 選擇玩家</h2>
            <div class="current-player" v-if="currentPlayerInfo">
              <div class="current-badge" :style="{ backgroundColor: getPlayerColor(currentPlayer!) }">
                當前
              </div>
              <div class="player-name">{{ currentPlayerInfo.name }}</div>
            </div>
            <div class="current-player empty" v-else>
              <span>請選擇玩家</span>
            </div>
            
            <div class="players-list">
              <button
                v-for="(player, index) in players"
                :key="player.id"
                @click="selectPlayer(player.id)"
                :class="['player-btn', { active: currentPlayer === player.id }]"
                :style="{ borderColor: getPlayerColor(player.id) }"
              >
                <span class="player-number">{{ index + 1 }}</span>
                <div 
                  class="player-avatar"
                  :style="{ backgroundColor: getPlayerColor(player.id) }"
                >
                  {{ player.name.charAt(0) }}
                </div>
                <span class="player-label">{{ player.name }}</span>
                <span class="player-score">{{ gameStore.getScore(player.id) }}分</span>
              </button>
            </div>

            <div class="quick-tip">
              💡 快捷鍵：按 1-9 快速選擇玩家
            </div>
          </div>
        </div>

        <!-- 中間：盤面 -->
        <div class="center-panel">
          <GridBoard
            :current-player-id="currentPlayer"
            @cell-picked="handleCellPicked"
          />
          
          <!-- 控制按鈕 -->
          <div class="controls">
            <button @click="toggleXRay" class="control-btn">
              {{ luckBoard.isXRayMode.value ? '🔍 關閉透視' : '👁️ 透視模式' }}
            </button>
            <button @click="resetBoard" class="control-btn danger">
              🔄 重新洗牌
            </button>
            <button @click="stageRunner.goToLeaderboard" class="control-btn">
              🏆 排行榜
            </button>
            <button 
              v-if="gameStore.hasNextStage"
              @click="stageRunner.goToNextStage" 
              class="control-btn primary"
            >
              ▶️ 下一關
            </button>
          </div>
        </div>

        <!-- 右側：排行榜 -->
        <div class="right-panel">
          <div class="panel-card">
            <h2 class="panel-title">🏆 即時排行榜</h2>
            <div class="leaderboard">
              <div
                v-for="(player, index) in rankedPlayers"
                :key="player.id"
                class="rank-item"
              >
                <div class="rank-number" :class="{ top3: index < 3 }">
                  {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1 }}
                </div>
                <div 
                  class="rank-avatar"
                  :style="{ backgroundColor: getPlayerColor(player.id) }"
                >
                  {{ player.name.charAt(0) }}
                </div>
                <div class="rank-info">
                  <div class="rank-name">{{ player.name }}</div>
                  <div class="rank-hits">
                    🎁 {{ gameStore.state.round1Stats?.greenHits[player.id] || 0 }}
                  </div>
                </div>
                <div class="rank-score">{{ gameStore.getScore(player.id) }}</div>
              </div>
            </div>
          </div>

          <!-- 遊戲說明 -->
          <div class="panel-card help">
            <h3 class="help-title">📖 遊戲說明</h3>
            <ul class="help-list">
              <li>👆 選擇玩家後點擊格子</li>
              <li>🎁 綠格 +1 分</li>
              <li>💩 紅格不加分</li>
              <li>🔄 可重新洗牌重玩</li>
              <li>⌨️ Alt+V 透視模式（測試用）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.luck-board-page {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 標題 */
.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 遊戲佈局 */
.game-layout {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 1.5rem;
}

/* 面板卡片 */
.panel-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  color: white;
}

.panel-card + .panel-card {
  margin-top: 1rem;
}

.panel-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

/* 當前玩家 */
.current-player {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.current-player.empty {
  justify-content: center;
  opacity: 0.6;
}

.current-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
}

.player-name {
  font-size: 1.2rem;
  font-weight: bold;
}

/* 玩家列表 */
.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.player-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
}

.player-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.player-btn.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: currentColor;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.player-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: bold;
}

.player-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.player-label {
  flex: 1;
  font-weight: 500;
}

.player-score {
  font-weight: bold;
  font-size: 1.1rem;
  color: #fbbf24;
}

.quick-tip {
  font-size: 0.85rem;
  opacity: 0.7;
  text-align: center;
}

/* 中間面板 */
.center-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 控制按鈕 */
.controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.control-btn.primary {
  background: linear-gradient(135deg, #10b981, #059669);
}

.control-btn.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

/* 排行榜 */
.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s;
}

.rank-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.rank-number {
  font-size: 1.5rem;
  font-weight: bold;
  width: 36px;
  text-align: center;
}

.rank-number.top3 {
  font-size: 1.8rem;
}

.rank-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.rank-info {
  flex: 1;
}

.rank-name {
  font-weight: 600;
  font-size: 1rem;
}

.rank-hits {
  font-size: 0.85rem;
  opacity: 0.7;
}

.rank-score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fbbf24;
}

/* 幫助說明 */
.help {
  background: rgba(59, 130, 246, 0.1);
}

.help-title {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.help-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-list li {
  padding: 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 響應式 */
@media (max-width: 1200px) {
  .game-layout {
    grid-template-columns: 1fr;
  }
  
  .left-panel,
  .right-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .control-btn {
    width: 100%;
  }
}
</style>
