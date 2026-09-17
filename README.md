# 🛡️ FormGuard

<div align="center">
  <img src="https://img.shields.io/npm/v/formguard?color=6d28d9&label=version" alt="Version" />
  <img src="https://img.shields.io/badge/dependencies-0-success" alt="Zero Dependencies" />
  <img src="https://img.shields.io/badge/types-TypeScript-blue" alt="TypeScript Support" />
  <br/>
  <p><b>Validación de formularios ultrarrápida, agnóstica y sin dependencias.</b></p>
</div>

---

**FormGuard** (anteriormente publicado como `form-validator-simple`) es una
librería moderna y ligera diseñada para validar datos en JavaScript y
TypeScript de forma limpia y declarativa. Nació bajo la filosofía de "cero
dependencias", lo que la hace increíblemente rápida y segura. Además,
incluye un hook oficial para integrarse sin esfuerzo con **React**.

## ✨ Características Principales

- 🪶 **Zero Dependencies:** Máximo rendimiento sin engordar tu `node_modules`.
- ⚛️ **Soporte Nativo para React:** Incluye `useFormValidator` para manejar estados y errores al instante.
- ⚡ **Asincronía Real:** Valida contra bases de datos o APIs en tiempo real con `validateFormAsync`.
- 📁 **Validación de Archivos:** Reglas dedicadas para tamaño (`maxFileSize`) y tipos permitidos (`allowedFileTypes`).
- 🛡️ **Tipado Estricto:** Completamente tipada con TypeScript para un autocompletado perfecto.
- 🧠 **Modo Multi-Error:** Retorna todos los errores de un campo si así lo deseas, no solo el primero.

---

## 🚀 Instalación

Usando npm:

```bash
npm install formguard
```

Usando yarn:

```bash
yarn add formguard
```

---

## 📖 Uso Básico (Vanilla JS / Node)

Nuestra API base es agnóstica y funciona en cualquier entorno de JavaScript.

```javascript
import { validateForm, isEmail, required, minLength } from 'formguard';

const data = {
  username: 'luis',
  email: 'luis@invalido'
};

const rules = {
  username: [
    v => required(v) || 'El usuario es obligatorio',
    v => minLength(v, 5) || 'Mínimo 5 caracteres'
  ],
  email: v => isEmail(v) || 'El email no tiene un formato válido'
};

// Pasando { allErrors: true } te devuelve un array de errores por campo
const { valid, errors } = validateForm(data, rules, { allErrors: true });

if (!valid) {
  console.log(errors); 
  // { username: ['Mínimo 5 caracteres'], email: ['El email no tiene un formato válido'] }
}
```

---

## ⚛️ Integración con React

Si usas React, puedes importar nuestro hook exclusivo que maneja todo el estado interno (valores, errores, estado de carga) de forma reactiva.

```jsx
import { useFormValidator } from 'formguard/react';
import { required, isEmail, isCreditCard } from 'formguard';

function App() {
  const { values, errors, handleChange, validate, isSubmitting } = useFormValidator(
    // Estado inicial
    { email: '', card: '' }, 
    // Reglas
    {
      email: v => isEmail(v) || 'Email inválido',
      card: v => isCreditCard(v) || 'Tarjeta inválida (algoritmo Luhn)'
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate(); // Automáticamente revisa si hay asincronía
    if (isValid) alert("¡Todo perfecto!");
  };

  return (
    <form onSubmit={onSubmit}>
      <input 
        value={values.email} 
        onChange={e => handleChange('email', e.target.value)} 
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <button disabled={isSubmitting}>Enviar</button>
    </form>
  );
}
```

---

## 🧰 Catálogo de Reglas Disponibles

La librería viene con un set robusto de validadores listos para usar:

### Textos y Números
- `required(value)`: Campo no vacío.
- `isEmail(value)`: Valida formato de correo.
- `minLength(value, min)`: Longitud mínima.
- `maxLength(value, max)`: Longitud máxima.
- `match(value, matchWith)`: Comparación exacta (ideal para "Confirmar Contraseña").
- `isNumeric(value)`: Verifica si la cadena representa un número.
- `min(value, minVal)`: Valor numérico mayor o igual.
- `max(value, maxVal)`: Valor numérico menor o igual.
- `isAlphanumeric(value)`: Solo letras y números.
- `isStrongPassword(value)`: Contraseñas con mayúsculas, minúsculas, números y símbolos.

### Formatos Avanzados
- `isUrl(value)`: Valida enlaces y dominios web.
- `isDate(value)`: Valida fechas reales en formato `YYYY-MM-DD` (incluso años bisiestos).
- `isCreditCard(value)`: Valida tarjetas bancarias usando el poderoso **Algoritmo de Luhn**.
- `isUUID(value)`: Identificadores universales (ej. bases de datos).
- `isIP(value)`: Direcciones IPv4 e IPv6.
- `isHexColor(value)`: Colores hexadecimales (`#fff`, `#FF5733`).
- `isJSON(value)`: Validar cadenas de texto JSON.
- `isPhoneBolivia(value)`: Regla regional para celulares de 8 dígitos.

### 📁 Archivos (Files)
- `maxFileSize(file, maxMb)`: Valida que el archivo no supere el tamaño en Megabytes.
- `allowedFileTypes(file, ['image/png', 'application/pdf'])`: Verifica la firma MIME del archivo.

---

## ⏳ Validaciones Asíncronas

Si necesitas consultar una base de datos para saber si un nombre de usuario existe, ¡puedes hacerlo! Solo devuelve una Promesa en tu regla y usa `validateFormAsync` (o simplemente llama a `validate()` si usas el hook de React).

```javascript
import { validateFormAsync, required } from 'formguard';

const data = { username: 'admin' };
const rules = {
  username: async (v) => {
    if (!required(v)) return 'Requerido';
    const exists = await fetch(`/api/users/${v}`).then(r => r.json());
    return !exists || 'Ese nombre de usuario ya está tomado';
  }
};

const { valid, errors } = await validateFormAsync(data, rules);
```

---

## 🧩 Campos opcionales: `required` + validadores de formato

Los validadores de formato (`isEmail`, `isUrl`, `isDate`, `isCreditCard`,
`isHexColor`, etc.) **rechazan un valor vacío por diseño**: `isEmail('')`
devuelve `false`, no `true`. Si un campo es opcional, combínalo
explícitamente con `required` en vez de asumir que el validador de formato
lo va a "dejar pasar":

```javascript
// Campo obligatorio: basta con el validador de formato.
email: v => isEmail(v) || 'Email inválido'

// Campo opcional: solo valida el formato si el usuario escribió algo.
sitioWeb: v => !required(v) || isUrl(v) || 'URL inválida'
```

Este es el estándar que sigue toda la librería (ver `spec.md`, sección
"Casos Límite"): un campo vacío nunca es "válido" para un validador de
formato por sí solo, evitando que un campo opcional sin completar pase
silenciosamente una regla de formato con datos incompletos.

---

## 🧑‍💻 Licencia e Involucrados

Desarrollado con arquitectura basada en **SDD (Spec-Driven Development)** para asegurar que el código siempre dice la verdad frente a los requerimientos.

MIT License. Siéntete libre de crear un Issue o Pull Request si quieres aportar nuevas reglas al ecosistema.
