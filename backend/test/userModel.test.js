import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../src/models/User.js';

test('User accepts the passwordHash generated during registration', async () => {
  const user = new User({
    name: 'Test Testing',
    email: 'registration-check@example.test',
    passwordHash: 'hashed-password-value'
  });

  await assert.doesNotReject(user.validate());
});
