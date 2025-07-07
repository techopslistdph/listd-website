import { ActionButtons } from './ActionButtons';
import { UseFormReturn } from 'react-hook-form';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ListingFormData } from './Schema';
import GenerateButton from './GenerateButton';
import { useAiGenerate } from '@/lib/queries/hooks/use-ai-generate';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  buildPropertyPrompt,
  validateRequiredFields,
} from '@/lib/utils/propertyPrompBuilder';

interface TitleDescriptionStepProps {
  onChange: (field: keyof ListingFormData, value: unknown) => void;
  onNext: () => void;
  onDraft: () => void;
  form: UseFormReturn<ListingFormData>;
  isSubmitting: boolean;
}

export function TitleDescriptionStep({
  onNext,
  onDraft,
  form,
  isSubmitting,
}: TitleDescriptionStepProps) {
  const [titleGenerated, setTitleGenerated] = useState<string | null>(null);
  const [descriptionGenerated, setDescriptionGenerated] = useState<
    string | null
  >(null);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const { mutate: generateContent } = useAiGenerate();

  const generateAiContent = (type: 'title' | 'description') => {
    const formData = form.getValues();

    const validation = validateRequiredFields(formData);
    if (!validation.isValid) {
      return toast.error(validation.message);
    }

    const request = type === 'title' ? formData.title : formData.description;
    const prompt = buildPropertyPrompt(formData, request, type);

    // Set loading state
    if (type === 'title') {
      setIsGeneratingTitle(true);
    } else {
      setIsGeneratingDescription(true);
    }

    generateContent(
      { ...prompt },
      {
        onSuccess: data => {
          if (data.success) {
            if (type === 'title') {
              setTitleGenerated(data?.data?.content || null);
            } else {
              setDescriptionGenerated(data?.data?.content || null);
            }
          } else {
            toast.error(data.message || 'Failed to generate title');
          }
        },
        onError: error => {
          toast.error(
            error.message || 'Failed to generate content. Please try again.'
          );
        },
        onSettled: () => {
          // Clear loading state
          if (type === 'title') {
            setIsGeneratingTitle(false);
          } else {
            setIsGeneratingDescription(false);
          }
        },
      }
    );
  };

  return (
    <div className='bg-white'>
      <h2 className='heading-5 mb-6'>Title and Description</h2>
      <div className='space-y-6'>
        <div className='flex flex-col gap-2 w-full'>
          <div className='flex items-center gap-2'>
            <FormInput
              name='title'
              label='Title'
              placeholder='Enter your title'
            />
          </div>
          <div
            className={`flex items-end gap-2 w-full ${
              titleGenerated ? 'justify-between' : 'justify-end'
            }`}
          >
            {titleGenerated && (
              <div className='mx-2 flex flex-col gap-2 text-sm w-full'>
                <p className='text-neutral-mid '>Suggestion:</p>
                <div
                  onClick={() => {
                    form.setValue('title', titleGenerated);
                    setTitleGenerated('');
                  }}
                  className='text-neutral-mid flex gap-1 items-center border border-primary-main rounded-md p-2 cursor-pointer'
                >
                  <p className='px-2'>{titleGenerated}</p>
                </div>
              </div>
            )}
            <GenerateButton
              isLoading={isGeneratingTitle}
              onClick={() => generateAiContent('title')}
            />
          </div>
        </div>
        <div className='space-y-4'>
          <Label>Description</Label>
          <Textarea
            placeholder='Tell us what makes your place special!'
            {...form.register('description')}
            className='min-h-[200px]'
          />
          <div
            className={`flex items-end gap-2 w-full ${
              descriptionGenerated ? 'justify-between' : 'justify-end'
            }`}
          >
            {descriptionGenerated && (
              <div className='mx-2 flex flex-col gap-2 text-sm'>
                <p className='text-neutral-mid '>Suggestion:</p>
                <div
                  onClick={() => {
                    if (descriptionGenerated) {
                      form.setValue('description', descriptionGenerated);
                      setDescriptionGenerated(null);
                    }
                  }}
                  className='text-neutral-mid flex gap-1 items-center border border-primary-main rounded-md p-2 cursor-pointer'
                >
                  <p className='px-2'>{descriptionGenerated}</p>
                </div>
              </div>
            )}
            <GenerateButton
              isLoading={isGeneratingDescription}
              onClick={() => generateAiContent('description')}
            />
          </div>
        </div>
      </div>
      <ActionButtons
        onDraft={onDraft}
        onNext={onNext}
        isLoading={isSubmitting}
      />
    </div>
  );
}
