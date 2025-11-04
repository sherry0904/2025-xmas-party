import type { GameConfig, GameState } from '~/types/game'

const NAMESPACE = 'xmasGame'

/**
 * LocalStorage 工具 Composable
 * 提供命名空間化的讀寫與快照功能
 */
export const useLocalStore = () => {
  /**
   * 取得完整 key
   */
  const getKey = (key: string): string => `${NAMESPACE}/${key}`

  /**
   * 讀取資料
   */
  const getItem = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    
    try {
      const fullKey = getKey(key)
      const data = localStorage.getItem(fullKey)
      if (!data) return defaultValue
      return JSON.parse(data) as T
    } catch (error) {
      console.error(`[useLocalStore] Failed to get ${key}:`, error)
      return defaultValue
    }
  }

  /**
   * 寫入資料
   */
  const setItem = <T>(key: string, value: T): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      const fullKey = getKey(key)
      localStorage.setItem(fullKey, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`[useLocalStore] Failed to set ${key}:`, error)
      // 可能是空間不足
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('LocalStorage 空間不足！請匯出資料後清除舊資料。')
      }
      return false
    }
  }

  /**
   * 刪除資料
   */
  const removeItem = (key: string): void => {
    if (typeof window === 'undefined') return
    
    try {
      const fullKey = getKey(key)
      localStorage.removeItem(fullKey)
    } catch (error) {
      console.error(`[useLocalStore] Failed to remove ${key}:`, error)
    }
  }

  /**
   * 清除所有命名空間下的資料
   */
  const clear = (): void => {
    if (typeof window === 'undefined') return
    
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(`${NAMESPACE}/`)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('[useLocalStore] Failed to clear:', error)
    }
  }

  /**
   * 取得設定
   */
  const getConfig = (): GameConfig | null => {
    return getItem<GameConfig | null>('config', null)
  }

  /**
   * 儲存設定
   */
  const setConfig = (config: GameConfig): boolean => {
    return setItem('config', config)
  }

  /**
   * 取得狀態
   */
  const getState = (): GameState | null => {
    return getItem<GameState | null>('state', null)
  }

  /**
   * 儲存狀態
   */
  const setState = (state: GameState): boolean => {
    return setItem('state', state)
  }

  /**
   * 建立快照（用於重要節點備份）
   */
  const createSnapshot = (label: string): boolean => {
    const config = getConfig()
    const state = getState()
    
    if (!config || !state) return false
    
    const timestamp = Date.now()
    const snapshotKey = `snapshots/${label}-${timestamp}`
    
    return setItem(snapshotKey, {
      label,
      timestamp,
      config,
      state,
    })
  }

  /**
   * 取得所有快照
   */
  const getSnapshots = (): Array<{ key: string; label: string; timestamp: number }> => {
    if (typeof window === 'undefined') return []
    
    try {
      const snapshots: Array<{ key: string; label: string; timestamp: number }> = []
      const keys = Object.keys(localStorage)
      
      keys.forEach(key => {
        if (key.startsWith(`${NAMESPACE}/snapshots/`)) {
          const data = localStorage.getItem(key)
          if (data) {
            const parsed = JSON.parse(data)
            snapshots.push({
              key: key.replace(`${NAMESPACE}/`, ''),
              label: parsed.label,
              timestamp: parsed.timestamp,
            })
          }
        }
      })
      
      return snapshots.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('[useLocalStore] Failed to get snapshots:', error)
      return []
    }
  }

  /**
   * 匯出為 JSON
   */
  const exportJSON = (): string => {
    const config = getConfig()
    const state = getState()
    
    return JSON.stringify({
      config,
      state,
      exportedAt: new Date().toISOString(),
    }, null, 2)
  }

  /**
   * 從 JSON 匯入
   */
  const importJSON = (json: string): boolean => {
    try {
      const data = JSON.parse(json)
      
      if (data.config) setConfig(data.config)
      if (data.state) setState(data.state)
      
      return true
    } catch (error) {
      console.error('[useLocalStore] Failed to import JSON:', error)
      return false
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    getConfig,
    setConfig,
    getState,
    setState,
    createSnapshot,
    getSnapshots,
    exportJSON,
    importJSON,
  }
}
