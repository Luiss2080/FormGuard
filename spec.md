# Especificación (Spec) - @luiss2080/form-validator-simple

## 1. Contexto y Objetivos
`@luiss2080/form-validator-simple` es una librería de validación de formularios ultra-ligera y sin dependencias. El objetivo de esta evolución es prepararla para entornos de producción modernos, añadiendo tipado (TypeScript), más reglas de uso común, validación asíncrona, y wrappers comerciales (React), manteniendo siempre su peso casi nulo y sin dependencias externas.

## 2. Historias de Usuario
- **HU1**: Como desarrollador frontend, quiero tener autocompletado y validación de tipos al usar la librería en proyectos con TypeScript.
- **HU2**: Como desarrollador web, quiero reglas listas para usar como `isUrl`, `isNumeric`, `maxLength` y `match` para no tener que escribir Regex manuales.
- **HU3**: Como usuario de React, quiero un hook `useFormValidator` que me dé el estado del formulario, errores y control de validación en tiempo real.
- **HU4**: Como backend dev, quiero poder validar si un usuario existe en BD pasándole una regla asíncrona a `validateFormAsync`.

## 3. Requisitos Funcionales (Notación EARS)
- **RF-1**: SIEMPRE que se importe la librería en un entorno TypeScript, el sistema DEBE proveer definiciones de tipos completas (vía `.d.ts`).
- **RF-2**: CUANDO el usuario invoque `validateForm` con una regla que retorna una promesa, el sistema DEBE soportar esta validación a través de una nueva función `validateFormAsync`.
- **RF-3**: CUANDO un valor se pase a `isUrl`, el sistema DEBE validar que sea una URL bien formada.
- **RF-4**: CUANDO se utilice el hook `useFormValidator(initialData, rules)`, el sistema DEBE retornar `{ values, errors, handleChange, validate, isValid }`.
- **RF-5**: SIEMPRE que la librería sea consumida, el tamaño del core DEBE seguir siendo minúsculo y sin dependencias externas en `package.json`.

## 4. Casos Límite y Consideraciones
- Campos opcionales (vacíos) no deben fallar validaciones de formato (como `isEmail` o `isUrl`) a menos que también tengan la regla `required`. Esto implica que las funciones de validación como `isEmail` deben aceptar explícitamente `""` (o se asume que el usuario hace `(v) => !v || isEmail(v)` - se debe definir el estándar en la documentación).

## 5. Fuera de Alcance
- Integraciones complejas con librerías de UI (ej: MUI, Tailwind).
- Validaciones anidadas profundas de objetos complejos.

## 6. Criterios de Aceptación
- [ ] Tests pasan al 100%.
- [ ] Soporte de autocompletado en TS.
- [ ] `useFormValidator` exportado y funcional.
