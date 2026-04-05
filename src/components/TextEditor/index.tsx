import { useAppStore } from '../../store';
import FileUpload from '../FileUpload';

const TextEditor = () => {
  const { inputText, setInputText, aiPhrases, result, clearResult } = useAppStore();

  const handleScroll = (e: any) => {
    const backdrop = document.getElementById('highlights-backdrop');
    if (backdrop) backdrop.scrollTop = e.target.scrollTop;
  };

  // Helper to generate text with marker spans for AI phrases
  const renderHighlights = () => {
    let resultNodes = [];
    let lastIndex = 0;
    
    // Process sorted phrases
    const sortedPhrases = [...aiPhrases].sort((a, b) => a.start - b.start);
    
    for (let i = 0; i < sortedPhrases.length; i++) {
      const phrase = sortedPhrases[i];
      if (phrase.start < lastIndex) continue; // skip overlaps
      
      // text before
      resultNodes.push(inputText.substring(lastIndex, phrase.start));
      // highlighted phrase
      resultNodes.push(
        <mark key={i} style={{ backgroundColor: 'rgba(245, 158, 11, 0.4)', color: 'transparent', borderRadius: '2px' }}>
          {inputText.substring(phrase.start, phrase.end)}
        </mark>
      );
      lastIndex = phrase.end;
    }
    resultNodes.push(inputText.substring(lastIndex));
    return resultNodes;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{result ? 'Original Text' : 'Input Text'}</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {inputText && (
             <button 
               onClick={() => { setInputText(''); clearResult(); }} 
               style={{ fontSize: '0.875rem', color: 'var(--accent-error)', cursor: 'pointer', background: 'transparent', border: 'none', textDecoration: 'underline' }}>
               Clear
             </button>
          )}
          <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            {inputText.length} characters
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', minHeight: '350px', flex: 1, display: 'flex' }}>
        {/* Backdrop for highlights */}
        <div 
          id="highlights-backdrop"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            padding: '1rem', fontSize: '1rem', lineHeight: '1.5',
            fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            color: 'transparent', pointerEvents: 'none', overflowY: 'auto'
          }}
        >
          {renderHighlights()}
        </div>

        {/* Actual editable textarea */}
        <textarea
          value={inputText}
          onChange={(e) => {
             setInputText(e.target.value);
             if (!e.target.value.trim()) clearResult();
          }}
          onScroll={handleScroll}
          placeholder="Paste your AI-generated text here..."
          disabled={!!result}
          style={{
             position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
             padding: '1rem', fontSize: '1rem', lineHeight: '1.5', resize: 'none',
             fontFamily: 'inherit', color: result ? 'var(--text-secondary)' : 'var(--text-primary)', 
             background: 'transparent', border: '1px solid var(--border-light)', 
             borderRadius: 'var(--radius-sm)', outline: 'none', zIndex: 2
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-secondary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
        />
      </div>

      {!result && <FileUpload />}
    </div>
  );
};

export default TextEditor;
