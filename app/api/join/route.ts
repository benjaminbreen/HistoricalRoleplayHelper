import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSession } from '../../lib/joinStore';

/** POST — teacher creates a new join session */
export async function POST(req: NextRequest) {
  try {
    const { scenarioTitle } = await req.json();
    if (!scenarioTitle || typeof scenarioTitle !== 'string') {
      return NextResponse.json({ error: 'Missing scenarioTitle' }, { status: 400 });
    }
    const session = createSession(scenarioTitle);
    return NextResponse.json({ code: session.code });
  } catch (error) {
    console.error('Join session creation error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

/** GET — teacher polls for students */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }
  const session = getSession(code);
  if (!session) {
    return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
  }
  return NextResponse.json({
    scenarioTitle: session.scenarioTitle,
    students: session.students,
  });
}
