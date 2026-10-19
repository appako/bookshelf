import { action, computed, makeObservable, observable } from 'mobx';
import { injectable } from 'tsyringe';
import { AuthStore } from '~/features/auth/auth.store';
import { BooksRepository } from '~/features/books/books.repository';
import { AsyncState } from '~/shared/mobx/async.state';
import { Controller } from '~/shared/mobx/controller.base';

@injectable()
export class HeaderController extends Controller {
    @observable private isConfirmingClear = false;
    private readonly clearing = new AsyncState();

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

    protected onDispose() {
        this.clearing.reset();
        this.cancelClear();
    }

    @computed get counterText() {
        return `Your books: ${this.repository.privateCount ?? '…'}`;
    }

    get nickname() {
        return this.auth.nickname;
    }

    @computed get showClear() {
        return !this.isConfirmingClear;
    }

    @computed get showClearConfirm() {
        return this.isConfirmingClear;
    }

    @computed get isClearDisabled() {
        return !this.repository.privateCount || this.clearing.isLoading;
    }

    @computed get clearLabel() {
        return this.clearing.isLoading ? 'Clearing…' : 'Clear my books';
    }

    @computed get clearErrorText() {
        return this.clearing.isError ? `Could not clear books: ${this.clearing.error}` : '';
    }

    @action requestClear = () => {
        this.isConfirmingClear = true;
    };

    @action cancelClear = () => {
        this.isConfirmingClear = false;
    };

    confirmClear = (): Promise<boolean> => {
        this.cancelClear();
        return this.clearing.run(() => this.repository.clear());
    };

    logout = () => this.auth.logout();
}
