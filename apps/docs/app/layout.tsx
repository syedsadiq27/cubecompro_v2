import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { DocsShell } from '@/components/docs-shell';
import '@repo/ui/styles.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CubeCom Pro Docs',
    template: '%s · CubeCom Pro Docs',
  },
  description:
    'Documentation for CubeCom Pro — Backoffice, 3D Editor, Logo Editor, Customizer, and design principles.',
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
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${GeistMono.variable}`}
    >
      <body className={inter.className}>
        <DocsShell>{children}</DocsShell>
      </body>
    </html>
  );
}
