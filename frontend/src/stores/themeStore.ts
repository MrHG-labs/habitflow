import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('hf-theme', theme);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',

  toggle: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: next });
    applyTheme(next);
  },
}));

/** Call once on app boot to restore saved theme */
export function initTheme() {
  if (typeof window === 'undefined') return;
  const saved = (localStorage.getItem('hf-theme') as Theme) ?? 'light';
  useThemeStore.setState({ theme: saved });
  applyTheme(saved);
}
