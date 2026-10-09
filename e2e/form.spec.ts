import { test, expect } from '@playwright/test';

test('форма валидируется и отправляется', async ({ page }) => {
  await page.goto('iframe.html?id=recipes-feedback-form--default&viewMode=story');

  // пустой email -> ошибка
  await page.getByRole('button', { name: 'Отправить' }).click();
  await expect(page.getByRole('alert')).toHaveText('Похоже, в адресе нет символа @');

  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Тема').selectOption('bug');
  await page.getByLabel('Сообщение').fill('Не работает кнопка X');
  await page.getByRole('checkbox', { name: /согласен/ }).check();
  await page.getByRole('button', { name: 'Отправить' }).click();

  await expect(page.getByRole('status')).toContainText('Форма отправлена');
});
