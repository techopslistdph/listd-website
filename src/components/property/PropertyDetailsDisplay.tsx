'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import {
  getAllPropertyDetails,
  PropertyDetailItem,
} from '@/utils/propertyDetailsWithIcons';
import { LucideIcon } from 'lucide-react';

interface PropertyDetailsDisplayProps {
  propertyDetail: PropertyDetail;
  showNumericOnly?: boolean;
  showBooleanOnly?: boolean;
  showAmenitiesOnly?: boolean;
  className?: string;
  itemClassName?: string;
}

export default function PropertyDetailsDisplay({
  propertyDetail,
  className = 'flex flex-wrap gap-4',
  itemClassName = 'flex flex-col items-center justify-center gap-0.5 text-neutral-main text-sm',
}: PropertyDetailsDisplayProps) {
  let details: PropertyDetailItem[] = [];

  details = getAllPropertyDetails(propertyDetail);

  if (details.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {details.map((item, index) => (
        <div key={`${item.key}-${index}`} className={itemClassName}>
          {item.icon && (
            <div className='w-5 h-5'>
              {typeof item.icon === 'function' ? (
                React.createElement(item.icon as LucideIcon, { size: 20 })
              ) : (
                <Image
                  src={item.icon as StaticImageData}
                  alt={item.label}
                  width={20}
                  height={20}
                />
              )}
            </div>
          )}
          <span className='text-center text-sm'>{item.value}</span>
          <span className='text-center text-sm'>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
