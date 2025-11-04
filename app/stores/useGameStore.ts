import { defineStore } from 'pinia'
import type { 
  GameConfig, 
  GameState, 
  Player, 
  PlayerId,
  LuckBoardConfig,
  FamiliarQuizConfig,
  ExpressionGuessConfig,
  VotesSummary,
  RevealMode,
} from '~/types/game'

/**
 * 預設設定
 */
const createDefaultConfig = (): GameConfig => ({
  players: [],
  stages: [],
  votes: { hardest: {}, easiest: {} },
  revealMode: 'suspense',
  sound: { on: true, volume: 0.8 },
  accessibility: { colorBlindMode: false },
})

/**
 * 預設狀態
 */
const createDefaultState = (): GameState => ({
  scores: {},
  currentStageIndex: 0,
  currentPlayerId: undefined,
  round1Stats: { greenHits: {} },
})

/**
 * 主要遊戲狀態 Store
 */
export const useGameStore = defineStore('game', {
  state: () => ({
    config: createDefaultConfig(),
    state: createDefaultState(),
  }),

  getters: {
    /**
     * 依分數排序的玩家列表
     */
    playersByScore(): Player[] {
      const { players } = this.config
      const { scores } = this.state
      
      return [...players].sort((a, b) => {
        const scoreA = scores[a.id] || 0
        const scoreB = scores[b.id] || 0
        
        // 分數高的在前
        if (scoreB !== scoreA) return scoreB - scoreA
        
        // 平手時，依 round1Stats 的 greenHits 決定
        const hitsA = this.state.round1Stats?.greenHits[a.id] || 0
        const hitsB = this.state.round1Stats?.greenHits[b.id] || 0
        return hitsB - hitsA
      })
    },

    /**
     * 當前關卡設定
     */
    currentStage(): LuckBoardConfig | FamiliarQuizConfig | ExpressionGuessConfig | undefined {
      return this.config.stages[this.state.currentStageIndex]
    },

    /**
     * 當前玩家
     */
    currentPlayer(): Player | undefined {
      if (!this.state.currentPlayerId) return undefined
      return this.config.players.find(p => p.id === this.state.currentPlayerId)
    },

    /**
     * 是否還有下一關
     */
    hasNextStage(): boolean {
      return this.state.currentStageIndex < this.config.stages.length - 1
    },

    /**
     * 已啟用的關卡
     */
    enabledStages(): (LuckBoardConfig | FamiliarQuizConfig | ExpressionGuessConfig)[] {
      return this.config.stages.filter(s => s.enabled)
    },

    /**
     * 取得玩家分數
     */
    getScore: (state) => (playerId: PlayerId): number => {
      return state.state.scores[playerId] || 0
    },
  },

  actions: {
    /**
     * 初始化（從 LocalStorage 載入或使用預設值）
     */
    initialize() {
      const localStore = useLocalStore()
      
      const savedConfig = localStore.getConfig()
      const savedState = localStore.getState()
      
      if (savedConfig) this.config = savedConfig
      if (savedState) this.state = savedState
      
      // 確保所有玩家都有初始分數
      this.config.players.forEach(player => {
        if (this.state.scores[player.id] === undefined) {
          this.state.scores[player.id] = 0
        }
      })
    },

    /**
     * 儲存到 LocalStorage
     */
    save() {
      const localStore = useLocalStore()
      localStore.setConfig(this.config)
      localStore.setState(this.state)
    },

    /**
     * 設定玩家列表
     */
    setPlayers(players: Player[]) {
      this.config.players = players
      
      // 初始化分數
      players.forEach(player => {
        if (this.state.scores[player.id] === undefined) {
          this.state.scores[player.id] = 0
        }
      })
      
      this.save()
    },

    /**
     * 新增玩家
     */
    addPlayer(player: Player) {
      this.config.players.push(player)
      this.state.scores[player.id] = 0
      this.save()
    },

    /**
     * 移除玩家
     */
    removePlayer(playerId: PlayerId) {
      this.config.players = this.config.players.filter(p => p.id !== playerId)
      delete this.state.scores[playerId]
      this.save()
    },

    /**
     * 設定當前玩家
     */
    setCurrentPlayer(playerId: PlayerId) {
      this.state.currentPlayerId = playerId
      this.save()
    },

    /**
     * 加分
     */
    addScore(playerId: PlayerId, delta = 1) {
      this.state.scores[playerId] = (this.state.scores[playerId] || 0) + delta
      this.save()
    },

    /**
     * 設定分數
     */
    setScore(playerId: PlayerId, score: number) {
      this.state.scores[playerId] = score
      this.save()
    },

    /**
     * 進入下一關
     */
    nextStage() {
      if (this.hasNextStage) {
        // 建立快照
        const localStore = useLocalStore()
        const currentStage = this.currentStage
        if (currentStage) {
          localStore.createSnapshot(`before-${currentStage.kind}-${Date.now()}`)
        }
        
        this.state.currentStageIndex++
        this.state.currentPlayerId = undefined // 重置當前玩家
        this.save()
      }
    },

    /**
     * 跳到指定關卡
     */
    goToStage(index: number) {
      if (index >= 0 && index < this.config.stages.length) {
        this.state.currentStageIndex = index
        this.state.currentPlayerId = undefined
        this.save()
      }
    },

    /**
     * 套用投票結果
     */
    applyVotes() {
      const { hardest, easiest } = this.config.votes
      
      // 最難送：每票 -1 分
      for (const playerId in hardest) {
        const votes = hardest[playerId]
        if (votes > 0) {
          this.addScore(playerId, -votes)
        }
      }
      
      // 最好送：每票 +1 分
      for (const playerId in easiest) {
        const votes = easiest[playerId]
        if (votes > 0) {
          this.addScore(playerId, votes)
        }
      }
      
      this.save()
    },

    /**
     * 設定投票結果
     */
    setVotes(votes: VotesSummary) {
      this.config.votes = votes
      this.save()
    },

    /**
     * 設定投票揭曉模式
     */
    setRevealMode(mode: RevealMode) {
      this.config.revealMode = mode
      this.save()
    },

    /**
     * 設定音效
     */
    setSoundConfig(on: boolean, volume?: number) {
      this.config.sound.on = on
      if (volume !== undefined) {
        this.config.sound.volume = Math.max(0, Math.min(1, volume))
      }
      this.save()
    },

    /**
     * 設定色弱模式
     */
    setColorBlindMode(enabled: boolean) {
      this.config.accessibility.colorBlindMode = enabled
      this.save()
    },

    /**
     * 重置遊戲
     */
    reset() {
      this.config = createDefaultConfig()
      this.state = createDefaultState()
      this.save()
    },

    /**
     * 建立快照
     */
    snapshot(label: string) {
      const localStore = useLocalStore()
      localStore.createSnapshot(label)
    },

    /**
     * 記錄 Luck Board 綠格命中（用於平手判定）
     */
    recordGreenHit(playerId: PlayerId) {
      if (!this.state.round1Stats) {
        this.state.round1Stats = { greenHits: {} }
      }
      
      const current = this.state.round1Stats.greenHits[playerId] || 0
      this.state.round1Stats.greenHits[playerId] = current + 1
      this.save()
    },
  },
})
