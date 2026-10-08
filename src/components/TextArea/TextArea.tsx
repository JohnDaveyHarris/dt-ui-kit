import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import fieldStyles from '../Field/Field.module.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  /** Вспомогательный текст */
  hint?: string;
  /** Текст ошибки, перекрывает hint */
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, id, className, rows = 4, ...rest },
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={clsx(
          fieldStyles.control,
          fieldStyles.textarea,
          error && fieldStyles.controlError,
        )}
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
