const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const NUMERIC_RE = /^-?\d+(\.\d+)?$/;
const ALPHANUMERIC_RE = /^[a-zA-Z0-9]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
// Celulares bolivianos: 8 dígitos, empiezan con 6 o 7 (Entel/Tigo/Viva).
const TELEFONO_BOLIVIA_RE = /^[67]\d{7}$/;

/** Valida que un campo no esté vacío (ignorando espacios). */
export function required(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Valida formato de email básico. */
export function isEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim());
}

/** Valida que un texto tenga al menos `min` caracteres (sin contar espacios extremos). */
export function minLength(value, min) {
  return typeof value === 'string' && value.trim().length >= min;
}

/** Valida que un texto tenga como máximo `max` caracteres. */
export function maxLength(value, max) {
  if (value === undefined || value === null) return true;
  return String(value).trim().length <= max;
}

/** Valida si el formato corresponde a una URL. */
export function isUrl(value) {
  if (!value) return false;
  return typeof value === 'string' && URL_RE.test(value.trim());
}

/** Valida si el valor es numérico. */
export function isNumeric(value) {
  if (value === undefined || value === null || value === '') return false;
  return NUMERIC_RE.test(String(value).trim());
}

/** Valida que un número sea mayor o igual a min. */
export function min(value, minVal) {
  if (!isNumeric(value)) return false;
  return Number(value) >= minVal;
}

/** Valida que un número sea menor o igual a max. */
export function max(value, maxVal) {
  if (!isNumeric(value)) return false;
  return Number(value) <= maxVal;
}

/** Valida si el valor es alfanumérico. */
export function isAlphanumeric(value) {
  return typeof value === 'string' && ALPHANUMERIC_RE.test(value.trim());
}

/** Valida si es una fecha YYYY-MM-DD válida. */
export function isDate(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const d = new Date(value);
  return d instanceof Date && !isNaN(d.getTime()) && value === d.toISOString().split('T')[0];
}

/** Valida tarjeta de crédito usando algoritmo de Luhn. */
export function isCreditCard(value) {
  if (typeof value !== 'string') return false;
  const clean = value.replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(clean)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/** Valida que el valor sea igual a otro (útil para confirmar contraseñas). */
export function match(value, matchWith) {
  return value === matchWith;
}

/** Valida que el archivo no supere el tamaño máximo (en MB). */
export function maxFileSize(file, maxMb) {
  if (!file || !file.size) return false;
  return file.size <= maxMb * 1024 * 1024;
}

/** Valida que el archivo coincida con los tipos permitidos (ej. ['image/jpeg', 'application/pdf']). */
export function allowedFileTypes(file, typesArray) {
  if (!file || !file.type) return false;
  return typesArray.includes(file.type);
}

/**
 * Valida un número de celular boliviano: 8 dígitos, empezando en 6 o 7.
 * Acepta espacios/guiones y el prefijo +591 (se ignoran antes de validar).
 */
export function isPhoneBolivia(value) {
  if (typeof value !== 'string') return false;
  const limpio = value.trim().replace(/^\+?591/, '').replace(/[\s-]/g, '');
  return TELEFONO_BOLIVIA_RE.test(limpio);
}

/**
 * Valida un objeto de datos contra un objeto de reglas y devuelve
 * { valid, errors } con el primer mensaje de error por campo (o un array si allErrors = true).
 *
 * Ej: validateForm({email: 'x'}, {email: v => isEmail(v) || 'Email inválido'}, { allErrors: true })
 */
export function validateForm(data, rules, options = {}) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const rulesArray = Array.isArray(rule) ? rule : [rule];
    for (const r of rulesArray) {
      const result = r(data[field]);
      if (result !== true) {
        const errMsg = typeof result === 'string' ? result : `${field} es inválido`;
        if (options.allErrors) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(errMsg);
        } else {
          errors[field] = errMsg;
          break; // Stop at first error per field by default
        }
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Valida un objeto de datos contra reglas que pueden retornar Promesas.
 */
export async function validateFormAsync(data, rules, options = {}) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const rulesArray = Array.isArray(rule) ? rule : [rule];
    for (const r of rulesArray) {
      const result = await r(data[field]);
      if (result !== true) {
        const errMsg = typeof result === 'string' ? result : `${field} es inválido`;
        if (options.allErrors) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(errMsg);
        } else {
          errors[field] = errMsg;
          break;
        }
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
