import { FormData } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TagInput } from './form/TagInput';
import { ImageUpload } from './form/ImageUpload';
import { ActionButtons } from './form/ActionButtons';
import { AddressFields } from './form/AddressFields';

interface PropertyDetailsStepProps {
  data: FormData;
  onChange: (field: keyof FormData, value: unknown) => void;
  onNext: () => void;
  onBack?: () => void;
  onDraft: () => void;
}

export function PropertyDetailsStep({
  data,
  onChange,
  onNext,
  onBack,
  onDraft,
}: PropertyDetailsStepProps) {
  const renderPropertySpecificFields = () => {
    switch (data.propertyType) {
      case 'warehouse':
        return (
          <>
            <div className='space-y-4'>
              <Label>Building Name</Label>
              <Input
                placeholder='Enter building name'
                value={data.buildingName}
                onChange={e => onChange('buildingName', e.target.value)}
              />
            </div>
            <div className='space-y-4'>
              <Label>Floor Number</Label>
              <Input
                type='number'
                placeholder='Enter floor number'
                value={data.floorNo}
                onChange={e => onChange('floorNo', e.target.value)}
              />
            </div>
            <div className='space-y-4'>
              <Label>Floor Area (sqm)</Label>
              <Input
                type='number'
                placeholder='Enter floor area'
                value={data.floorArea}
                onChange={e => onChange('floorArea', e.target.value)}
              />
            </div>
            <div className='space-y-4'>
              <Label>Ceiling Height (m)</Label>
              <Input
                type='number'
                placeholder='Enter ceiling height'
                value={data.ceilingHeight}
                onChange={e => onChange('ceilingHeight', e.target.value)}
              />
            </div>
          </>
        );
      case 'house and lot':
        return (
          <>
            <div className='space-y-4'>
              <Label>Floor Area (sqm)</Label>
              <Input
                type='number'
                placeholder='Enter floor area'
                value={data.floorArea}
                onChange={e => onChange('floorArea', e.target.value)}
              />
            </div>
            <div className='space-y-4'>
              <Label>Lot Size (sqm)</Label>
              <Input
                type='number'
                placeholder='Enter lot size'
                value={data.lotSize}
                onChange={e => onChange('lotSize', e.target.value)}
              />
            </div>
            <div className='space-y-4'>
              <Label>Lot Type</Label>
              <TagInput
                label='Add lot types'
                value={data.lotType}
                onChange={value => onChange('lotType', value)}
                placeholder='Type and press Enter'
              />
            </div>
            <div className='space-y-4'>
              <Label>Number of Bedrooms</Label>
              <Input
                type='number'
                placeholder='Enter number of bedrooms'
                value={data.bedrooms}
                onChange={e => onChange('bedrooms', e.target.value)}
              />
            </div>
            <div className='space-y-4'>
              <Label>Number of Bathrooms</Label>
              <Input
                type='number'
                placeholder='Enter number of bathrooms'
                value={data.bathrooms}
                onChange={e => onChange('bathrooms', e.target.value)}
              />
            </div>
            <div className='space-y-4'>
              <Label>Number of Parking Spaces</Label>
              <Input
                type='number'
                placeholder='Enter number of parking spaces'
                value={data.parking}
                onChange={e => onChange('parking', e.target.value)}
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={data.fullyFurnished}
                onCheckedChange={checked => onChange('fullyFurnished', checked)}
              />
              <Label>Fully Furnished</Label>
            </div>
          </>
        );
      case 'land':
        return (
          <>
            <div className='space-y-4'>
              <Label>Lot Size (sqm)</Label>
              <Input
                type='number'
                placeholder='Enter lot size'
                value={data.lotSize}
                onChange={e => onChange('lotSize', e.target.value)}
              />
            </div>
            <div className='space-y-4'>
              <Label>Lot Type</Label>
              <TagInput
                label='Add lot types'
                value={data.lotType}
                onChange={value => onChange('lotType', value)}
                placeholder='Type and press Enter'
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Label>Property Type</Label>
        <Select
          value={data.propertyType}
          onValueChange={value => onChange('propertyType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select property type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='warehouse'>Warehouse</SelectItem>
            <SelectItem value='house and lot'>House and Lot</SelectItem>
            <SelectItem value='land'>Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AddressFields data={data} onChange={onChange} />

      {renderPropertySpecificFields()}

      <div className='space-y-4'>
        <Label>Amenities</Label>
        <TagInput
          label='Add amenities'
          value={data.amenities}
          onChange={value => onChange('amenities', value)}
          placeholder='Type and press Enter'
        />
      </div>

      <div className='space-y-4'>
        <Label>Features</Label>
        <TagInput
          label='Add features'
          value={data.features}
          onChange={value => onChange('features', value)}
          placeholder='Type and press Enter'
        />
      </div>

      <div className='space-y-4'>
        <Label>Security Features</Label>
        <TagInput
          label='Add security features'
          value={data.security}
          onChange={value => onChange('security', value)}
          placeholder='Type and press Enter'
        />
      </div>

      <div className='space-y-4'>
        <Label>Images</Label>
        <ImageUpload onChange={files => onChange('images', files)} />
      </div>

      <ActionButtons onDraft={onDraft} onNext={onNext} onBack={onBack} />
    </div>
  );
}
