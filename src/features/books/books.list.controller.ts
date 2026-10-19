import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { injectable } from 'tsyringe';
import { Controller } from '~/shared/mobx/controller.base';
import type { TabItem } from '~/shared/ui/tabs';
import { BooksRepository, type BooksScope } from './books.repository';

export type BookItem = { key: string; title: string };

const SCOPES: { id: BooksScope; label: string; emptyText: string }[] = [
    { id: 'all', label: 'All books', emptyText: 'No books yet' },
    { id: 'private', label: 'Private books', emptyText: 'You have not added any books yet' },
];

@injectable()
export class BooksListController extends Controller {
    @observable scope: BooksScope = 'all';

    constructor(private readonly repository: BooksRepository) {
        super();
        makeObservable(this);
    }

    protected onInit() {
        this.autoDispose(
            reaction(
                () => this.scope,
                scope => this.repository.load(scope),
                { fireImmediately: true },
            ),
        );
    }

    @computed get tabs(): TabItem[] {
        return SCOPES.map(({ id, label }) => ({
            id,
            label,
            isActive: id === this.scope,
            select: () => this.select(id),
        }));
    }

    @computed get items(): BookItem[] {
        return (this.books ?? []).map(book => ({ key: book.key, title: `${book.author}: ${book.name}` }));
    }

    @computed get statusText(): string {
        if (this.state.isError) return `Could not load books: ${this.state.error}`;
        if (this.books === undefined) return 'Loading…';
        if (this.books.length === 0) return SCOPES.find(scope => scope.id === this.scope)!.emptyText;
        return '';
    }

    @computed get statusTone() {
        return this.state.isError ? 'error' : 'muted';
    }

    @computed get showRetry() {
        return this.state.isError;
    }

    @computed get isRefreshing() {
        return this.state.isLoading && this.books !== undefined;
    }

    @action select(scope: BooksScope) {
        this.scope = scope;
    }

    retry = () => this.repository.load(this.scope);

    private get books() {
        return this.repository.books(this.scope);
    }

    private get state() {
        return this.repository.states[this.scope];
    }
}
