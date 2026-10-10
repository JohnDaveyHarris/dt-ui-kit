# @JohnDaveyHarris/my-ui-kit

Небольшой React UI-kit: компоненты форм с доступностью (a11y), тёмной темой и полной инженерной обвязкой.

[Документация (Storybook)](https://johndaveyharris.github.io/dt-ui-kit/)

[![CI](https://github.com/JohnDaveyHarris/dt-ui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnDaveyHarris/dt-ui-kit/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/github/deployments/JohnDaveyHarris/dt-ui-kit/github-pages?label=GitHub%20Pages&logo=github)](https://johndaveyharris.github.io/dt-ui-kit/)

## Возможности

- Компоненты: `Button`, `TextField`, `TextArea`, `PasswordField`, `Select`, `Checkbox`, `RadioGroup`, `Switch`
- Тёмная тема на CSS-переменных
- Доступность: семантика, `aria`-атрибуты, клавиатурная навигация
- Документация: Storybook (включая axe-проверки в UI)
- Тесты: Vitest + Testing Library, Playwright (e2e + визуальные)

## Стек

React, TypeScript, CSS Modules, Vite, Storybook, Vitest, Playwright, ESLint, Husky

## Быстрый старт

```bash
npm ci
npm run dev      # Storybook на localhost:6006
npm test         # юнит-тесты
npm run test:e2e # e2e + визуальные тесты
```
