import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const locks = [
  {
    id: 'redGreen',
    label: 'Red Light\nGreen Light',
    route: '/round/redgreen',
    shape: 'circle',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="3"/>
        <circle cx="40" cy="40" r="20" fill="currentColor" opacity="0.15"/>
        <circle cx="40" cy="40" r="8" fill="currentColor"/>
      </svg>
    ),
    round: 1
  },
  {
    id: 'circle',
    label: 'Logical\nReasoning',
    route: '/round/circle',
    shape: 'circle',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="currentColor" opacity="0.2"/>
        <circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="3"/>
        <text x="40" y="46" textAnchor="middle" fill="currentColor" fontSize="20" fontFamily="Bebas Neue, cursive">?</text>
      </svg>
    ),
    round: 2
  },
  {
    id: 'triangle',
    label: 'Code\nOutput',
    route: '/round/triangle',
    shape: 'triangle',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <polygon points="40,8 72,68 8,68" fill="none" stroke="currentColor" strokeWidth="3"/>
        <polygon points="40,22 60,56 20,56" fill="currentColor" opacity="0.15"/>
        <text x="40" y="52" textAnchor="middle" fill="currentColor" fontSize="18" fontFamily="Share Tech Mono, monospace">&gt;_</text>
      </svg>
    ),
    round: 3
  },
  {
    id: 'square',
    label: 'Cows &\nBulls',
    route: '/round/square',
    shape: 'square',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <rect x="8" y="8" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="3"/>
        <rect x="20" y="20" width="40" height="40" fill="currentColor" opacity="0.15"/>
        <text x="40" y="46" textAnchor="middle" fill="currentColor" fontSize="16" fontFamily="Bebas Neue, cursive">4-DIG</text>
      </svg>
    ),
    round: 4
  },
  {
    id: 'umbrella',
    label: 'Tech\nMCQ',
    route: '/round/umbrella',
    shape: 'umbrella',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <path d="M40 15 Q10 15 10 40 Q10 42 40 42 Q70 42 70 40 Q70 15 40 15 Z" fill="none" stroke="currentColor" strokeWidth="3"/>
        <line x1="40" y1="42" x2="40" y2="62" stroke="currentColor" strokeWidth="3"/>
        <path d="M40 62 Q40 70 32 70" fill="none" stroke="currentColor" strokeWidth="3"/>
      </svg>
    ),
    round: 5
  }
];

const LockCard = ({ lock, status, onClick }) => {
  const isPermanent = status === 'permanently_locked';
  const isUnlocked = status === 'unlocked';

  const colors = {
    locked: { color: 'var(--pink)', bg: 'rgba(255,0,118,0.05)', border: 'rgba(255,0,118,0.3)' },
    unlocked: { color: 'var(--green)', bg: 'rgba(0,255,136,0.05)', border: 'rgba(0,255,136,0.3)' },
    permanently_locked: { color: '#444', bg: 'rgba(40,40,40,0.5)', border: '#333' }
  };

  const c = colors[status] || colors.locked;

  return (
    <div
      onClick={!isPermanent ? onClick : undefined}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        cursor: isPermanent ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
        opacity: isPermanent ? 0.5 : 0,
        animation: 'fadeIn 0.5s ease forwards',
        animationDelay: `${lock.round * 0.1}s`
      }}
      onMouseEnter={e => {
        if (!isPermanent) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 8px 30px ${c.color}44`;
          e.currentTarget.style.borderColor = c.color;
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = c.border;
      }}
    >
      {/* Round badge */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        background: c.color,
        color: '#000',
        fontSize: '0.65rem',
        fontFamily: 'Bebas Neue, cursive',
        letterSpacing: 1,
        padding: '2px 8px'
      }}>
        ROUND {lock.round}
      </div>

      {/* Status badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        fontSize: '0.65rem',
        fontFamily: 'Share Tech Mono, monospace',
        color: c.color,
        letterSpacing: 1
      }}>
        {isUnlocked ? '✓ OPEN' : isPermanent ? '✗ DEAD' : '● LOCKED'}
      </div>

      {/* Icon */}
      <div style={{ color: c.color, opacity: isPermanent ? 0.3 : 1 }}>
        {lock.icon}
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <p className="font-bebas" style={{
          fontSize: '1.3rem',
          letterSpacing: 3,
          color: c.color,
          lineHeight: 1.2,
          whiteSpace: 'pre-line'
        }}>
          {lock.label}
        </p>
      </div>

      {/* Pulse animation for locked */}
      {status === 'locked' && (
        <div style={{
          position: 'absolute', inset: -1,
          border: `1px solid ${c.color}`,
          animation: 'pulse-pink 2s infinite',
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
};

const Home = () => {
  const { team, progress, refreshProgress } = useAuth();
  const navigate = useNavigate();

  const getStatus = (lockId) => {
    return progress?.locks?.[lockId] || 'locked';
  };

  const allDone = locks.every(l => getStatus(l.id) === 'unlocked');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <Navbar />

      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="font-bebas glow-pink" style={{ fontSize: '4rem', letterSpacing: 8, lineHeight: 1 }}>
            CHOOSE YOUR GAME
          </h1>
          <p style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem', marginTop: 8 }}>
            Complete all rounds to survive — wrong answers lock forever
          </p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 24 }}>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--green)', fontSize: '0.85rem' }}>
              ✓ {progress?.completedRounds || 0} / 5 ROUNDS
            </span>
          </div>
        </div>

        {/* Locks Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          maxWidth: 1000,
          margin: '0 auto'
        }}>
          {locks.map(lock => (
            <LockCard
              key={lock.id}
              lock={lock}
              status={getStatus(lock.id)}
              onClick={() => navigate(lock.route)}
            />
          ))}
        </div>

        {/* Completion banner */}
        {allDone && (
          <div style={{
            marginTop: 48,
            textAlign: 'center',
            padding: 32,
            border: '1px solid var(--green)',
            background: 'rgba(0,255,136,0.05)',
            animation: 'fadeIn 0.5s ease'
          }}>
            <h2 className="font-bebas glow-green" style={{ fontSize: '3rem', letterSpacing: 4 }}>
              YOU SURVIVED! 🦑
            </h2>
            <button
              className="btn-primary"
              style={{ marginTop: 20, background: 'var(--green)', color: '#000' }}
              onClick={() => navigate('/result')}
            >
              VIEW RESULTS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
