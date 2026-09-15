import test from 'node:test';
import assert from 'node:assert/strict';
import { required, isEmail, minLength, maxLength, isUrl, isNumeric, match, isPhoneBolivia, validateForm, validateFormAsync } from '../src/index.js';

test('required rechaza vacío y espacios', () => {
  assert.equal(required('hola'), true);
  assert.equal(required('   '), false);
  assert.equal(required(''), false);
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
