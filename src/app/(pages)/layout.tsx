import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/lib/queries';
import Main from './main';
import { Toaster } from 'sonner';
import ProgressBarProviders from '@/components/providers/ProgressBarProvider';

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
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${poppins.variable} antialiased`}>
          <QueryProvider>
            <Toaster position='top-right' />
              <ProgressBarProviders>
              <Main>{children}</Main>
            </ProgressBarProviders>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
