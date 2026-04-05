import { useRef } from 'react';
import * as Diff from 'diff';

interface DiffViewProps {
  original: string;
  humanized: string;
}

const DiffView = ({ original, humanized }: DiffViewProps) => {
  const diff = Diff.diffWordsWithSpace(original, humanized);
  
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (targetRef.current) {
      const source = e.currentTarget;
      // Calculate percentage scrolled
      const scrollPercentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
      
      // Apply percentage to target
      targetRef.current.scrollTop = scrollPercentage * (targetRef.current.scrollHeight - targetRef.current.clientHeight);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem', height: '500px' }}>
      {/* Left side: Original with removals highlighted */}
      <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <h4 style={{ color: 'var(--text-tertiary)', margin: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', background: 'var(--bg-dark)', padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>Original Input</h4>
        <div 
          ref={leftRef}
          onScroll={(e) => handleScroll(e, rightRef)}
          className="custom-scrollbar"
          style={{ 
            padding: '1.5rem', 
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontSize: '0.95rem',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {diff.map((part, index) => {
            if (part.added) return null;
            return (
              <span 
                key={`orig-${index}`} 
                style={{
                  background: part.removed ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                  color: part.removed ? '#fca5a5' : 'var(--text-primary)',
                  textDecoration: part.removed ? 'line-through' : 'none',
                  borderRadius: '2px'
                }}
              >
                {part.value}
              </span>
            );
          })}
        </div>
      </div>

      {/* Right side: Humanized with additions highlighted */}
      <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <h4 style={{ color: 'var(--accent-success)', margin: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', background: 'var(--bg-dark)', padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>Humanized Output</h4>
        <div 
          ref={rightRef}
          onScroll={(e) => handleScroll(e, leftRef)}
          className="custom-scrollbar"
          style={{ 
            padding: '1.5rem', 
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontSize: '0.95rem',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {diff.map((part, index) => {
            if (part.removed) return null;
            return (
              <span 
                key={`hum-${index}`} 
                style={{
                  background: part.added ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: part.added ? '#6ee7b7' : 'var(--text-primary)',
                  borderRadius: '2px'
                }}
              >
                {part.value}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiffView;
