import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { humanizeService } from '../services/api';
import { useAppStore } from '../store';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await humanizeService.login({ username, password });
        setAuth(res.access_token, username);
        navigate('/');
      } else {
        const res = await humanizeService.register({ username, password });
        setAuth(res.access_token, username);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <LogIn size={48} className="text-gradient" style={{ marginBottom: '1rem' }} />
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? 'Login to access your history' : 'Sign up to save your processed documents'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</label>
            <input 
              type="text" required 
              value={username} onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" required 
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>

          {error && <div style={{ color: error.includes('thành công') ? 'var(--accent-success)' : 'var(--accent-error)', fontSize: '0.875rem' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', marginTop: '1rem' }}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ color: 'var(--accent-secondary)' }}>
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
