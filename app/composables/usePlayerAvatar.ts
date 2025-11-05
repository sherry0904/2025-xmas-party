/**
 * 玩家頭像處理
 * 支援：
 * 1. Emoji（直接使用）
 * 2. 圖片檔名（從 /images/players/ 載入）
 * 3. 預設圖片（找不到時使用）
 */

export const usePlayerAvatar = () => {
  /**
   * 判斷是否為 emoji
   */
  const isEmoji = (str: string): boolean => {
    // 簡單判斷：emoji 通常是 1-2 個字元，且包含特殊 Unicode 字元
    if (!str) return false
    if (str.length > 4) return false
    
    // 常見 emoji Unicode 範圍
    const emojiRanges = [
      /[\u{1F300}-\u{1F9FF}]/u,  // 表情符號和象形文字
      /[\u{2600}-\u{26FF}]/u,    // 雜項符號
      /[\u{2700}-\u{27BF}]/u,    // 裝飾符號
    ]
    
    return emojiRanges.some(range => range.test(str))
  }

  /**
   * 取得頭像 URL 或 emoji
   * @param avatar - 頭像字串（emoji 或檔名）
   * @returns { type: 'emoji' | 'image', value: string }
   */
  const getAvatarInfo = (avatar: string): { type: 'emoji' | 'image'; value: string } => {
    if (!avatar) {
      return { type: 'image', value: '/images/players/default.jpg' }
    }

    if (isEmoji(avatar)) {
      return { type: 'emoji', value: avatar }
    }

    // 圖片檔案
    return {
      type: 'image',
      value: `/images/players/${avatar}`
    }
  }

  /**
   * 處理圖片載入失敗，使用預設圖片
   */
  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    if (img.src !== '/images/players/default.jpg') {
      console.warn(`頭像圖片載入失敗: ${img.src}，使用預設圖片`)
      img.src = '/images/players/default.jpg'
    }
  }

  return {
    isEmoji,
    getAvatarInfo,
    handleImageError
  }
}
