import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Mail, CheckCircle, ArrowRight, Bell } from 'lucide-react';

export default function NotifyForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sithumdf_study_subscriber');
    if (saved) {
      setSubmitted(true);
      setEmail(saved);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSubmitted(true);
    localStorage.setItem('sithumdf_study_subscriber', email);

    // Launch Claude terracotta & amber confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#DE5844', '#B45309', '#F59E0B', '#E5DFC9', '#FAF8F5'],
      });
    } catch {
      // Fallback safe
    }
  };

  return (
    <div style={{
      maxWidth: '560px',
      margin: '0 auto',
      width: '100%',
    }}>
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: error ? '1.5px solid #EF4444' : '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: '6px',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.2s ease',
          }}>
            <div style={{ padding: '0 0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your email for early access..."
              aria-label="Email address for launch notification"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                padding: '8px 4px',
              }}
            />
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'var(--claude-terracotta)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(222, 88, 68, 0.35)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--claude-terracotta-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--claude-terracotta)'}
            >
              <span>Notify Me</span>
              <ArrowRight size={15} />
            </button>
          </div>
          {error && (
            <p style={{
              color: '#DC2626',
              fontSize: '0.8rem',
              marginTop: '6px',
              textAlign: 'left',
              paddingLeft: '12px',
            }}>
              {error}
            </p>
          )}
        </form>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          background: 'var(--claude-terracotta-subtle)',
          border: '1px solid var(--claude-terracotta-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 20px',
          color: 'var(--claude-terracotta)',
        }}>
          <CheckCircle size={20} color="var(--claude-terracotta)" />
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>You're on the priority list!</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              We'll send an invite to <strong>{email}</strong> the moment sithumdf.study launches.
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('sithumdf_study_subscriber');
              setSubmitted(false);
              setEmail('');
            }}
            style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textDecoration: 'underline',
              background: 'none',
              padding: '4px',
            }}
          >
            Change
          </button>
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '18px',
        marginTop: '12px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Bell size={12} color="var(--claude-terracotta)" />
          No spam, ever
        </span>
        <span>•</span>
        <span>Launch invite only</span>
        <span>•</span>
        <span>Interactive previews first</span>
      </div>
    </div>
  );
}
