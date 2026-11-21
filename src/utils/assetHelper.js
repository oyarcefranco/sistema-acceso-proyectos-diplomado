/**
 * Utilidad para resolver rutas de recursos (documentos, imágenes, descargas)
 * garantizando compatibilidad absoluta tanto en desarrollo local como en GitHub Pages
 * bajo cualquier subruta de repositorio.
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http://') || 
    path.startsWith('https://') || 
    path.startsWith('blob:') || 
    path.startsWith('data:')
  ) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, '');

  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    let pathname = window.location.pathname;

    // Si pathname termina en un archivo (ej: /index.html), nos quedamos con el directorio
    if (!pathname.endsWith('/')) {
      if (pathname.includes('.')) {
        pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
      } else {
        pathname = pathname + '/';
      }
    }

    return `${origin}${pathname}${cleanPath}`;
  }

  const baseUrl = import.meta.env?.BASE_URL || './';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
}
