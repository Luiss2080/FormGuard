import { useState, useCallback } from 'react';
import { validateForm, validateFormAsync } from '../index.js';

/**
 * Hook de React para manejar estado y validación de formularios.
 * @param {Object} initialData Datos iniciales del formulario.
 * @param {Object} rules Reglas de validación.
 * @returns {Object} { values, errors, handleChange, validate, isValid, isSubmitting }
 */
export function useFormValidator(initialData, rules) {
  const [values, setValues] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Limpiar error al escribir
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const validate = useCallback(async (asyncValidation = false) => {
    setIsSubmitting(true);
    try {
      let result;
      if (asyncValidation) {
        result = await validateFormAsync(values, rules);
      } else {
        result = validateForm(values, rules);
      }
      setErrors(result.errors);
      return result.valid;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, rules]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    handleChange,
    validate,
    isValid,
    isSubmitting
  };
}
