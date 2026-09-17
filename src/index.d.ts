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
export declare function min(value: any, minVal: number): boolean;
export declare function max(value: any, maxVal: number): boolean;
export declare function isAlphanumeric(value: any): boolean;
export declare function isDate(value: any): boolean;
export declare function isCreditCard(value: any): boolean;
export declare function isUUID(value: any): boolean;
export declare function isIP(value: any): boolean;
export declare function isHexColor(value: any): boolean;
export declare function isJSON(value: any): boolean;
export declare function isStrongPassword(value: any): boolean;
export declare function match(value: any, matchWith: any): boolean;
export declare function pattern(value: any, regex: RegExp): boolean;
export declare function maxFileSize(file: any, maxMb: number): boolean;
export declare function allowedFileTypes(file: any, typesArray: string[]): boolean;
export declare function isPhoneBolivia(value: any): boolean;

export interface ValidationOptions {
  allErrors?: boolean;
}

export declare function validateForm(data: Record<string, any>, rules: Record<string, ValidationRule | ValidationRule[]>, options?: ValidationOptions): ValidationResult;
export declare function validateFormAsync(data: Record<string, any>, rules: Record<string, AsyncValidationRule | AsyncValidationRule[]>, options?: ValidationOptions): Promise<ValidationResult>;
