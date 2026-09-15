import { ValidationRule, AsyncValidationRule } from '../index.js';

export interface UseFormValidatorReturn<T> {
  values: T;
  errors: Record<string, string>;
  handleChange: (field: keyof T, value: any) => void;
  validate: (asyncValidation?: boolean) => Promise<boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

export declare function useFormValidator<T extends Record<string, any>>(
  initialData: T,
  rules: Record<string, ValidationRule | AsyncValidationRule>
): UseFormValidatorReturn<T>;
