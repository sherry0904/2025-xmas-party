import type { LuckBoardCell, PlayerId } from '~/types/game'

/**
 * Luck Board 盤面管理 Composable
 */
export const useLuckBoard = () => {
  const gameStore = useGameStore()
  
  // 盤面配置
  const ROWS = 10 // A-J
  const COLS = 6  // 1-6
  const TOTAL_CELLS = ROWS * COLS
  
  // 行標籤 A-J
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  
  // 列標籤 1-6
  const colLabels = [1, 2, 3, 4, 5, 6]
  
  // 盤面狀態
  const board = ref<LuckBoardCell[]>([])
  const isXRayMode = ref(false) // 透視模式
  
  /**
   * 產生隨機盤面（綠紅比例 1:1）
   */
  const generateBoard = () => {
    const cells: LuckBoardCell[] = []
    const greenCount = Math.floor(TOTAL_CELLS / 2)
    
    // 建立格子陣列：一半綠、一半紅
    for (let i = 0; i < TOTAL_CELLS; i++) {
      cells.push({
        id: i,
        type: i < greenCount ? 'G' : 'R',
        pickedBy: null,
      })
    }
    
    // Fisher-Yates 洗牌演算法
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cells[i], cells[j]] = [cells[j], cells[i]]
    }
    
    // 重新指定 id（確保順序）
    cells.forEach((cell, index) => {
      cell.id = index
    })
    
    board.value = cells
  }
  
  /**
   * 取得格子座標（例如：B3）
   */
  const getCellCoordinate = (cellId: number): string => {
    const row = Math.floor(cellId / COLS)
    const col = cellId % COLS
    return `${rowLabels[row]}${colLabels[col]}`
  }
  
  /**
   * 點擊格子
   */
  const pickCell = (cellId: number, playerId: PlayerId) => {
    const cell = board.value.find(c => c.id === cellId)
    
    if (!cell || cell.pickedBy !== null) {
      return false // 已被抽過
    }
    
    // 標記為已抽
    cell.pickedBy = playerId
    
    // 如果是綠格，加分
    if (cell.type === 'G') {
      gameStore.addScore(playerId, 1)
      gameStore.recordGreenHit(playerId) // 記錄綠格命中（用於平手判定）
    }
    
    return true
  }
  
  /**
   * 取得格子狀態
   */
  const getCellStatus = (cellId: number) => {
    const cell = board.value.find(c => c.id === cellId)
    if (!cell) return null
    
    return {
      isPicked: cell.pickedBy !== null,
      isGreen: cell.type === 'G',
      pickedBy: cell.pickedBy,
      coordinate: getCellCoordinate(cellId),
    }
  }
  
  /**
   * 切換透視模式
   */
  const toggleXRayMode = () => {
    isXRayMode.value = !isXRayMode.value
  }
  
  /**
   * 重置盤面
   */
  const resetBoard = () => {
    generateBoard()
  }
  
  /**
   * 取得統計資訊
   */
  const getStats = () => {
    const picked = board.value.filter(c => c.pickedBy !== null).length
    const remaining = TOTAL_CELLS - picked
    const greenPicked = board.value.filter(c => c.type === 'G' && c.pickedBy !== null).length
    const redPicked = board.value.filter(c => c.type === 'R' && c.pickedBy !== null).length
    
    return {
      total: TOTAL_CELLS,
      picked,
      remaining,
      greenPicked,
      redPicked,
      progress: Math.round((picked / TOTAL_CELLS) * 100),
    }
  }
  
  /**
   * 取得玩家顏色
   */
  const getPlayerColor = (playerId: PlayerId): string => {
    const player = gameStore.config.players.find(p => p.id === playerId)
    if (!player) return '#gray'
    
    // 預設聖誕配色
    const colors = [
      '#DC2626', // 紅
      '#16A34A', // 綠
      '#F59E0B', // 金
      '#2563EB', // 藍
      '#9333EA', // 紫
      '#EA580C', // 橙
      '#EC4899', // 粉
      '#F3F4F6', // 白
    ]
    
    const index = gameStore.config.players.findIndex(p => p.id === playerId)
    return colors[index % colors.length]
  }
  
  return {
    board,
    isXRayMode,
    rowLabels,
    colLabels,
    ROWS,
    COLS,
    generateBoard,
    getCellCoordinate,
    pickCell,
    getCellStatus,
    toggleXRayMode,
    resetBoard,
    getStats,
    getPlayerColor,
  }
}
