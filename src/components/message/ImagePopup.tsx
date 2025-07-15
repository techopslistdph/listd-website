/* eslint-disable @next/next/no-img-element */
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';

interface Attachment {
  id?: string;
  fileUrl: string;
  fileName: string;
  fileType?: string;
}

interface ImagePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachments: Attachment[];
  initialIndex?: number;
}

export default function ImagePopup({
  open,
  onOpenChange,
  attachments,
  initialIndex = 0,
}: ImagePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset current index when popup opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex]);

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : attachments.length - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [attachments.length, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev < attachments.length - 1 ? prev + 1 : 0));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [attachments.length, isTransitioning]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onOpenChange(false);
    },
    [handleNext, handlePrevious, onOpenChange]
  );

  const currentAttachment = attachments[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='sr-only'>Image Preview</DialogTitle>
      <DialogContent
        className='max-w-[90vw] max-h-[90vh] w-full h-full p-0 bg-black/80 border-0'
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <DialogClose className='absolute top-4 right-4 z-50 text-white hover:text-gray-300'>
          <X className='h-6 w-6' />
        </DialogClose>

        {/* Header with image count */}
        <div className='absolute top-4 left-4 z-50 text-white text-sm'>
          {currentIndex + 1} / {attachments.length}
        </div>

        {/* Main image container */}
        <div className='relative w-full h-full flex items-center justify-center'>
          {currentAttachment?.fileType?.startsWith('image/') ? (
            <img
              src={currentAttachment.fileUrl}
              alt={currentAttachment.fileName}
              className='max-w-full max-h-full object-contain'
            />
          ) : (
            <div className='flex flex-col items-center justify-center text-white'>
              <div className='text-4xl mb-4'>📎</div>
              <div className='text-lg font-medium mb-2'>
                {currentAttachment?.fileName}
              </div>
              <a
                href={currentAttachment?.fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:text-blue-300 underline'
              >
                Download File
              </a>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {attachments.length > 1 && (
          <>
            <button
              className='absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors'
              onClick={handlePrevious}
              disabled={isTransitioning}
            >
              <ChevronLeft className='h-6 w-6' />
            </button>
            <button
              className='absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors'
              onClick={handleNext}
              disabled={isTransitioning}
            >
              <ChevronRight className='h-6 w-6' />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {attachments.length > 1 && (
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50'>
            {attachments.map((attachment, idx) => (
              <div
                key={attachment.id || attachment.fileUrl}
                onClick={() => setCurrentIndex(idx)}
                className={`w-16 h-12 relative border cursor-pointer transition-all ${
                  currentIndex === idx
                    ? 'border-white scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                {attachment.fileType?.startsWith('image/') ? (
                  <img
                    src={attachment.fileUrl}
                    alt={attachment.fileName}
                    className='object-cover h-full w-full rounded'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-600 rounded flex items-center justify-center text-white text-xs'>
                    📎
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
