import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RoundLayout from '../components/RoundLayout';

const Circle = () => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('locked');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { refreshProgress } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await api.get('/game/circle');
      if (res.data.status === 'unlocked') {
        setStatus('unlocked');
      } else {
        setQuestion(res.data.question);
      }
    } catch (err) {
      if (err.response?.status === 403) setStatus('permanently_locked');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await api.post('/game/circle/submit', { answer });
      await refreshProgress();
      if (res.data.correct) {
        setStatus('unlocked');
        setMessage('✓ Correct! You advance to the next round.');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setStatus('permanently_locked');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const icon = (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="25" fill="rgba(139,90,43,0.3)" stroke="#8b5a2b" strokeWidth="2.5"/>
      <text x="30" y="36" textAnchor="middle" fill="#8b5a2b" fontSize="22" fontFamily="Bebas Neue, cursive">?</text>
    </svg>
  );

  return (
    <RoundLayout
      title="CIRCLE — LOGICAL REASONING"
      subtitle="Solve the logical puzzle. One chance only."
      icon={icon}
      accentColor="#c8a97e"
      dead={status === 'permanently_locked'}
      locked={status === 'unlocked' ? false : undefined}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading question...</div>
      ) : (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          {question && (
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: 32,
              marginBottom: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="#c8a97e" strokeWidth="1.5"/>
                </svg>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', color: '#c8a97e', fontSize: '0.8rem', letterSpacing: 2 }}>LOGICAL SERIES</span>
              </div>

              <p style={{
                fontSize: '1.2rem',
                color: 'var(--text)',
                fontFamily: 'Share Tech Mono, monospace',
                lineHeight: 1.8,
                background: 'rgba(200, 169, 126, 0.05)',
                padding: '20px 24px',
                border: '1px solid rgba(200, 169, 126, 0.2)',
                letterSpacing: 1
              }}>
                {question.question}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 28 }}>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', letterSpacing: 2 }}>
              YOUR ANSWER
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Type your answer..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              required
              style={{ marginBottom: 20 }}
            />

            {message && (
              <div style={{
                padding: '12px 16px', marginBottom: 20,
                background: 'rgba(0,255,136,0.1)',
                border: '1px solid var(--green)',
                color: 'var(--green)',
                fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem'
              }}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', background: '#c8a97e', color: '#000' }}>
              {submitting ? 'CHECKING...' : 'SUBMIT ANSWER'}
            </button>
          </form>

          <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,51,51,0.05)', border: '1px solid rgba(255,51,51,0.2)' }}>
            <p style={{ color: 'var(--danger)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', textAlign: 'center' }}>
              ⚠ Wrong answer = permanent elimination from this round
            </p>
          </div>
        </div>
      )}
    </RoundLayout>
  );
};

export default Circle;
