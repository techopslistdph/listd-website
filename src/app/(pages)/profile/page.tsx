import { Container } from '@/components/common/Container';
import Tab from '@/components/profile/Tab';
import TabSkeleton from '@/components/profile/TabSkeleton';
import { getAmenities, getFeatures } from '@/lib/queries/server/propety';
import { getUser } from '@/lib/queries/server/user';

export const dynamic = 'force-dynamic';

export default async function UserProfilePage() {
  const [userProfile, features, amenities] = await Promise.all([
    getUser(),
    getFeatures(),
    getAmenities(),
  ]);

  if (!userProfile.success) {
    return (
      <Container>
        <TabSkeleton />
      </Container>
    );
  }

  if (!userProfile.success || !userProfile.data) {
    return (
      <div className='text-center text-error-main text-xl py-20 flex items-center justify-center'>
        Error: {userProfile.message || 'User profile not found'}
      </div>
    );
  }

  return (
    <Container>
      <Tab
        userProfile={userProfile.data}
        features={features?.data?.uniqueFeatures || []}
        amenities={amenities?.data?.uniqueAmenities || []}
      />
    </Container>
  );
}
