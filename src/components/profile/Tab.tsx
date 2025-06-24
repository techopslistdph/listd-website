import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProfileInformation from './ProfileInformation';
import Image from 'next/image';
import profileImage from '@/../public/images/profile.png';
import verifiedIcon from '@/../public/images/icons/verified.png';
import Button from '../common/Button';
import EditProfile from './EditProfile';
import MyListing from './MyListing';
import ValuationListing from './ValuationListing';
import LoginSecurity from './LoginSecurity';
import MyFavorites from './MyFavorites';
import { UserProfile } from '@/lib/queries/server/user/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Tab({ userProfile }: { userProfile: UserProfile }) {
  console.log({ userProfile });
  return (
    <div className='w-full'>
      <div className='mb-5 border-b border-neutral-mid/40 pb-5 flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between'>
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
        <Button className='h-12 px-10 text-sm font-semibold sm:w-44 md:w-auto'>
          Create listing
        </Button>
      </div>
      <Tabs defaultValue='profile-information' className='w-full  '>
        <TabsList
          className='mb-8'
          style={{ borderColor: 'var(--primary-main)' }}
        >
          <TabsTrigger value='profile-information'>
            Profile Information
          </TabsTrigger>
          <TabsTrigger value='edit-profile'>Edit Profile</TabsTrigger>
          <TabsTrigger value='my-listing'>My Listing</TabsTrigger>
          <TabsTrigger value='my-valuation'>My Valuation</TabsTrigger>
          <TabsTrigger value='my-favorites'>My Favorites</TabsTrigger>
          <TabsTrigger value='login-security'>Login Security</TabsTrigger>
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
