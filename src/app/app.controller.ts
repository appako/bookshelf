import { computed, makeObservable, reaction } from 'mobx';
import { injectable } from 'tsyringe';
import { AuthStore } from '~/features/auth/auth.store';
import { BooksRepository } from '~/features/books/books.repository';
import { Controller } from '~/shared/mobx/controller.base';

@injectable()
export class AppController extends Controller {
    constructor(
        private readonly auth: AuthStore,
        private readonly books: BooksRepository,
    ) {
        super();
        makeObservable(this);
    }

    protected onInit() {
        this.autoDispose(
            reaction(
                () => this.auth.nickname,
                () => this.books.reset(),
            ),
        );
    }

    @computed get showLogin() {
        return !this.auth.isAuthorized;
    }

    @computed get showShelf() {
        return this.auth.isAuthorized;
    }
}
