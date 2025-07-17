/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PropertyDetailsDisplay from '@/components/property/PropertyDetailsDisplay';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { parsePropertyDescription } from '@/lib/utils/property';

interface PropertyDescriptionProps {
  description: string;
  propertyDetail: PropertyDetail;
}

export default function PropertyDescription({
  description,
  propertyDetail,
}: PropertyDescriptionProps) {
  const [open, setOpen] = useState(false);
  const parsedSections = parsePropertyDescription(description);

  const renderSection = (section: any, index: number) => {
    switch (section.type) {
      case 'keyValue':
        return (
          <div key={index} className='mb-4'>
            {section.content.map((line: string, lineIndex: number) => {
              const [key, value] = line.split(' : ');
              return (
                <div
                  key={lineIndex}
                  className='flex flex-col sm:flex-row sm:items-center mb-2'
                >
                  <span className='font-medium text-gray-700 min-w-[120px] sm:min-w-[150px]'>
                    {key}:
                  </span>
                  <span className='text-gray-900'>{value}</span>
                </div>
              );
            })}
          </div>
        );

      case 'bulletList':
        return (
          <div key={index} className='mb-4'>
            {section.title && (
              <h4 className='font-semibold text-gray-800 mb-2'>
                {section.title}
              </h4>
            )}
            <ul className='list-disc list-inside space-y-1'>
              {section.content.map((item: string, itemIndex: number) => (
                <li key={itemIndex} className='text-gray-700'>
                  {item.replace(/^[•-]\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'paragraph':
        return (
          <div key={index} className='mb-4'>
            {section.content.map((paragraph: string, paraIndex: number) => (
              <p key={paraIndex} className='text-gray-700 leading-relaxed mb-2'>
                {paragraph}
              </p>
            ))}
          </div>
        );

      case 'contact':
        return (
          <div key={index} className='mb-4 p-4 bg-blue-50 rounded-lg'>
            <h4 className='font-semibold text-blue-800 mb-2'>
              Contact Information
            </h4>
            {section.content.map((contact: string, contactIndex: number) => (
              <p key={contactIndex} className='text-blue-700'>
                {contact}
              </p>
            ))}
          </div>
        );

      case 'source':
        return (
          <div key={index} className='mt-6 pt-4 border-t border-gray-200'>
            <h4 className='font-semibold text-gray-600 mb-2 text-sm'>
              Listing Source
            </h4>
            {section.content.map((source: string, sourceIndex: number) => (
              <p key={sourceIndex} className='text-gray-500 text-sm'>
                {source}
              </p>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='mt-4 md:mt-6 p-5 rounded-lg mb-2 border'>
      <button
        className='flex items-center justify-between w-full font-semibold text-xl mb-2 cursor-pointer focus:outline-none'
        onClick={() => setOpen(prev => !prev)}
        type='button'
      >
        <span>Description</span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className='mt-5'>
          <div className='mb-5 text-neutral-main'>
            {parsedSections.length > 0 ? (
              parsedSections.map((section, index) =>
                renderSection(section, index)
              )
            ) : (
              <p className='text-gray-700 leading-relaxed'>{description}</p>
            )}
          </div>
          <PropertyDetailsDisplay
            propertyDetail={propertyDetail}
            className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full'
          />
        </div>
      )}
    </div>
  );
}
