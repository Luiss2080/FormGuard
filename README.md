# @luiss2080/form-validator-simple

Validador de formularios simple y gratuito: `required`, `isEmail`, `minLength`
y un `validateForm` que corre reglas contra un objeto de datos. Sin dependencias.

Pensado para proyectos chicos, formularios de contacto o cualquier caso donde
no necesitás una librería de validación pesada.

## Instalación

```
@luiss2080:registry=https://npm.pkg.github.com
```

```bash
npm install @luiss2080/form-validator-simple
```

## Uso

```js
import { validateForm, isEmail, required } from '@luiss2080/form-validator-simple';

const { valid, errors } = validateForm(
  { nombre: '', email: 'mal' },
  {
    nombre: (v) => required(v) || 'Nombre requerido',
    email: (v) => isEmail(v) || 'Email inválido',
  }
);
```

## Tests

```bash
npm test
```

## Licencia

MIT — gratis para usar, modificar y regalar.
