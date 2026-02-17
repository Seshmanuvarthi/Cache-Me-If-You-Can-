import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(teamId.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background shapes */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%', opacity: 0.05,
        width: 200, height: 200, borderRadius: '50%',
        border: '3px solid var(--pink)'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%', opacity: 0.05,
        width: 200, height: 200,
        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        background: 'var(--pink)'
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '8%', opacity: 0.05,
        width: 150, height: 150,
        background: 'var(--pink)'
      }} />

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: 40,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        position: 'relative',
        animation: 'fadeIn 0.6s ease'
      }}>
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--pink)', boxShadow: '0 0 20px var(--pink)' }} />

        {/* Logo shapes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 32 }}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--pink)" strokeWidth="2.5" />
          </svg>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <polygon points="18,3 33,30 3,30" fill="none" stroke="var(--pink)" strokeWidth="2.5" />
          </svg>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <rect x="5" y="5" width="26" height="26" fill="none" stroke="var(--pink)" strokeWidth="2.5" />
          </svg>
        </div>

        <h1 className="font-bebas glow-pink" style={{ textAlign: 'center', fontSize: '2.8rem', marginBottom: 4, letterSpacing: 6 }}>
          SQUID GAME
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 40, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 2 }}>
          TECH FEST EVENT — ENTER TO PLAY
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'Share Tech Mono, monospace', letterSpacing: 2 }}>
              TEAM ID
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. TEAM01"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'Share Tech Mono, monospace', letterSpacing: 2 }}>
              PASSWORD
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              marginBottom: 20,
              padding: '12px 16px',
              background: 'rgba(255, 51, 51, 0.1)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.85rem'
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'CONNECTING...' : 'ENTER THE GAME'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)', fontSize: '0.75rem', fontFamily: 'Share Tech Mono, monospace' }}>
          Your timer starts upon login
        </p>
      </div>
    </div>
  );
};

export default Login;
