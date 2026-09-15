const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const NUMERIC_RE = /^-?\d+(\.\d+)?$/;
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

/** Valida que el valor sea igual a otro (útil para confirmar contraseñas). */
export function match(value, matchWith) {
  return value === matchWith;
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
 * { valid, errors } con el primer mensaje de error por campo.
 *
 * Ej: validateForm({email: 'x'}, {email: v => isEmail(v) || 'Email inválido'})
 */
export function validateForm(data, rules) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(data[field]);
    if (result !== true) {
      errors[field] = typeof result === 'string' ? result : `${field} es inválido`;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Valida un objeto de datos contra reglas que pueden retornar Promesas.
 */
export async function validateFormAsync(data, rules) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const result = await rule(data[field]);
    if (result !== true) {
      errors[field] = typeof result === 'string' ? result : `${field} es inválido`;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
