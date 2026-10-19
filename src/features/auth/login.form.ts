import { IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { action, makeObservable, observable } from 'mobx';
import { FormBase } from '~/shared/validation/form.base';

export class LoginForm extends FormBase {
    @observable
    @MaxLength(32, { message: 'Up to 32 characters' })
    @Matches(/^[a-z0-9_-]*$/i, { message: 'Only latin letters, digits, "-" and "_"' })
    @IsNotEmpty({ message: 'Enter your nickname' })
    nickname = '';

    constructor() {
        super();
        makeObservable(this);
    }

    @action setNickname(value: string) {
        this.nickname = value;
        this.markTouched('nickname');
    }

    /** Nicknames are case-insensitive for the user, so "Appako" and "appako" share one shelf. */
    toNickname() {
        return this.nickname.toLowerCase();
    }
}
