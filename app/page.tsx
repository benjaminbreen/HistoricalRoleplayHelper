'use client';

import { useState } from 'react';
import { Scenario } from './lib/types';
import SetupForm from './components/SetupForm';
import SessionView from './components/SessionView';

export default function Home() {
  const [scenario, setScenario] = useState<Scenario | null>(null);

  if (scenario) {
    return (
      <SessionView
        scenario={scenario}
        onEnd={() => setScenario(null)}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <SetupForm onStart={setScenario} />
    </div>
  );
}
