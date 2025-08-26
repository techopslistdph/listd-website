'use client';

import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/ui/common/NavigationBar';
import Footer from '@/components/ui/common/Footer';
import {
  navigationlinks,
  footerLinks,
  footerAppButtons,
  footerSocials,
} from '../data';
import { UserProfile } from '@/lib/queries/hooks/types/user';

export default function Main({
  children,
  userProfile,
}: {
  children: React.ReactNode;
  userProfile: UserProfile | null;
}) {
  const pathname = usePathname();
  const hideNavAndFooter =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password';

  return (
    <>
      {!hideNavAndFooter && (
        <NavigationBar
          userProfile={userProfile}
          navigtionItems={navigationlinks}
        />
      )}
      {children}
      {!hideNavAndFooter && (
        <Footer
          footerLinks={footerLinks}
          footerAppButtons={footerAppButtons}
          footerSocials={footerSocials}
        />
      )}
    </>
  );
}
