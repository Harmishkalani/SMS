import test from 'node:test';
import assert from 'node:assert/strict';
import { validEmail, validateStudent } from '../src/utils/validators.js';
test('validEmail accepts a conventional address', () => assert.equal(validEmail('student@example.com'), true));
test('validEmail rejects missing domain', () => assert.equal(validEmail('student@'), false));
test('validateStudent returns errors for empty data', () => assert.ok(validateStudent({}).length >= 6));
test('validateStudent accepts complete valid student data', () => {
  const errors = validateStudent({rollNumber:'S-1',firstName:'A',lastName:'B',email:'a@b.com',course:'IT',year:1,status:'Active'});
  assert.deepEqual(errors, []);
});
test('validateStudent rejects an invalid year', () => assert.ok(validateStudent({rollNumber:'S',firstName:'A',lastName:'B',email:'a@b.com',course:'IT',year:9}).some(e=>e.includes('year'))));
