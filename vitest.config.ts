import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/testing/setup.ts'],
    css: true, // иначе CSS Modules вернут undefined в тестах
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: { provider: 'v8' },
  },
});