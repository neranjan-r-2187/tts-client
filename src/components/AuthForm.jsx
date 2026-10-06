import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from './ErrorMessage';

function AuthForm({ initialMode = 'login', onSuccess, onBack, onGuest }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        if (onSuccess) onSuccess();
      } else {
        await signUp(email, password);
        setNotice('Account created successfully! Logging you in...');
        await signIn(email, password);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <div>
          {onBack && (
            <button
              type="button"
              className="btn-text"
              style={{ fontSize: 13, marginBottom: 12, display: 'inline-block' }}
              onClick={onBack}
            >
              ← Back to Home
            </button>
          )}
          <div className="form-sheet__eyebrow">{mode === 'login' ? 'Welcome back' : 'New here'}</div>
          <h2 className="form-sheet__heading" style={{ marginBottom: 0 }}>
            {mode === 'login' ? 'Log in' : 'Create an account'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <div className="field">
          <label className="field__label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            className="textarea"
            style={{ minHeight: 'auto', height: 44 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            className="textarea"
            style={{ minHeight: 'auto', height: 44 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>

        {notice && <p className="field__meta" style={{ color: 'var(--teal)', marginTop: 12 }}>{notice}</p>}
        <ErrorMessage message={error} />
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
            setNotice('');
          }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>

        {onGuest && (
          <button
            type="button"
            className="btn-text"
            style={{ marginTop: 8, textAlign: 'center' }}
            onClick={onGuest}
          >
            Continue as Guest (No login) →
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthForm;