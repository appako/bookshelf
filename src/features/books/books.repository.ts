import { action, computed, makeObservable, observable } from 'mobx';
import { singleton } from 'tsyringe';
import { AuthStore } from '~/features/auth/auth.store';
import { AsyncState } from '~/shared/mobx/async.state';
import { plainToModel } from '~/shared/validation/plain.to.model';
import { validateModel } from '~/shared/validation/validate.model';
import { BookModel } from './book.model';
import type { NewBookDto } from './books.dto';
import { BooksGateway } from './books.gateway';

export type BooksScope = 'all' | 'private';

/** App-wide books data (shared by the list and the header counter). Holds PM, talks DTO to the gateway. */
@singleton()
export class BooksRepository {
    /** `undefined` until the scope is loaded for the first time. */
    @observable.shallow private lists: Record<BooksScope, BookModel[] | undefined> = {
        all: undefined,
        private: undefined,
    };

    readonly states: Record<BooksScope, AsyncState> = { all: new AsyncState(), private: new AsyncState() };

    constructor(
        private readonly gateway: BooksGateway,
        private readonly auth: AuthStore,
    ) {
        makeObservable(this);
    }

    books(scope: BooksScope): BookModel[] | undefined {
        return this.lists[scope];
    }

    @computed get privateCount(): number | undefined {
        return this.lists.private?.length;
    }

    load(scope: BooksScope): Promise<boolean> {
        const user = this.auth.user;
        return this.states[scope].run(
            () => this.fetch(scope, user),
            books => (this.lists[scope] = books),
        );
    }

    /** Saves the book, then refreshes both scopes (the new book shows up in "all" and "private"). */
    async add(book: NewBookDto): Promise<void> {
        const response = await this.gateway.addBook(this.auth.user, book);
        if (response?.status !== 'ok') {
            throw new Error('The book was not saved, please try again');
        }
        await Promise.all([this.load('all'), this.load('private')]);
    }

    @action reset() {
        this.lists.all = undefined;
        this.lists.private = undefined;
        this.states.all.reset();
        this.states.private.reset();
    }

    private async fetch(scope: BooksScope, user: string): Promise<BookModel[]> {
        const payload = scope === 'all' ? await this.gateway.getAll(user) : await this.gateway.getPrivate(user);
        return toBookModels(payload);
    }
}

/** Validates raw records and maps them to PM; malformed records (e.g. `{}` — the API accepts any body) are skipped. */
function toBookModels(payload: unknown): BookModel[] {
    if (!Array.isArray(payload)) {
        throw new Error('Unexpected response from the books API');
    }
    return payload.flatMap((plain: unknown, index) => {
        if (typeof plain !== 'object' || plain === null) return [];
        const book = plainToModel(BookModel, plain);
        const errors = validateModel(book);
        if (Object.keys(errors).length > 0) {
            console.debug('[BooksRepository] skipping invalid book', plain, errors);
            return [];
        }
        book.key = book.id === undefined ? `idx:${index}` : `id:${book.id}`;
        return [book];
    });
}
