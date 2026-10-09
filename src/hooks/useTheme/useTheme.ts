import { useCallback, useLayoutEffect, useState, useSyncExternalStore } from 'react';

/** Ключ в localStorage, под которым хранится выбор темы */
export const THEME_STORAGE_KEY = 'ui-theme';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const SYSTEM_QUERY = '(prefers-color-scheme: dark)';

function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    // localStorage может быть недоступен (приватный режим и т.п.)
    return 'system';
  }
}

// --- Системная тема ОС как внешний стор ---

function subscribeToSystemTheme(onChange: () => void): () => void {
  if (typeof window.matchMedia !== 'function') return () => {};
  const media = window.matchMedia(SYSTEM_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getSystemSnapshot(): ResolvedTheme {
  if (typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia(SYSTEM_QUERY).matches ? 'dark' : 'light';
}

function getServerSystemSnapshot(): ResolvedTheme {
  // SSR: на сервере тема неизвестна - светлая как дефолт
  return 'light';
}

/** Применяет тему к документу и возвращает применённую (используется в Storybook-декораторе) */
export function applyTheme(preference: ThemePreference): ResolvedTheme {
  const resolved = preference === 'system' ? getSystemSnapshot() : preference;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = resolved;
  }
  return resolved;
}

export function useTheme() {
  // Выбор пользователя: хранится в localStorage
  const [theme, setThemeState] = useState<ThemePreference>(getStoredPreference);

  // Системная тема - подписка на внешнюю систему через useSyncExternalStore.
  // React сам читает снапшот и перерисовывает при изменении
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemSnapshot,
    getServerSystemSnapshot,
  );

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback((next: ThemePreference) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Не сохранили - тема всё равно применится до перезагрузки страницы
    }
    setThemeState(next);
  }, []);

  return { theme, resolvedTheme, setTheme } as const;
}
