import { useState } from 'react';
import { humanizeService } from '../services/api';
import { useAppStore } from '../store';
import { API_BASE_URL } from '../constants';

export const useHumanize = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streamText, setStreamText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const store = useAppStore();

  const humanize = async () => {
    if (!store.inputText.trim()) {
      setError('Please provide text to humanize');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setStreamText('');
    setError(null);
    store.clearResult();

    try {
      const token = store.token;
      let headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/humanize/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: store.inputText,
          style: store.style,
          intensity_level: store.intensity_level,
          language: store.language,
          simulate_student: store.simulateStudent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body received from the server');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamData = '';
      let leftover = ''; // Buffer for fragmented chunks

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkStr = leftover + decoder.decode(value, { stream: true });
        const events = chunkStr.split('\n\n');
        
        // The last element might be incomplete; save it for the next read
        leftover = events.pop() || '';

        for (const event of events) {
          if (event.startsWith('data: ')) {
            try {
              const data = JSON.parse(event.substring(6));
              if (data.type === 'progress') setProgress(data.progress);
              if (data.type === 'chunk') {
                streamData += (streamData ? '\n\n' : '') + data.text;
                setStreamText(streamData);
              }
              if (data.type === 'complete') {
                 store.setResult({
                    original_text: store.inputText,
                    humanized_text: data.humanized_text,
                    history_id: data.history_id
                 });
                 setProgress(100);
              }
              if (data.type === 'error') throw new Error(data.detail);
            } catch (e) {
              console.error("Failed to parse SSE event:", e);
            }
          }
        }
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while humanizing the text.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocx = async (historyId: string) => {
    try {
      await humanizeService.downloadDocx(historyId, `ai-humanized-${historyId.slice(-6)}.docx`);
    } catch (err) {
      console.error('Failed to download document:', err);
    }
  };

  return { humanize, downloadDocx, isLoading, progress, streamText, error };
};
