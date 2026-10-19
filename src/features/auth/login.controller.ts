import { computed, makeObservable } from 'mobx';
import { injectable } from 'tsyringe';
import { Controller } from '~/shared/mobx/controller.base';
import { AuthStore } from './auth.store';
import { LoginForm } from './login.form';

@injectable()
export class LoginController extends Controller {
    readonly form = new LoginForm();

    constructor(private readonly auth: AuthStore) {
        super();
        makeObservable(this);
    }

    get nickname() {
        return this.form.nickname;
    }

    @computed get nicknameError() {
        return this.form.visibleError('nickname');
    }

    onNicknameChange = (value: string) => this.form.setNickname(value);

    submit = () => {
        this.form.markSubmitAttempted();
        if (!this.form.isValid) return;
        this.auth.login(this.form.toNickname());
    };
}
