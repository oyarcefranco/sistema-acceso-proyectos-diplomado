/**
 * Utilidades para formateo y validación de RUT chileno
 */

// Normaliza cualquier documento (RUT, pasaporte o documento extranjero)
export function normalizeDoc(doc) {
  if (!doc) return '';
  return String(doc).trim().toUpperCase().replace(/[\.\-\s]/g, '');
}

// Limpia el RUT dejando solo dígitos y K
export function cleanRut(rut) {
  if (!rut) return '';
  return String(rut).replace(/[^0-9kK]/g, '').toUpperCase();
}

// Formatea un RUT a formato estándar: 12.345.678-K (solo si es RUT chileno)
export function formatRut(rut) {
  if (!rut) return '';
  const str = String(rut).trim();
  
  // Si contiene letras antes del final, es pasaporte / documento extranjero
  const cleaned = cleanRut(str);
  if (!cleaned) return str;
  if (/[A-Z]/.test(cleaned.slice(0, -1))) {
    return str.toUpperCase();
  }
  
  if (cleaned.length <= 1) return cleaned;
  
  const dv = cleaned.slice(-1);
  const cuerpo = cleaned.slice(0, -1);
  
  // Agregar puntos al cuerpo
  let formattedCuerpo = '';
  let count = 0;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    count++;
    formattedCuerpo = cuerpo[i] + formattedCuerpo;
    if (count === 3 && i > 0) {
      formattedCuerpo = '.' + formattedCuerpo;
      count = 0;
    }
  }
  
  return `${formattedCuerpo}-${dv}`;
}

// Calcula el Dígito Verificador (Módulo 11)
export function calculateDv(cuerpo) {
  let suma = 0;
  let multiplo = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

// Valida si un RUT es matemáticamente correcto
export function validateRut(rut) {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 8 || cleaned.length > 9) return false;
  
  const dv = cleaned.slice(-1);
  const cuerpo = cleaned.slice(0, -1);
  
  if (!/^\d+$/.test(cuerpo)) return false;
  
  return calculateDv(cuerpo) === dv;
}
