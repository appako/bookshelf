import { container } from 'tsyringe';
import { vi } from 'vitest';
import type { BookDto, NewBookDto, StatusResponseDto } from '~/features/books/books.dto';
import { BooksGateway } from '~/features/books/books.gateway';

export class FakeBooksGateway implements Pick<BooksGateway, keyof BooksGateway> {
    private static readonly SEED_BOOKS: BookDto[] = [
        { id: 111, name: 'Wind in the willows', ownerId: 'postnikov', author: 'Kenneth Graeme' },
        { id: 121, name: 'I, Robot', ownerId: 'postnikov', author: 'Isaac Asimov' },
        { id: 131, name: 'The Hobbit', ownerId: 'postnikov', author: 'Jrr Tolkein' },
    ];

    readonly added: NewBookDto[] = [];

    getAll = vi.fn(async (_user: string): Promise<unknown> => [...FakeBooksGateway.SEED_BOOKS, ...this.added]);

    getPrivate = vi.fn(async (_user: string): Promise<unknown> => [...this.added]);

    addBook = vi.fn(async (_user: string, book: NewBookDto): Promise<StatusResponseDto> => {
        this.added.push(book);
        return { status: 'ok' };
    });

    reset = vi.fn(async (_user: string): Promise<StatusResponseDto> => {
        this.added.length = 0;
        return { status: 'ok' };
    });
}

export function registerFakeBooksGateway() {
    const gateway = new FakeBooksGateway();
    container.registerInstance(BooksGateway, gateway as unknown as BooksGateway);
    return gateway;
}
