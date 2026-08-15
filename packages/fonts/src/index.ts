import { fileURLToPath } from 'node:url';

export type FontSrcEntry = {
  path: string;
  style: 'normal' | 'italic';
};

export type FontFaceConfig = {
  family: string;
  variable: `--font-${string}`;
  weight: string;
  src: readonly FontSrcEntry[];
};

function fontSrc(relativePath: string): string {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export const instrumentSans = {
  family: 'Instrument Sans',
  variable: '--font-instrument',
  weight: '400 700',
  src: [
    {
      path: fontSrc(
        './instrument-sans/webfonts/InstrumentSans[wdth,wght].woff2'
      ),
      style: 'normal',
    },
    {
      path: fontSrc(
        './instrument-sans/webfonts/InstrumentSans-Italic[wdth,wght].woff2'
      ),
      style: 'italic',
    },
  ],
} as const satisfies FontFaceConfig;

export const fonts = {
  instrumentSans,
} as const;
