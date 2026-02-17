import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RoundLayout from '../components/RoundLayout';

const RedGreen = () => {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState(null); // locked / unlocked / permanently_locked
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { refreshProgress } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/game/redgreen');
      setStatus(res.data.status || 'locked');
    } catch (err) {
      if (err.response?.status === 403) setStatus('permanently_locked');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await api.post('/game/redgreen/submit', { answer });
      await refreshProgress();
      if (res.data.correct) {
        setStatus('unlocked');
        setMessage('✓ Correct! Round unlocked.');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setStatus('permanently_locked');
        setMessage('✗ Wrong! Round permanently locked.');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const icon = (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="30" cy="30" r="14" fill="currentColor" opacity="0.2"/>
      <circle cx="30" cy="30" r="6" fill="currentColor"/>
    </svg>
  );

  return (
    <RoundLayout
      title="RED LIGHT GREEN LIGHT"
      subtitle="Enter the secret passcode to unlock this round"
      icon={icon}
      dead={status === 'permanently_locked'}
      locked={status === 'unlocked' ? false : undefined}
    >
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Animated traffic light graphic */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
          {['#ff3333', '#ffaa00', '#33ff66'].map((color, i) => (
            <div key={i} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: i === 2 ? color : '#1a1a1a',
              border: `2px solid ${color}`,
              boxShadow: i === 2 ? `0 0 20px ${color}` : 'none',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>

        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          padding: 32
        }}>
          <p style={{ color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.7 }}>
            The doll is watching. Enter the correct code to proceed to the next round. One wrong answer and the container is locked permanently.
          </p>

          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', letterSpacing: 2 }}>
              SECRET CODE
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter the secret code..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              required
              style={{ marginBottom: 20 }}
            />

            {message && (
              <div style={{
                padding: '12px 16px',
                marginBottom: 20,
                background: message.startsWith('✓') ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,51,0.1)',
                border: `1px solid ${message.startsWith('✓') ? 'var(--green)' : 'var(--danger)'}`,
                color: message.startsWith('✓') ? 'var(--green)' : 'var(--danger)',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.9rem'
              }}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'CHECKING...' : 'SUBMIT CODE'}
            </button>
          </form>
        </div>
      </div>
    </RoundLayout>
  );
};

export default RedGreen;
