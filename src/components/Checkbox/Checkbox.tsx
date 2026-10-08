import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import fieldStyles from '../Field/Field.module.css';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  hint?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, error, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint && !error ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx(fieldStyles.field, className)}>
      <label className={styles.label} htmlFor={inputId}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={clsx(styles.box, error && styles.boxError)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {label}
      </label>
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
});
