'use client';

import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/common/NavigationBar';
import Footer from '@/components/common/Footer';
import {
  navigationlinks,
  footerLinks,
  footerAppButtons,
  footerSocials,
} from '../data';

export default function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname === '/login' || pathname === '/signup';

  return (
    <>
      {!hideNavAndFooter && <NavigationBar navigtionItems={navigationlinks} />}
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
