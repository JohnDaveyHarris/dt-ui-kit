import { test, expect } from '@playwright/test';

const story = (id: string) => `iframe.html?id=${id}&viewMode=story&globals=theme:light`;

// Escape на нативном <dialog> - default action браузера для trusted ввода.
// Синтетический keydown из play-функции его не порождает,
// поэтому реальную клавиатуру проверяем здесь, где page.keyboard идёт через CDP.
test('Modal закрывается по Escape', async ({ page }) => {
  await page.goto(story('components-modal--interactive'));

  await page.getByRole('button', { name: 'Открыть модалку' }).click();
  const dialog = page.getByRole('dialog', { name: 'Подтверждение' });
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

// Клик по фону - тоже доверенное событие (мышь)
test('Modal закрывается по клику на фон', async ({ page }) => {
  await page.goto(story('components-modal--interactive'));

  await page.getByRole('button', { name: 'Открыть модалку' }).click();
  const dialog = page.getByRole('dialog', { name: 'Подтверждение' });
  await expect(dialog).toBeVisible();

  await page.mouse.click(16, 16); // угол вьюпорта - вне диалога, это область ::backdrop
  await expect(dialog).toBeHidden();
});
