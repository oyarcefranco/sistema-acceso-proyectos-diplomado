# Portal de Iniciativas y Evidencias VcM · Diplomado USS

Sistema web interactivo diseñado para que académicos internos y externos que cursan el **Diplomado en Vinculación con el Medio (USS)** accedan de forma ágil, intuitiva y centralizada a la información, indicadores y evidencias documentales (encuestas validadas e informes de cierre) para su trabajo final.

---

## 🎯 Solución Anti-OneDrive (Arquitectura Plana)

Este sistema reemplaza la estructura de carpetas anidadas de OneDrive que generaba desorientación y fatiga de clics, ofreciendo:
* **Fila 360° por Proyecto:** En una sola fila se visualiza el código, año, línea de acción, métricas de Cristóbal y botones directos a cada PDF.
* **Control de Acceso por RUT Chileno:** Validación en vivo de formato y dígito verificador contra la nómina oficial (`whitelist.json`).
* **Visor de PDF Integrado:** Modal institucional que permite leer los reportes sin salir de la plataforma y descargarlos en 1 clic.
* **Descarga Consolidada en Excel y ZIP:** Generación instantánea de la planilla completa y del expediente comprimido del PTH.
* **Filtros Dinámicos:** Búsqueda en vivo por nombre, código, sede, año (2024 / 2025) y línea de acción.

---

## 🚀 Cómo ejecutar en desarrollo

1. Abre una terminal en esta carpeta.
2. Ejecuta:
   ```bash
   npm run dev
   ```
3. Abre el enlace local en tu navegador (usualmente `http://localhost:5173`).

Para generar la versión final lista para producción:
```bash
npm run build
```

---

## 👥 Cómo actualizar la nómina de usuarios autorizados

El archivo `src/data/whitelist.json` contiene la lista blanca de evaluadores. Para agregar o modificar personas:

```json
[
  {
    "rut": "12.345.678-5",
    "nombre": "Dr. Franco Oyarce",
    "rol": "Académico Evaluador",
    "tipo": "Interno",
    "facultad": "Facultad de Medicina y Ciencia",
    "email": "franco.oyarce@uss.cl"
  }
]
```
> *Nota: El sistema limpia puntos y guiones automáticamente al validar, por lo que el usuario puede ingresar su RUT como prefiera.*

---

## 📊 Cómo actualizar proyectos, indicadores y documentos

El archivo `src/data/iniciativas.json` contiene la estructura completa de los 5 PTH:
1. **Más Personas Mayores Activas**
2. **Más Azul**
3. **Más Parques**
4. **Más Turismo Sostenible**
5. **Más Sinergia Territorial**

Por cada proyecto puedes actualizar:
* `codigo`, `nombre`, `ano`, `lineaAccion`, `sede`
* `indicadores`: `{ "organizaciones": X, "estudiantes": Y, "academicos": Z }` (Datos solicitados a Cristóbal)
* `documentos`: enlaces y estados (`"Validado"`, `"En proceso de validación"`, `"En ejecución 2025"`).

---

## ☁️ Despliegue en la Nube (Vercel / Netlify / Cloudflare)

El proyecto está 100% optimizado para la nube:
1. Sube este repositorio a GitHub / GitLab.
2. Conéctalo a **Vercel** o **Netlify**.
3. El comando de build es `npm run build` y la carpeta de salida es `dist`.
4. ¡Listo! Tendrás una URL pública inmediata protegida por el login de RUT.
