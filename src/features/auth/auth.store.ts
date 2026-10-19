import { action, computed, makeObservable, observable } from 'mobx';
import { singleton } from 'tsyringe';
import { AppStorage } from '~/shared/storage/app.storage';

@singleton()
export class AuthStore {
    private static readonly NICKNAME_KEY = 'bookshelf.nickname';

    @observable nickname = '';

    constructor(private readonly storage: AppStorage) {
        this.nickname = storage.get(AuthStore.NICKNAME_KEY) ?? '';
        makeObservable(this);
    }

    @computed get isAuthorized() {
        return this.nickname !== '';
    }

    get user(): string {
        if (!this.isAuthorized) {
            throw new Error('Not authorized');
        }
        return this.nickname;
    }

    @action login(nickname: string) {
        this.nickname = nickname;
        this.storage.set(AuthStore.NICKNAME_KEY, nickname);
    }

    @action logout() {
        this.nickname = '';
        this.storage.remove(AuthStore.NICKNAME_KEY);
    }
}
