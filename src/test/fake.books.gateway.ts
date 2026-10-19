import { container } from 'tsyringe';
import { vi } from 'vitest';
import type { BookDto, NewBookDto } from '~/features/books/books.dto';
import { BooksGateway } from '~/features/books/books.gateway';

export const SEED_BOOKS: BookDto[] = [
    { id: 111, name: 'Wind in the willows', ownerId: 'postnikov', author: 'Kenneth Graeme' },
    { id: 121, name: 'I, Robot', ownerId: 'postnikov', author: 'Isaac Asimov' },
    { id: 131, name: 'The Hobbit', ownerId: 'postnikov', author: 'Jrr Tolkein' },
];

/**
 * In-memory stand-in for the API, mirroring its observed behaviour: every user starts with the seed books,
 * added books (stored without id) appear in both "all" and "private". Methods are spies, so tests can
 * assert calls or override single responses with `mockImplementationOnce` / `mockReturnValueOnce`.
 */
export class FakeBooksGateway implements Pick<BooksGateway, keyof BooksGateway> {
    readonly added: NewBookDto[] = [];

    getAll = vi.fn(async (_user: string): Promise<unknown> => [...SEED_BOOKS, ...this.added]);

    getPrivate = vi.fn(async (_user: string): Promise<unknown> => [...this.added]);

    addBook = vi.fn(async (_user: string, book: NewBookDto) => {
        this.added.push(book);
        return { status: 'ok' };
    });
}

export function registerFakeBooksGateway() {
    const gateway = new FakeBooksGateway();
    container.registerInstance(BooksGateway, gateway as unknown as BooksGateway);
    return gateway;
}
