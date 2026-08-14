import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { DocsShell } from '@/components/docs-shell';
import {
  DOCS_DESCRIPTION,
  DOCS_NAME,
  DOCS_URL,
  MARKETING_URL,
} from '@/lib/site';
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
  metadataBase: new URL(DOCS_URL),
  title: {
    default: 'CubeCom Pro Documentation',
    template: `%s | ${DOCS_NAME}`,
  },
  description: DOCS_DESCRIPTION,
  applicationName: DOCS_NAME,
  authors: [{ name: 'CubeCom Pro', url: MARKETING_URL }],
  creator: 'CubeCom Pro',
  publisher: 'CubeCom Pro',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: DOCS_URL,
    siteName: DOCS_NAME,
    title: 'CubeCom Pro Documentation',
    description: DOCS_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CubeCom Pro Documentation',
    description: DOCS_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
