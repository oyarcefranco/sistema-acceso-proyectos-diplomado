import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const CAPTURES_DIR = path.join(ROOT_DIR, 'auditoria_capturas');
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

if (!fs.existsSync(CAPTURES_DIR)) {
  fs.mkdirSync(CAPTURES_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath === '/' || reqPath === '') {
        reqPath = '/index.html';
      }

      const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
      let filePath = path.join(DIST_DIR, safePath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        if (!path.extname(safePath)) {
          filePath = path.join(DIST_DIR, 'index.html');
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`404 Not Found: ${reqPath}`);
          return;
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const stat = fs.statSync(filePath);

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Static Server] Montado con éxito en ${BASE_URL}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

const auditStats = {
  totalTests: 0,
  totalButtonsTested: 0,
  pdfRequestsTotal: 0,
  pdfRequests200: 0,
  pdfRequests404: 0,
  notFoundErrors: [],
  captures: [],
  logs: [],
  verdict: 'PENDIENTE',
};

function log(msg) {
  const ts = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${ts}] ${msg}`);
  auditStats.logs.push(`[${ts}] ${msg}`);
}

async function takeScreenshot(page, filename, description) {
  const fullPath = path.join(CAPTURES_DIR, filename);
  await page.screenshot({ path: fullPath, fullPage: false });
  auditStats.captures.push({
    filename,
    path: fullPath,
    description,
  });
  log(`📸 Captura guardada: ${filename} - ${description}`);
}

async function verifyImages(page, contextName) {
  const brokenImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => ({ src: img.src, alt: img.alt }));
  });

  if (brokenImages.length > 0) {
    throw new Error(
      `Imágenes rotas encontradas en ${contextName}: ${JSON.stringify(brokenImages)}`
    );
  }
  return true;
}

async function closeModal(page) {
  const closeBtn = page.locator('button[title="Cerrar (Esc)"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    auditStats.totalButtonsTested++;
  } else {
    await page.keyboard.press('Escape');
    auditStats.totalButtonsTested++;
  }
  await page.locator('iframe').waitFor({ state: 'detached', timeout: 4000 });
  await page.waitForTimeout(200);
}

async function runAudit() {
  log('================================================================');
  log('INICIANDO AUDITORÍA INTEGRAL PLAYWRIGHT (MS EDGE) - PORTAL VCM USS');
  log('================================================================');

  const server = await startStaticServer();

  let browser;
  try {
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
    });
    log('Navegador Microsoft Edge (Chromium) inicializado correctamente.');

    // -------------------------------------------------------------
    // FASE 1: AUDITORÍA EN VISTA DESKTOP (1280x800)
    // -------------------------------------------------------------
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });

    const page = await desktopContext.newPage();

    page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      if (url.toLowerCase().endsWith('.pdf')) {
        auditStats.pdfRequestsTotal++;
        if (status === 200) {
          auditStats.pdfRequests200++;
        } else if (status === 404) {
          auditStats.pdfRequests404++;
          auditStats.notFoundErrors.push(url);
          log(`❌ ERROR 404 en PDF: ${url}`);
        }
      } else if (status === 404) {
        auditStats.notFoundErrors.push(url);
        log(`❌ ERROR 404 en recurso: ${url}`);
      }
    });

    // -------------------------------------------------------------
    // TEST 1: Pantalla inicial y LoginModal
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 1: Carga inicial y validación de LoginModal ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await verifyImages(page, 'Login Modal');
    await takeScreenshot(page, '01_login_modal_desktop.png', 'Pantalla inicial con LoginModal institucional');

    // -------------------------------------------------------------
    // TEST 2: Prueba de validación de RUT erróneo
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 2: Manejo de error con RUT no válido (7.777.777-7) ---');
    await page.fill('input[type="text"]', '7.777.777-7');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('text=El RUT ingresado no es válido', { timeout: 4000 });
    await takeScreenshot(page, '02_login_error_chilean_desktop.png', 'Validación de error con RUT no autorizado o inválido');

    await page.fill('input[type="text"]', '');

    // -------------------------------------------------------------
    // TEST 3: Login Estudiante Chileno (17.405.679-K)
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 3: Login exitoso Estudiante Chileno (17.405.679-K) ---');
    await page.fill('input[type="text"]', '17.405.679-K');
    await submitBtn.click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('text=ABUHADBA VENEGAS, PILAR VALENTINA', { timeout: 6000 });
    await verifyImages(page, 'Dashboard Estudiante Chileno');
    await takeScreenshot(page, '03_login_chilean_student_desktop.png', 'Sesión iniciada con estudiante nacional (Pilar Abuhadba)');

    // -------------------------------------------------------------
    // TEST 4: Verificación de Logos Oficiales en Header y Banner
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 4: Verificación de nitidez de logos oficiales en Header y Banner ---');
    const headerLogo = page.locator('header img[alt*="Universidad San Sebastián"]');
    const bannerLogo = page.locator('img[alt="Universidad San Sebastián"]');
    await headerLogo.waitFor({ state: 'visible' });
    await bannerLogo.waitFor({ state: 'visible' });
    await takeScreenshot(page, '04_home_banner_and_logos_desktop.png', 'Header y Banner de bienvenida con logos institucionales nítidos');

    // -------------------------------------------------------------
    // TEST 5: Cierre de Sesión (Logout)
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 5: Cerrar sesión segura ---');
    const logoutBtn = page.locator('header button[title="Cerrar Sesión"]');
    await logoutBtn.click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('text=Diplomado en Vinculación con el Medio');
    await takeScreenshot(page, '05_logout_screen_desktop.png', 'Retorno exitoso a la pantalla de Login tras cerrar sesión');

    // -------------------------------------------------------------
    // TEST 6: Login Estudiante Extranjero (Pasaporte B02454716)
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 6: Login exitoso Estudiante Extranjero (Pasaporte B02454716) ---');
    const foreignTabBtn = page.locator('button:has-text("Extranjero / Pasaporte")');
    await foreignTabBtn.click();
    auditStats.totalButtonsTested++;
    await page.fill('input[type="text"]', 'B02454716');
    await page.locator('button[type="submit"]').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('text=ARANA DE SERRANO, RINA MARGARITA', { timeout: 6000 });
    await verifyImages(page, 'Dashboard Estudiante Extranjero');
    await takeScreenshot(page, '06_login_foreign_passport_desktop.png', 'Sesión iniciada con pasaporte extranjero (Rina Arana de Serrano)');
    await takeScreenshot(page, '07_foreign_student_header_badge_desktop.png', 'Detalle de badge "Estudiante Extranjero" en Header');

    // Cerrar sesión
    await page.locator('header button[title="Cerrar Sesión"]').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('text=Diplomado en Vinculación con el Medio');

    // -------------------------------------------------------------
    // TEST 7: Login Modo Administrador (Contraseña 'VcmAdmin2026!')
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 7: Login exitoso Modo Administrador ---');
    const adminTabBtn = page.locator('button[title*="Jefatura"]');
    await adminTabBtn.click();
    auditStats.totalButtonsTested++;

    await page.fill('input[type="password"]', 'wrongPassword123');
    await page.locator('button[type="submit"]').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('text=Contraseña de administración incorrecta');
    await takeScreenshot(page, '08_login_admin_password_desktop.png', 'Manejo de error con clave de administración errónea');

    await page.fill('input[type="password"]', 'VcmAdmin2026!');
    await page.locator('button[type="submit"]').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('text=Administrador / Equipo VcM', { timeout: 6000 });
    await verifyImages(page, 'Dashboard Administrador');
    await takeScreenshot(page, '09_admin_dashboard_golden_badge_desktop.png', 'Dashboard activo en Modo Administrador con Badge Dorado');

    // -------------------------------------------------------------
    // TEST 8: Selector de Programas Territoriales Hito (PTH)
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 8: Auditoría de los 5 Programas Territoriales Hito (PTH) ---');
    await takeScreenshot(page, '10_pth_selector_desktop.png', 'Selector completo con los 5 PTH y 4 Proyectos Emblemáticos');

    // PTH 1: Más Personas Mayores Activas
    auditStats.totalTests++;
    log('Entrando a PTH 1: Más Personas Mayores Activas...');
    await page.locator('h3', { hasText: 'Más Personas Mayores Activas' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Más Personas Mayores Activas")');
    await verifyImages(page, 'PTH Más Personas Mayores Activas');
    
    // Probar pestañas
    const tabs = [
      { name: 'postulacion', label: 'Formularios Postulación' },
      { name: 'cierre', label: 'Informes Cierre' },
      { name: 'estudiantes', label: 'Enc. Estudiantes' },
      { name: 'organizaciones', label: 'Enc. Organizaciones' },
      { name: 'indicadores', label: 'Indicadores' },
      { name: 'matriz', label: 'Matriz 360°' }
    ];
    for (const t of tabs) {
      const tabLoc = page.locator(`button:has-text("${t.label}")`).first();
      if (await tabLoc.isVisible()) {
        await tabLoc.click();
        auditStats.totalButtonsTested++;
        await page.waitForTimeout(150);
      }
    }
    await takeScreenshot(page, '11_pth1_adulto_mayor_detail_desktop.png', 'Detalle de PTH Más Personas Mayores y navegación por pestañas');
    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // PTH 2: Más Azul
    auditStats.totalTests++;
    log('Entrando a PTH 2: Más Azul...');
    await page.locator('h3', { hasText: 'Más Azul' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Más Azul")');
    await verifyImages(page, 'PTH Más Azul');
    await takeScreenshot(page, '12_pth2_mas_azul_detail_desktop.png', 'Detalle de PTH Más Azul con matriz de proyectos e indicadores');
    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // -------------------------------------------------------------
    // TEST 9: PTH 3 (Más Parques) - AUDITORÍA ESPECIAL PROYECTO ID 4829
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 9: PTH 3 Más Parques y Auditoría Exhaustiva de Proyecto ID 4829 ---');
    await page.locator('h3', { hasText: 'Más Parques' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Más Parques")');
    await verifyImages(page, 'PTH Más Parques');
    await takeScreenshot(page, '13_pth3_mas_parques_detail_desktop.png', 'Detalle de PTH Más Parques');

    // Filtrar por ID 4829
    const searchInput = page.locator('input[placeholder*="Buscar por proyecto"]');
    await searchInput.fill('4829');
    await page.waitForTimeout(300);
    const cardProj4829 = page.locator('div.group', { hasText: 'ID 4829' }).first();
    await cardProj4829.waitFor({ state: 'visible' });

    // 1. Abrir Formulario de Postulación ID 4829
    log('Abriendo Postulación ID 4829...');
    const postBtn4829 = cardProj4829.locator('button:has-text("Disponible")');
    await postBtn4829.click();
    auditStats.totalButtonsTested++;
    const iframePost = page.locator('iframe[src*="Postulacion_ID_4829.pdf"]');
    await iframePost.waitFor({ state: 'attached', timeout: 5000 });
    await takeScreenshot(page, '14_pth3_mas_parques_project_4829_modal_desktop.png', 'Visor PDF con Formulario de Postulación ID 4829 cargado sin 404');
    await closeModal(page);

    // 2. Abrir Informe de Cierre ID 4829
    log('Abriendo Informe de Cierre ID 4829...');
    const cierreBtn4829 = cardProj4829.locator('button:has-text("Finalizado")');
    await cierreBtn4829.click();
    auditStats.totalButtonsTested++;
    const iframeCierre = page.locator('iframe[src*="Informe_Cierre_ID_4829.pdf"]');
    await iframeCierre.waitFor({ state: 'attached', timeout: 5000 });
    await takeScreenshot(page, '15_pth3_project_4829_cierre_pdf_modal_desktop.png', 'Visor PDF con Informe de Cierre ID 4829 cargado sin 404');
    await closeModal(page);

    // 3. Abrir Encuesta de Estudiantes ID 4829
    log('Abriendo Encuesta de Estudiantes ID 4829...');
    const encuestaEstBtn4829 = cardProj4829.locator('button:has-text("Validado")');
    await encuestaEstBtn4829.click();
    auditStats.totalButtonsTested++;
    const iframeEst = page.locator('iframe[src*="Encuesta_Estudiantes_ID_4829.pdf"]');
    await iframeEst.waitFor({ state: 'attached', timeout: 5000 });
    await takeScreenshot(page, '16_pth3_project_4829_encuesta_estudiantes_modal_desktop.png', 'Visor PDF con Encuesta de Estudiantes ID 4829 cargada sin 404');
    await closeModal(page);

    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // PTH 4: Más Turismo Sostenible
    auditStats.totalTests++;
    log('Entrando a PTH 4: Más Turismo Sostenible...');
    await page.locator('h3', { hasText: 'Más Turismo Sostenible' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Más Turismo Sostenible")');
    await verifyImages(page, 'PTH Más Turismo Sostenible');
    await takeScreenshot(page, '17_pth4_turismo_sostenible_detail_desktop.png', 'Detalle de PTH Más Turismo Sostenible');
    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // PTH 5: Más Sinergia Territorial
    auditStats.totalTests++;
    log('Entrando a PTH 5: Más Sinergia Territorial...');
    await page.locator('h3', { hasText: 'Más Sinergia Territorial' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Más Sinergia Territorial")');
    await verifyImages(page, 'PTH Más Sinergia Territorial');
    await takeScreenshot(page, '18_pth5_sinergia_territorial_detail_desktop.png', 'Detalle de PTH Más Sinergia Territorial');
    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // -------------------------------------------------------------
    // TEST 10: Auditoría Proyectos de Continuidad - PAMUSS (ID 4406)
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 10: Continuidad PAMUSS - Validación ID 4406 y estados de encuestas ---');
    await page.locator('h3', { hasText: 'Programa del Adulto Mayor (PAMUSS)' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Programa del Adulto Mayor (PAMUSS)")');
    await verifyImages(page, 'Continuidad PAMUSS');
    await takeScreenshot(page, '19_continuidad_pamuss_detail_desktop.png', 'Detalle de Continuidad PAMUSS con sus 5 versiones históricas');

    // Localizar ID 4406
    const card4406 = page.locator('div.group', { hasText: 'ID 4406' }).first();
    await card4406.scrollIntoViewIfNeeded();
    await takeScreenshot(page, '20_continuidad_pamuss_id_4406_surveys_desktop.png', 'Tarjetas de evidencias de ID 4406 con botones Ver Encuesta activos');

    // 1. Abrir Encuesta de Estudiantes ID 4406
    log('Abriendo Encuesta de Estudiantes ID 4406...');
    const encEstBtn4406 = card4406.locator('button[title*="encuesta de estudiantes"]');
    await encEstBtn4406.click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('iframe[src*="Encuesta_Estudiantes_ID_4406.pdf"]', { timeout: 5000 });
    await takeScreenshot(page, '21_continuidad_pamuss_id_4406_encuesta_estudiantes_modal_desktop.png', 'Modal con Encuesta de Estudiantes ID 4406 en PAMUSS');
    await closeModal(page);

    // 2. Abrir Encuesta de Organizaciones ID 4406
    log('Abriendo Encuesta de Organizaciones ID 4406...');
    const encOrgBtn4406 = card4406.locator('button[title*="organizaciones"]');
    await encOrgBtn4406.click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('iframe[src*="Encuesta_Organizaciones_ID_4406.pdf"]', { timeout: 5000 });
    await takeScreenshot(page, '22_continuidad_pamuss_id_4406_encuesta_org_modal_desktop.png', 'Modal con Encuesta de Organizaciones ID 4406 en PAMUSS');
    await closeModal(page);

    // 3. Verificar estado 'No aplicada' en versión sin encuestas (ID 1742)
    const card1742 = page.locator('div.group', { hasText: 'ID 1742' }).first();
    await card1742.scrollIntoViewIfNeeded();
    const noAplicadaVisible = await card1742.locator('text=No aplicada en este año').first().isVisible();
    log(`Estado 'No aplicada' visible en ID 1742: ${noAplicadaVisible}`);
    await takeScreenshot(page, '23_continuidad_pamuss_id_1742_no_aplicada_state_desktop.png', 'Versión ID 1742 mostrando estado "No aplicada en este año" en gris tenue');

    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // -------------------------------------------------------------
    // TEST 11: Continuidad CET, Bomberos y Adolescentes
    // -------------------------------------------------------------
    auditStats.totalTests++;
    log('--- TEST 11: Auditoría de Continuidad CET, Bomberos y Adolescentes ---');

    // CET
    await page.locator('h3', { hasText: 'Reinserción del CET' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Reinserción del CET")');
    await verifyImages(page, 'Continuidad CET');
    await takeScreenshot(page, '24_continuidad_cet_reinsercion_desktop.png', 'Detalle de Continuidad CET con 4 versiones ejecutadas');
    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // Bomberos
    auditStats.totalTests++;
    await page.locator('h3', { hasText: 'Más Salud para Bomberos' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Más Salud para Bomberos")');
    await verifyImages(page, 'Continuidad Bomberos');
    await takeScreenshot(page, '25_continuidad_bomberos_desktop.png', 'Detalle de Continuidad Bomberos con 5 versiones ejecutadas');
    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // Adolescentes
    auditStats.totalTests++;
    await page.locator('h3', { hasText: 'Salud en Adolescentes' }).click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Salud en Adolescentes")');
    await verifyImages(page, 'Continuidad Adolescentes');
    await takeScreenshot(page, '26_continuidad_adolescentes_desktop.png', 'Detalle de Continuidad Adolescentes con 5 versiones ejecutadas');
    await page.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await page.waitForSelector('h1:has-text("Bienvenido")');

    // Cerrar contexto desktop
    await desktopContext.close();

    // -------------------------------------------------------------
    // FASE 2: AUDITORÍA EN VIEWPORT MOBILE (390x844 - iPhone 12/13/14)
    // -------------------------------------------------------------
    log('-------------------------------------------------------------');
    log('FASE 2: AUDITORÍA EN VIEWPORT MOBILE (390x844)');
    log('-------------------------------------------------------------');

    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });

    const mobilePage = await mobileContext.newPage();

    // Test 12: Mobile Login View
    auditStats.totalTests++;
    log('--- TEST 12: Carga en vista móvil y Login ---');
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await verifyImages(mobilePage, 'Mobile Login');
    await takeScreenshot(mobilePage, '27_mobile_login_view.png', 'Pantalla de Login adaptada a Viewport Móvil (390x844)');

    // Login rápido de administrador en mobile
    const mAdminBtn = mobilePage.locator('button[title*="Jefatura"]');
    await mAdminBtn.click();
    auditStats.totalButtonsTested++;
    await mobilePage.fill('input[type="password"]', 'VcmAdmin2026!');
    await mobilePage.locator('button[type="submit"]').click();
    auditStats.totalButtonsTested++;
    await mobilePage.waitForSelector('text=Bienvenido');
    await verifyImages(mobilePage, 'Mobile Home');
    await takeScreenshot(mobilePage, '28_mobile_home_dashboard.png', 'Dashboard de inicio y bienvenida en Viewport Móvil');

    // Test 13: Mobile PTH Detail
    auditStats.totalTests++;
    log('--- TEST 13: Detalle de PTH en vista móvil ---');
    await mobilePage.locator('h3', { hasText: 'Más Parques' }).click();
    auditStats.totalButtonsTested++;
    await mobilePage.waitForSelector('h1:has-text("Más Parques")');
    await verifyImages(mobilePage, 'Mobile PTH Más Parques');
    await takeScreenshot(mobilePage, '29_mobile_pth_detail.png', 'Vista de PTH Más Parques con tarjetas móviles responsivas');
    await mobilePage.locator('button:has-text("Volver al Catálogo")').click();
    auditStats.totalButtonsTested++;
    await mobilePage.waitForSelector('text=Bienvenido');

    // Test 14: Mobile Continuidad PAMUSS
    auditStats.totalTests++;
    log('--- TEST 14: Detalle de Continuidad PAMUSS en vista móvil ---');
    await mobilePage.locator('h3', { hasText: 'Programa del Adulto Mayor (PAMUSS)' }).click();
    auditStats.totalButtonsTested++;
    await mobilePage.waitForSelector('h1:has-text("Programa del Adulto Mayor (PAMUSS)")');
    await verifyImages(mobilePage, 'Mobile Continuidad PAMUSS');
    await takeScreenshot(mobilePage, '30_mobile_continuidad_pamuss.png', 'Vista móvil de Proyecto de Continuidad PAMUSS');

    await mobileContext.close();

    // -------------------------------------------------------------
    // FASE 3: BARRIDO HTTP EXHAUSTIVO DE LOS 201 ARCHIVOS PDF
    // -------------------------------------------------------------
    log('-------------------------------------------------------------');
    log('FASE 3: BARRIDO HTTP DIRECTO DE TODOS LOS 201 PDFs DEL CATÁLOGO');
    log('-------------------------------------------------------------');

    const iniciativasRaw = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, 'src/data/iniciativas.json'), 'utf8')
    );
    const continuidadRaw = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, 'src/data/proyectosContinuidad.json'), 'utf8')
    );

    const pdfList = [];

    // Recolectar PDFs de Iniciativas
    for (const pth of iniciativasRaw) {
      if (Array.isArray(pth.reportesGenerales)) {
        for (const rep of pth.reportesGenerales) {
          if (rep.archivo) pdfList.push(rep.archivo);
        }
      }
      for (const pr of pth.proyectos || []) {
        for (const doc of Object.values(pr.documentos || {})) {
          if (doc?.disponible && doc?.archivo) {
            pdfList.push(doc.archivo);
          }
        }
      }
    }

    // Recolectar PDFs de Continuidad
    for (const prog of continuidadRaw) {
      for (const ver of prog.versiones || []) {
        if (ver.archivo) pdfList.push(ver.archivo);
        for (const doc of Object.values(ver.documentos || {})) {
          if (doc?.disponible && doc?.archivo) {
            pdfList.push(doc.archivo);
          }
        }
      }
    }

    const uniquePdfs = Array.from(new Set(pdfList));
    log(`Verificando acceso HTTP de ${uniquePdfs.length} PDFs únicos registrados...`);

    let pdfCheckSuccess = 0;
    let pdfCheckFail = 0;

    for (const pdfRel of uniquePdfs) {
      const cleanRel = pdfRel.replace(/^\/+/, '');
      const testUrl = `${BASE_URL}/${cleanRel}`;

      await new Promise((resolve) => {
        http.get(testUrl, (res) => {
          if (res.statusCode === 200) {
            pdfCheckSuccess++;
          } else {
            pdfCheckFail++;
            auditStats.notFoundErrors.push(testUrl);
            log(`❌ ERROR ${res.statusCode} al solicitar: ${testUrl}`);
          }
          resolve();
        }).on('error', (err) => {
          pdfCheckFail++;
          auditStats.notFoundErrors.push(testUrl);
          log(`❌ Error de red en ${testUrl}: ${err.message}`);
          resolve();
        });
      });
    }

    log(`Resultado barrido HTTP de PDFs: ${pdfCheckSuccess} exitosos (200 OK), ${pdfCheckFail} errores.`);

    auditStats.totalTests++;
    auditStats.pdfRequestsTotal += uniquePdfs.length;
    auditStats.pdfRequests200 += pdfCheckSuccess;
    auditStats.pdfRequests404 += pdfCheckFail;

    if (auditStats.notFoundErrors.length === 0 && auditStats.pdfRequests404 === 0) {
      auditStats.verdict = 'APROBADO CON DISTINCIÓN MÁXIMA (0 ERRORES)';
    } else {
      auditStats.verdict = 'FALLIDO - ERRORES DETECTADOS';
    }

  } catch (err) {
    log(`❌ ERROR CRÍTICO DURANTE LA EJECUCIÓN: ${err.message}`);
    log(err.stack);
    auditStats.verdict = `ERROR: ${err.message}`;
  } finally {
    if (browser) await browser.close();
    server.close();
    log('[Static Server] Servidor cerrado.');
  }

  // Guardar reporte JSON
  const reportPath = path.join(CAPTURES_DIR, 'auditoria_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditStats, null, 2), 'utf8');
  log(`Reporte estructurado guardado en: ${reportPath}`);

  log('================================================================');
  log(`AUDITORÍA COMPLETADA. VEREDICTO: ${auditStats.verdict}`);
  log(`Total pruebas: ${auditStats.totalTests}`);
  log(`Total botones interactuados: ${auditStats.totalButtonsTested}`);
  log(`Total capturas generadas: ${auditStats.captures.length}`);
  log(`Errores 404 encontrados: ${auditStats.notFoundErrors.length}`);
  log('================================================================');

  return auditStats;
}

runAudit();
