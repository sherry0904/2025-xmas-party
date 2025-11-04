<script setup lang="ts">
import type { PlayerId } from '~/types/game'

const props = defineProps<{
  currentPlayerId?: PlayerId | null
}>()

const emit = defineEmits<{
  cellPicked: [cellId: number, playerId: PlayerId]
}>()

const gameStore = useGameStore()
const luckBoard = useLuckBoard()
const audio = useAudio()

// 初始化盤面
onMounted(() => {
  if (luckBoard.board.value.length === 0) {
    luckBoard.generateBoard()
  }
})

// 處理格子點擊
const handleCellPick = (cellId: number) => {
  if (!props.currentPlayerId) {
    alert('請先選擇當前玩家！')
    return
  }
  
  const cell = luckBoard.board.value.find(c => c.id === cellId)
  if (!cell || cell.pickedBy !== null) {
    return // 已被抽過
  }
  
  // 播放點擊音效
  audio.play('click', { volume: gameStore.config.sound.volume })
  
  // 抽取格子
  const success = luckBoard.pickCell(cellId, props.currentPlayerId)
  
  if (success) {
    // 延遲播放結果音效（等待翻牌動畫）
    setTimeout(() => {
      if (cell.type === 'G') {
        audio.play('hit', { volume: gameStore.config.sound.volume })
      } else {
        audio.play('miss', { volume: gameStore.config.sound.volume })
      }
    }, 300)
    
    emit('cellPicked', cellId, props.currentPlayerId)
  }
}

// 取得玩家資訊
const getPlayerInfo = (playerId: PlayerId | null) => {
  if (!playerId) return { name: '', color: '' }
  
  const player = gameStore.config.players.find(p => p.id === playerId)
  return {
    name: player?.name || '',
    color: luckBoard.getPlayerColor(playerId),
  }
}
</script>

<template>
  <div class="grid-board-container">
    <!-- 統計資訊 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">已抽取：</span>
        <span class="stat-value">{{ luckBoard.getStats().picked }} / {{ luckBoard.getStats().total }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">進度：</span>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${luckBoard.getStats().progress}%` }"
          ></div>
        </div>
        <span class="stat-value">{{ luckBoard.getStats().progress }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">🎁 {{ luckBoard.getStats().greenPicked }}</span>
        <span class="stat-label">💩 {{ luckBoard.getStats().redPicked }}</span>
      </div>
    </div>
    
    <!-- 盤面主體 -->
    <div class="board-wrapper">
      <!-- 列標籤（上方：1-6） -->
      <div class="col-labels">
        <div class="corner-cell"></div>
        <div 
          v-for="col in luckBoard.colLabels" 
          :key="col"
          class="col-label"
        >
          {{ col }}
        </div>
      </div>
      
      <!-- 盤面網格 -->
      <div class="board-grid">
        <!-- 行標籤（左側：A-J） -->
        <div class="row-labels">
          <div 
            v-for="row in luckBoard.rowLabels" 
            :key="row"
            class="row-label"
          >
            {{ row }}
          </div>
        </div>
        
        <!-- 格子陣列 -->
        <div class="cells-grid">
          <Cell
            v-for="cell in luckBoard.board.value"
            :key="cell.id"
            :cell-id="cell.id"
            :coordinate="luckBoard.getCellCoordinate(cell.id)"
            :is-picked="cell.pickedBy !== null"
            :is-green="cell.type === 'G'"
            :picked-by="cell.pickedBy"
            :player-color="cell.pickedBy ? getPlayerInfo(cell.pickedBy).color : ''"
            :player-name="cell.pickedBy ? getPlayerInfo(cell.pickedBy).name : ''"
            :is-x-ray-mode="luckBoard.isXRayMode.value"
            @pick="handleCellPick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-board-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* 統計資訊列 */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-bottom: 1rem;
  color: white;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: bold;
}

.progress-bar {
  width: 120px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #fbbf24);
  transition: width 0.5s ease;
}

/* 盤面主體 */
.board-wrapper {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* 列標籤（上方） */
.col-labels {
  display: grid;
  grid-template-columns: 40px repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.corner-cell {
  width: 40px;
}

.col-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 盤面網格 */
.board-grid {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 8px;
}

/* 行標籤（左側） */
.row-labels {
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  gap: 8px;
}

.row-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 格子網格 */
.cells-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 8px;
  aspect-ratio: 6 / 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .stats-bar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .board-wrapper {
    padding: 1rem;
  }
  
  .col-labels,
  .board-grid {
    gap: 4px;
  }
  
  .cells-grid {
    gap: 4px;
  }
  
  .col-label,
  .row-label {
    font-size: 1rem;
  }
  
  .corner-cell,
  .row-labels {
    width: 30px;
  }
  
  .col-labels {
    grid-template-columns: 30px repeat(6, 1fr);
  }
  
  .board-grid {
    grid-template-columns: 30px 1fr;
  }
}

@media (max-width: 480px) {
  .stats-bar {
    font-size: 0.85rem;
  }
  
  .progress-bar {
    width: 80px;
  }
  
  .col-label,
  .row-label {
    font-size: 0.9rem;
  }
}
</style>
