'use client';
import React from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
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

export default function UserProfileCard() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  const userInitials = getInitials(
    user.fullName,
    user.emailAddresses[0]?.emailAddress
  );
  const displayName =
    toTitleCase(user.fullName) || user.emailAddresses[0]?.emailAddress;

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
            <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
            <AvatarFallback className='bg-purple-100 text-purple-600 font-semibold text-xs'>
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <LogOut className='h-4 w-4 text-[var(--primary-main)]' />
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
