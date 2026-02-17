import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RoundLayout from '../components/RoundLayout';

const Square = () => {
  const [data, setData] = useState(null);
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
      const res = await api.get('/game/square');
      if (res.data.status === 'unlocked') {
        setStatus('unlocked');
      } else {
        setData(res.data);
      }
    } catch (err) {
      if (err.response?.status === 403) setStatus('permanently_locked');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setAnswer(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answer.length !== 4) {
      setMessage('⚠ Enter exactly 4 digits');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      const res = await api.post('/game/square/submit', { answer });
      await refreshProgress();
      if (res.data.correct) {
        setStatus('unlocked');
        setMessage('✓ Correct! The number is cracked!');
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
      <rect x="6" y="6" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="18" y="18" width="24" height="24" fill="currentColor" opacity="0.15"/>
      <text x="30" y="35" textAnchor="middle" fill="currentColor" fontSize="14" fontFamily="Bebas Neue, cursive">BULL</text>
    </svg>
  );

  return (
    <RoundLayout
      title="SQUARE — COWS & BULLS"
      subtitle="Decode the 4-digit number using the visual clues"
      icon={icon}
      accentColor="#f0c040"
      dead={status === 'permanently_locked'}
      locked={status === 'unlocked' ? false : undefined}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading puzzle...</div>
      ) : (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          {/* Game rules */}
          <div style={{
            background: 'rgba(240,192,64,0.05)',
            border: '1px solid rgba(240,192,64,0.2)',
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            gap: 32
          }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.8 }}>
              <span style={{ color: '#f0c040' }}>🐄 COW</span> = Correct digit, wrong position<br/>
              <span style={{ color: '#f0c040' }}>🐂 BULL</span> = Correct digit, correct position
            </div>
          </div>

          {/* Image display */}
          {data?.imageUrl && (
            <div style={{
              marginBottom: 24,
              border: '1px solid rgba(240,192,64,0.3)',
              overflow: 'hidden',
              background: 'var(--dark3)'
            }}>
              <img
                src={data.imageUrl}
                alt="Cows and Bulls Puzzle"
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 400, objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback if image fails */}
              <div style={{
                display: 'none', height: 200, alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem',
                flexDirection: 'column', gap: 8
              }}>
                <span style={{ fontSize: '2rem' }}>🖼️</span>
                <span>Image: {data.imageUrl}</span>
                <span style={{ fontSize: '0.75rem' }}>Contact event organizer if image doesn't load</span>
              </div>
            </div>
          )}

          {data?.question && (
            <p style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: 'var(--muted)',
              fontSize: '0.9rem',
              marginBottom: 24,
              padding: '12px 16px',
              background: 'var(--dark3)',
              border: '1px solid var(--border)'
            }}>
              {data.question}
            </p>
          )}

          {/* Answer input */}
          <form onSubmit={handleSubmit} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 28 }}>
            <label style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', letterSpacing: 2 }}>
              YOUR 4-DIGIT GUESS
            </label>

            {/* Large digit display */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  flex: 1,
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--dark3)',
                  border: `2px solid ${answer[i] ? '#f0c040' : 'var(--border)'}`,
                  fontFamily: 'Bebas Neue, cursive',
                  fontSize: '2.5rem',
                  color: answer[i] ? '#f0c040' : 'var(--border)',
                  transition: 'all 0.2s',
                  boxShadow: answer[i] ? '0 0 10px rgba(240,192,64,0.3)' : 'none'
                }}>
                  {answer[i] || '—'}
                </div>
              ))}
            </div>

            <input
              type="text"
              className="input-field"
              placeholder="Enter 4-digit number (e.g. 1234)"
              value={answer}
              onChange={handleAnswerChange}
              maxLength={4}
              required
              style={{ marginBottom: 20 }}
            />

            {message && (
              <div style={{
                padding: '12px 16px', marginBottom: 20,
                background: message.startsWith('✓') ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,51,0.1)',
                border: `1px solid ${message.startsWith('✓') ? 'var(--green)' : 'var(--danger)'}`,
                color: message.startsWith('✓') ? 'var(--green)' : 'var(--danger)',
                fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || answer.length !== 4}
              style={{ width: '100%', background: '#f0c040', color: '#000' }}
            >
              {submitting ? 'CHECKING...' : `SUBMIT: ${answer || '????'}`}
            </button>
          </form>

          <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,51,51,0.05)', border: '1px solid rgba(255,51,51,0.2)' }}>
            <p style={{ color: 'var(--danger)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', textAlign: 'center' }}>
              ⚠ Wrong answer = permanent elimination. Study the clues carefully.
            </p>
          </div>
        </div>
      )}
    </RoundLayout>
  );
};

export default Square;
