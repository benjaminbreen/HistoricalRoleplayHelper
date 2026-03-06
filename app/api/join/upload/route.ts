import { NextRequest, NextResponse } from 'next/server';
import { addStudent, getSession } from '../../../lib/joinStore';
import { CharacterSheet } from '../../../lib/types';

/** POST — student submits their completed character sheet */
export async function POST(req: NextRequest) {
  try {
    const { code, characterSheet } = await req.json() as {
      code: string;
      characterSheet: CharacterSheet;
    };

    if (!code || !characterSheet) {
      return NextResponse.json({ error: 'Missing code or characterSheet' }, { status: 400 });
    }

    const session = getSession(code);
    if (!session) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
    }

    if (!characterSheet.id || !characterSheet.characterName) {
      return NextResponse.json({ error: 'Invalid character sheet' }, { status: 400 });
    }

    const added = addStudent(code, characterSheet);
    if (!added) {
      return NextResponse.json({ error: 'Session full' }, { status: 409 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Join upload error:', error);
    return NextResponse.json({ error: 'Failed to upload character' }, { status: 500 });
  }
}
