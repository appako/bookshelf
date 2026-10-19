import { container } from 'tsyringe';
import { describe, expect, it } from 'vitest';
import { deferred } from '~/test/deferred';
import { setupShelf, TEST_USER } from '~/test/test.app';
import { BookAddController } from '../book.add.controller';

function setup() {
    const shelf = setupShelf();
    const add = container.resolve(BookAddController);
    add.init();
    return { ...shelf, add };
}

describe('BookAddController', () => {
    it('validates required fields on submit and does not call the API', async () => {
        const { add, gateway } = setup();

        await add.submit();

        expect(add.nameError).toBe('Enter the title');
        expect(add.authorError).toBe('Enter the author');
        expect(gateway.addBook).not.toHaveBeenCalled();
    });

    it('treats whitespace-only values as empty', () => {
        const { add } = setup();

        add.onNameChange('   ');

        expect(add.nameError).toBe('Enter the title');
        expect(add.authorError).toBe('');
    });

    it('adds a trimmed book for the current user, refreshes data and clears the form', async () => {
        const { add, gateway, repository } = setup();
        add.onNameChange(' Dune ');
        add.onAuthorChange('Frank Herbert');

        await add.submit();

        expect(gateway.addBook).toHaveBeenCalledWith(TEST_USER, { name: 'Dune', author: 'Frank Herbert' });
        expect(repository.privateCount).toBe(1);
        expect(repository.books('all')).toHaveLength(4);
        expect([add.name, add.author, add.nameError, add.authorError]).toEqual(['', '', '', '']);
    });

    it('blocks double submit while saving', async () => {
        const { add, gateway } = setup();
        const save = deferred<{ status: string }>();
        gateway.addBook.mockReturnValueOnce(save.promise);
        add.onNameChange('Dune');
        add.onAuthorChange('Frank Herbert');

        const first = add.submit();
        expect(add.isSubmitting).toBe(true);
        expect(add.submitLabel).toBe('Adding…');
        await add.submit();
        save.resolve({ status: 'ok' });
        await first;

        expect(gateway.addBook).toHaveBeenCalledTimes(1);
        expect(add.submitLabel).toBe('Add book');
    });

    it('keeps the input and shows an error when saving fails', async () => {
        const { add, gateway } = setup();
        gateway.addBook.mockRejectedValueOnce(new Error('Network Error'));
        add.onNameChange('Dune');
        add.onAuthorChange('Frank Herbert');

        await add.submit();

        expect(add.errorText).toBe('Could not add the book: Network Error');
        expect([add.name, add.author]).toEqual(['Dune', 'Frank Herbert']);
    });
});
