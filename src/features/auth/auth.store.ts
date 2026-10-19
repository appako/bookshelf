import { action, computed, makeObservable, observable } from 'mobx';
import { singleton } from 'tsyringe';
import { AppStorage } from '~/shared/storage/app.storage';

const NICKNAME_KEY = 'bookshelf.nickname';

/** App-wide session: the nickname is the API "user" path segment. Persisted between reloads. */
@singleton()
export class AuthStore {
    @observable nickname = '';

    constructor(private readonly storage: AppStorage) {
        makeObservable(this);
        this.nickname = storage.get(NICKNAME_KEY) ?? '';
    }

    @computed get isAuthorized() {
        return this.nickname !== '';
    }

    /** API user; only valid inside the authorized part of the app. */
    get user(): string {
        if (!this.isAuthorized) {
            throw new Error('Not authorized');
        }
        return this.nickname;
    }

    @action login(nickname: string) {
        this.nickname = nickname;
        this.storage.set(NICKNAME_KEY, nickname);
    }

    @action logout() {
        this.nickname = '';
        this.storage.remove(NICKNAME_KEY);
    }
}
