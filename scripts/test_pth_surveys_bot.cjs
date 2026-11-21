const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static server for dist
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];
  let filePath = path.join(__dirname, '..', 'dist', cleanUrl === '/' ? 'index.html' : cleanUrl);
  
  if (!fs.existsSync(filePath)) {
    // Fallback for single page app
    filePath = path.join(__dirname, '..', 'dist', 'index.html');
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4174, async () => {
  console.log('Test server running at http://localhost:4174');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const screenshotsDir = path.join(__dirname, '..', 'auditoria_capturas');
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('Console Error:', msg.text());
  });

  try {
    // 1. Cargar login y autenticar
    await page.goto('http://localhost:4174');
    await page.waitForSelector('input[type="text"]');
    await page.fill('input[type="text"]', '17.405.679-K');
    await page.click('button:has-text("Ingresar al Portal")');
    await page.waitForSelector('text=Bienvenido/a');
    console.log('✓ Login exitoso');

    // 2. Entrar a Más Parques
    await page.click('h3:has-text("Más Parques")');
    await page.waitForSelector('text=Programa Territorial Hito');
    console.log('✓ Navegado a Más Parques');

    // Verificar pestaña Indicadores de Impacto VcM (que NO diga Cristóbal)
    const tabIndicadores = await page.locator('button:has-text("Indicadores de Impacto VcM")').count();
    const tabCristobal = await page.locator('text=Cristóbal').count();
    console.log(`✓ Tab Indicadores de Impacto VcM presente: ${tabIndicadores > 0}`);
    console.log(`✓ Ocurrencias de la palabra 'Cristóbal' en UI: ${tabCristobal} (debe ser 0)`);
    if (tabCristobal > 0) errors.push("Palabra 'Cristóbal' detectada en la interfaz");

    // Verificar que NO haya texto 'Ver reporte general PTH' como etiqueta estática
    const badgesViejos = await page.locator('text="Ver reporte general PTH"').count();
    console.log(`✓ Badges amarillos 'Ver reporte general PTH': ${badgesViejos} (debe ser 0)`);
    if (badgesViejos > 0) errors.push(`Aún aparecen ${badgesViejos} badges estáticos 'Ver reporte general PTH'`);

    // Tomar captura de la tabla de Más Parques con las encuestas activas
    await page.screenshot({ path: path.join(screenshotsDir, '31_pth_mas_parques_surveys_active.png'), fullPage: false });
    console.log('✓ Captura 31 guardada: Más Parques con encuestas activas');

    // Abrir una encuesta de organizaciones con Reporte PTH (asegurando selector visible en desktop)
    const btnReportePth = page.locator('button:has-text("Reporte PTH"):visible').first();
    if (await btnReportePth.count() > 0) {
      await btnReportePth.click();
      await page.waitForSelector('iframe');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotsDir, '32_modal_reporte_general_pth.png') });
      console.log('✓ Captura 32 guardada: Modal Reporte General PTH');
      await page.click('button[title="Cerrar (Esc)"]');
    }

    // 3. Volver e ir a Más Azul
    await page.click('text=Volver al Catálogo de Iniciativas');
    await page.waitForSelector('text=Bienvenido/a');
    await page.click('h3:has-text("Más Azul")');
    await page.waitForSelector('text=Programa Territorial Hito');
    console.log('✓ Navegado a Más Azul');
    await page.screenshot({ path: path.join(screenshotsDir, '33_pth_mas_azul_surveys_active.png') });
    console.log('✓ Captura 33 guardada: Más Azul con encuestas activas');

    // 4. Ir a la pestaña Indicadores de Impacto VcM
    await page.click('button:has-text("Indicadores de Impacto VcM")');
    await page.waitForSelector('text=Consolidado de Indicadores Oficiales de Impacto Territorial');
    await page.screenshot({ path: path.join(screenshotsDir, '34_indicadores_impacto_vcm_tab.png') });
    console.log('✓ Captura 34 guardada: Pestaña Indicadores de Impacto VcM');

    // 5. Ir a Más Personas Mayores Activas
    await page.click('text=Volver al Catálogo de Iniciativas');
    await page.waitForSelector('text=Bienvenido/a');
    await page.click('h3:has-text("Más Personas Mayores Activas")');
    await page.waitForSelector('text=Programa Territorial Hito');
    console.log('✓ Navegado a Más Personas Mayores Activas');
    await page.screenshot({ path: path.join(screenshotsDir, '35_pth_personas_mayores_surveys_active.png') });
    console.log('✓ Captura 35 guardada: Más Personas Mayores Activas con encuestas activas');

  } catch (err) {
    console.error('Error durante la prueba:', err);
    errors.push(err.message);
  } finally {
    await browser.close();
    server.close();
    console.log('\n=== REPORTE FINAL DEL BOT ===');
    console.log(`Errores encontrados: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Detalle errores:', errors);
      process.exit(1);
    } else {
      console.log('✓ 100% de verificaciones superadas con 0 errores.');
      process.exit(0);
    }
  }
});
