'use client';
import { Container } from '@/components/common/Container';
import Tab from '@/components/profile/Tab';
import TabSkeleton from '@/components/profile/TabSkeleton';
import { useGetProfile } from '@/lib/queries/hooks/use-user-profile';

export default function UserProfilePage() {
  const { data: userProfile, isLoading, error } = useGetProfile();

  if (isLoading) {
    return (
      <Container>
        <TabSkeleton />
      </Container>
    );
  }

  if (error || !userProfile?.data) {
    return (
      <div className='text-center text-error-main text-xl py-20 flex items-center justify-center'>
        Error: {error?.message || 'User profile not found'}
      </div>
    );
  }

  return (
    <Container>
      <Tab userProfile={userProfile.data} />
    </Container>
  );
}
