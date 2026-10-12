import { useEffect, useState, useSyncExternalStore } from 'react';
import clsx from 'clsx';
import { dismissToast, toastStore, type Toast } from './toastManager';
import styles from './Toaster.module.css';

export function Toaster() {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    getServerSnapshot,
  );

  return (
    <div className={styles.region} role="region" aria-label="Уведомления">
      <div className={styles.live} role="status" aria-live="polite" aria-atomic="false">
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function getServerSnapshot(): Toast[] {
  return [];
}

function ToastCard({ item }: { item: Toast }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || item.duration === Infinity) return;
    const timer = setTimeout(() => dismissToast(item.id), item.duration);
    return () => clearTimeout(timer);
  }, [paused, item.id, item.duration]);

  return (
    <div
      className={clsx(styles.toast, styles[item.variant])}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={styles.content}>{item.message}</div>
      <button
        type="button"
        className={styles.close}
        onClick={() => dismissToast(item.id)}
        aria-label="Закрыть уведомление"
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
