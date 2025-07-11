import Image, { StaticImageData } from 'next/image';
import calculateMortgageIcon from '@/../public/images/icons/calculate-mortgage.svg';
import shortMortgageCaseIcon from '@/../public/images/icons/short-mortgage.svg';
import verified from '@/../public/images/icons/verified.png';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface Agent {
  name: string;
  image?: StaticImageData;
  whatsapp: string;
  email: string;
  isVerified: boolean;
  position: string;
}

interface AgentCardProps {
  agent: Agent;
  propertyOwnerId: string;
}

export function AgentCard({ agent, propertyOwnerId }: AgentCardProps) {
  return (
    <div className='sticky top-5'>
      <div className='rounded-lg border p-4 flex flex-col  gap-2'>
        <div className='flex items-center gap-2'>
          <Avatar className='size-[60px]'>
            {agent?.image && (
              <AvatarImage src={agent?.image?.src} alt={agent?.name} />
            )}
            <AvatarFallback className='bg-primary-main text-white text-lg'>
              {agent?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='font-semibold flex flex-col items-start gap-1'>
            <div className='flex items-center gap-1'>
              {agent?.name}{' '}
              {agent?.isVerified && (
                <Image src={verified} alt='verified' width={16} height={16} />
              )}
            </div>
            <div className='text-xs text-gray-500'>{agent.position}</div>
          </div>
        </div>
        {agent?.whatsapp && (
          <a
            href={`https://wa.me/${agent?.whatsapp}`}
            className='w-full mt-2 py-3 rounded-full bg-primary-main text-white text-center font-semibold'
          >
            Whatsapp
          </a>
        )}
        {propertyOwnerId && (
          <Link
            href='/message'
            className='w-full py-3 rounded-full border border-primary-main text-primary-main text-center font-semibold'
          >
            Direct Message
          </Link>
        )}
      </div>
      <div className='rounded-lg border p-4 flex flex-col items-center gap-2 py-10 mt-5'>
        <div className='flex items-center gap-2 py-3 cursor-pointer'>
          <Image
            src={calculateMortgageIcon}
            alt='calculate-mortgage'
            width={20}
            height={20}
          />
          <span className='underline'>Calculate Mortgage</span>
        </div>
        <div className='flex items-center gap-2 py-3 cursor-pointer'>
          <Image
            src={shortMortgageCaseIcon}
            alt='calculate-mortgage'
            width={20}
            height={20}
          />
          <span className='underline'>Short Mortgage Case</span>
        </div>
      </div>
    </div>
  );
}
