export type StageType =
  | 'freeform'
  | 'debate'
  | 'speech'
  | 'npc_response'
  | 'vote'
  | 'verdict'
  | 'debrief';

/** Returns true for stage types that use verdict/debrief mechanics. */
export function isVerdictStage(type: StageType): boolean {
  return type === 'verdict' || type === 'debrief';
}

/** Returns true for leadership/guidance roles (TA, facilitator). */
export function isLeaderRole(suggestedFor: string): boolean {
  return suggestedFor === 'ta' || suggestedFor === 'facilitator';
}

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
  context: string;
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
  suggestedFor: 'student' | 'ta' | 'facilitator' | 'participant' | 'observer';
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

export interface CharacterSheet {
  id: string;
  studentRealName: string;
  classroomId?: string;
  characterName: string;
  profession?: string;
  age?: string;
  gender?: string;
  family?: string;
  socialClass?: string;
  personality?: string;
  customFields?: Record<string, string>;
  portraitDataUrl: string;       // base64 cropped portrait (~15KB each)
  needsReview: boolean;
}

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
  characterId?: string;  // links to CharacterSheet.id
}

export interface VotingOption {
  id: string;
  label: string;
  votes: number;
}

export interface Scenario {
  title: string;
  description: string;
  context: string;
  setting: string;
  centralQuestion: string;
  votingOptions: VotingOption[];
  stages: Stage[];
  npcs: NpcCharacter[];
  roles: StudentRole[];
  introNarrative?: string;
  introBannerImage?: string;
  outcome?: string;
  backgroundImage?: string;
  mode?: 'education' | 'civic';
  category?: string;
  difficulty?: 'introductory' | 'intermediate' | 'advanced';
  participantRange?: { min: number; max: number };
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
  cast?: CharacterSheet[];
}
