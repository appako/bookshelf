import { singleton } from 'tsyringe';
import { authAddBook, authClean, authGetAllBooks, authGetPrivateBooks } from '~/shared/api/generated/books.api';
import type { NewBookDto, StatusResponseDto } from './books.dto';

@singleton()
export class BooksGateway {
    getAll(user: string): Promise<unknown> {
        return authGetAllBooks(user);
    }

    getPrivate(user: string): Promise<unknown> {
        return authGetPrivateBooks(user);
    }

    addBook(user: string, book: NewBookDto): Promise<StatusResponseDto> {
        return authAddBook(user, book);
    }

    reset(user: string): Promise<StatusResponseDto> {
        return authClean(user);
    }
}
