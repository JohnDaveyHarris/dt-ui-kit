import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import fieldStyles from '../Field/Field.module.css';
import styles from './PasswordField.module.css';

export interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  hint?: string;
  error?: string;
  showVisibilityToggle?: boolean;
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/**
 * Поле пароля с кнопкой управления видимостью.
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    {
      label,
      hint,
      error,
      showVisibilityToggle = true,
      id,
      className,
      autoComplete = 'current-password',
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [visible, setVisible] = useState(false);
    const hintId = hint && !error ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={clsx(fieldStyles.field, className)}>
        <label className={fieldStyles.label} htmlFor={inputId}>
          {label}
        </label>
        <div className={styles.wrapper}>
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={clsx(fieldStyles.control, styles.control, error && fieldStyles.controlError)}
            autoComplete={autoComplete}
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...rest}
          />
          {showVisibilityToggle && (
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>
        {hint && !error && (
          <p className={fieldStyles.hint} id={hintId}>
            {hint}
          </p>
        )}
        {error && (
          <p className={fieldStyles.error} id={errorId} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
