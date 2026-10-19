import { singleton } from 'tsyringe';
import { authAddBook, authGetAllBooks, authGetPrivateBooks } from '~/shared/api/generated/books.api';
import type { AddBookResponseDto, NewBookDto } from './books.dto';

/** Transport only: generated API calls in, raw DTOs out. Lists are `unknown` until validated by the repository. */
@singleton()
export class BooksGateway {
    getAll(user: string): Promise<unknown> {
        return authGetAllBooks(user);
    }

    getPrivate(user: string): Promise<unknown> {
        return authGetPrivateBooks(user);
    }

    addBook(user: string, book: NewBookDto): Promise<AddBookResponseDto> {
        return authAddBook(user, book);
    }
}
