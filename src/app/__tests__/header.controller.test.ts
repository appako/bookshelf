import { container } from 'tsyringe';
import { describe, expect, it } from 'vitest';
import { BooksRepository } from '~/features/books/books.repository';
import { flush, setupShelf, TEST_USER } from '~/test/test.app';
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

describe('HeaderController: clear my books', () => {
    async function setupWithOwnBook() {
        const shelf = setupShelf();
        const header = container.resolve(HeaderController);
        header.init();
        await shelf.repository.add({ name: 'Dune', author: 'Frank Herbert' });
        return { ...shelf, header };
    }

    it('is disabled while the user has no own books', async () => {
        setupShelf();
        const header = container.resolve(HeaderController);
        header.init();
        await flush();

        expect(header.isClearDisabled).toBe(true);
    });

    it('asks for confirmation first and can be cancelled without touching the API', async () => {
        const { header, gateway } = await setupWithOwnBook();
        expect(header.isClearDisabled).toBe(false);

        header.requestClear();
        expect([header.showClear, header.showClearConfirm]).toEqual([false, true]);

        header.cancelClear();
        expect([header.showClear, header.showClearConfirm]).toEqual([true, false]);
        expect(gateway.reset).not.toHaveBeenCalled();
    });

    it('clears own books on confirm and refreshes the counter and lists', async () => {
        const { header, gateway, repository } = await setupWithOwnBook();
        header.requestClear();

        const clearing = header.confirmClear();
        expect(header.clearLabel).toBe('Clearing…');
        expect(header.isClearDisabled).toBe(true);
        await clearing;

        expect(gateway.reset).toHaveBeenCalledWith(TEST_USER);
        expect(header.counterText).toBe('Your books: 0');
        expect(repository.books('all')).toHaveLength(3);
        expect(header.showClear).toBe(true);
    });

    it('shows an error when the API does not confirm the reset', async () => {
        const { header, gateway } = await setupWithOwnBook();
        gateway.reset.mockResolvedValueOnce({ status: 'error' });

        header.requestClear();
        await header.confirmClear();

        expect(header.clearErrorText).toBe('Could not clear books: The books were not cleared, please try again');
        expect(header.counterText).toBe('Your books: 1');
    });
});
