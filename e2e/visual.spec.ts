import { test, expect, type Page } from '@playwright/test';

// Тема закреплена явно: база - светлая, тёмная - отдельный тест.
const story = (id: string, globals = 'theme:light') =>
  `iframe.html?id=${id}&viewMode=story&globals=${globals}`;

// Лоадер Storybook виден, пока сторя не смонтирована (dev-режим,
// холодный кэш CI) - ждём первого ребёнка в корне стори, прежде чем снимать
async function gotoStory(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector('#storybook-root > *');
}

test.describe('Визуальные тесты', () => {
  test('Button / primary', async ({ page }) => {
    await gotoStory(page, story('components-button--primary'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-primary.png');
  });

  test('Button / тёмная тема', async ({ page }) => {
    await gotoStory(page, story('components-button--primary', 'theme:dark'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-primary-dark.png');
  });

  test('TextField / ошибка', async ({ page }) => {
    await gotoStory(page, story('components-textfield--with-error'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('textfield-error.png');
  });

  test('Switch / включён', async ({ page }) => {
    await gotoStory(page, story('components-switch--on'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('switch-on.png');
  });

  test('PasswordField / ошибка', async ({ page }) => {
    await gotoStory(page, story('components-passwordfield--with-error'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('passwordfield-error.png');
  });

  test('Modal / открыт', async ({ page }) => {
    await gotoStory(page, story('components-modal--open'));
    await expect(page.locator('dialog')).toHaveScreenshot('modal-open.png');
  });

  test('Toast / уведомления', async ({ page }) => {
    await gotoStory(page, story('components-toast--visible'));
    await expect(page.getByText('Файл загружен')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Уведомления' })).toHaveScreenshot('toast.png');
  });

  test('Tooltip / открыт', async ({ page }) => {
    await gotoStory(page, story('components-tooltip--visible'));
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page.locator('#storybook-root')).toHaveScreenshot('tooltip.png');
  });
});
