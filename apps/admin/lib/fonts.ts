import localFont from 'next/font/local';

export const instrumentSans = localFont({
  src: [
    {
      path: '../../../node_modules/@repo/fonts/src/instrument-sans/webfonts/InstrumentSans[wdth,wght].woff2',
      style: 'normal',
    },
    {
      path: '../../../node_modules/@repo/fonts/src/instrument-sans/webfonts/InstrumentSans-Italic[wdth,wght].woff2',
      style: 'italic',
    },
  ],
  variable: '--font-instrument',
  weight: '400 700',
  display: 'swap',
});
