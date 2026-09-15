export type ValidationRule = (value: any) => boolean | string;
export type AsyncValidationRule = (value: any) => boolean | string | Promise<boolean | string>;

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export declare function required(value: any): boolean;
export declare function isEmail(value: any): boolean;
export declare function minLength(value: any, min: number): boolean;
export declare function maxLength(value: any, max: number): boolean;
export declare function isUrl(value: any): boolean;
export declare function isNumeric(value: any): boolean;
export declare function match(value: any, matchWith: any): boolean;
export declare function isPhoneBolivia(value: any): boolean;

export declare function validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult;
export declare function validateFormAsync(data: Record<string, any>, rules: Record<string, AsyncValidationRule>): Promise<ValidationResult>;
