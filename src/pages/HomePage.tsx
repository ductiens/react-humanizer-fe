import StyleSelector from '../components/StyleSelector';
import TextEditor from '../components/TextEditor';
import AnalysisPanel from '../components/AnalysisPanel';
import DiffView from '../components/DiffView';
import { useAppStore } from '../store';
import { useHumanize } from '../hooks/useHumanize';
import { Sparkles } from 'lucide-react';

const HomePage = () => {
  const { inputText, result } = useAppStore();
  const { humanize, downloadDocx, isLoading, progress, streamText, error, hasStarted } = useHumanize();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
          Make AI Text <span className="text-gradient">Human.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Effortlessly bypass AI detectors and create natural-sounding text. Upload your documents or paste text directly.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr) minmax(300px, 1fr)', 
        gap: '2rem',
        alignItems: 'stretch'
      }}>
        {/* Left Column */}
        <TextEditor />

        {/* Center Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
          <StyleSelector />
          
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             {/* <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
               <em>Disclaimer: Kết quả mang tính best-effort. App không đảm bảo bypass bất kỳ AI detector nào.</em>
             </p> */}
             <button
               onClick={humanize}
               disabled={isLoading || !inputText.trim()}
               style={{
                 width: '100%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '0.5rem',
                 padding: '1rem',
                 borderRadius: 'var(--radius-xl)',
                 background: isLoading ? 'var(--text-tertiary)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                 color: 'white',
                 fontWeight: 800,
                 fontSize: '1.1rem',
                 boxShadow: isLoading ? 'none' : 'var(--shadow-glow)',
                 cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                 transition: 'all 0.3s'
               }}
             >
               {isLoading ? (
                 <span>Processing Chunk...</span>
               ) : (
                 <>
                   <Sparkles size={20} />
                   <span>Humanize Văn Bản</span>
                 </>
               )}
             </button>

             {error && (
               <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)', borderRadius: 'var(--radius-sm)' }}>
                 {error}
               </div>
             )}
          </div>
        </div>

        {/* Right Column */}
        <AnalysisPanel isProcessing={isLoading} progress={progress} downloadAction={downloadDocx} />
      </div>

      {/* Show Diff View below as soon as humanization has been started or we have a result */}
      {(hasStarted || result) && (
         <div style={{ marginTop: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Live Comparison</h3>
            <DiffView original={inputText} humanized={result ? result.humanized_text : streamText} />
         </div>
      )}
    </div>
  );
};

export default HomePage;
