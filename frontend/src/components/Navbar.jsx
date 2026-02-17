import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Timer from './Timer';

const Navbar = () => {
  const { team, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'var(--dark2)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--pink)', boxShadow: '0 0 8px var(--pink)' }} />
          <div style={{ width: 12, height: 12, background: 'var(--pink)', boxShadow: '0 0 8px var(--pink)', clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
          <div style={{ width: 12, height: 12, background: 'var(--pink)', boxShadow: '0 0 8px var(--pink)' }} />
        </div>
        <span className="font-bebas glow-pink" style={{ fontSize: '1.4rem', letterSpacing: 3 }}>
          SQUID GAME
        </span>
      </div>

      {/* Center - Timer */}
      <Timer />

      {/* Right - Team + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem' }}>
          {team?.teamId}
        </span>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            padding: '6px 14px',
            cursor: 'pointer',
            fontFamily: 'Bebas Neue, cursive',
            letterSpacing: 1,
            fontSize: '0.95rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--pink)'; e.target.style.color = 'var(--pink)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)'; }}
        >
          BOARD
        </button>
        <button className="btn-secondary" onClick={handleLogout} style={{ padding: '6px 14px', fontSize: '0.9rem' }}>
          EXIT
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
