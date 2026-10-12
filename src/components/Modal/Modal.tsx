import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Modal.module.css';

export interface ModalProps {
  /** Открыта ли модалка (контролируемый компонент) */
  open: boolean;
  /** Запрос закрытия: Escape, клик по фону, кнопка ✕ */
  onClose: () => void;
  /** Заголовок — связывается с диалогом через aria-labelledby */
  title: ReactNode;
  /** Описание под заголовком */
  description?: ReactNode;
  /** Основное содержимое */
  children?: ReactNode;
  /** Нижняя панель с действиями */
  footer?: ReactNode;
  /** Закрывать ли по Escape и клику по фону */
  dismissible?: boolean;
  size?: 's' | 'm' | 'l';
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  dismissible = true,
  size = 'm',
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Синхронизация React-состояния с императивным API <dialog>.
  // Атрибут open не используем: он даёт немодальный режим без focus trap
  // и ::backdrop, поэтому только showModal()/close().
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Блокировка скролла страницы + компенсация исчезнувшего скроллбара
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  // cancel и close не всплывают — подписываемся нативно.
  // Это подписка на внешнюю систему: колбэки синхронизируют её с React-состоянием.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(event: Event) {
      // Гасим нативное закрытие: источник правды один — React-состояние.
      // Диалог закроет наш sync-эффект после перерендера.
      event.preventDefault();
      if (dismissible) onClose();
    }
    function handleClose() {
      // Диалог закрыли «со стороны» (например, <form method="dialog"> внутри)
      if (open) onClose();
    }

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
    };
  }, [open, dismissible, onClose]);

  return (
    // jsx-a11y: ложные срабатывания для <dialog>. Клавиатурный путь закрытия
    // есть - Escape (встроенное событие cancel, подписка в useEffect ниже)
    // и кнопка x. Клик по фону - дополнительный мышиный сценарий,
    // ::backdrop - псевдоэлемент, на него обработчик не повесить.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className={clsx(styles.dialog, styles[size], className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={(event: MouseEvent<HTMLDialogElement>) => {
        if (dismissible && event.target === dialogRef.current) onClose();
      }}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        {description && (
          <p className={styles.description} id={descriptionId}>
            {description}
          </p>
        )}
        {children && <div className={styles.body}>{children}</div>}
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
}
