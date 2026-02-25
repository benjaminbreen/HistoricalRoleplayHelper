import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as File | null;

    if (!audio) {
      return new Response(JSON.stringify({ error: 'Missing audio file' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Whisper limit is 25MB
    if (audio.size > 25 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Audio file too large (max 25MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openaiForm = new FormData();
    openaiForm.append('file', audio, 'audio.webm');
    openaiForm.append('model', 'whisper-1');
    openaiForm.append('response_format', 'json');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiForm,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Whisper API error:', err);
      return new Response(JSON.stringify({ error: 'Transcription failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify({ text: data.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Transcribe error:', error);
    return new Response(JSON.stringify({ error: 'Transcription failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
