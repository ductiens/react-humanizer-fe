import { History, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import HistoryList from '../components/HistoryList';

const HistoryPage = () => {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textDecoration: 'none', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Quay lại trang chính
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'inset 0 0 0 1px var(--border-light)'
        }}>
          <History size={32} color="var(--accent-secondary)" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>Processing History</h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>Review and download your previously humanized texts.</p>
        </div>
      </div>
      
      <HistoryList />
    </div>
  );
};

export default HistoryPage;
