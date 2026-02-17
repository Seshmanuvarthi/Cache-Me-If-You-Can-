import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const RoundLayout = ({ title, subtitle, icon, accentColor = 'var(--pink)', children, locked, dead }) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <Navbar />
      <div className="container" style={{ padding: '40px 20px', maxWidth: 720 }}>
        {/* Round header */}
        <div style={{ marginBottom: 40 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', marginBottom: 20, letterSpacing: 1 }}
          >
            ← BACK TO HOME
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ color: accentColor, flexShrink: 0 }}>{icon}</div>
            <div>
              <h1 className="font-bebas" style={{ fontSize: '3rem', letterSpacing: 4, color: accentColor, lineHeight: 1 }}>
                {title}
              </h1>
              <p style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', marginTop: 4 }}>
                {subtitle}
              </p>
            </div>
          </div>

          <div style={{ height: 2, background: accentColor, marginTop: 20, boxShadow: `0 0 10px ${accentColor}` }} />
        </div>

        {/* Permanently locked overlay */}
        {dead && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            border: '1px solid var(--danger)',
            background: 'rgba(255,51,51,0.05)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>☠️</div>
            <h2 className="font-bebas" style={{ fontSize: '2.5rem', color: 'var(--danger)', letterSpacing: 3 }}>
              LOCK FREEZED PERMANATLY
            </h2>
            <p style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', marginTop: 12 }}>
              You answered incorrectly. This round is permanently locked.
            </p>
            <button className="btn-secondary" style={{ marginTop: 24 }} onClick={() => navigate('/')}>
              BACK TO HOME
            </button>
          </div>
        )}

        {/* Already unlocked */}
        {locked === false && !dead && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            border: '1px solid var(--green)',
            background: 'rgba(0,255,136,0.05)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h2 className="font-bebas glow-green" style={{ fontSize: '2.5rem', letterSpacing: 3 }}>
              ROUND CLEARED CONTAINER UNLOCKED !
            </h2>
            <button className="btn-secondary" style={{ marginTop: 24, borderColor: 'var(--green)', color: 'var(--green)' }} onClick={() => navigate('/')}>
              BACK TO HOME
            </button>
          </div>
        )}

        {/* Main content */}
        {!dead && locked !== false && children}
      </div>
    </div>
  );
};

export default RoundLayout;
