import type { StageKind } from '~/types/game'

/**
 * 關卡導航與流程控制 Composable
 */
export const useStageRunner = () => {
  const gameStore = useGameStore()
  const router = useRouter()

  /**
   * 關卡種類對應的路由路徑
   */
  const stageRoutes: Record<StageKind, string> = {
    'luck-board': '/game/luck-board',
    'familiar-quiz': '/game/familiar-quiz',
    'expression-guess': '/game/expression-guess',
  }

  /**
   * 前往當前關卡
   */
  const goToCurrentStage = () => {
    const stage = gameStore.currentStage
    
    if (!stage) {
      // 沒有關卡，前往排行榜
      router.push('/leaderboard')
      return
    }

    if (!stage.enabled) {
      // 關卡未啟用，跳到下一關
      gameStore.nextStage()
      goToCurrentStage()
      return
    }

    const route = stageRoutes[stage.kind]
    if (route) {
      router.push(route)
    }
  }

  /**
   * 前往下一關
   */
  const goToNextStage = () => {
    if (gameStore.hasNextStage) {
      gameStore.nextStage()
      goToCurrentStage()
    } else {
      // 遊戲結束，前往排行榜
      router.push('/leaderboard')
    }
  }

  /**
   * 前往指定關卡
   */
  const goToStage = (index: number) => {
    gameStore.goToStage(index)
    goToCurrentStage()
  }

  /**
   * 前往首頁
   */
  const goToHome = () => {
    router.push('/')
  }

  /**
   * 前往排行榜
   */
  const goToLeaderboard = () => {
    router.push('/leaderboard')
  }

  /**
   * 前往管理頁面
   */
  const goToManage = () => {
    router.push('/manage')
  }

  /**
   * 前往主持人分數頁
   */
  const goToHostScore = () => {
    router.push('/host/score')
  }

  /**
   * 前往投票揭曉頁
   */
  const goToVotes = () => {
    router.push('/votes')
  }

  /**
   * 取得當前關卡資訊
   */
  const getCurrentStageInfo = () => {
    const stage = gameStore.currentStage
    const totalStages = gameStore.enabledStages.length
    const currentIndex = gameStore.state.currentStageIndex + 1

    return {
      stage,
      currentIndex,
      totalStages,
      hasNext: gameStore.hasNextStage,
    }
  }

  return {
    goToCurrentStage,
    goToNextStage,
    goToStage,
    goToHome,
    goToLeaderboard,
    goToManage,
    goToHostScore,
    goToVotes,
    getCurrentStageInfo,
  }
}
