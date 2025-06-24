import { Container } from '@/components/common/Container';
import Tab from '@/components/profile/Tab';
import { getUserProfile } from '@/lib/queries/server/user';

export default async function UserProfilePage() {
  const userProfile = await getUserProfile();

  if (!userProfile.success || !userProfile.data) {
    return (
      <div className='text-center text-error-main text-xl py-20 flex items-center justify-center'>
        Error: {userProfile?.message || 'User profile not found'}
      </div>
    );
  }

  return (
    <Container>
      <Tab userProfile={userProfile.data} />
    </Container>
  );
}
