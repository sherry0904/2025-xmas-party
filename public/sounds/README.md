# 音效檔案說明

此目錄存放遊戲所需的音效檔案。請準備以下 MP3 格式的音效：

## 必要音效

1. **click.mp3** - 點擊格子音效
   - 用於：Luck Board 點擊格子時
   - 建議：短促的點擊聲（如按鈕音效）
   - 免費來源：https://freesound.org/search/?q=click

2. **hit.mp3** - 命中音效
   - 用於：Luck Board 抽中綠格（得分）
   - 建議：愉悅的成功音效（如叮咚聲、歡呼聲）
   - 免費來源：https://freesound.org/search/?q=success

3. **miss.mp3** - 落空音效
   - 用於：Luck Board 抽中紅格（不得分）
   - 建議：失望音效（如嘆氣聲、咚的一聲）
   - 免費來源：https://freesound.org/search/?q=fail

4. **correct.mp3** - 答對音效
   - 用於：Quiz 答對題目時
   - 建議：正確提示音（如叮、鈴聲）
   - 免費來源：https://freesound.org/search/?q=correct

5. **reveal.mp3** - 揭曉音效
   - 用於：投票結果逐人揭曉時
   - 建議：懸念音效（如鼓聲、開箱聲）
   - 免費來源：https://freesound.org/search/?q=drum+roll

6. **finish.mp3** - 結束音效
   - 用於：關卡完成、遊戲結束
   - 建議：勝利音效（如喇叭聲、掌聲）
   - 免費來源：https://freesound.org/search/?q=applause

## 📥 推薦免費音效網站

### 1. Freesound.org ⭐ 推薦
- 網址：https://freesound.org
- 特色：最大的免費音效庫，需註冊
- 授權：CC0 或 CC BY（注意授權條款）

### 2. Zapsplat
- 網址：https://www.zapsplat.com
- 特色：高品質音效，需註冊
- 授權：免費個人使用

### 3. Mixkit
- 網址：https://mixkit.co/free-sound-effects/
- 特色：不需註冊，直接下載
- 授權：免費商業使用

### 4. Pixabay Music
- 網址：https://pixabay.com/sound-effects/
- 特色：免註冊，CC0 授權
- 授權：完全免費

## 🎵 快速取得音效方案

### 方案 A：使用 Freesound.org（推薦）
```bash
# 推薦關鍵字搜尋：
click → "ui click"
hit → "success bell" 或 "ding"
miss → "fail" 或 "wrong"
correct → "correct answer"
reveal → "drum roll"
finish → "victory" 或 "applause"
```

### 方案 B：使用瀏覽器內建音效（測試用）
如果暫時沒有音效檔案，可以先關閉音效功能，遊戲仍可正常運作。

## 音效規格建議

- **格式**：MP3（瀏覽器相容性最好）
- **時長**：0.5-2 秒（短促為佳）
- **音量**：-3dB 至 -6dB（避免過大）
- **取樣率**：44.1kHz 或 48kHz
- **位元率**：128-192 kbps

## 💡 臨時替代方案

如果暫時沒有音效檔案：

1. **關閉音效**
   - 在首頁載入假資料後
   - 音效預設為開啟，可在管理頁面關閉

2. **使用靜音播放**
   - 遊戲會嘗試播放音效
   - 找不到檔案時會自動忽略錯誤

3. **製作簡單音效**
   - 使用線上工具：https://www.beepbox.co
   - 錄製自己的聲音
   - 使用手機 App 製作

## 📂 檔案放置方式

下載音效後，直接放入此目錄：

```
public/sounds/
├── click.mp3    ← 放這裡
├── hit.mp3      ← 放這裡
├── miss.mp3     ← 放這裡
├── correct.mp3  ← 放這裡
├── reveal.mp3   ← 放這裡
└── finish.mp3   ← 放這裡
```

放入後**不需要重啟伺服器**，重新整理頁面即可。

## 🔊 測試音效

在 Luck Board 頁面：
1. 載入假資料
2. 選擇玩家
3. 點擊格子
4. 應該會聽到 click → hit/miss 音效

## ⚙️ 調整音效設定

在管理頁面（尚未實作）或直接在瀏覽器 console 執行：

```javascript
// 關閉音效
const gameStore = useGameStore()
gameStore.setSoundConfig(false)

// 開啟音效並設定音量（0-1）
gameStore.setSoundConfig(true, 0.5)
```

## 實作注意事項

音效由 `composables/useAudio.ts` 管理，支援：
- ✅ 預載所有音效（減少延遲）
- ✅ 音量控制
- ✅ 靜音開關
- ✅ 循環播放（如背景音樂）
- ✅ 錯誤處理（檔案不存在時不會中斷遊戲）

---

**提示**：目前系統已經整合音效功能，只缺實際的音效檔案。遊戲可以在沒有音效的情況下正常運作！
