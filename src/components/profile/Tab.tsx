import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProfileInformation from './ProfileInformation';
import Image from 'next/image';
import profileImage from '@/../public/images/profile.png';
import verifiedIcon from '@/../public/images/icons/verified.png';
import EditProfile from './EditProfile';
import MyListing from './MyListing';
import ValuationListing from './ValuationListing';
import LoginSecurity from './LoginSecurity';
import MyFavorites from './MyFavorites';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { UserProfile } from '@/lib/queries/hooks/types/user';

export default function Tab({ userProfile }: { userProfile: UserProfile }) {
  return (
    <div className='w-full'>
      <div className='mb-5 border-b border-neutral-mid/40 pb-5 flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between '>
        <div className='flex flex-col md:flex-row items-center gap-5'>
          <Avatar className='w-16 h-16 rounded-full border-primary-mid border-4'>
            <AvatarImage
              src={userProfile.profile?.avatarUrl || profileImage.src}
            />
            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className=' text-center md:text-left'>
            <div className='flex items-center gap-2'>
              <h5 className='heading-5'>{userProfile.name}</h5>
              <Image src={verifiedIcon} alt='verified' width={24} height={24} />
            </div>
            <span className='caption'>Verified</span>
          </div>
        </div>
        <Link
          href='/post-listing'
          className='flex items-center justify-center h-12 px-10 text-sm font-semibold w-auto bg-primary-main text-white rounded-full'
        >
          Create listing
        </Link>
      </div>

      <Tabs defaultValue='profile-information' className='w-full'>
        <TabsList className='w-full overflow-x-auto justify-start p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          <TabsTrigger
            value='profile-information'
            className='flex-shrink-0 whitespace-nowrap flex-none md:flex-1'
          >
            Profile Information
          </TabsTrigger>
          <TabsTrigger
            value='edit-profile'
            className='flex-shrink-0 whitespace-nowrap flex-none md:flex-1'
          >
            Edit Profile
          </TabsTrigger>
          <TabsTrigger
            value='my-listing'
            className='flex-shrink-0 whitespace-nowrap flex-none md:flex-1'
          >
            My Listing
          </TabsTrigger>
          <TabsTrigger
            value='my-valuation'
            className='flex-shrink-0 whitespace-nowrap flex-none md:flex-1'
          >
            My Valuation
          </TabsTrigger>
          <TabsTrigger
            value='my-favorites'
            className='flex-shrink-0 whitespace-nowrap flex-none md:flex-1'
          >
            My Favorites
          </TabsTrigger>
          <TabsTrigger
            value='login-security'
            className='flex-shrink-0 whitespace-nowrap flex-none lg:flex-1'
          >
            Login Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value='profile-information'>
          <ProfileInformation userProfile={userProfile} />
        </TabsContent>
        <TabsContent value='edit-profile'>
          <EditProfile userProfile={userProfile} />
        </TabsContent>
        <TabsContent value='my-listing'>
          <MyListing />
        </TabsContent>
        <TabsContent value='my-valuation'>
          <ValuationListing />
        </TabsContent>
        <TabsContent value='my-favorites'>
          <MyFavorites />
        </TabsContent>
        <TabsContent value='login-security'>
          <LoginSecurity />
        </TabsContent>
      </Tabs>
    </div>
  );
}
