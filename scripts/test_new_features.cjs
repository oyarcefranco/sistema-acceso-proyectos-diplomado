const { chromium } = require('playwright');
const { spawn } = require('child_process');

async function test() {
  const preview = spawn('npx', ['vite', 'preview', '--port', '4199'], { shell: true });
  
  await new Promise((resolve) => {
    preview.stdout.on('data', (d) => {
      console.log('Vite preview:', d.toString());
      if (d.toString().includes('http')) resolve();
    });
    setTimeout(resolve, 4000);
  });

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    await page.goto('http://localhost:4199/', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully!');

    // 1. Screenshot login modal (sin sesiones de prueba)
    await page.screenshot({ path: 'auditoria_capturas/01_login_sin_sesiones_prueba.png' });
    console.log('Screenshot 01 taken');

    // 2. Fill Franco Oyarce admin RUT in the main input
    const rutInput = page.locator('input').first();
    await rutInput.fill('12.345.678-5');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    // 3. Screenshot home with PTH cards with official images
    await page.screenshot({ path: 'auditoria_capturas/02_home_pth_cards_con_imagenes.png', fullPage: true });
    console.log('Screenshot 02 taken');

    // 4. Click Más Azul PTH
    await page.locator('h3:has-text("Más Azul")').first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'auditoria_capturas/03_pth_mas_azul_banner_y_encuestas_generales.png', fullPage: true });
    console.log('Screenshot 03 taken');

    // 5. Return to home
    await page.click('button:has-text("Volver al Catálogo")');
    await page.waitForTimeout(800);

    // 6. Click Continuity Project (CET Concepción)
    await page.locator('h3:has-text("Garantías en Salud")').first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'auditoria_capturas/04_continuidad_expediente.png', fullPage: true });
    console.log('Screenshot 04 taken');

    // 7. Click on the "Indicadores de Impacto & Organizaciones" tab
    await page.click('button:has-text("Indicadores de Impacto")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'auditoria_capturas/05_continuidad_indicadores_y_organizaciones.png', fullPage: true });
    console.log('Screenshot 05 taken');

    console.log('TEST COMPLETED 100% SUCCESSFULLY!');
  } finally {
    await browser.close();
    preview.kill();
  }
}

test().catch(console.error);
