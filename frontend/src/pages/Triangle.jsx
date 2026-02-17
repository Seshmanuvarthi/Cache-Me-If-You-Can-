import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RoundLayout from '../components/RoundLayout';

const Triangle = () => {
  const [language, setLanguage] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('locked');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshProgress } = useAuth();
  const navigate = useNavigate();

  const fetchQuestion = async (lang) => {
    setLoading(true);
    try {
      const res = await api.get(`/game/triangle?language=${lang}`);
      if (res.data.status === 'unlocked') {
        setStatus('unlocked');
      } else {
        setQuestion(res.data.question);
        setLanguage(res.data.language);
      }
    } catch (err) {
      if (err.response?.status === 403) setStatus('permanently_locked');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    fetchQuestion(lang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await api.post('/game/triangle/submit', { answer });
      await refreshProgress();
      if (res.data.correct) {
        setStatus('unlocked');
        setMessage('✓ Correct output! Well done.');
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
      <polygon points="30,5 55,52 5,52" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <text x="30" y="40" textAnchor="middle" fill="currentColor" fontSize="13" fontFamily="Share Tech Mono, monospace">&gt;_</text>
    </svg>
  );

  const langBadgeStyle = (lang) => ({
    padding: '14px 32px',
    border: `2px solid ${language === lang ? 'var(--pink)' : 'var(--border)'}`,
    background: language === lang ? 'rgba(255,0,118,0.15)' : 'var(--card)',
    color: language === lang ? 'var(--pink)' : 'var(--muted)',
    cursor: 'pointer',
    fontFamily: 'Bebas Neue, cursive',
    fontSize: '1.4rem',
    letterSpacing: 3,
    transition: 'all 0.2s',
    flex: 1,
    textAlign: 'center'
  });

  return (
    <RoundLayout
      title="TRIANGLE — CODE OUTPUT"
      subtitle="Predict the exact output of the code. One chance."
      icon={icon}
      dead={status === 'permanently_locked'}
      locked={status === 'unlocked' ? false : undefined}
    >
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Language selection */}
        {!question && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 32 }}>
            <p style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 24, textAlign: 'center' }}>
              Select programming language:
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={langBadgeStyle('python')} onClick={() => handleLanguageSelect('python')}>
                🐍 Python
              </div>
              <div style={langBadgeStyle('c')} onClick={() => handleLanguageSelect('c')}>
                © C Lang
              </div>
            </div>
            {loading && <p style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', marginTop: 20 }}>Loading question...</p>}
          </div>
        )}

        {/* Question display */}
        {question && !loading && (
          <>
            <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{
                background: language === 'python' ? '#3572A5' : '#555555',
                color: 'white', padding: '4px 12px',
                fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', letterSpacing: 1
              }}>
                {language === 'python' ? 'PYTHON' : 'C LANGUAGE'}
              </span>
            </div>

            <div style={{
              background: '#0d0d0d',
              border: '1px solid var(--border)',
              padding: '24px',
              marginBottom: 24,
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.95rem',
              lineHeight: 1.8,
              color: '#e8e8e8',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto'
            }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.7rem', marginBottom: 12, letterSpacing: 2 }}>
                // PREDICT THE OUTPUT:
              </div>
              {question.question}
            </div>

            <form onSubmit={handleSubmit} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 28 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', letterSpacing: 2 }}>
                PREDICTED OUTPUT
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Type exact output (spaces matter)..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                required
                style={{ marginBottom: 20 }}
              />

              {message && (
                <div style={{
                  padding: '12px 16px', marginBottom: 20,
                  background: 'rgba(0,255,136,0.1)', border: '1px solid var(--green)',
                  color: 'var(--green)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.9rem'
                }}>
                  {message}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? 'CHECKING...' : 'SUBMIT OUTPUT'}
              </button>
            </form>
          </>
        )}

        <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,51,51,0.05)', border: '1px solid rgba(255,51,51,0.2)' }}>
          <p style={{ color: 'var(--danger)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', textAlign: 'center' }}>
            ⚠ Wrong answer = permanent elimination. Match output exactly including spaces.
          </p>
        </div>
      </div>
    </RoundLayout>
  );
};

export default Triangle;
