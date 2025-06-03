import Image, { StaticImageData } from 'next/image';
import calculateMortgageIcon from '@/../public/images/icons/calculate-mortgage.svg';
import shortMortgageCaseIcon from '@/../public/images/icons/short-mortgage.svg';
import verified from '@/../public/images/icons/verified.png';
interface Agent {
  name: string;
  image: StaticImageData;
  whatsapp: string;
  email: string;
  isVerified: boolean;
  position: string;
}

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className='sticky top-5'>
      <div className='rounded-lg border p-4 flex flex-col  gap-2'>
        <div className='flex items-center gap-2'>
          <Image
            src={agent.image}
            alt={agent.name}
            width={60}
            height={60}
            className='rounded-full'
          />
          <div className='font-semibold flex flex-col items-start gap-1'>
            <div className='flex items-center gap-1'>
              {agent.name}{' '}
              {agent.isVerified && (
                <Image src={verified} alt='verified' width={16} height={16} />
              )}
            </div>
            <div className='text-xs text-gray-500'>{agent.position}</div>
          </div>
        </div>
        <a
          href={`https://wa.me/${agent.whatsapp}`}
          className='w-full mt-2 py-3 rounded-full bg-primary-main text-white text-center font-semibold'
        >
          Whatsapp
        </a>
        <a
          href={`mailto:${agent.email}`}
          className='w-full py-3 rounded-full border border-primary-main text-primary-main text-center font-semibold'
        >
          Direct Message
        </a>
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
