import { UserProfile } from '@/lib/queries/server/user/types';

export default function ProfileInformation({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const information = [
    {
      label: 'First Name',
      value: userProfile.profile?.firstName,
    },
    {
      label: 'Last Name',
      value: userProfile.profile?.lastName,
    },
    {
      label: 'Email',
      value: userProfile.email,
    },
    {
      label: 'Company Name',
      value: userProfile.profile?.companyName || 'Not Provided',
    },
    {
      label: 'Government ID (Optional)',
      value: userProfile.profile?.governmentIdUrl || 'Not Provided',
    },
  ];

  return (
    <div className='w-full lg:p-8'>
      <div className='space-y-3 lg:space-y-5'>
        {information.map(item => (
          <div
            key={item.label}
            className='rounded-lg border-[#F6F6F6] border p-4 lg:p-5 shadow-2xl shadow-[#F7EFFD] space-y-0.5 lg:space-y-1'
          >
            <p className='text-sm lg:text-base'>{item.label}</p>
            <p className='text-xs lg:text-sm text-neutral-mid'>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
