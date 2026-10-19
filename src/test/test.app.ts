import { container } from 'tsyringe';
import { AuthStore } from '~/features/auth/auth.store';
import { BooksRepository } from '~/features/books/books.repository';
import { registerFakeBooksGateway } from './fake.books.gateway';

export const TEST_USER = 'appako';

export function setupShelf() {
    const gateway = registerFakeBooksGateway();
    const auth = container.resolve(AuthStore);
    auth.login(TEST_USER);
    return { gateway, auth, repository: container.resolve(BooksRepository) };
}

export const flush = () => new Promise(resolve => setTimeout(resolve, 0));
