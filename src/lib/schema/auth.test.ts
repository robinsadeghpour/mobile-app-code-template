import { signUpSchema } from './auth';

const signUpWith = (password: string) =>
  signUpSchema().safeParse({ email: 'new@example.com', password, confirmPassword: password }).success;

describe('signUpSchema', () => {
  it.each(['Str0ng!pass', 'Abcdefg1-', 'Abcdefg1_', 'Abcdefg1.', 'Abcdef 1é'])('accepts %s', (password) => {
    expect(signUpWith(password)).toBe(true);
  });

  it.each([
    ['too short', 'Ab1!'],
    ['no uppercase', 'abcdefg1!'],
    ['no lowercase', 'ABCDEFG1!'],
    ['no number', 'Abcdefgh!'],
    ['no special character', 'Abcdefg12'],
  ])('rejects a password with %s', (_reason, password) => {
    expect(signUpWith(password)).toBe(false);
  });
});
