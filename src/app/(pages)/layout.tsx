import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/lib/queries';
import Main from './main';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

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
        <NextTopLoader  color='#33239f' height={2} showSpinner={false} />
          <QueryProvider>
            <Toaster position='top-right' />
              <Main>{children}</Main>
            </QueryProvider>
          
        </body>
      </html>
    </ClerkProvider>
  );
}
