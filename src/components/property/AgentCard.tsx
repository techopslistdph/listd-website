import Image, { StaticImageData } from 'next/image';
import verified from '@/../public/images/icons/verified.png';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { draftConversation } from '@/lib/utils/draftConversation';
import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { useGetProfile } from '@/lib/queries/hooks/use-user-profile';
import { useRouter } from 'next/navigation';

interface Agent {
  name: string;
  image?: StaticImageData;
  whatsapp: string;
  email: string;
  isVerified: boolean;
  position: string;
  avatarUrl: string;
}

interface AgentCardProps {
  agent: Agent;
  propertyDetail: PropertyDetail;
  propertyOwnerId: string;
}

export function AgentCard({
  agent,
  propertyDetail,
  propertyOwnerId,
}: AgentCardProps) {
  const { data: currentUser } = useGetProfile();
  const router = useRouter();
  return (
    <div className='sticky top-5'>
      <div className='rounded-lg border p-4 flex flex-col  gap-2'>
        <div className='flex items-center gap-2'>
          <Avatar className='size-[60px]'>
            {agent?.avatarUrl && (
              <AvatarImage src={agent?.avatarUrl} alt={agent?.name} />
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
        {currentUser &&
          propertyOwnerId &&
          currentUser?.data?.id !== propertyOwnerId && (
            <div>
              <Button
                className='w-full mt-2 py-6 text-base rounded-full hover:bg-primary-main bg-primary-main text-white text-center font-semibold'
                onClick={() => {
                  // Validate IDs before creating draft
                  if (!propertyOwnerId) {
                    console.error('Property Owner ID not available');
                    return;
                  }

                  if (!propertyDetail.property?.id) {
                    console.error('Property ID not available');
                    return;
                  }

                  draftConversation(
                    propertyDetail.property.propertyOwner,
                    propertyDetail
                  );
                  router.push('/message');
                }}
              >
                Direct Message
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}
