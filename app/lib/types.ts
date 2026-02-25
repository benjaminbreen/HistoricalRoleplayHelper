export type StageType =
  | 'freeform'
  | 'debate'
  | 'speech'
  | 'npc_response'
  | 'vote'
  | 'verdict';

export interface StageEvent {
  id: string;
  text: string;
  description: string;
  minDelay: number;
  maxDelay: number;
  probability: number;
}

export interface Stage {
  id: string;
  type: StageType;
  title: string;
  description: string;
  durationSeconds: number;
  events?: StageEvent[];
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
  avatarImage?: string;
  voice: TtsVoice;
}

export interface StudentRole {
  id: string;
  name: string;
  title: string;
  description: string;
  suggestedFor: 'student' | 'ta';
  assignedTo: string;
}

export interface NpcResponse {
  npcId: string;
  text: string;
  timestamp: number;
  stageId: string;
}

export type ArgumentStance = 'for' | 'against' | 'mixed';
export type RhetoricMode = 'evidence' | 'values' | 'consequences' | 'authority';

export interface TranscriptEntry {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
  stageId: string;
  profession?: string;
  age?: string;
  gender?: string;
  votes?: number;
  stance?: ArgumentStance;
  rhetoric?: RhetoricMode;
  isSystemEvent?: boolean;
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
  studentRoles: StudentRole[];
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

export interface SavedSession {
  scenario: Scenario;
  currentStageIndex: number;
  timerSeconds: number;
  transcript: TranscriptEntry[];
  npcResponses: NpcResponse[];
  votingOptions: VotingOption[];
  savedAt: string;
  triggeredEventIds?: string[];
}
