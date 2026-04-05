import { useState, useCallback } from 'react';
import { humanizeService } from '../services/api';
import { useAppStore } from '../store';

export const useHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setHistory = useAppStore((state) => state.setHistory);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await humanizeService.getHistory();
      setHistory(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load history.');
    } finally {
      setIsLoading(false);
    }
  }, [setHistory]);

  return { fetchHistory, isLoading, error };
};
