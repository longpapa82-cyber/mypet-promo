// Features 섹션 디자인 고도화(C/D) 육안검증용 캡처.
// 함정: IntersectionObserver Reveal 섹션은 스크롤 전 캡처하면 빈 화면 → step-scroll로 보강.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = 'http://localhost:4173/mypet/';
const OUT = '/tmp/feat-shots';
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Reveal 트리거: 천천히 끝까지 스크롤 → 각 섹션 화면진입 발화
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += Math.floor(vp.height * 0.6)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(400);

  // Features 섹션을 화면 중앙에 두고 캡처
  const feat = page.locator('#features');
  await feat.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/features-${vp.name}.png` });

  // 데스크톱은 폰 호버 상태도 캡처(첫 행 폰)
  if (vp.name === 'desktop') {
    const firstPhone = page.locator('#features [class*="media"]').first();
    await firstPhone.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/features-hover.png` });
  }
  await page.close();
}
await browser.close();
console.log('DONE');
