import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Missing imageBase64' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });

    const prompt = `You are analyzing a photograph of a handwritten student character sheet for a historical roleplaying activity. Extract structured data from the sheet.

Look for:
- The student's real name (usually written at the top, often labeled "Name" or "Student")
- Their character's name (the historical persona they are playing)
- Labeled fields such as: Profession, Age, Gender, Family, Social Class, Personality
- Any other labeled fields (put them in customFields)
- The location of any hand-drawn portrait on the sheet

Return ONLY valid JSON with these fields:
{
  "studentRealName": "string",
  "characterName": "string",
  "profession": "string or empty",
  "age": "string or empty",
  "gender": "string or empty",
  "family": "string or empty",
  "socialClass": "string or empty",
  "personality": "string or empty",
  "customFields": { "fieldLabel": "fieldValue" },
  "portraitBounds": { "x": number, "y": number, "width": number, "height": number },
  "confidence": 0.0 to 1.0
}

For portraitBounds, estimate the pixel coordinates of the drawn portrait area. If there is no portrait, use {"x":0,"y":0,"width":0,"height":0}.
For confidence, rate how well you could read the handwriting (1.0 = perfectly clear, 0.0 = illegible).
If a field is not present or illegible, use an empty string.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64,
        },
      },
    ]);

    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ extraction: parsed });
  } catch (error) {
    console.error('Extract character API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract character data from image' },
      { status: 500 }
    );
  }
}
