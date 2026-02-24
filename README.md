# Historical Roleplaying Helper

A classroom tool for facilitating historical roleplaying activities. Students adopt historically accurate personas and collectively debate key historical decisions, guided by LLM-powered NPC characters that respond to their arguments in real time.

Built for projection on a classroom screen — large fonts, high contrast, dark theme with warm gold accents.

## Features

- **Scenario configuration** — define a historical question, voting options, activity stages, and NPC characters
- **Stage-based flow** — freeform discussion, structured debate, individual speeches, NPC responses, voting, and verdict/reveal
- **Speech-to-text** — capture student arguments via browser microphone (Web Speech API)
- **LLM-powered NPCs** — characters respond in-character to student arguments using Google Gemini
- **Text-to-speech** — NPC responses read aloud with distinct OpenAI TTS voices per character
- **Voting & results** — instructor tallies votes with visual bar chart display
- **Historical reveal** — show what actually happened after the class votes
- **Countdown timer** — per-stage timer with audio warnings
- **Fullscreen mode** — optimized for classroom projection

## Demo Scenario

Includes a built-in scenario: **The Conversion of Axum (340 CE)** — students debate whether King Ezana should convert the kingdom to Christianity, with three NPC courtiers who react to their arguments.

## Setup

```bash
npm install
```

Create `.env.local` with:

```
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

Gemini is used for NPC text generation. OpenAI is used for text-to-speech voices (falls back to browser TTS if unavailable).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Google Gemini API (gemini-2.0-flash)
- OpenAI TTS API
- Web Speech API (browser-native speech-to-text)
