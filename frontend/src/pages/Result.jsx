import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Result = () => {
  const [result, setResult] = useState(null);
  const { team, progress } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const res = await api.get('/game/status');
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs) => {
    if (!secs) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalTime = result?.startTime && result?.endTime
    ? Math.floor((new Date(result.endTime) - new Date(result.startTime)) / 1000)
    : null;

  const roundNames = {
    redGreen: 'Red Light Green Light',
    circle: 'Logical Reasoning',
    triangle: 'Code Output',
    square: 'Cows & Bulls',
    umbrella: 'Tech MCQ'
  };

  const survived = result?.locks && Object.values(result.locks).every(v => v === 'unlocked');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        {/* Main result */}
        <div style={{
          marginBottom: 48,
          animation: 'fadeIn 0.6s ease'
        }}>
          {survived ? (
            <>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏆</div>
              <h1 className="font-bebas glow-green" style={{ fontSize: '5rem', letterSpacing: 8, lineHeight: 1 }}>
                SURVIVED!
              </h1>
              <p style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', marginTop: 12, letterSpacing: 2 }}>
                {team?.teamId} COMPLETED THE SQUID GAME
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>☠️</div>
              <h1 className="font-bebas" style={{ fontSize: '4rem', letterSpacing: 8, color: 'var(--danger)' }}>
                GAME OVER !!! 
              </h1>
              <p style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', marginTop: 12 }}>
                {team?.teamId} — GAME OVER
              </p>
            </>
          )}
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            padding: 28,
            animation: 'countUp 0.5s ease 0.2s both'
          }}>
            <div style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', letterSpacing: 2, marginBottom: 8 }}>
              TOTAL TIME
            </div>
            <div className="font-bebas" style={{
              fontSize: '2.5rem',
              color: survived ? 'var(--green)' : 'var(--pink)',
              textShadow: `0 0 20px ${survived ? 'var(--green)' : 'var(--pink)'}`
            }}>
              {totalTime !== null ? formatTime(totalTime) : '--:--:--'}
            </div>
            {totalTime !== null && (
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'Share Tech Mono, monospace', marginTop: 4 }}>
                {totalTime} seconds
              </div>
            )}
          </div>

          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            padding: 28,
            animation: 'countUp 0.5s ease 0.4s both'
          }}>
            <div style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', letterSpacing: 2, marginBottom: 8 }}>
              ROUNDS COMPLETED
            </div>
            <div className="font-bebas" style={{
              fontSize: '2.5rem',
              color: 'var(--pink)',
              textShadow: '0 0 20px var(--pink)'
            }}>
              {result?.completedRounds || 0} / 5
            </div>
          </div>
        </div>

        {/* Round breakdown */}
        {result?.locks && (
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            padding: 28,
            marginBottom: 32,
            textAlign: 'left',
            animation: 'fadeIn 0.5s ease 0.6s both'
          }}>
            <h3 className="font-bebas" style={{ letterSpacing: 3, marginBottom: 20, color: 'var(--muted)' }}>
              ROUND BREAKDOWN
            </h3>
            {Object.entries(result.locks).map(([round, lockStatus]) => (
              <div key={round} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text)' }}>{roundNames[round] || round}</span>
                <span style={{
                  color: lockStatus === 'unlocked' ? 'var(--green)' : lockStatus === 'permanently_locked' ? 'var(--danger)' : 'var(--muted)',
                  letterSpacing: 1
                }}>
                  {lockStatus === 'unlocked' ? '✓ CLEARED' : lockStatus === 'permanently_locked' ? '✗ LOCKED' : '○ SKIPPED'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            BACK TO HOME
          </button>
          <button className="btn-primary" onClick={() => navigate('/leaderboard')}>
            VIEW LEADERBOARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
