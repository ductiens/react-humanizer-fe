import { create } from 'zustand';
import type { HistoryItem } from '../types';

interface AppState {
  // Global settings
  style: string;
  intensity_level: string;
  language: string;
  simulateStudent: boolean;
  
  // App state
  inputText: string;
  result: {
    original_text: string;
    humanized_text: string;
    history_id: string;
  } | null;
  history: HistoryItem[];
  
  // Auth state
  token: string | null;
  username: string | null;

  // Analysis state
  aiScore: number | null;
  aiPhrases: {phrase: string, start: number, end: number}[];

  // Setters
  setSettings: (settings: Partial<AppState>) => void;
  setInputText: (text: string) => void;
  setResult: (result: AppState['result']) => void;
  setHistory: (history: HistoryItem[]) => void;
  setAuth: (token: string | null, username: string | null) => void;
  setAnalysis: (score: number | null, phrases: any[]) => void;
  clearResult: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  style: 'academic',
  intensity_level: 'medium',
  language: 'vietnamese',
  simulateStudent: true,
  
  inputText: '',
  result: null,
  history: [],

  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),

  aiScore: null,
  aiPhrases: [],
  
  setSettings: (settings) => set((state) => ({ ...state, ...settings })),
  setInputText: (text) => set({ inputText: text }),
  setResult: (result) => set({ result }),
  setHistory: (history) => set({ history }),
  setAuth: (token, username) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username || '');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    set({ token, username, inputText: '', result: null, aiScore: null, aiPhrases: [], history: [] });
  },
  setAnalysis: (aiScore, aiPhrases) => set({ aiScore, aiPhrases }),
  clearResult: () => set({ result: null }),
}));
