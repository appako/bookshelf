import { describe, expect, it } from 'vitest';
import { setupShelf, TEST_USER } from '~/test/test.app';

describe('BooksRepository', () => {
    it('loads books of the logged-in user and maps DTOs to models with stable keys', async () => {
        const { gateway, repository } = setupShelf();
        gateway.getAll.mockResolvedValueOnce([
            { id: 1, name: 'Dune', author: 'Frank Herbert', ownerId: 'x' },
            { name: 'Solaris', author: 'Stanislaw Lem' },
        ]);

        await repository.load('all');

        expect(gateway.getAll).toHaveBeenCalledWith(TEST_USER);
        expect(repository.books('all')).toMatchObject([
            { key: 'id:1', id: 1, name: 'Dune', author: 'Frank Herbert' },
            { key: 'idx:1', name: 'Solaris', author: 'Stanislaw Lem' },
        ]);
    });

    it('skips malformed records instead of failing the whole list', async () => {
        const { gateway, repository } = setupShelf();
        gateway.getPrivate.mockResolvedValueOnce([
            {},
            null,
            { name: 42, author: 'Nobody' },
            { name: 'Dune', author: '' },
            { name: 'Solaris', author: 'Stanislaw Lem' },
        ]);

        await repository.load('private');

        expect(repository.books('private')).toMatchObject([{ name: 'Solaris' }]);
        expect(repository.privateCount).toBe(1);
    });

    it('treats a non-array response as a load error', async () => {
        const { gateway, repository } = setupShelf();
        gateway.getAll.mockResolvedValueOnce({ unexpected: true });

        await expect(repository.load('all')).resolves.toBe(false);

        expect(repository.states.all.error).toBe('Unexpected response from the books API');
        expect(repository.books('all')).toBeUndefined();
    });

    it('adds a book and refreshes both scopes', async () => {
        const { gateway, repository } = setupShelf();

        await repository.add({ name: 'Dune', author: 'Frank Herbert' });

        expect(gateway.addBook).toHaveBeenCalledWith(TEST_USER, { name: 'Dune', author: 'Frank Herbert' });
        expect(repository.books('all')).toHaveLength(4);
        expect(repository.books('private')).toMatchObject([{ name: 'Dune', author: 'Frank Herbert' }]);
    });

    it('fails adding when the API does not confirm the save', async () => {
        const { gateway, repository } = setupShelf();
        gateway.addBook.mockResolvedValueOnce({ status: 'error' });

        await expect(repository.add({ name: 'Dune', author: 'Frank Herbert' })).rejects.toThrow(
            'The book was not saved',
        );
        expect(gateway.getAll).not.toHaveBeenCalled();
    });

    it('forgets loaded data on reset', async () => {
        const { repository } = setupShelf();
        await repository.load('private');

        repository.reset();

        expect(repository.privateCount).toBeUndefined();
        expect(repository.states.private.status).toBe('idle');
    });
});
