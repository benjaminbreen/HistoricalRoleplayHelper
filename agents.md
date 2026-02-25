# Historical Roleplaying Helper — Project Overview & Roadmap

## What This Is

A web-based toolkit for running structured classroom debates augmented by LLM-powered NPC characters. A teacher projects the app on a wall in a physical classroom. Students argue in person, in character, while AI-driven historical (or fictional, or philosophical) figures respond to their arguments in real time. The app manages timed debate stages, tracks arguments, handles voting, and triggers dramatic events to keep discussions dynamic.

The digital interface is a projection surface for a real, embodied classroom activity — not a replacement for it.

## Architecture

- **Next.js 16 + React** single-page app
- **Gemini API** for LLM-powered NPC responses and argument tagging
- **OpenAI TTS** for optional voiced NPC responses
- **Web Speech API** for real-time speech-to-text transcription of student arguments
- No database — sessions are ephemeral by design, with JSON export/import for continuity

### Key Components

| Component | Role |
|-----------|------|
| `SetupForm` | Landing gallery of preset scenarios + full scenario editor |
| `SessionView` | Live session controller — timer, stages, transcript, NPC panel |
| `SpeechCapture` | Browser speech recognition for capturing student arguments |
| `NpcPanel` | Manages AI character responses with streaming + TTS |
| `VotingPanel` | Real-time vote tracking with animated results |
| `StageManager` | Timed progression through debate phases |
| `EventBanner` | Dramatic mid-debate events triggered by timer or probability |
| `Verdict` | End-of-session historical reveal and reflection |

### Data Model

A `Scenario` defines everything: title, context, central question, voting options, timed stages (with optional random events), NPC characters (with personality/stance/voice), and student roles. Scenarios are portable JSON — presets ship with the app, custom ones can be exported and shared.

## Current State

Three fully developed history presets:
- **The Conversion of Axum** (340 CE) — religious/political transformation
- **The Fire on the Avenue of the Dead** (c. 550 CE, Teotihuacan) — crisis governance
- **The Eruption of Vesuvius** (79 CE, Pompeii) — emergency decision-making

Core features working: speech capture, NPC responses, timed stages, voting, event system, session save/recovery, JSON export/import for asynchronous rejoin.

## Roadmap

### Phase 1 — Polish & Open Source (current)

- Landing page redesign (gallery view with direct-start and editor modes) [done]
- Session recovery with full event state [done]
- Documentation, README, and contribution guide
- Open source release under MIT license
- Deploy hosted demo instance

### Phase 2 — Multi-Discipline Expansion

Generalize the app from "Historical Roleplaying Helper" to a broader classroom deliberation toolkit. The core debate mechanics are discipline-agnostic; what changes is scenario content and light UI framing.

**Target disciplines and example scenarios:**

- **Philosophy**: Socratic dialogues (AI Socrates as a probing NPC), thought experiment debates (trolley problem with stakeholder characters), historical philosophy debates (Hobbes vs. Locke vs. Rousseau on the social contract)
- **Political Science**: Model UN-style negotiations, constitutional convention simulations, policy debates with lobbyist/citizen/expert NPCs
- **Literature**: Mock trials of fictional characters, editorial board deliberations, characters from different works confronting shared dilemmas
- **STEM (history of science)**: Lamarck vs. Darwin, continental drift skeptics vs. Wegener, Bohr-Einstein debates on quantum mechanics — teaching that scientific knowledge is contested and constructed
- **Ethics / Bioethics**: Hospital ethics boards, IRB review simulations, emerging technology policy panels

**Concrete engineering work:**
- Rename UI labels to be discipline-neutral where needed ("Historical Context" becomes "Background Context" with per-scenario overrides)
- Add a `discipline` field to `Scenario` for filtering and theming
- Build 2-3 presets per discipline above (10-15 total new scenarios)
- Discipline-specific stage templates (Socratic dialogue pacing differs from Model UN)
- Variant ending types beyond voting: written rulings, consensus statements, split decisions

**What stays the same:** The NPC system, speech capture, stage/timer mechanics, event system, and session management are all reusable as-is.

### Phase 3 — Student Character Sheet Ingestion

Enable students to create characters on paper (handwritten name, background, personality, hand-drawn portrait) and batch-ingest these into the app via photographed sheets. The student's creative work — their handwriting, their drawing — becomes a living character in the simulation. See detailed planning notes below.

### Phase 4 — Teacher Dashboard & Scenario Sharing

- Post-session analytics: participation balance, argument quality distribution, voting patterns
- Scenario sharing: public library of community-contributed scenarios
- Classroom management: session codes, multi-device student input (optional — the core use case remains single-projector)

## Character Sheet Ingestion — Planning Notes

### Concept

Students fill out a physical character sheet template (printed PDF). Teacher photographs a batch (e.g., 30 sheets from one class, potentially 100+ across sections). The app processes photos via vision LLM to extract structured character data and isolate hand-drawn portraits. Teacher reviews/corrects on a confirmation screen. Characters are loaded into the active scenario.

### Pipeline

1. **Upload**: Teacher uploads batch of photos (phone camera or document scanner)
2. **Vision extraction**: Each photo is sent to a multimodal LLM (Gemini) with a structured prompt requesting JSON output for all text fields
3. **Portrait isolation**: The bordered drawing area is identified and cropped — either via LLM bounding-box detection or simple template-based contour detection
4. **Review screen**: Teacher sees extracted data in editable cards, corrects any misreadings
5. **Import**: Confirmed characters populate the scenario's student roles with name, background, personality, and hand-drawn avatar

### Design Constraints

- The character sheet template is a key artifact — must have clearly labeled fields, a bordered portrait box, and structured creative prompts ("What does your character fear?" "What did they dream about last night?")
- Hand-drawn portraits should appear as-is in the app. The roughness is pedagogically valuable — it is the student's own creative work.
- Student privacy: no data persists beyond the session unless teacher explicitly exports. Critical for institutional adoption and grant compliance.
- Must handle imperfect photos: slight angles, varied lighting, phone cameras of varying quality.

### Open Questions

- Cost per batch at scale (100 sheets via Gemini vision)
- Whether cheaper alternatives to full LLM vision exist for the text extraction portion
- Character sheet template design (what fields maximize both pedagogical value and extraction reliability)
- How extracted personality data should feed into NPC/session behavior (does the LLM reference a student's character background when responding to their arguments?)
