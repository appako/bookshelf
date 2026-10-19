import { container } from 'tsyringe';
import { describe, expect, it } from 'vitest';
import { AuthStore } from '../auth.store';

describe('AuthStore', () => {
    it('is not authorized by default', () => {
        const auth = container.resolve(AuthStore);

        expect(auth.isAuthorized).toBe(false);
        expect(() => auth.user).toThrow('Not authorized');
    });

    it('logs in and restores the session after reload', () => {
        container.resolve(AuthStore).login('appako');

        container.clearInstances();
        const restored = container.resolve(AuthStore);

        expect(restored.isAuthorized).toBe(true);
        expect(restored.user).toBe('appako');
    });

    it('forgets the nickname on logout', () => {
        const auth = container.resolve(AuthStore);
        auth.login('appako');

        auth.logout();
        container.clearInstances();

        expect(container.resolve(AuthStore).isAuthorized).toBe(false);
    });
});
