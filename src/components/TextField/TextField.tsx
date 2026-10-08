import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import fieldStyles from '../Field/Field.module.css';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Вспомогательный текст */
  hint?: string;
  /** Текст ошибки, перекрывает hint */
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
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
      <label className={fieldStyles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={clsx(fieldStyles.control, error && fieldStyles.controlError)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
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
