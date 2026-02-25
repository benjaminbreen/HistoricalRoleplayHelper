import { NextRequest, NextResponse } from 'next/server';
import { generateNpcResponse, streamNpcResponse } from '../../lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, userPrompt, stream } = await req.json();

    if (!systemPrompt || !userPrompt) {
      return NextResponse.json(
        { error: 'Missing systemPrompt or userPrompt' },
        { status: 400 }
      );
    }

    // Reject excessively large prompts to avoid API timeouts
    const totalLength = systemPrompt.length + userPrompt.length;
    if (totalLength > 100_000) {
      return NextResponse.json(
        { error: 'Prompt too long (max 100k characters combined)' },
        { status: 400 }
      );
    }

    if (stream) {
      const readableStream = await streamNpcResponse(systemPrompt, userPrompt);
      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const text = await generateNpcResponse(systemPrompt, userPrompt);
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
