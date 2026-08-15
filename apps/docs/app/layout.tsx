import type { Metadata, Viewport } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { instrumentSans } from '@/lib/fonts';
import {
  DOCS_DESCRIPTION,
  DOCS_NAME,
  DOCS_URL,
  MARKETING_URL,
} from '@/lib/site';
import './globals.css';

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
      className={instrumentSans.variable}
      suppressHydrationWarning
    >
      <body
        className={`${instrumentSans.className} flex min-h-screen flex-col`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
