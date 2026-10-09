import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY, useTheme } from './useTheme';

type SchemeListener = (event: { matches: boolean }) => void;

/**
 * jsdom вообще не реализует window.matchMedia - ставим глобальный стаб
 * и управляем им из тестов через возвращённый контроллер.
 */
function installMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<SchemeListener>();

  const mediaList = {
    get matches() {
      return matches;
    },
    addEventListener(_type: string, listener: SchemeListener) {
      listeners.add(listener);
    },
    removeEventListener(_type: string, listener: SchemeListener) {
      listeners.delete(listener);
    },
  } as unknown as MediaQueryList;

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaList),
  );

  return {
    change(next: boolean) {
      matches = next;
      listeners.forEach((listener) => listener({ matches: next }));
    },
  };
}

describe('useTheme', () => {
  let media: ReturnType<typeof installMatchMedia>;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    // Хук подписан на системную тему всегда - стаб нужен в каждом тесте
    media = installMatchMedia(false);
  });

  afterEach(() => {
    // Снимаем стаб, чтобы он не протёк в другие тестовые файлы
    vi.unstubAllGlobals();
  });

  it('по умолчанию следует системной теме', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('восстанавливает сохранённый выбор', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('setTheme сохраняет выбор и применяет атрибут', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setTheme('dark'));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('в режиме system реагирует на смену темы ОС', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.resolvedTheme).toBe('light');

    act(() => media.change(true));

    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
