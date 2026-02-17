import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/leaderboard');
      setData(res.data.leaderboard || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Leaderboard fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    if (!secs) return '--:--:--';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const rankEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--dark2)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem' }}
          >
            ← BACK
          </button>
          <h1 className="font-bebas glow-pink" style={{ fontSize: '1.8rem', letterSpacing: 4 }}>
            LEADERBOARD
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {lastUpdated && (
            <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--muted)', fontSize: '0.75rem' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--green)',
            boxShadow: '0 0 8px var(--green)',
            animation: 'pulse-pink 2s infinite'
          }} />
          <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--green)', fontSize: '0.75rem' }}>LIVE</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 className="font-bebas" style={{ fontSize: '3rem', letterSpacing: 6, color: 'var(--pink)' }}>
            SURVIVORS BOARD
          </h2>
          <p style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', marginTop: 4 }}>
            Only teams that completed all 5 rounds appear here — Auto refreshes every 10s
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ color: 'var(--pink)', fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', letterSpacing: 3, animation: 'flicker 1s infinite' }}>
              LOADING...
            </div>
          </div>
        ) : data.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 80,
            border: '1px solid var(--border)',
            background: 'var(--card)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🦑</div>
            <h3 className="font-bebas" style={{ fontSize: '2rem', color: 'var(--muted)', letterSpacing: 3 }}>
              NO SURVIVORS YET
            </h3>
            <p style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', marginTop: 8 }}>
              Be the first to complete all 5 rounds!
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 180px 180px',
              padding: '12px 20px',
              background: 'var(--dark3)',
              border: '1px solid var(--border)',
              marginBottom: 2,
              fontFamily: 'Bebas Neue, cursive',
              fontSize: '0.9rem',
              letterSpacing: 3,
              color: 'var(--muted)'
            }}>
              <span>RANK</span>
              <span>TEAM</span>
              <span style={{ textAlign: 'center' }}>TIME</span>
              <span style={{ textAlign: 'center' }}>ROUNDS</span>
            </div>

            {data.map((entry, idx) => (
              <div
                key={entry.teamId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 180px 180px',
                  padding: '16px 20px',
                  background: idx === 0 ? 'rgba(255, 215, 0, 0.05)' : idx === 1 ? 'rgba(192, 192, 192, 0.05)' : 'var(--card)',
                  border: `1px solid ${idx < 3 ? rankColors[idx] + '44' : 'var(--border)'}`,
                  marginBottom: 4,
                  animation: `fadeIn 0.3s ease ${idx * 0.05}s both`,
                  transition: 'all 0.2s',
                  alignItems: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--pink)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = idx < 3 ? rankColors[idx] + '44' : 'var(--border)'}
              >
                {/* Rank */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {idx < 3 ? (
                    <span style={{ fontSize: '1.5rem' }}>{rankEmojis[idx]}</span>
                  ) : (
                    <span className="font-bebas" style={{ fontSize: '1.4rem', color: 'var(--muted)' }}>
                      #{entry.rank}
                    </span>
                  )}
                </div>

                {/* Team */}
                <div>
                  <span className="font-bebas" style={{
                    fontSize: '1.3rem',
                    letterSpacing: 3,
                    color: idx < 3 ? rankColors[idx] : 'var(--text)'
                  }}>
                    {entry.teamId}
                  </span>
                </div>

                {/* Time */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '1.1rem',
                    color: 'var(--green)',
                    textShadow: '0 0 10px var(--green)'
                  }}>
                    {formatTime(entry.totalTime)}
                  </span>
                  <div style={{ color: 'var(--muted)', fontSize: '0.7rem', fontFamily: 'Share Tech Mono, monospace', marginTop: 2 }}>
                    {entry.totalTime}s
                  </div>
                </div>

                {/* Rounds */}
                <div style={{ textAlign: 'center' }}>
                  <span className="font-bebas" style={{ fontSize: '1.4rem', color: 'var(--pink)' }}>
                    {entry.completedRounds}/5
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
