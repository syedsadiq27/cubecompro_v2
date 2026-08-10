'use client';

import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  createProjectThemeAdapter,
  resolveTheme,
  type ThemeConfig,
} from '@repo/configurator-core';

const ThemeContext = createContext<ThemeConfig>(resolveTheme());

export function ThemeProvider({
  theme,
  children,
}: {
  theme?: ThemeConfig | null;
  children: ReactNode;
}) {
  const value = useMemo(
    () => createProjectThemeAdapter(theme).getTheme(),
    [theme]
  );

  const style = {
    '--cc-primary': value.primaryColor,
    '--cc-accent': value.accentColor,
    '--cc-font': value.fontFamily,
    fontFamily: value.fontFamily,
  } as CSSProperties;

  return (
    <ThemeContext.Provider value={value}>
      <div className="h-full min-h-0" style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
