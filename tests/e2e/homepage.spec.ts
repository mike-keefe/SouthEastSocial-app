import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads and shows key elements', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /what's on/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /browse events/i }).or(page.getByRole('link', { name: /see all/i }))).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('search form submits to /events with query params', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel(/search events/i).fill('jazz')
    await page.getByRole('button', { name: /search/i }).click()
    await expect(page).toHaveURL(/\/events\?.*q=jazz/)
  })
})

test.describe('Navigation', () => {
  test('nav links are present on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Events' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Venues' })).toBeVisible()
  })

  test('mobile nav opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const hamburger = page.getByLabel('Open menu')
    await expect(hamburger).toBeVisible()
    await hamburger.click()
    await expect(page.getByLabel('Mobile navigation')).toBeVisible()
    await page.getByLabel('Close menu').click()
  })
})

test.describe('Events page', () => {
  test('loads the events listing', async ({ page }) => {
    await page.goto('/events')
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()
  })
})

test.describe('404 page', () => {
  test('shows a custom not-found page', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist-abc123')
    expect(res?.status()).toBe(404)
    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByRole('link', { name: /browse events/i })).toBeVisible()
  })
})
