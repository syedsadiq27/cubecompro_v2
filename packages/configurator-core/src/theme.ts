export type ThemeConfig = {
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  showPoweredBy?: boolean;
};

export const DEFAULT_THEME: Required<
  Pick<ThemeConfig, 'primaryColor' | 'accentColor' | 'fontFamily' | 'showPoweredBy'>
> &
  ThemeConfig = {
  primaryColor: '#1f1f1f',
  accentColor: '#5c5c5c',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  showPoweredBy: false,
};

export function resolveTheme(input?: ThemeConfig | null): ThemeConfig {
  return {
    ...DEFAULT_THEME,
    ...input,
    primaryColor: input?.primaryColor || DEFAULT_THEME.primaryColor,
    accentColor: input?.accentColor || DEFAULT_THEME.accentColor,
    fontFamily: input?.fontFamily || DEFAULT_THEME.fontFamily,
    showPoweredBy: input?.showPoweredBy ?? DEFAULT_THEME.showPoweredBy,
  };
}
