/**
 * 音效管理 Composable
 * 支援靜音、音量控制與預載
 */

export type SoundType = 'click' | 'hit' | 'miss' | 'correct' | 'reveal' | 'finish'

export const useAudio = () => {
  const audioCache = new Map<SoundType, HTMLAudioElement>()
  
  // 音效檔案路徑對應
  const soundPaths: Record<SoundType, string> = {
    click: '/sounds/click.mp3',
    hit: '/sounds/hit.mp3',
    miss: '/sounds/miss.mp3',
    correct: '/sounds/correct.mp3',
    reveal: '/sounds/reveal.mp3',
    finish: '/sounds/finish.mp3',
  }

  /**
   * 預載音效
   */
  const preload = (type: SoundType): void => {
    if (typeof window === 'undefined') return
    if (audioCache.has(type)) return

    try {
      const audio = new Audio(soundPaths[type])
      audio.preload = 'auto'
      audioCache.set(type, audio)
    } catch (error) {
      console.error(`[useAudio] Failed to preload ${type}:`, error)
    }
  }

  /**
   * 預載所有音效
   */
  const preloadAll = (): void => {
    Object.keys(soundPaths).forEach(type => preload(type as SoundType))
  }

  /**
   * 播放音效
   */
  const play = (type: SoundType, options?: { volume?: number; loop?: boolean }): void => {
    if (typeof window === 'undefined') return

    try {
      let audio = audioCache.get(type)
      
      // 如果沒有預載，即時建立
      if (!audio) {
        audio = new Audio(soundPaths[type])
        audioCache.set(type, audio)
      }

      // 重置播放位置
      audio.currentTime = 0
      
      // 設定音量
      if (options?.volume !== undefined) {
        audio.volume = Math.max(0, Math.min(1, options.volume))
      }
      
      // 設定循環
      audio.loop = options?.loop || false

      // 播放
      audio.play().catch(error => {
        console.error(`[useAudio] Failed to play ${type}:`, error)
      })
    } catch (error) {
      console.error(`[useAudio] Error playing ${type}:`, error)
    }
  }

  /**
   * 停止音效
   */
  const stop = (type: SoundType): void => {
    if (typeof window === 'undefined') return

    try {
      const audio = audioCache.get(type)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    } catch (error) {
      console.error(`[useAudio] Failed to stop ${type}:`, error)
    }
  }

  /**
   * 停止所有音效
   */
  const stopAll = (): void => {
    audioCache.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  /**
   * 設定全域音量
   */
  const setGlobalVolume = (volume: number): void => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    audioCache.forEach(audio => {
      audio.volume = clampedVolume
    })
  }

  /**
   * 清除快取
   */
  const clearCache = (): void => {
    stopAll()
    audioCache.clear()
  }

  return {
    preload,
    preloadAll,
    play,
    stop,
    stopAll,
    setGlobalVolume,
    clearCache,
  }
}
