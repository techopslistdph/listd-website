import { api } from '@/lib/fetch-wrapper';
import { useMutation } from '@tanstack/react-query';
import { AiGeneratePrompt, AiGenerateResponse } from './types/ai-generate';
import { LocationCoordinatesResponse } from '../server/propety/type';

interface ValuationResponse {
  data: Record<string, unknown>;
  error?: { message: string };
}

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

  valuate: async (prompt: AiGeneratePrompt, userId: string) => {
    try {
      console.log(prompt);
      const locationCoordinates = await api.post<LocationCoordinatesResponse>(
        `/api/google-maps/address-autocomplete`,
        {
          query: prompt.location,
        }
      );

      if ('error' in locationCoordinates) {
        return {
          success: false,
          data: null,
          message:
            locationCoordinates.error?.message || 'Location coordinates failed',
        };
      }

      // get the long lat from the location coordinates
      const longLat = locationCoordinates.data.predictions[0].coordinates;

      // pass it inside the context as lat and lng
      prompt.context!.latitude = longLat.latitude;
      prompt.context!.longitude = longLat.longitude;

      console.log(prompt);
      // Generate the AI valuation
      const aiResponse = await ai.generate(prompt);

      if (!aiResponse.success || !aiResponse.data) {
        return {
          success: false,
          data: null,
          message: aiResponse.message || 'AI valuation generation failed',
        };
      }

      const valuationPayload = {
        inputPayload: {
          ...prompt.context,
          location: prompt?.location,
          propertyType: prompt.propertyType,
        },
        aiResult: {
          ...(prompt.context?.transactionType?.toLowerCase().includes('rent')
            ? aiResponse.data?.valuation?.rentalPrice ||
              aiResponse.data?.valuation?.salePrice
            : aiResponse.data?.valuation?.salePrice ||
              aiResponse.data?.valuation?.rentalPrice),
          valuationDate: new Date().toISOString(),
        },
        manualValuationResult: aiResponse.data.valuation?.analysis,
        status: 'completed',
      };

      if (!userId) {
        return {
          success: true,
          data: valuationPayload,
          message: 'Valuation completed',
        };
      }

      const valuationResponse = await api.post<ValuationResponse>(
        '/api/valuations',
        valuationPayload
      );

      if ('error' in valuationResponse) {
        return {
          success: false,
          data: null,
          message:
            valuationResponse.error?.message || 'Valuation submission failed',
        };
      }

      return {
        success: true,
        data: {
          ...valuationResponse.data,
        },
        message: 'Valuation completed and submitted successfully',
      };
    } catch (error) {
      console.error(
        'Error in valuation process:',
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

export const useAiValuate = () => {
  return useMutation({
    mutationFn: ({
      prompt,
      userId,
    }: {
      prompt: AiGeneratePrompt;
      userId: string;
    }) => ai.valuate(prompt, userId),
  });
};
