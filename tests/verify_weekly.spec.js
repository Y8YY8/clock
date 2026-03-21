const { test, expect } = require('@playwright/test');
const path = require('path');

test('Weekly features verification', async ({ page }) => {
    await page.goto(`file://${path.resolve(__dirname, '../index.html')}`);

    // Switch to Weekly Tab
    await page.click('#btn-weekly');

    // Check if UI elements exist
    await expect(page.locator('button:has-text("مسح الكل")')).toBeVisible();
    await expect(page.locator('#syncIdInput')).toBeVisible();
    await expect(page.locator('button:has-text("ربط")')).toBeVisible();
    await expect(page.locator('button:has-text("كود جديد")')).toBeVisible();

    // Test Auto-save
    const textarea = page.locator('#note-sat');
    await textarea.fill('Task for Saturday');

    const localStorageData = await page.evaluate(() => localStorage.getItem('royalWeek'));
    expect(localStorageData).toContain('Task for Saturday');

    // Test Delete All
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("مسح الكل")');

    await expect(textarea).toHaveValue('');
    const clearedData = await page.evaluate(() => JSON.parse(localStorage.getItem('royalWeek')));
    expect(clearedData['sat']).toBe("");
});
