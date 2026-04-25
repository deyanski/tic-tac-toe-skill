import { test, expect } from '@playwright/test';

/**
 * Non-auth browser tests — all cases assume signed-out state (no active session).
 * These can run in CI without any GitHub OAuth credentials.
 */

test.beforeEach(async ({ page }) => {
  // Clear any lingering auth tokens from storage so every test starts clean
  await page.goto('/tic-tac-toe-skill/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  // Reload to start fresh after clearing storage
  await page.goto('/tic-tac-toe-skill/');
  await page.waitForLoadState('networkidle');
});

test('game board is visible without signing in', async ({ page }) => {
  await expect(page.locator('.board')).toBeVisible();
});

test('header title renders correctly', async ({ page }) => {
  const title = page.locator('.app-title');
  await expect(title).toBeVisible();
  await expect(title).toContainText('TIC');
  await expect(title).toContainText('TAC');
  await expect(title).toContainText('TOE');
});

test('"sign in required" hint appears below leaderboard toggle when signed out', async ({ page }) => {
  const hint = page.locator('.board-lock-hint');
  await expect(hint).toBeVisible();
  await expect(hint).toContainText('sign in required');
});

test('opening leaderboard panel while signed out shows locked state, not table', async ({ page }) => {
  await page.locator('.ctrl-btn--board').click();

  // Locked panel should appear
  await expect(page.locator('.leaderboard--locked')).toBeVisible();
  await expect(page.locator('.leaderboard__state--auth')).toContainText('SIGN IN TO VIEW LEADERBOARD');

  // Data table must NOT be rendered
  await expect(page.locator('.leaderboard__table')).not.toBeVisible();
});

test('locked leaderboard panel has a visible sign-in button', async ({ page }) => {
  await page.locator('.ctrl-btn--board').click();

  const signInBtn = page.locator('.leaderboard__signin');
  await expect(signInBtn).toBeVisible();
  await expect(signInBtn).toContainText('SIGN IN WITH GITHUB');
});

test('sign-in button in locked panel starts GitHub OAuth redirect', async ({ page }) => {
  await page.locator('.ctrl-btn--board').click();

  // Intercept navigation — we verify it starts toward GitHub, not that it completes
  const [request] = await Promise.all([
    page.waitForRequest((req) => req.url().includes('github.com')),
    page.locator('.leaderboard__signin').click(),
  ]);
  expect(request.url()).toContain('github.com');
});

test('closing leaderboard panel hides the locked state', async ({ page }) => {
  const toggleBtn = page.locator('.ctrl-btn--board');

  await toggleBtn.click();
  await expect(page.locator('.leaderboard--locked')).toBeVisible();

  await toggleBtn.click();
  await expect(page.locator('.leaderboard--locked')).not.toBeVisible();
});

test('game cells are clickable while signed out', async ({ page }) => {
  const firstCell = page.locator('.cell').first();
  await firstCell.click();

  // After clicking, the cell should contain X (player mark)
  await expect(firstCell.locator('.cell-mark')).toBeVisible();
});

test('status bar updates after a move while signed out', async ({ page }) => {
  const statusText = page.locator('.status-bar__text');
  const initialText = await statusText.textContent();

  await page.locator('.cell').first().click();
  // Status changes from "YOUR TURN" to AI thinking or AI turn
  await expect(statusText).not.toHaveText(initialText ?? '');
});

test('theme toggle works while signed out', async ({ page }) => {
  const root = page.locator('.app-root');

  // Default is night mode
  await expect(root).toHaveAttribute('data-theme', 'night');

  await page.locator('.ctrl-btn--theme').click();
  await expect(root).toHaveAttribute('data-theme', 'day');

  await page.locator('.ctrl-btn--theme').click();
  await expect(root).toHaveAttribute('data-theme', 'night');
});

test('difficulty toggle switches between EASY and HARD', async ({ page }) => {
  const easyBtn = page.locator('.ctrl-btn', { hasText: 'EASY' });
  const hardBtn = page.locator('.ctrl-btn', { hasText: 'HARD' });

  await expect(easyBtn).toBeVisible();
  await expect(hardBtn).toBeVisible();

  // EASY is active by default
  await expect(easyBtn).toHaveClass(/ctrl-btn--active/);

  await hardBtn.click();
  await expect(hardBtn).toHaveClass(/ctrl-btn--active/);
  await expect(easyBtn).not.toHaveClass(/ctrl-btn--active/);
});

test('reset button resets the board', async ({ page }) => {
  // Make a move
  await page.locator('.cell').first().click();
  await expect(page.locator('.cell').first().locator('.cell-mark')).toBeVisible();

  // Reset
  await page.locator('.ctrl-btn--reset').click();
  await expect(page.locator('.cell').first().locator('.cell-mark')).not.toBeVisible();
});
