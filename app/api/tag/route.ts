import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { text, centralQuestion } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction:
        'You classify debate arguments. Return ONLY valid JSON with two fields: "stance" (one of "for", "against", or "mixed") and "rhetoric" (one of "evidence", "values", "consequences", or "authority"). No other text.',
    });

    const prompt = centralQuestion
      ? `Classify this argument in the context of the debate question: "${centralQuestion}"\n\nArgument: "${text}"`
      : `Classify this debate argument: "${text}"`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Parse JSON from response, handling possible markdown wrapping
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const validStances = ['for', 'against', 'mixed'];
    const validRhetoric = ['evidence', 'values', 'consequences', 'authority'];

    return NextResponse.json({
      stance: validStances.includes(parsed.stance) ? parsed.stance : null,
      rhetoric: validRhetoric.includes(parsed.rhetoric) ? parsed.rhetoric : null,
    });
  } catch (error) {
    console.error('Tag API error:', error);
    return NextResponse.json({ stance: null, rhetoric: null }, { status: 200 });
  }
}
