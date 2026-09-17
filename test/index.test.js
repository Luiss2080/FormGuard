import test from 'node:test';
import assert from 'node:assert/strict';
import { required, isEmail, minLength, maxLength, isUrl, isNumeric, match, isPhoneBolivia, validateForm, validateFormAsync, isDate, isAlphanumeric, min, max, isCreditCard, maxFileSize, allowedFileTypes, isUUID, isIP, isHexColor, isJSON, isStrongPassword } from '../src/index.js';

test('required rechaza vacío y espacios', () => {
  assert.equal(required('hola'), true);
  assert.equal(required('   '), false);
  assert.equal(required(''), false);
});

test('required trata 0 y false como valores presentes, no vacíos', () => {
  // Bug: antes required() solo aceptaba strings, así que un input numérico
  // en 0 (ej. cantidad = 0) o un checkbox sin marcar (false) fallaban
  // aunque el usuario sí completó el campo.
  assert.equal(required(0), true);
  assert.equal(required(false), true);
  assert.equal(required(true), true);
  assert.equal(required(NaN), false);
});

test('required maneja null, undefined y arreglos', () => {
  assert.equal(required(null), false);
  assert.equal(required(undefined), false);
  assert.equal(required([]), false);
  assert.equal(required([1]), true);
  assert.equal(required(['']), true); // el arreglo tiene un elemento, aunque vacío
});

test('isEmail valida formato básico', () => {
  assert.equal(isEmail('a@b.com'), true);
  assert.equal(isEmail('no-es-email'), false);
});

test('minLength respeta el mínimo', () => {
  assert.equal(minLength('hola', 3), true);
  assert.equal(minLength('hi', 3), false);
});

test('isPhoneBolivia acepta celulares válidos con o sin prefijo/formato', () => {
  assert.equal(isPhoneBolivia('71234567'), true);
  assert.equal(isPhoneBolivia('+59171234567'), true);
  assert.equal(isPhoneBolivia('7123-4567'), true);
  assert.equal(isPhoneBolivia('61234567'), true);
});

test('isPhoneBolivia rechaza números inválidos', () => {
  assert.equal(isPhoneBolivia('51234567'), false); // no empieza en 6/7
  assert.equal(isPhoneBolivia('712345'), false); // muy corto
  assert.equal(isPhoneBolivia('no-es-numero'), false);
});

test('validateForm agrega errores por campo', () => {
  const { valid, errors } = validateForm(
    { nombre: '', email: 'mal' },
    {
      nombre: (v) => required(v) || 'Nombre requerido',
      email: (v) => isEmail(v) || 'Email inválido',
    }
  );
  assert.equal(valid, false);
  assert.equal(errors.nombre, 'Nombre requerido');
  assert.equal(errors.email, 'Email inválido');
});

test('maxLength respeta el máximo', () => {
  assert.equal(maxLength('hola', 4), true);
  assert.equal(maxLength('hola', 3), false);
});

test('isUrl valida formato de url', () => {
  assert.equal(isUrl('https://google.com'), true);
  assert.equal(isUrl('http://test.com/path'), true);
  assert.equal(isUrl('not-a-url'), false);
});

test('isNumeric valida numeros', () => {
  assert.equal(isNumeric('123'), true);
  assert.equal(isNumeric('-123.45'), true);
  assert.equal(isNumeric('abc'), false);
  assert.equal(isNumeric(''), false);
});

test('match comprueba igualdad estricta', () => {
  assert.equal(match('pass', 'pass'), true);
  assert.equal(match('pass', 'fail'), false);
});

test('min y max evaluan numeros', () => {
  assert.equal(min('10', 5), true);
  assert.equal(min('4', 5), false);
  assert.equal(max('10', 15), true);
  assert.equal(max('20', 15), false);
});

test('isAlphanumeric', () => {
  assert.equal(isAlphanumeric('hola123'), true);
  assert.equal(isAlphanumeric('hola 123'), false);
  assert.equal(isAlphanumeric('hola!'), false);
});

test('isDate valida fechas yyyy-mm-dd', () => {
  assert.equal(isDate('2024-02-29'), true); // bisiesto
  assert.equal(isDate('2023-02-29'), false);
  assert.equal(isDate('10-10-2020'), false);
});

test('isCreditCard algoritmo luhn', () => {
  assert.equal(isCreditCard('4111111111111111'), true); // Test Luhn Visa
  assert.equal(isCreditCard('4111111111111112'), false);
});

test('validateForm soporta arreglos de reglas y allErrors', () => {
  const data = { age: '15' };
  const rules = {
    age: [
      (v) => isNumeric(v) || 'Debe ser numero',
      (v) => min(v, 18) || 'Mayor de edad'
    ]
  };
  const { valid, errors } = validateForm(data, rules, { allErrors: true });
  assert.equal(valid, false);
  assert.equal(errors.age.length, 1);
  assert.equal(errors.age[0], 'Mayor de edad');
  
  // Testear fallando ambas
  const data2 = { age: 'abc' };
  const { errors: e2 } = validateForm(data2, rules, { allErrors: true });
  assert.equal(e2.age.length, 2);
});

test('validateFormAsync maneja promesas', async () => {
  const { valid, errors } = await validateFormAsync(
    { username: 'taken' },
    {
      username: async (v) => (v !== 'taken') || 'Usuario ya existe',
    }
  );
  assert.equal(valid, false);
  assert.equal(errors.username, 'Usuario ya existe');
});

test('file validation', () => {
  const fakeFile = { size: 1024 * 1024, type: 'image/jpeg' }; // 1MB
  assert.equal(maxFileSize(fakeFile, 2), true);
  assert.equal(maxFileSize(fakeFile, 0.5), false);
  
  assert.equal(allowedFileTypes(fakeFile, ['image/jpeg', 'image/png']), true);
  assert.equal(allowedFileTypes(fakeFile, ['application/pdf']), false);
});

test('Ultimate validators', () => {
  assert.equal(isUUID('550e8400-e29b-41d4-a716-446655440000'), true);
  assert.equal(isUUID('invalid-uuid'), false);
  
  assert.equal(isIP('192.168.1.1'), true);
  assert.equal(isIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), true);
  assert.equal(isIP('999.999.999.999'), false);
  
  assert.equal(isHexColor('#FF5733'), true);
  assert.equal(isHexColor('FF5733'), true);
  assert.equal(isHexColor('#zzz'), false);
  
  assert.equal(isJSON('{"name":"luis"}'), true);
  assert.equal(isJSON('{name:"luis"}'), false);
  
  assert.equal(isStrongPassword('Abcdef1@'), true);
  assert.equal(isStrongPassword('password'), false);
});
