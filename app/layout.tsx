import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { initSentry } from '@/lib/sentry';

initSentry();

export const metadata: Metadata = {
  title: 'Futuristic ANS',
  description: 'A next-generation automated news platform',
  openGraph: {
    title: 'Futuristic ANS',
    description: 'Discover the future of news with AI-powered features',
    url: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </body>
      </html>
    // </ClerkProvider>
  );
}