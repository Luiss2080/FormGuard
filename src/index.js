const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
