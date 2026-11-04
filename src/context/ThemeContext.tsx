import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type ColorTheme = 'sapphire' | 'emerald' | 'violet' | 'amber';

export interface ColorThemeOption {
  id: ColorTheme;
  name: string;
  primaryColor: string;
  accentColor: string;
  badge: string;
}

export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: 'sapphire',
    name: 'Midnight Sapphire',
    primaryColor: '#1D4ED8',
    accentColor: '#3B82F6',
    badge: 'Modern Tech (Active)',
  },
  {
    id: 'emerald',
    name: 'Ivory & Emerald',
    primaryColor: '#176B50',
    accentColor: '#27966F',
    badge: 'Nature & Sage',
  },
  {
    id: 'violet',
    name: 'Cosmic Violet',
    primaryColor: '#4F46E5',
    accentColor: '#8B5CF6',
    badge: 'AI & Neon',
  },
  {
    id: 'amber',
    name: 'Executive Amber',
    primaryColor: '#B45309',
    accentColor: '#F59E0B',
    badge: 'Warm Luxury',
  },
];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
  colorThemeOptions: ColorThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('mentor_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('mentor_color_theme');
    if (saved === 'sapphire' || saved === 'emerald' || saved === 'violet' || saved === 'amber') {
      return saved;
    }
    return 'sapphire'; // Modern Sapphire as new vibrant default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mentor_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem('mentor_color_theme', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const setColorTheme = (ct: ColorTheme) => {
    setColorThemeState(ct);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        colorTheme,
        setColorTheme,
        colorThemeOptions: COLOR_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
