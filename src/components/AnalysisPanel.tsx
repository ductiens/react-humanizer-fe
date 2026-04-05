import { useAnalysis } from '../hooks/useAnalysis';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { CheckCircle, Copy, DownloadCloud, Activity } from 'lucide-react';

const AnalysisPanel = ({ isProcessing, progress, downloadAction }: any) => {
  const { stats, aiScore, aiPhrases } = useAnalysis();
  const { result, clearResult } = useAppStore();

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'var(--accent-success)'; // green
    if (score <= 70) return 'var(--accent-warning)'; // yellow
    return 'var(--accent-error)'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score <= 30) return 'Có vẻ do người viết';
    if (score <= 70) return 'Khó xác định';
    return 'Có thể do AI viết';
  };

  const getTTRLabel = (ttr: number) => {
    if (ttr > 70) return 'Từ vựng phong phú';
    if (ttr >= 40) return 'Từ vựng bình thường';
    return 'Từ vựng lặp lại nhiều';
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
           <CheckCircle size={48} color="var(--accent-success)" style={{ marginBottom: '1rem' }} />
           <h3 style={{ margin: 0, color: 'var(--accent-success)' }}>Processing Complete</h3>
           <p style={{ color: 'var(--text-secondary)' }}>Văn bản đã qua xử lý tự nhiên.</p>
        </div>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>
            ↓ {aiPhrases.length}
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cụm AI đã thay thế</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
          <button 
           onClick={() => { navigator.clipboard.writeText(result.humanized_text); alert('Copied!') }} 
           style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-surface)' }}>
            <Copy size={16} /> Copy Text
          </button>
          <button 
           onClick={() => downloadAction(result.history_id)} 
           style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
            <DownloadCloud size={16} /> Download DOCX
          </button>
          <button 
           onClick={() => clearResult()} 
           style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', marginTop: '0.5rem', cursor: 'pointer' }}>
            Phân tích lại
          </button>
        </div>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '100%' }}>
        <Activity size={48} className="text-gradient" />
        <h3 style={{ margin: 0 }}>Humanizing Text...</h3>
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', transition: 'width 0.3s ease' }}></div>
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{progress}% Complete</span>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <h3 style={{ margin: 0, fontSize: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>Text Analysis</h3>
      
      {/* 1. AI Detection Score */}
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>AI Probability Score</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
               <circle cx="30" cy="30" r="28" fill="none" stroke="var(--border-light)" strokeWidth="4" />
               {aiScore !== null && (
                 <circle cx="30" cy="30" r="28" fill="none" stroke={getScoreColor(aiScore)} strokeWidth="4" strokeDasharray="175" strokeDashoffset={175 - (175 * aiScore / 100)} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
               )}
            </svg>
            <span style={{ fontWeight: 'bold' }}>{aiScore !== null ? `${aiScore}%` : '-'}</span>
          </div>
          <div>
            <span style={{ color: aiScore !== null ? getScoreColor(aiScore) : 'var(--text-secondary)', fontWeight: 500 }}>
              {aiScore !== null ? getScoreLabel(aiScore) : 'Đang phân tích...'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. AI Phrases */}
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>AI Phrase Detector</h4>
        {aiPhrases.length > 0 ? (
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-warning)', borderRadius: 'var(--radius-xl)', fontSize: '0.875rem', fontWeight: 600 }}>
            ⚠ Phát hiện {aiPhrases.length} cụm từ AI
          </span>
        ) : (
          <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Không tìm thấy mẫu câu AI điển hình.</span>
        )}
      </div>

      {/* 4. TTR */}
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Vocabulary Diversity (TTR)</h4>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
           <div style={{ width: `${stats.ttr}%`, height: '100%', background: stats.ttr > 70 ? 'var(--accent-success)' : stats.ttr >= 40 ? 'var(--accent-warning)' : 'var(--accent-error)' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-tertiary)' }}>{stats.ttr}%</span>
          <span style={{ color: 'var(--text-secondary)' }}>{getTTRLabel(stats.ttr)}</span>
        </div>
      </div>

      {/* 2. Stats */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Words</div>
           <div style={{ fontWeight: 600 }}>{stats.words}</div>
        </div>
        <div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Sentences</div>
           <div style={{ fontWeight: 600 }}>{stats.sentences}</div>
        </div>
        <div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Est. Time</div>
           <div style={{ fontWeight: 600 }}>~{stats.estReadTime} min</div>
        </div>
        <div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Readability</div>
           <div style={{ fontWeight: 600 }}>{stats.readabilityScore}/100</div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
