import { useTheme, type ThemePreference } from '../hooks/useTheme/useTheme';
import { Radio, RadioGroup } from '../components/RadioGroup/RadioGroup';

const OPTIONS = [
  { value: 'system', label: 'Системная' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
] as const;

export function ThemeToggleDemo() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div style={{ display: 'grid', gap: 'var(--ui-space-3)', minWidth: 280 }}>
      <RadioGroup
        name="theme-preference"
        label="Тема оформления"
        value={theme}
        onChange={(value) => setTheme(value as ThemePreference)}
        direction="row"
      >
        {OPTIONS.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} />
        ))}
      </RadioGroup>
      <p
        style={{
          margin: 0,
          fontSize: 'var(--ui-font-size-s)',
          color: 'var(--ui-color-text-muted)',
        }}
      >
        Применённая тема: {resolvedTheme === 'dark' ? 'тёмная' : 'светлая'}
      </p>
    </div>
  );
}
