import { container } from 'tsyringe';
import { describe, expect, it } from 'vitest';
import { AuthStore } from '../auth.store';
import { LoginController } from '../login.controller';

function setup() {
    return { login: container.resolve(LoginController), auth: container.resolve(AuthStore) };
}

describe('LoginController', () => {
    it('does not show an error before the user interacts', () => {
        const { login } = setup();

        expect(login.nicknameError).toBe('');
    });

    it('rejects an empty nickname on submit', () => {
        const { login, auth } = setup();

        login.submit();

        expect(login.nicknameError).toBe('Enter your nickname');
        expect(auth.isAuthorized).toBe(false);
    });

    it.each([
        ['with spaces', 'Only latin letters, digits, "-" and "_"'],
        ['кириллица', 'Only latin letters, digits, "-" and "_"'],
        ['a'.repeat(33), 'Up to 32 characters'],
    ])('validates "%s" while typing', (value, error) => {
        const { login } = setup();

        login.onNicknameChange(value);

        expect(login.nicknameError).toBe(error);
    });

    it('clears the error once the nickname becomes valid', () => {
        const { login } = setup();
        login.onNicknameChange('bad name');

        login.onNicknameChange('good_name-1');

        expect(login.nicknameError).toBe('');
    });

    it('logs in with a lower-cased nickname', () => {
        const { login, auth } = setup();
        login.onNicknameChange('Appako');

        login.submit();

        expect(auth.user).toBe('appako');
    });
});
