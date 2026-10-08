import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import fieldStyles from '../Field/Field.module.css';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, hint, error, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const hintId = hint && !error ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={clsx(fieldStyles.field, className)}>
      <label className={fieldStyles.label} htmlFor={selectId}>
        {label}
      </label>
      <div className={styles.wrapper}>
        <select
          ref={ref}
          id={selectId}
          className={clsx(fieldStyles.control, styles.control, error && fieldStyles.controlError)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
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
});
