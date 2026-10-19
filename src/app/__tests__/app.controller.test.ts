import { container } from 'tsyringe';
import { describe, expect, it } from 'vitest';
import { AuthStore } from '~/features/auth/auth.store';
import { registerFakeBooksGateway } from '~/test/fake.books.gateway';
import { setupShelf } from '~/test/test.app';
import { AppController } from '../app.controller';

describe('AppController', () => {
    it('shows the login screen until the user is authorized', () => {
        registerFakeBooksGateway();
        const app = container.resolve(AppController);

        expect([app.showLogin, app.showShelf]).toEqual([true, false]);

        container.resolve(AuthStore).login('appako');
        expect([app.showLogin, app.showShelf]).toEqual([false, true]);
    });

    it("drops the previous user's books on logout", async () => {
        const { auth, repository } = setupShelf();
        const app = container.resolve(AppController);
        app.init();
        await repository.load('private');

        auth.logout();

        expect(repository.privateCount).toBeUndefined();
        app.dispose();
    });
});
