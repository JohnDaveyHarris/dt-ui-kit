import { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';
import '../src/styles/global.css';
import {
  applyTheme,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from '../src/hooks/useTheme/useTheme';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      description: 'Тема оформления',
      defaultValue: 'system',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' },
          { value: 'system', title: 'Системная' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as ThemePreference) ?? 'system';

      useEffect(() => {
        // Держим localStorage в согласии с тулбаром, чтобы демо с useTheme
        // читали то же состояние, что выбрано в документации
        try {
          localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
          // без localStorage хук возьмёт 'system'
        }
        applyTheme(theme);
      }, [theme]);

      return <Story />;
    },
  ],
};

export default preview;
