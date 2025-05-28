import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../globals.css';
import NavigationBar from '@/components/common/NavigationBar';
import {
  navigationlinks,
  footerLinks,
  footerAppButtons,
  footerSocials,
} from '../data';
import Footer from '@/components/common/Footer';

import {
  ClerkProvider,
} from '@clerk/nextjs'
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Listd',
  description: 'Listd',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigtionItems = navigationlinks;

  return (
    <ClerkProvider>
    <html lang='en'>
      <body className={`${poppins.variable} antialiased`}>
        <NavigationBar navigtionItems={navigtionItems} />
        {children}
        <Footer
          footerLinks={footerLinks}
          footerAppButtons={footerAppButtons}
          footerSocials={footerSocials}
        />
      </body>
    </html>
    </ClerkProvider>
  );
}
