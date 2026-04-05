import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { humanizeService } from '../services/api';

export const useAnalysis = () => {
  const { inputText, setAnalysis, aiScore, aiPhrases } = useAppStore();
  const [stats, setStats] = useState({
    words: 0,
    sentences: 0,
    paragraphs: 0,
    avgSentenceLength: 0,
    readabilityScore: 0,
    estReadTime: 0,
    ttr: 0
  });

  useEffect(() => {
    // FE Realtime Stats
    const text = inputText.trim();
    if (!text) {
      setStats({ words: 0, sentences: 0, paragraphs: 0, avgSentenceLength: 0, readabilityScore: 0, estReadTime: 0, ttr: 0 });
      setAnalysis(null, []);
      return;
    }

    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(w => w.trim().length > 0);
    const paragraphs = text.split(/\n\n/).filter(w => w.trim().length > 0);
    
    const wordCount = words.length || 1;
    const sentCount = sentences.length || 1;
    
    // TTR (Type-Token Ratio)
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
    const ttr = (uniqueWords.size / wordCount) * 100;

    // Flesch-Kincaid basic approx
    const syllablesPattern = /[aeiouy]+(?:[^aeiouy]+[e])?/gi;
    let syllables = 0;
    words.forEach(w => {
      const match = w.match(syllablesPattern);
      syllables += match ? match.length : 1;
    });
    const readability = 206.835 - 1.015 * (wordCount / sentCount) - 84.6 * (syllables / wordCount);

    setStats({
      words: wordCount,
      sentences: sentCount,
      paragraphs: paragraphs.length,
      avgSentenceLength: Math.round(wordCount / sentCount),
      readabilityScore: Math.round(Math.max(0, Math.min(100, readability))),
      estReadTime: Math.max(1, Math.ceil(wordCount / 200)),
      ttr: Math.round(ttr)
    });

    // Debounce API calls
    const handler = setTimeout(async () => {
      try {
        const [scoreRes, phraseRes] = await Promise.all([
          humanizeService.getAIScore(text),
          humanizeService.getAIPhrases(text)
        ]);
        setAnalysis(scoreRes.score, phraseRes.phrases);
      } catch (e) {
        console.error("Analysis API failed", e);
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [inputText, setAnalysis]);

  return { stats, aiScore, aiPhrases };
};
