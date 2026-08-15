export const SUITE = {
  sidebarWidth: 220,
  sidebarCollapsedWidth: 64,
  topBarHeight: 48,
  pagePaddingX: 24,
  pageHeaderPaddingY: 16,
  inspectorWidth: 330,
  inspectorWidthLg: 350,
  controlHeight: 36,
  controlHeightSm: 32,
  iconButtonSize: 32,
  radiusControl: 7,
  radiusPanel: 10,
  gapPage: 20,
  gapSection: 16,
  gapControl: 8,
  tableRowHeight: 56,
  brand: '#665CFF',
  sidebarInk: '#0E0F12',
} as const;

export type SuiteToken = keyof typeof SUITE;
