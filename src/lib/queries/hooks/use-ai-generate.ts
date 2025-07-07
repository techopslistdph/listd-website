import { api } from '@/lib/fetch-wrapper';
import { useMutation } from '@tanstack/react-query';
import { AiGeneratePrompt, AiGenerateResponse } from './types/ai-generate';

const ai = {
  generate: async (prompt: AiGeneratePrompt) => {
    try {
      const response = await api.post<AiGenerateResponse>(
        '/api/ai-tools/generate',
        { ...prompt }
      );

      if ('error' in response) {
        return {
          success: false,
          data: null,
          message: response.error?.message || 'AI generation failed',
        };
      }

      return {
        success: true,
        data: response.data,
        message: 'Generated successfully',
      };
    } catch (error) {
      console.error(
        'Error generating AI:',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      throw error;
    }
  },
};

export const useAiGenerate = () => {
  return useMutation({
    mutationFn: (prompt: AiGeneratePrompt) => ai.generate(prompt),
  });
};
