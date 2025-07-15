import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/lib/queries';
import Main from './main';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import { getUser } from '@/lib/queries/server/user';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Listd',
  description: 'Listd',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userProfile] = await Promise.all([getUser()]);

  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${poppins.variable} antialiased`}>
          <NextTopLoader
            easing='ease'
            color='#33239f'
            height={2}
            showSpinner={true}
          />
          <QueryProvider>
            <Toaster position='top-right' />
            <Main userProfile={userProfile?.data || null}>{children}</Main>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
