# @luiss2080/form-validator-simple

Validador de formularios simple, ligero y gratuito, ahora con soporte para **TypeScript**, validaciones asíncronas y un **Hook de React** incorporado. Sin dependencias externas.

Pensado para proyectos modernos (React, Vue, Vanilla JS) donde necesitas validar formularios sin importar librerías pesadas.

## Características

- 🪶 **Zero Dependencies**: Extremadamente ligero.
- 📘 **TypeScript Support**: Tipado completo para un excelente DX.
- ⚡ **React Integration**: Hook `useFormValidator` listo para usar.
- 🔄 **Validación Asíncrona**: Verifica datos contra tu backend (ej. "email en uso").
- 🛠️ **Reglas Incorporadas**: `required`, `isEmail`, `minLength`, `maxLength`, `isUrl`, `isNumeric`, `match` y más.

## Instalación

```bash
npm install @luiss2080/form-validator-simple
```
*(Asegúrate de tener configurado el registry de GitHub Packages si es necesario).*

## Uso (Vanilla JS / TypeScript)

```ts
import { validateForm, isEmail, required, minLength } from '@luiss2080/form-validator-simple';

const rules = {
  nombre: (v) => required(v) || 'Nombre requerido',
  email: (v) => isEmail(v) || 'Email inválido',
  password: (v) => minLength(v, 6) || 'Mínimo 6 caracteres'
};

const data = { nombre: '', email: 'mal', password: '123' };
const { valid, errors } = validateForm(data, rules);

console.log(valid); // false
console.log(errors); // { nombre: 'Nombre requerido', email: 'Email inválido', password: 'Mínimo 6 caracteres' }
```

### Validación Asíncrona

```ts
import { validateFormAsync, required } from '@luiss2080/form-validator-simple';

const rules = {
  username: async (v) => {
    if (!required(v)) return 'Requerido';
    const exists = await checkUserInDB(v); // Tu llamada a API
    return !exists || 'Usuario ya existe';
  }
};

const { valid, errors } = await validateFormAsync({ username: 'luiss2080' }, rules);
```

## Uso en React ⚛️

Importa desde el submódulo `/react` para manejar automáticamente el estado y los errores de tus formularios.

```jsx
import React from 'react';
import { useFormValidator } from '@luiss2080/form-validator-simple/react';
import { required, isEmail } from '@luiss2080/form-validator-simple';

export function ContactForm() {
  const { values, errors, handleChange, validate, isValid } = useFormValidator(
    { email: '', name: '' },
    {
      name: (v) => required(v) || 'El nombre es obligatorio',
      email: (v) => isEmail(v) || 'Email no válido'
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (await validate()) {
      alert("Enviado con éxito!");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input 
        value={values.name} 
        onChange={e => handleChange('name', e.target.value)} 
        placeholder="Nombre" 
      />
      {errors.name && <p style={{color: 'red'}}>{errors.name}</p>}

      <input 
        value={values.email} 
        onChange={e => handleChange('email', e.target.value)} 
        placeholder="Email" 
      />
      {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}

      <button type="submit">Enviar</button>
    </form>
  );
}
```

## API de Reglas Incluidas

- `required(value)`: Campo no vacío.
- `isEmail(value)`: Formato de email.
- `minLength(value, min)`: Longitud mínima.
- `maxLength(value, max)`: Longitud máxima.
- `isUrl(value)`: Formato de URL válida.
- `isNumeric(value)`: Números enteros o decimales.
- `match(value, matchWith)`: Comprueba igualdad estricta (útil para contraseñas).
- `isPhoneBolivia(value)`: Celulares de Bolivia.

## Tests

```bash
npm test
```

## Licencia

MIT — gratis para usar, modificar y regalar.
