import { NpcCharacter, Scenario, TranscriptEntry } from './types';

export function buildNpcSystemPrompt(npc: NpcCharacter, scenario: Scenario): string {
  return `You are ${npc.name}, ${npc.title}.

HISTORICAL SETTING: ${scenario.timePeriod} — ${scenario.historicalContext}

YOUR CHARACTER:
- Personality: ${npc.personality}
- Historical Context: ${npc.historicalContext}
- Your Stance on "${scenario.centralQuestion}": ${npc.stance}

INSTRUCTIONS:
- Stay completely in character as ${npc.name}
- Speak in first person, with the authority and manner appropriate to your role
- Reference specific arguments made by students when responding
- Ground your responses in historically accurate details
- Be persuasive and dramatic — this is a classroom performance
- Keep responses to 2-4 paragraphs maximum
- Do NOT use modern language or anachronisms
- Address the central question: "${scenario.centralQuestion}"`;
}

export function buildNpcResponsePrompt(
  transcript: TranscriptEntry[],
  scenario: Scenario
): string {
  const transcriptText = transcript
    .map((e) => `[${e.speaker}]: ${e.text}`)
    .join('\n');

  return `The following arguments have been made in this debate about: "${scenario.centralQuestion}"

TRANSCRIPT OF ARGUMENTS:
${transcriptText || '(No arguments have been made yet)'}

Respond to these arguments in character. Reference specific points made by the speakers. Be historically grounded and persuasive.`;
}

export function buildVerdictPrompt(
  transcript: TranscriptEntry[],
  scenario: Scenario,
  votingResults: { label: string; votes: number }[]
): string {
  const transcriptText = transcript
    .map((e) => `[${e.speaker}]: ${e.text}`)
    .join('\n');

  const resultsText = votingResults
    .map((v) => `${v.label}: ${v.votes} votes`)
    .join('\n');

  return `The debate on "${scenario.centralQuestion}" has concluded.

TRANSCRIPT OF ARGUMENTS:
${transcriptText || '(No arguments were recorded)'}

VOTING RESULTS:
${resultsText}

Deliver your final verdict in character. React to the vote outcome. Reference the strongest arguments made. Explain what this decision means historically. Be dramatic and memorable — this is the climax of the activity.`;
}

export function buildNpcGenerationPrompt(scenario: Scenario): string {
  return `Generate 3 historically accurate NPC characters for a classroom roleplaying activity.

SCENARIO: ${scenario.title}
TIME PERIOD: ${scenario.timePeriod}
CONTEXT: ${scenario.historicalContext}
CENTRAL QUESTION: ${scenario.centralQuestion}

For each character, provide a JSON array with objects containing:
- name: historical or historically plausible name
- title: their role/position
- personality: 2-3 sentence personality description
- historicalContext: their historical background
- stance: their position on the central question
- avatarEmoji: a single emoji representing them

Return ONLY valid JSON array, no markdown formatting.`;
}
