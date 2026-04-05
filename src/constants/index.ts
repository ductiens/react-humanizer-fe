export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const STYLE_OPTIONS = [
  { value: 'academic', label: 'Academic', description: 'Formal, objective, standard terminology' },
  { value: 'creative', label: 'Creative', description: 'Expressive, narrative, emotional appeal' },
  { value: 'report', label: 'Report', description: 'Direct, structured, clear insights' },
  { value: 'business', label: 'Business', description: 'Professional, persuasive, action-oriented' },
];

export const INTENSITY_OPTIONS = [
  { value: 'light', label: 'Light', description: 'Vocabulary swaps' },
  { value: 'medium', label: 'Medium', description: 'Sentence restructuring' },
  { value: 'heavy', label: 'Heavy', description: 'Full rewrite & tone shift' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'vietnamese', label: 'Vietnamese 🇻🇳' },
  { value: 'english', label: 'English 🇬🇧' },
];
