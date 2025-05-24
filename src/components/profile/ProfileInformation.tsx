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
      <div className='space-y-5'>
        {information.map((item) => (
          <div
            key={item.label}
            className='rounded-lg border-[#F6F6F6] border  p-5 shadow-2xl shadow-[#F7EFFD] space-y-1'
          >
            <p className='body'>{item.label}</p>
            <p className='body-sm text-[var(--neutral-mid)]'>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
