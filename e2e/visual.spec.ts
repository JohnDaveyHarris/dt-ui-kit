import { test, expect } from '@playwright/test';

const story = (id: string) => `iframe.html?id=${id}&viewMode=story`;

test.describe('Визуальные тесты', () => {
  test('Button / primary', async ({ page }) => {
    await page.goto(story('components-button--primary'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-primary.png');
  });

  test('Button / тёмная тема', async ({ page }) => {
    await page.goto(story('components-button--primary') + '&globals=theme:dark');
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-primary-dark.png');
  });

  test('TextField / ошибка', async ({ page }) => {
    await page.goto(story('components-textfield--with-error'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('textfield-error.png');
  });
});
