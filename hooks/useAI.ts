import { useState, useCallback } from 'react';
import { analyzeProductIdea } from '../services/geminiService';
import { AIAnalysisResult } from '../types';

interface UseAIState {
  data: AIAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

export const useProductAnalysis = () => {
  const [state, setState] = useState<UseAIState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const analyze = useCallback(async (idea: string) => {
    setState({ data: null, isLoading: true, error: null });

    try {
      if (!idea || idea.length < 5) {
        throw new Error("Please enter a more detailed description.");
      }

      const jsonString = await analyzeProductIdea(idea);
      const parsedData = JSON.parse(jsonString) as AIAnalysisResult;
      
      setState({
        data: parsedData,
        isLoading: false,
        error: null
      });
    } catch (err) {
      console.error(err);
      setState({
        data: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred."
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    analysis: state.data,
    isAnalyzing: state.isLoading,
    error: state.error,
    analyze,
    reset
  };
};