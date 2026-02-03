import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('blog page loads and has content', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  });

  test('photos page loads and has content', async ({ page }) => {
    const response = await page.goto('/photos');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Photos', level: 1 })).toBeVisible();
  });

  test('dogs page loads and has content', async ({ page }) => {
    const response = await page.goto('/dogs');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: /Dogs/i, level: 1 })).toBeVisible();
  });

  test('presentations page loads and has content', async ({ page }) => {
    const response = await page.goto('/presentations');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Presentations', level: 1 })).toBeVisible();
  });

  test('blog post page loads', async ({ page }) => {
    // Test a known blog post
    const response = await page.goto('/blog/DeveloperFonts');
    expect(response?.status()).toBe(200);
    // Should have an article element
    await expect(page.locator('article')).toBeVisible();
  });

  test('404 page shows not found content', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-that-does-not-exist');
    // Astro returns 200 for custom 404 pages in SSR mode
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/not found|404/i)).toBeVisible();
  });
});
