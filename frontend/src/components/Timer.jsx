import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Timer = () => {
  const { progress, refreshProgress } = useAuth();
  const [remaining, setRemaining] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    if (!progress?.startTime) return;

    const totalTime = 30 * 60; // 1800 seconds

    if (progress?.endTime) {
      setRemaining(0);
      return;
    }

    const interval = setInterval(async () => {
      const now = Date.now();
      const start = new Date(progress.startTime).getTime();
      const elapsed = Math.floor((now - start) / 1000);
      const rem = Math.max(0, totalTime - elapsed);
      setRemaining(rem);

      if (rem === 0) {
        // Time's up, complete the game
        try {
          await api.post('/api/game/complete');
          await refreshProgress();
        } catch (error) {
          console.error('Error completing game:', error);
        }
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progress?.startTime, progress?.endTime, refreshProgress]);

  const format = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="timer" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>TIME</span>
      <span style={{ fontSize: '1.3rem' }}>{format(remaining)}</span>
    </div>
  );
};

export default Timer;
