'use client';
import React from 'react';
import { useClerk } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getInitials, toTitleCase } from '@/lib/utils';
import Link from 'next/link';
import { useGetProfile } from '@/lib/queries/hooks/use-user-profile';
import { Skeleton } from '../ui/skeleton';

export default function UserProfileCard() {
  const { data: userProfile, isLoading } = useGetProfile();
  const { signOut } = useClerk();

  if (isLoading) return <Skeleton className='h-8 w-8' />;
  if (!userProfile) return null;

  const userInitials = getInitials(
    userProfile.data?.name,
    userProfile.data?.email
  );
  const displayName =
    toTitleCase(userProfile.data?.name) || userProfile.data?.email;

  const handleLogout = () => {
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity'>
          <span className='text-sm font-medium text-gray-900'>
            {displayName}
          </span>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={userProfile.data?.profile?.avatarUrl}
              alt={userProfile.data?.name || 'User'}
            />
            <AvatarFallback className='bg-purple-100 text-purple-600 font-semibold text-xs'>
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <LogOut className='h-4 w-4 text-primary-main' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem>
          <Link href='/profile' className='flex items-center gap-2'>
            <User className='mr-2 h-4 w-4' />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
