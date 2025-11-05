<script setup lang="ts">
const gameStore = useGameStore()
const router = useRouter()
const players = computed(() => gameStore.config.players)
const getAvatarUrl = (player) => {
  // 使用 game-config.json 中指定的 avatar 檔名（放在 public/images/players/），沒有則回傳 default
  if (player && player.avatar) return `/images/players/${player.avatar}`
  return defaultAvatar
}
const defaultAvatar = '/images/players/default-avatar.svg'
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="manage-page">
    <div class="container">
      <!-- 標題列 -->
      <div class="header">
        <button @click="goHome" class="back-btn">← 返回首頁</button>
        <h1 class="title">⚙️ 遊戲管理</h1>
      </div>

      <!-- 玩家管理區（只顯示，不可編輯） -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">👥 玩家管理</h2>
        </div>

        <div class="players-list">
          <div v-if="players.length === 0" class="empty-state">
            <p class="empty-icon">👥</p>
            <p class="empty-text">尚未新增任何玩家</p>
            <p class="empty-hint">請在 public/game-config.json 編輯玩家資料</p>
          </div>

          <div v-else class="players-grid">
            <div
              v-for="player in players"
              :key="player.id"
              class="player-card"
              :style="{ borderColor: player.color }"
            >
              <div class="player-avatar" :style="{ backgroundColor: player.color + '20' }">
                <img
                  :src="getAvatarUrl(player)"
                  @error="(e) => e.target.src = defaultAvatar"
                  alt="頭像"
                  class="avatar-img"
                />
              </div>
              <div class="player-info">
                <h3 class="player-name">{{ player.name }}</h3>
                <p class="player-score">得分：{{ gameStore.state.scores[player.id] || 0 }} 分</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 音效設定區 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">🔊 音效設定</h2>
        </div>

        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <input
                v-model="gameStore.config.sound.enabled"
                type="checkbox"
                @change="gameStore.save()"
              />
              <span>啟用音效</span>
            </label>
          </div>

          <div class="setting-item">
            <label class="setting-label">音量大小</label>
            <input
              v-model="gameStore.config.sound.volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="volume-slider"
              @change="gameStore.save()"
            />
            <span class="volume-value">{{ Math.round(gameStore.config.sound.volume * 100) }}%</span>
          </div>
        </div>
      </div>

      <!-- 色弱模式設定 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">♿ 無障礙設定</h2>
        </div>

        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <input
                v-model="gameStore.config.colorblindMode"
                type="checkbox"
                @change="gameStore.save()"
              />
              <span>色弱模式（增加圖案辨識）</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manage-page {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 標題列 */
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

/* 區塊 */
.section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.add-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

/* 編輯表單 */
.edit-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* 頭像選擇器 */
.avatar-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
  gap: 0.5rem;
}

.avatar-option {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar-option:hover {
  background: rgba(255, 255, 255, 0.2);
}

.avatar-option.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.2);
}

/* 顏色選擇器 */
.color-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
  gap: 0.5rem;
}

.color-option {
  width: 3rem;
  height: 3rem;
  border: 3px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: white;
  box-shadow: 0 0 0 2px currentColor;
}

.check {
  font-size: 1.25rem;
}

/* 預覽 */
.form-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.preview-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.player-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid;
  border-radius: 0.5rem;
}

.preview-avatar {
  font-size: 1.5rem;
}

.preview-name {
  color: white;
  font-weight: 600;
}

/* 表單按鈕 */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 玩家列表 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-hint {
  font-size: 0.875rem;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.player-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

.player-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.player-avatar {
  width: 3rem; /* 48px */
  height: 3rem;
  display: block;
  flex: 0 0 3rem;
  border-radius: 9999px; /* circle */
  overflow: hidden; /* crop to circle */
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-info {
  flex: 1;
}

.avatar-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* center-crop */
  object-position: center center;
}

.player-name {
  color: white;
  font-weight: bold;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.player-score {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.player-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.3);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

/* 設定區 */
.settings-grid {
  display: grid;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.setting-label input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.volume-slider {
  flex: 1;
  max-width: 300px;
}

.volume-value {
  color: white;
  font-weight: 600;
  min-width: 3rem;
}

/* 響應式 */
@media (max-width: 768px) {
  .manage-page {
    padding: 1rem 0.5rem;
  }

  .section {
    padding: 1.5rem 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .players-grid {
    grid-template-columns: 1fr;
  }

  .player-avatar {
    width: 2.5rem; /* 40px */
    height: 2.5rem;
    flex: 0 0 2.5rem;
  }

  .avatar-selector,
  .color-selector {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
