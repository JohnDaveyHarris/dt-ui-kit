import type { ReactNode } from 'react';

export type ToastVariant = 'info' | 'success' | 'danger';

export interface Toast {
  id: number;
  variant: ToastVariant;
  message: ReactNode;
  /** ms до авто-закрытия; Infinity — только вручную */
  duration: number;
}

export interface ToastOptions {
  variant?: ToastVariant;
  /** ms; Infinity отключает авто-закрытие */
  duration?: number;
}

/** Дефолт: достаточно, чтобы прочитать; соответствует WCAG-гайдансу */
const DEFAULT_DURATION = 5000;
const MAX_VISIBLE = 5;

let nextId = 1;
let toasts: Toast[] = [];
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Снапшот для useSyncExternalStore - стабильная ссылка, пока очередь не изменилась */
function getSnapshot(): Toast[] {
  return toasts;
}

export function dismissToast(id: number): void {
  const next = toasts.filter((item) => item.id !== id);
  if (next.length !== toasts.length) {
    toasts = next;
    emit();
  }
}

export function dismissAll(): void {
  if (toasts.length > 0) {
    toasts = [];
    emit();
  }
}

/** Показать уведомление. Возвращает id для программного закрытия */
export function toast(message: ReactNode, options: ToastOptions = {}): number {
  const item: Toast = {
    id: nextId++,
    variant: options.variant ?? 'info',
    message,
    duration: options.duration ?? DEFAULT_DURATION,
  };
  toasts = [...toasts, item].slice(-MAX_VISIBLE);
  emit();
  return item.id;
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- declaration merging с функцией (handbook: «Merging with Functions»); no-namespace этот легитимный случай не различает
export namespace toast {
  export const success = (message: ReactNode, options: ToastOptions = {}): number =>
    toast(message, { ...options, variant: 'success' });

  export const error = (message: ReactNode, options: ToastOptions = {}): number =>
    toast(message, { ...options, variant: 'danger' });

  export const dismiss = dismissToast;
}

/** Контракт для useSyncExternalStore в <Toaster /> */
export const toastStore = { subscribe, getSnapshot } as const;
