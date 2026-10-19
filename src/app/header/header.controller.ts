import { computed, makeObservable } from 'mobx';
import { injectable } from 'tsyringe';
import { AuthStore } from '~/features/auth/auth.store';
import { BooksRepository } from '~/features/books/books.repository';
import { Controller } from '~/shared/mobx/controller.base';

@injectable()
export class HeaderController extends Controller {
    constructor(
        private readonly repository: BooksRepository,
        private readonly auth: AuthStore,
    ) {
        super();
        makeObservable(this);
    }

    protected onInit() {
        void this.repository.load('private');
    }

    @computed get counterText() {
        return `Your books: ${this.repository.privateCount ?? '…'}`;
    }

    get nickname() {
        return this.auth.nickname;
    }

    logout = () => this.auth.logout();
}
