<script setup lang="ts">
// 初始化遊戲 Store
const gameStore = useGameStore()

onMounted(() => {
  // 從 LocalStorage 載入狀態
  gameStore.initialize()
  
  // 預載音效
  const audio = useAudio()
  audio.preloadAll()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-900 via-red-900 to-green-800">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
/* 全域樣式 */
body {
  font-family: 'Microsoft JhengHei', 'PingFang TC', 'Noto Sans TC', sans-serif;
}

/* 色弱模式樣式（可依需求調整） */
.colorblind-mode {
  filter: grayscale(30%);
}
</style>
