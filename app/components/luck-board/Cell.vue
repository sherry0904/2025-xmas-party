<script setup lang="ts">
import type { PlayerId } from '~/types/game'

const props = defineProps<{
  cellId: number
  coordinate: string
  isPicked: boolean
  isGreen: boolean
  pickedBy: PlayerId | null
  playerColor?: string
  playerName?: string
  isXRayMode: boolean
}>()

const emit = defineEmits<{
  pick: [cellId: number]
}>()

const isFlipping = ref(false)

const handleClick = () => {
  if (props.isPicked) return
  
  isFlipping.value = true
  emit('pick', props.cellId)
  
  // 動畫結束後重置
  setTimeout(() => {
    isFlipping.value = false
  }, 600)
}

// 格子樣式
const cellClass = computed(() => {
  const classes = ['cell']
  
  if (props.isPicked) {
    classes.push('picked')
    classes.push(props.isGreen ? 'green' : 'red')
  } else {
    classes.push('unpicked')
  }
  
  if (isFlipping.value) {
    classes.push('flipping')
  }
  
  return classes.join(' ')
})
</script>

<template>
  <div 
    :class="cellClass"
    @click="handleClick"
    :title="coordinate"
  >
    <!-- 未抽取狀態 -->
    <div v-if="!isPicked" class="cell-content mystery">
      <div class="mystery-icon">🎁</div>
      <div class="mystery-question">?</div>
      <div class="coordinate-hint">{{ coordinate }}</div>
    </div>
    
    <!-- 已抽取（綠格）- 禮物 -->
    <div v-else-if="isPicked && isGreen" class="cell-content gift">
      <div class="gift-icon animate-bounce">🎁</div>
      <div class="sparkles">
        <span class="sparkle">✨</span>
        <span class="sparkle">✨</span>
        <span class="sparkle">✨</span>
      </div>
      <div class="player-badge" :style="{ backgroundColor: playerColor }">
        {{ playerName }}
      </div>
      <div class="score-popup">+1</div>
    </div>
    
    <!-- 已抽取（紅格）- 便便 -->
    <div v-else-if="isPicked && !isGreen" class="cell-content poop">
      <div class="poop-icon animate-shake">💩</div>
      <div class="player-badge" :style="{ backgroundColor: playerColor, opacity: 0.8 }">
        {{ playerName }}
      </div>
    </div>
    
    <!-- 透視模式提示 -->
    <div v-if="isXRayMode && !isPicked" class="xray-hint">
      {{ isGreen ? '🎁' : '💩' }}
    </div>
  </div>
</template>

<style scoped>
.cell {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 未抽取狀態 */
.cell.unpicked {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.cell.unpicked:hover {
  transform: scale(1.05);
  border-color: rgba(255, 215, 0, 0.8);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

/* 已抽取狀態 */
.cell.picked {
  cursor: default;
  transform: scale(0.98);
}

.cell.green {
  background: linear-gradient(135deg, #10b981, #059669);
  border: 2px solid #34d399;
  animation: glow-green 2s ease-in-out infinite;
}

.cell.red {
  background: linear-gradient(135deg, #8b4513, #654321);
  border: 2px solid #a0522d;
}

/* 翻轉動畫 */
.cell.flipping {
  animation: flip 0.6s ease-in-out;
}

@keyframes flip {
  0% { transform: rotateY(0deg) scale(1); }
  50% { transform: rotateY(90deg) scale(1.2); }
  100% { transform: rotateY(180deg) scale(1); }
}

/* 綠格發光動畫 */
@keyframes glow-green {
  0%, 100% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
  50% { box-shadow: 0 0 25px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.4); }
}

/* 格子內容 */
.cell-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

/* 神秘盒子 */
.mystery {
  position: relative;
}

.mystery-icon {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.mystery-question {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: -10px;
}

.coordinate-hint {
  position: absolute;
  bottom: 4px;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.cell:hover .coordinate-hint {
  opacity: 0.8;
}

/* 禮物 */
.gift-icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
}

.sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1.5rem;
  animation: sparkle 1.5s ease-in-out infinite;
}

.sparkle:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.sparkle:nth-child(2) {
  top: 10%;
  right: 10%;
  animation-delay: 0.5s;
}

.sparkle:nth-child(3) {
  bottom: 10%;
  left: 50%;
  animation-delay: 1s;
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
}

/* 便便 */
.poop-icon {
  font-size: 3rem;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px) rotate(-5deg); }
  75% { transform: translateX(10px) rotate(5deg); }
}

/* 玩家徽章 */
.player-badge {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 加分動畫 */
.score-popup {
  position: absolute;
  top: 10%;
  right: 10%;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
  animation: popup 1s ease-out;
  pointer-events: none;
}

@keyframes popup {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
  }
}

/* 透視模式提示 */
.xray-hint {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 1rem;
  opacity: 0.6;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .mystery-icon,
  .gift-icon,
  .poop-icon {
    font-size: 2rem;
  }
  
  .player-badge {
    font-size: 0.6rem;
    padding: 1px 6px;
  }
}
</style>
