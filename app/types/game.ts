export type PlayerId = string; // uuid

export interface Player {
  id: PlayerId;
  name: string;
  avatarUrl?: string;
}

export type StageKind = 'luck-board' | 'familiar-quiz' | 'expression-guess';

export interface StageConfigBase {
  id: string;          // uuid
  kind: StageKind;     // 決定載入哪個頁面/元件
  enabled: boolean;    // 可被跳過
  title?: string;
}

export interface LuckBoardConfig extends StageConfigBase {
  kind: 'luck-board';
  rows: number;        // 4 或 10
  cols: number;        // 4 或 6
  mode: 'A'|'B';       // A 連抽 / B 輪抽
  picksPerPlayer: number; // 每人抽幾次（A 模式使用）
}

export interface QuizItem {
  id: string;
  q: string;
  type: 'single'|'text';
  options?: string[];  // type=single 使用
  a?: number|string;   // 正解（單選索引或簡答字串）
}

export interface FamiliarQuizConfig extends StageConfigBase {
  kind: 'familiar-quiz';
  banks: Record<PlayerId, QuizItem[]>; // 每人題庫
  perPlayerMax?: number;               // 每人最多作答題數，預設 5
}

export interface GuessCard { 
  id: string; 
  text: string; 
  category: string; 
}

export interface ExpressionGuessConfig extends StageConfigBase {
  kind: 'expression-guess';
  durationSec: number;  // 60
  count: number;        // 10
  categories: string[]; // 可選類別
  cards: GuessCard[];   // 題庫（含類別屬性）
}

export interface VotesSummary {
  hardest: Record<PlayerId, number>; // 最難送 票數
  easiest: Record<PlayerId, number>; // 最好送 票數
}

export type RevealMode = 'suspense' | 'random' | 'by-score-asc';

export interface GameConfig {
  players: Player[];
  stages: (LuckBoardConfig | FamiliarQuizConfig | ExpressionGuessConfig)[];
  votes: VotesSummary;
  revealMode: RevealMode;  // 投票揭曉策略
  sound: { on: boolean; volume: number };
  accessibility: { colorBlindMode: boolean };
}

export interface GameState {
  scores: Record<PlayerId, number>;
  currentStageIndex: number;
  currentPlayerId?: PlayerId; // 每關開始前由主持人指定
  round1Stats?: { greenHits: Record<PlayerId, number> }; // 用於平手
}

// Luck Board Cell 型別
export interface LuckBoardCell {
  id: number;
  type: 'G' | 'R';  // Green 或 Red
  pickedBy?: PlayerId | null;
}

// Luck Board 標籤
export interface LuckBoardLabels {
  rows: string[];  // ['A', 'B', 'C', ...]
  cols: (string | number)[];  // [1, 2, 3, ...]
}
