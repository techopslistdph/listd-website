import { useState } from 'react';
import { toast } from 'sonner';
import { AiValuation } from '@/lib/queries/hooks/types/ai-generate';
import { generateValuationPDF } from '@/lib/utils/generateValuationPDF';
import { PropertyType } from '@/components/listing/types';

interface UseValuationPDFProps {
  valuationResult?: AiValuation;
  propertyType: PropertyType;
}

export const useValuationPDF = ({
  valuationResult,
  propertyType,
}: UseValuationPDFProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!valuationResult) {
      toast.error('No valuation data available');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      try {
        await generateValuationPDF({
          valuation: valuationResult,
          propertyType: propertyType,
        });
        toast.success('PDF report opened for printing');
      } catch (pdfError) {
        console.warn(
          'PDF generation failed, falling back to HTML download:',
          pdfError
        );

        toast.success('HTML report downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return {
    isGeneratingPDF,
    handleDownloadPDF,
  };
};
