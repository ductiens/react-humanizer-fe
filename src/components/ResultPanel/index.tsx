import { DownloadCloud, CheckCircle } from 'lucide-react';
import DiffView from '../DiffView';
import { useHumanize } from '../../hooks/useHumanize';

interface ResultPanelProps {
  originalText: string;
  humanizedText: string;
  historyId: string;
}

const ResultPanel = ({ originalText, humanizedText, historyId }: ResultPanelProps) => {
  const { downloadDocx } = useHumanize();

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle className="text-gradient" size={24} color="var(--accent-success)" />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Processing Complete</h2>
        </div>
        
        <button
          onClick={() => downloadDocx(historyId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
            fontWeight: 500,
            transition: 'all 0.2s',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'var(--text-secondary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
          }}
        >
          <DownloadCloud size={18} />
          <span>Download DOCX</span>
        </button>
      </div>

      <DiffView original={originalText} humanized={humanizedText} />
    </div>
  );
};

export default ResultPanel;
