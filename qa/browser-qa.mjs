import { chromium } from 'playwright';
import fs from 'node:fs';

const base = 'http://127.0.0.1:4173';
const pages = ['/', '/enterprise.html', '/professionals.html', '/solutions.html', '/science.html', '/trust.html', '/employee-experience.html'];
const viewports = {
  wide: { width: 1920, height: 1080 },
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 1024, height: 1366 },
  mobile: { width: 390, height: 844 }
};
fs.mkdirSync('qa-artifacts/screenshots', { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true });

for (const [vpName, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  for (const path of pages) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => pageErrors.push(String(err)));
    page.on('requestfailed', req => failedRequests.push({ url: req.url(), failure: req.failure()?.errorText || '' }));

    const rec = { viewport: vpName, ...viewport, path };
    try {
      const response = await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(400);
      rec.status = response?.status() ?? null;
      rec.title = await page.title();
      rec.bodyTextLen = await page.evaluate(() => document.body.innerText.trim().length);
      rec.clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      rec.scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      rec.overflowX = rec.scrollWidth > rec.clientWidth + 2;
      rec.h1Count = await page.locator('h1').count();
      rec.mainVisible = await page.locator('main').isVisible().catch(()=>false);
      rec.consoleErrors = consoleErrors;
      rec.pageErrors = pageErrors;
      rec.failedRequests = failedRequests.filter(x => !x.url.includes('google') && !x.url.includes('wa.me'));

      rec.offscreen = await page.evaluate(() => {
        const vw=document.documentElement.clientWidth;
        return Array.from(document.querySelectorAll('body *')).map(el => {
          const r=el.getBoundingClientRect();
          return {tag:el.tagName,cls:String(el.className||'').slice(0,100),x:r.x,right:r.right,y:r.y,w:r.width,h:r.height};
        }).filter(x => x.w>vw+2 || x.x<-2 || x.right>vw+2).slice(0,40);
      });
      if (rec.overflowX) {
        rec.overflowDiagnostics = await page.evaluate(() => {
          const vw=document.documentElement.clientWidth;
          const details=[...document.querySelectorAll('body *')].map(el=>{
            const r=el.getBoundingClientRect(), cs=getComputedStyle(el);
            return {tag:el.tagName,id:el.id||'',cls:String(el.className||'').slice(0,100),x:Math.round(r.x),right:Math.round(r.right),w:Math.round(r.width),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,cssWidth:cs.width,minWidth:cs.minWidth,maxWidth:cs.maxWidth,position:cs.position,overflowX:cs.overflowX,whiteSpace:cs.whiteSpace};
          }).filter(x=>x.right>vw+1 || x.x<-1 || x.w>vw+1 || x.scrollWidth>x.clientWidth+2)
            .sort((a,b)=>Math.max(b.right-vw,b.scrollWidth-b.clientWidth)-Math.max(a.right-vw,a.scrollWidth-a.clientWidth)).slice(0,40);
          const hero=document.querySelector('.v6-beta-hero');
          const after=hero?getComputedStyle(hero,'::after'):null;
          return {vw,htmlScrollWidth:document.documentElement.scrollWidth,bodyScrollWidth:document.body.scrollWidth,bodyWidth:getComputedStyle(document.body).width,details,heroAfter:after?{width:after.width,right:after.right,left:after.left,boxShadow:after.boxShadow,position:after.position}:null};
        });
      }

      if (path === '/') {
        rec.testimonialCardCount = await page.locator('.sx-testimonial-card').count();
        rec.carouselControlsVisible = await page.locator('.sx-carousel-controls').isVisible().catch(()=>false);
        const next = page.locator('[data-carousel-next]');
        if (await next.count()) {
          await page.locator('.sx-testimonials-section').scrollIntoViewIfNeeded();
          const controlsVisible = await next.isVisible();
          rec.carouselNextVisible = controlsVisible;
          if (controlsVisible) {
            const before = await page.evaluate(() => window.scrollY);
            await next.evaluate(el => el.click());
            await page.waitForTimeout(800);
            const after = await page.evaluate(() => window.scrollY);
            rec.carouselVerticalJumpPx = Math.abs(after - before);
          }
        }
        if (vpName === 'mobile') {
          const toggle = page.locator('.home-menu-toggle');
          if (await toggle.count()) {
            await toggle.click();
            rec.mobileMenuExpanded = await toggle.getAttribute('aria-expanded');
            rec.mobileMenuPanelVisible = await page.locator('#home-menu-panel').isVisible().catch(()=>false);
          }
        }
      }

      if (path === '/professionals.html') {
        const finder = page.locator('.finder');
        const cat = page.locator('.assessment-catalogue-inline').first();
        if (await finder.count() && await cat.count()) {
          const fb = await finder.boundingBox(), cb = await cat.boundingBox();
          rec.finderBeforeCatalogue = !!fb && !!cb && fb.y < cb.y;
        }
        rec.assessmentCards = await page.locator('.assessment-catalogue-inline .assessment-card').count();
        if (rec.assessmentCards) {
          rec.firstCard = await page.locator('.assessment-catalogue-inline .assessment-card').first().evaluate(el => {
            const h = el.querySelector('h3'), p = el.querySelector('p');
            return {
              bg: getComputedStyle(el).backgroundImage,
              border: getComputedStyle(el).borderColor,
              h3Color: h ? getComputedStyle(h).color : null,
              pColor: p ? getComputedStyle(p).color : null
            };
          });
        }
      }

      if (path === '/enterprise.html') {
        const form = page.locator('#conversation .form5');
        rec.contactFormVisible = await form.isVisible().catch(()=>false);
        if (rec.contactFormVisible) {
          rec.contactFormBox = await form.boundingBox();
          const fields = page.locator('#conversation .form5 input, #conversation .form5 select, #conversation .form5 textarea');
          rec.contactFieldCount = await fields.count();
          rec.contactFieldsWithinViewport = await page.evaluate(() => {
            const w = document.documentElement.clientWidth;
            return [...document.querySelectorAll('#conversation .form5 input,#conversation .form5 select,#conversation .form5 textarea')]
              .every(e => { const r=e.getBoundingClientRect(); return r.left >= -1 && r.right <= w+1; });
          });
        }
      }

      if (path === '/trust.html') {
        rec.mailtoCount = await page.locator('a[href^="mailto:"]').count();
        const cta = page.locator('.v6-beta-cta a:has-text("Contact us")');
        rec.trustContactHref = await cta.getAttribute('href').catch(()=>null);
        rec.trustParagraphLines = await page.locator('.v6-beta-cta p').evaluate(el => {
          const cs=getComputedStyle(el), lh=parseFloat(cs.lineHeight), h=el.getBoundingClientRect().height;
          return lh ? Math.round(h/lh) : null;
        }).catch(()=>null);
      }

      if (path === '/employee-experience.html') {
        rec.signalShowcase = await page.locator('.signal-exec-showcase').count() > 0;
        rec.signalMatrixCards = await page.locator('.signal-matrix article').count();
      }

      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y=0; y<pageHeight; y+=Math.max(500, Math.floor(viewport.height*0.75))) {
        await page.evaluate(y=>window.scrollTo(0,y), y);
        await page.waitForTimeout(40);
      }
      await page.evaluate(() => window.scrollTo(0,0));
      await page.waitForTimeout(150);
      const safe = path === '/' ? 'home' : path.replace(/^\\//,'').replace('.html','');
      await page.screenshot({ path: `qa-artifacts/screenshots/${safe}-${vpName}.png`, fullPage: true });
    } catch (e) {
      rec.exception = String(e);
    }
    results.push(rec);
    await page.close();
  }
  await context.close();
}
await browser.close();

const failures = results.filter(r => r.exception || r.status !== 200 || r.overflowX || r.consoleErrors?.length || r.pageErrors?.length || r.failedRequests?.length || (r.carouselVerticalJumpPx ?? 0) > 4 || r.h1Count !== 1 || !r.mainVisible);
const summary = {
  generatedAt: new Date().toISOString(),
  total: results.length,
  failures: failures.length,
  failedChecks: failures.map(r => ({ viewport:r.viewport, path:r.path, status:r.status, overflowX:r.overflowX, consoleErrors:r.consoleErrors, pageErrors:r.pageErrors, failedRequests:r.failedRequests, carouselVerticalJumpPx:r.carouselVerticalJumpPx, exception:r.exception })),
  results
};
fs.writeFileSync('qa-artifacts/browser-qa.json', JSON.stringify(summary,null,2));
console.log(JSON.stringify({ total: summary.total, failures: summary.failures, failedChecks: summary.failedChecks }, null, 2));
if (summary.failures) process.exitCode = 1;
