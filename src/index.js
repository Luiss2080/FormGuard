const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
