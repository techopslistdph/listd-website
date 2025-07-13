interface TabNavigationProps {
  activeTab: 'published' | 'draft' | 'closed'
  onTabChange: (tab: 'published' | 'draft' | 'closed') => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { key: 'published' as const, label: 'Published' },
    { key: 'closed' as const, label: 'Closed' },
    { key: 'draft' as const, label: 'Drafts' }
  ]

  return (
    <div className='flex bg-gray-100 rounded-full mb-6 w-full'>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 py-2 text-sm lg:text-base rounded-full font-medium transition cursor-pointer ${
            activeTab === tab.key
              ? 'bg-[#4B23A0] text-white'
              : 'text-gray-500'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
} 