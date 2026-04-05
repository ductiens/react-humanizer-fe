import { UploadCloud } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useRef } from 'react';

const FileUpload = () => {
  const { uploadFile, isUploading, uploadError } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.docx" 
        style={{ display: 'none' }} 
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        style={{
          width: '100%',
          padding: '1.5rem',
          border: '1px dashed var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.01)',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s',
          cursor: isUploading ? 'not-allowed' : 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-secondary)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
      >
        <UploadCloud size={32} color={isUploading ? 'var(--text-tertiary)' : 'var(--accent-secondary)'} />
        <span style={{ fontWeight: 500 }}>
          {isUploading ? 'Processing File...' : 'Upload PDF or DOCX to Extract Text'}
        </span>
      </button>

      {uploadError && (
        <p style={{ color: 'var(--accent-error)', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>
          {uploadError}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
