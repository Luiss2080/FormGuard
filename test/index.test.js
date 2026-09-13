import test from 'node:test';
import assert from 'node:assert/strict';
import { required, isEmail, minLength, validateForm } from '../src/index.js';

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
