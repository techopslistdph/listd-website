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
import { UserProfile } from '@/lib/queries/hooks/types/user';

export default function UserProfileCard({
  userProfile,
}: {
  userProfile: UserProfile | null;
}) {
  const { signOut } = useClerk();

  if (!userProfile) return null;

  const userInitials = getInitials(userProfile.name, userProfile.email);
  const displayName = toTitleCase(userProfile.name) || userProfile.email;

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
              src={userProfile.profile?.avatarUrl}
              alt={userProfile.name || 'User'}
            />
            <AvatarFallback className='bg-purple-100 text-purple-600 font-semibold text-xs'>
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <LogOut className='h-4 w-4 text-primary-main' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/profile' className='flex items-center gap-2 w-full'>
            <User className='mr-2 h-4 w-4' />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
