import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Bot, History, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';

const Layout = () => {
  const { username, token, setAuth } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null, null);
    navigate('/');
  };

  return (
    <div className="app-container">
      <header style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border-light)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 15, 0.8)'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Bot color="white" size={24} />
            </div>
            <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>AI Humanizer</h1>
          </Link>

          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/history" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)'
            }}>
              <History size={18} />
              <span>History</span>
            </Link>

            {token ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={16} /> {username}
                  </span>
                  <button onClick={handleLogout} style={{ color: 'var(--accent-error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <LogOut size={16} /> Logout
                  </button>
               </div>
            ) : (
               <Link to="/login" style={{ 
                 padding: '0.5rem 1.5rem', background: 'var(--accent-primary)', 
                 color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600 
               }}>
                 Login
               </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
