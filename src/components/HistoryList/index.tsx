import { useEffect } from 'react';
import { useHistory } from '../../hooks/useHistory';
import { useHumanize } from '../../hooks/useHumanize';
import { useAppStore } from '../../store';
import { FileText, Download, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryList = () => {
  const { fetchHistory, isLoading, error } = useHistory();
  const { downloadDocx } = useHumanize();
  const history = useAppStore((state) => state.history);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (isLoading && history.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>Loading history...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--accent-error)', textAlign: 'center', padding: '2rem' }}>{error}</div>;
  }

  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
        <FileText size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>No history found</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Your previous conversions will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {history.map((item, i) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-panel" 
          style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ 
                background: 'rgba(139, 92, 246, 0.1)', 
                color: 'var(--accent-secondary)', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                {item.style || item.settings?.style} • {item.intensity_level || item.settings?.intensity_level}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                <Clock size={14} />
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => downloadDocx(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--accent-secondary)'
              }}
            >
              <Download size={16} /> <span style={{ fontSize: '0.875rem' }}>DOCX</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h5 style={{ color: 'var(--text-tertiary)', margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Original</h5>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.original_text || item.input_text}
              </p>
            </div>
            <div>
              <h5 style={{ color: 'var(--accent-success)', margin: '0 0 0.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Humanized</h5>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.humanized_text || item.output_text}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HistoryList;
