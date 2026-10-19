import { container } from 'tsyringe';
import { describe, expect, it } from 'vitest';
import { BooksRepository } from '~/features/books/books.repository';
import { flush, setupShelf } from '~/test/test.app';
import { HeaderController } from '../header/header.controller';

describe('HeaderController', () => {
    it('shows the private books counter once it is loaded', async () => {
        setupShelf();
        const header = container.resolve(HeaderController);

        header.init();
        expect(header.counterText).toBe('Your books: …');

        await flush();
        expect(header.counterText).toBe('Your books: 0');
    });

    it('updates the counter when a book is added anywhere in the app', async () => {
        setupShelf();
        const header = container.resolve(HeaderController);
        header.init();

        await container.resolve(BooksRepository).add({ name: 'Dune', author: 'Frank Herbert' });

        expect(header.counterText).toBe('Your books: 1');
    });

    it('shows the nickname and logs out', () => {
        const { auth } = setupShelf();
        const header = container.resolve(HeaderController);

        expect(header.nickname).toBe('appako');
        header.logout();

        expect(auth.isAuthorized).toBe(false);
    });
});
