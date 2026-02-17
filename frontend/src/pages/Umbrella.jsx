import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RoundLayout from '../components/RoundLayout';

const Umbrella = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('locked');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { refreshProgress } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/game/umbrella');
      if (res.data.status === 'unlocked') {
        setStatus('unlocked');
      } else {
        setQuestions(res.data.questions || []);
      }
    } catch (err) {
      if (err.response?.status === 403) setStatus('permanently_locked');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      setMessage('⚠ Answer all 3 questions before submitting');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      const res = await api.post('/game/umbrella/submit', { answers });
      await refreshProgress();
      if (res.data.correct) {
        setStatus('unlocked');
        setMessage('✓ All correct! YOU SURVIVED THE SQUID GAME!');
        setTimeout(() => navigate('/result'), 2000);
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
      <path d="M30 10 Q8 10 8 30 Q8 32 30 32 Q52 32 52 30 Q52 10 30 10 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="30" y1="32" x2="30" y2="50" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M30 50 Q30 56 23 56" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  );

  const allAnswered = questions.length > 0 && Object.keys(answers).length >= questions.length;

  return (
    <RoundLayout
      title="UMBRELLA — TECH MCQ"
      subtitle="Answer all 3 questions correctly to survive the final round"
      icon={icon}
      accentColor="#a855f7"
      dead={status === 'permanently_locked'}
      locked={status === 'unlocked' ? false : undefined}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading questions...</div>
      ) : (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div style={{
            background: 'rgba(168,85,247,0.05)',
            border: '1px solid rgba(168,85,247,0.2)',
            padding: '12px 20px',
            marginBottom: 24,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.85rem',
            color: '#a855f7',
            textAlign: 'center'
          }}>
            FINAL ROUND — All 3 must be correct simultaneously. Wrong = Game Over.
          </div>

          <form onSubmit={handleSubmit}>
            {questions.map((q, qIdx) => (
              <div
                key={q._id}
                style={{
                  background: 'var(--card)',
                  border: `1px solid ${answers[q._id] ? 'rgba(168,85,247,0.4)' : 'var(--border)'}`,
                  padding: 28,
                  marginBottom: 16,
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: answers[q._id] ? '#a855f7' : 'var(--dark3)',
                    border: `2px solid ${answers[q._id] ? '#a855f7' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Bebas Neue, cursive', fontSize: '0.9rem',
                    color: answers[q._id] ? 'white' : 'var(--muted)',
                    flexShrink: 0, transition: 'all 0.2s'
                  }}>
                    {qIdx + 1}
                  </div>
                  <p style={{ fontFamily: 'Share Tech Mono, monospace', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {q.question}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {q.options?.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      onClick={() => handleSelect(q._id, option)}
                      style={{
                        padding: '12px 16px',
                        border: `1px solid ${answers[q._id] === option ? '#a855f7' : 'var(--border)'}`,
                        background: answers[q._id] === option ? 'rgba(168,85,247,0.15)' : 'var(--dark3)',
                        cursor: 'pointer',
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: '0.85rem',
                        color: answers[q._id] === option ? '#a855f7' : 'var(--text)',
                        transition: 'all 0.15s',
                        boxShadow: answers[q._id] === option ? '0 0 10px rgba(168,85,247,0.2)' : 'none'
                      }}
                      onMouseEnter={e => {
                        if (answers[q._id] !== option) e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
                      }}
                      onMouseLeave={e => {
                        if (answers[q._id] !== option) e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      <span style={{ color: '#a855f7', marginRight: 8 }}>
                        {['A', 'B', 'C', 'D'][optIdx]}.
                      </span>
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Progress indicator */}
            <div style={{
              marginBottom: 20,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.85rem',
              color: 'var(--muted)'
            }}>
              {questions.map((q, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: answers[q._id] ? '#a855f7' : 'var(--border)',
                  boxShadow: answers[q._id] ? '0 0 6px #a855f7' : 'none',
                  transition: 'all 0.2s'
                }} />
              ))}
              <span style={{ marginLeft: 8 }}>{Object.keys(answers).length}/{questions.length} answered</span>
            </div>

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
              disabled={submitting || !allAnswered}
              style={{ width: '100%', background: '#a855f7' }}
            >
              {submitting ? 'CHECKING...' : 'SUBMIT ALL ANSWERS'}
            </button>
          </form>
        </div>
      )}
    </RoundLayout>
  );
};

export default Umbrella;
