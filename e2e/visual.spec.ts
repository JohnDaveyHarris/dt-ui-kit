import { test, expect } from '@playwright/test';

const story = (id: string, globals = 'theme:light') =>
  `iframe.html?id=${id}&viewMode=story&globals=${globals}`;

test.describe('Визуальные тесты', () => {
  test('Button / primary', async ({ page }) => {
    await page.goto(story('components-button--primary'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-primary.png');
  });

  test('Button / тёмная тема', async ({ page }) => {
    await page.goto(story('components-button--primary', 'theme:dark'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-primary-dark.png');
  });

  test('TextField / ошибка', async ({ page }) => {
    await page.goto(story('components-textfield--with-error'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('textfield-error.png');
  });

  test('Switch / включён', async ({ page }) => {
    await page.goto(story('components-switch--on'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('switch-on.png');
  });

  test('PasswordField / ошибка', async ({ page }) => {
    await page.goto(story('components-passwordfield--with-error'));
    await expect(page.locator('#storybook-root')).toHaveScreenshot('passwordfield-error.png');
  });
});
