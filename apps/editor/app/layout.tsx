import type { Metadata, Viewport } from 'next';
import '@repo/ui/styles.css';
import './globals.css';
import { instrumentSans } from '@/lib/fonts';

export const metadata: Metadata = {
  title: {
    default: 'CubeCom Pro · 3D Editor',
    template: '%s · CubeCom Pro',
  },
  description:
    '3D product editor for CubeCom Pro — stage, materials, and configuration.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={instrumentSans.variable} suppressHydrationWarning>
      <body className={`${instrumentSans.className} ui-type-body`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
