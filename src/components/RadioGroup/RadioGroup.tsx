import { createContext, useContext, type ReactNode } from 'react';
import clsx from 'clsx';
import fieldStyles from '../Field/Field.module.css';
import styles from './RadioGroup.module.css';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  name: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  hint?: string;
  error?: string;
  direction?: 'row' | 'column';
  children?: ReactNode;
  className?: string;
}

export function RadioGroup({
  name,
  label,
  value,
  onChange,
  hint,
  error,
  direction = 'column',
  children,
  className,
}: RadioGroupProps) {
  const hintId = hint && !error ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      className={clsx(fieldStyles.field, styles.group, className)}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
    >
      <legend className={fieldStyles.label}>{label}</legend>
      <div className={clsx(styles.items, styles[direction])}>
        <RadioGroupContext.Provider value={{ name, value, onChange }}>
          {children}
        </RadioGroupContext.Provider>
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
    </fieldset>
  );
}

export interface RadioProps {
  value: string;
  label: ReactNode;
  className?: string;
}

export function Radio({ value, label, className }: RadioProps) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error('Radio должен использоваться внутри RadioGroup');

  return (
    <label className={clsx(styles.label, className)}>
      <input
        type="radio"
        className={styles.input}
        name={group.name}
        value={value}
        checked={group.value === value}
        onChange={() => group.onChange?.(value)}
      />
      <span>{label}</span>
    </label>
  );
}
