import { resolveTheme, type ThemeConfig } from '../theme';

export type ThemeAdapter = {
  getTheme: () => ThemeConfig;
};

export function createProjectThemeAdapter(
  projectTheme?: ThemeConfig | null
): ThemeAdapter {
  return {
    getTheme: () => resolveTheme(projectTheme),
  };
}
