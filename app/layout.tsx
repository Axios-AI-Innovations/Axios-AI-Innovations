import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmailProvider from '@/components/providers/EmailProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Axios AI Innovations | AI for the Work You Hate',
  description:
    'Full-stack AI solutions that turn 4-hour tasks into 10-minute wins. Built by Axios AI Innovations.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={`${inter.className} bg-slate-950 text-white`}>
      <EmailProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </EmailProvider>
    </body>
  </html>
);

export default RootLayout;

