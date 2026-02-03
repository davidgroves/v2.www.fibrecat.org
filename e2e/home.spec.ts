import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fibrecat\.org/);
  });

  test('displays main heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: 'David Groves', level: 1 });
    await expect(heading).toBeVisible();
  });

  test('has navigation links', async ({ page }) => {
    await page.goto('/');

    // Check all nav items from NAV_ITEMS in consts.ts
    const navLinks = [
      { href: '/', label: 'Home' },
      { href: '/blog', label: 'Blog' },
      { href: '/photos', label: 'Photos' },
      { href: '/dogs', label: 'Dogs' },
      { href: '/presentations', label: 'Presentations' },
    ];

    for (const { href, label } of navLinks) {
      const link = page.getByRole('link', { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
    }
  });
});
