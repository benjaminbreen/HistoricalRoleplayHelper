import { NpcCharacter, Scenario, TranscriptEntry } from './types';

export function buildNpcSystemPrompt(npc: NpcCharacter, scenario: Scenario): string {
  return `You are ${npc.name}, ${npc.title}.

SETTING: ${scenario.setting} — ${scenario.context}

YOUR CHARACTER:
- Personality: ${npc.personality}
- Background: ${npc.context}
- Your Stance on "${scenario.centralQuestion}": ${npc.stance}

INSTRUCTIONS:
- Stay completely in character as ${npc.name}
- Speak in first person, with the authority and manner appropriate to your role
- Reference specific arguments made by students when responding
- Ground your responses in historically accurate details
- Write in plain, direct language — like a real person talking, not a novel or stage play
- Do NOT use flowery or theatrical language (no "hark," "hearken," "lo," "verily," etc.)
- Do NOT use modern slang either — aim for clear, natural speech that sounds like a smart person from this era would actually talk
- Keep responses SHORT: 3-5 sentences maximum. Be concise and pointed.
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

Respond to these arguments in character. Reference specific points made by the speakers. Be historically grounded. Keep it to 3-5 sentences — direct and natural, not theatrical.`;
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

Deliver your final verdict in character. React to the vote outcome. Reference the strongest arguments made. Briefly note what this decision means historically. Keep it to 4-6 sentences — direct and natural, not theatrical.`;
}

export function buildRejoinPrompt(
  originalTranscript: TranscriptEntry[],
  newArguments: TranscriptEntry[],
  scenario: Scenario,
  votingResults: { label: string; votes: number }[]
): string {
  const originalText = originalTranscript
    .map((e) => `[${e.speaker}]: ${e.text}`)
    .join('\n');

  const newText = newArguments
    .map((e) => `[${e.speaker}]: ${e.text}`)
    .join('\n');

  const resultsText = votingResults
    .map((v) => `${v.label}: ${v.votes} votes`)
    .join('\n');

  return `This is an asynchronous response to a debate that already took place about: "${scenario.centralQuestion}"

A student who missed the original session is now participating. Below are the original arguments from the live session, followed by new arguments from the absent student.

ORIGINAL ARGUMENTS (from the live session):
${originalText || '(No arguments were recorded)'}

NEW ARGUMENTS (from the absent student joining asynchronously):
${newText || '(No new arguments submitted)'}

UPDATED VOTING RESULTS (including the new student's vote):
${resultsText}

Respond in character. Address the new arguments specifically — do they raise points that were missed in the original debate? Do they strengthen or weaken a particular position? Note whether the new contributions change your assessment. Keep it to 4-6 sentences — direct and natural, not theatrical.`;
}

export function buildNpcGenerationPrompt(scenario: Scenario): string {
  return `Generate 3 historically accurate NPC characters for a classroom roleplaying activity.

SCENARIO: ${scenario.title}
SETTING: ${scenario.setting}
CONTEXT: ${scenario.context}
CENTRAL QUESTION: ${scenario.centralQuestion}

For each character, provide a JSON array with objects containing:
- name: historical or historically plausible name
- title: their role/position
- personality: 2-3 sentence personality description
- context: their historical background
- stance: their position on the central question
- avatarEmoji: a single emoji representing them

Return ONLY valid JSON array, no markdown formatting.`;
}
