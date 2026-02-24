export type StageType =
  | 'freeform'
  | 'debate'
  | 'speech'
  | 'npc_response'
  | 'vote'
  | 'verdict';

export interface Stage {
  id: string;
  type: StageType;
  title: string;
  description: string;
  durationSeconds: number;
}

export type TtsVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface NpcCharacter {
  id: string;
  name: string;
  title: string;
  personality: string;
  historicalContext: string;
  stance: string;
  avatarEmoji: string;
  voice: TtsVoice;
}

export interface NpcResponse {
  npcId: string;
  text: string;
  timestamp: number;
  stageId: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
  stageId: string;
}

export interface VotingOption {
  id: string;
  label: string;
  votes: number;
}

export interface Scenario {
  title: string;
  description: string;
  historicalContext: string;
  timePeriod: string;
  centralQuestion: string;
  votingOptions: VotingOption[];
  stages: Stage[];
  npcs: NpcCharacter[];
  historicalOutcome: string;
  backgroundImage?: string;
}

export interface SessionState {
  scenario: Scenario;
  currentStageIndex: number;
  timerSeconds: number;
  timerRunning: boolean;
  transcript: TranscriptEntry[];
  npcResponses: NpcResponse[];
  phase: 'setup' | 'active' | 'completed';
}
