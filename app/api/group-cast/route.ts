import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { professions } = (await req.json()) as { professions: string[] };

    if (!professions || professions.length === 0) {
      return NextResponse.json({ categories: {} });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `Group these historical character professions into short semantic categories (e.g. "Agriculture", "Military", "Religious", "Artisan", "Governance", "Trade", "Scholarly").
Return ONLY valid JSON with no markdown fencing: {"categories":{"<profession>":"<category>"}}
Each profession must appear exactly once. Use 2-4 word category names max.

Professions: ${JSON.stringify(professions)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const parsed = JSON.parse(cleaned) as { categories: Record<string, string> };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('group-cast error:', error);
    return NextResponse.json({ categories: {} }, { status: 200 });
  }
}
