import type { GameConfig } from '~/types/game'

/**
 * 假資料範例（用於測試與開發）
 */
export const mockGameConfig: GameConfig = {
  players: [
    { id: 'p1', name: 'Alice', avatarUrl: '' },
    { id: 'p2', name: 'Bob', avatarUrl: '' },
    { id: 'p3', name: 'Carol', avatarUrl: '' },
    { id: 'p4', name: 'Dave', avatarUrl: '' },
    { id: 'p5', name: 'Eve', avatarUrl: '' },
  ],
  stages: [
    {
      id: 's1',
      kind: 'luck-board',
      enabled: true,
      title: '幸運盤面',
      rows: 4,
      cols: 4,
      mode: 'A',
      picksPerPlayer: 6,
    },
    {
      id: 's2',
      kind: 'familiar-quiz',
      enabled: true,
      title: '熟人問答',
      banks: {
        p1: [
          {
            id: 'q1',
            q: 'Alice 最喜歡的顏色是？',
            type: 'single',
            options: ['紅色', '藍色', '綠色', '黃色'],
            a: 1,
          },
          {
            id: 'q2',
            q: 'Alice 的生日月份？',
            type: 'text',
            a: '3月',
          },
        ],
        p2: [
          {
            id: 'q3',
            q: 'Bob 最喜歡的運動是？',
            type: 'single',
            options: ['籃球', '足球', '游泳', '跑步'],
            a: 0,
          },
        ],
      },
      perPlayerMax: 5,
    },
    {
      id: 's3',
      kind: 'expression-guess',
      enabled: true,
      title: '表情你猜我猜',
      durationSec: 60,
      count: 10,
      categories: ['聖誕節', '日常生活', '電影'],
      cards: [
        { id: 'c1', text: '聖誕老人', category: '聖誕節' },
        { id: 'c2', text: '麋鹿', category: '聖誕節' },
        { id: 'c3', text: '聖誕樹', category: '聖誕節' },
        { id: 'c4', text: '雪人', category: '聖誕節' },
        { id: 'c5', text: '禮物', category: '聖誕節' },
        { id: 'c6', text: '刷牙', category: '日常生活' },
        { id: 'c7', text: '煮飯', category: '日常生活' },
        { id: 'c8', text: '開車', category: '日常生活' },
        { id: 'c9', text: '鐵達尼號', category: '電影' },
        { id: 'c10', text: '哈利波特', category: '電影' },
      ],
    },
  ],
  votes: {
    hardest: {},
    easiest: {},
  },
  revealMode: 'suspense',
  sound: { on: true, volume: 0.8 },
  accessibility: { colorBlindMode: false },
}
