import { getSession } from '../../lib/joinStore';
import StudentUploadForm from './StudentUploadForm';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: Props) {
  const { code } = await params;
  const session = getSession(code.toUpperCase());

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: 'var(--background)' }}>
        <div className="text-center max-w-sm">
          <div className="text-4xl sm:text-5xl mb-4">🔍</div>
          <h1 className="heading-display text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Session Not Found
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            This session code has expired or is invalid. Ask your teacher for a new code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <StudentUploadForm code={session.code} scenarioTitle={session.scenarioTitle} />
  );
}
