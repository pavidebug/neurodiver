import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5174/home'
const out = process.argv[3] ?? 'desktop-dashboard-preview.png'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2000)

  if (!page.url().includes('/home')) {
    const guestBtn = page.getByRole('button', { name: /continue as guest/i })
    if (await guestBtn.isVisible().catch(() => false)) {
      await guestBtn.click()
      await page.waitForTimeout(4000)
    }
  }

  await page.goto('http://localhost:5174/home', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: out, fullPage: true })
  console.log(`Saved ${out} — ${page.url()}`)
} finally {
  await browser.close()
}
