export default function ProfileInformation() {
  const information = [
    {
      label: 'First Name',
      value: 'John',
    },
    {
      label: 'Last Name',
      value: 'Doe',
    },
    {
      label: 'Email',
      value: 'john.doe@example.com',
    },
    {
      label: 'Company Name',
      value: 'Not Provided',
    },
    {
      label: 'Government ID (Optional)',
      value: 'Provided',
    },
  ];

  return (
    <div className='w-full'>
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
