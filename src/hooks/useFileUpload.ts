import { useState } from 'react';
import { humanizeService } from '../services/api';
import { useAppStore } from '../store';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const setInputText = useAppStore((state) => state.setInputText);

  const uploadFile = async (file: File) => {
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
      setUploadError('Invalid file format. Only PDF and DOCX are supported.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await humanizeService.uploadFile(file);
      setInputText(response.text);
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || 'Failed to parse file. Please check if the document is readable.');
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, uploadError };
};
