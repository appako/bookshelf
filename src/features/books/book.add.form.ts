import { Matches, MaxLength } from 'class-validator';
import { action, makeObservable, observable } from 'mobx';
import { FormBase } from '~/shared/validation/form.base';
import type { NewBookDto } from './books.dto';

export class BookAddForm extends FormBase {
    @observable
    @MaxLength(120, { message: 'Up to 120 characters' })
    @Matches(/\S/, { message: 'Enter the title' })
    name = '';

    @observable
    @MaxLength(120, { message: 'Up to 120 characters' })
    @Matches(/\S/, { message: 'Enter the author' })
    author = '';

    constructor() {
        super();
        makeObservable(this);
    }

    @action setName(value: string) {
        this.name = value;
        this.markTouched('name');
    }

    @action setAuthor(value: string) {
        this.author = value;
        this.markTouched('author');
    }

    toDto(): NewBookDto {
        return { name: this.name.trim(), author: this.author.trim() };
    }

    @action reset() {
        this.name = '';
        this.author = '';
        this.resetValidation();
    }
}
