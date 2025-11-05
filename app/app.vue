<script setup lang="ts">
import { onMounted } from 'vue'

// 讓應用啟動時就載入靜態設定
const gameStore = useGameStore()
// 預載音效
const audio = useAudio()

onMounted(() => {
  // 初始化遊戲設定（從 public/game-config.json）
  gameStore.initialize()
  // 預載音效檔
  audio.preloadAll()
})

// 產生雪花陣列
const snowflakes = Array.from({ length: 20 }, (_, i) => i + 1)
</script>

<template>
  <div class="app-container">
    <!-- 背景裝飾 -->
    <div class="background-wrapper">
      <!-- 聖誕雪花動畫 -->
      <div class="snowflakes" aria-hidden="true">
        <div 
          v-for="i in snowflakes" 
          :key="i" 
          class="snowflake"
        >
          ❅
        </div>
      </div>
      
      <!-- 漸層背景 -->
      <div class="gradient-bg"></div>
    </div>
    
    <!-- 主要內容 -->
    <div class="content-wrapper">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </div>
  </div>
</template>

<style>
/* 全域樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft JhengHei', 'PingFang TC', 'Noto Sans TC', sans-serif;
  overflow-x: hidden;
}

.app-container {
  position: relative;
  min-height: 100vh;
}

/* 背景層 */
.background-wrapper {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

/* 現代化漸層背景 */
.gradient-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, 
      #0f172a 0%,
      #1e293b 25%,
      #334155 50%,
      #1e293b 75%,
      #0f172a 100%
    );
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* 雪花容器 */
.snowflakes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 雪花樣式 */
.snowflake {
  position: absolute;
  top: -10%;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.5rem;
  animation: snowfall linear infinite;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* 為每個雪花設定不同的動畫參數 */
.snowflake:nth-child(1) { left: 5%; animation-duration: 12s; animation-delay: 0s; }
.snowflake:nth-child(2) { left: 15%; animation-duration: 15s; animation-delay: 2s; font-size: 1.2rem; }
.snowflake:nth-child(3) { left: 25%; animation-duration: 10s; animation-delay: 4s; font-size: 1.8rem; }
.snowflake:nth-child(4) { left: 35%; animation-duration: 14s; animation-delay: 1s; }
.snowflake:nth-child(5) { left: 45%; animation-duration: 11s; animation-delay: 3s; font-size: 1.4rem; }
.snowflake:nth-child(6) { left: 55%; animation-duration: 13s; animation-delay: 5s; }
.snowflake:nth-child(7) { left: 65%; animation-duration: 16s; animation-delay: 2s; font-size: 1.6rem; }
.snowflake:nth-child(8) { left: 75%; animation-duration: 12s; animation-delay: 4s; }
.snowflake:nth-child(9) { left: 85%; animation-duration: 14s; animation-delay: 1s; font-size: 1.3rem; }
.snowflake:nth-child(10) { left: 95%; animation-duration: 11s; animation-delay: 3s; }
.snowflake:nth-child(11) { left: 10%; animation-duration: 15s; animation-delay: 5s; font-size: 1.7rem; }
.snowflake:nth-child(12) { left: 20%; animation-duration: 13s; animation-delay: 2s; }
.snowflake:nth-child(13) { left: 30%; animation-duration: 12s; animation-delay: 4s; font-size: 1.5rem; }
.snowflake:nth-child(14) { left: 40%; animation-duration: 14s; animation-delay: 1s; }
.snowflake:nth-child(15) { left: 50%; animation-duration: 16s; animation-delay: 3s; font-size: 1.2rem; }
.snowflake:nth-child(16) { left: 60%; animation-duration: 11s; animation-delay: 5s; }
.snowflake:nth-child(17) { left: 70%; animation-duration: 13s; animation-delay: 2s; font-size: 1.9rem; }
.snowflake:nth-child(18) { left: 80%; animation-duration: 15s; animation-delay: 4s; }
.snowflake:nth-child(19) { left: 90%; animation-duration: 12s; animation-delay: 1s; font-size: 1.4rem; }
.snowflake:nth-child(20) { left: 8%; animation-duration: 14s; animation-delay: 3s; }

@keyframes snowfall {
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) translateX(50px) rotate(360deg);
    opacity: 0;
  }
}

/* 內容層 */
.content-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

/* 色弱模式樣式 */
.colorblind-mode {
  filter: grayscale(30%);
}

/* 滾動條樣式 */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.5);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}
</style>
