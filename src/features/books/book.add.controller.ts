import { computed, makeObservable } from 'mobx';
import { injectable } from 'tsyringe';
import { AsyncState } from '~/shared/mobx/async.state';
import { Controller } from '~/shared/mobx/controller.base';
import { BooksRepository } from './books.repository';
import { BookAddForm } from './book.add.form';

@injectable()
export class BookAddController extends Controller {
    readonly form = new BookAddForm();
    private readonly saving = new AsyncState();

    constructor(private readonly repository: BooksRepository) {
        super();
        makeObservable(this);
    }

    get name() {
        return this.form.name;
    }

    get author() {
        return this.form.author;
    }

    @computed get nameError() {
        return this.form.visibleError('name');
    }

    @computed get authorError() {
        return this.form.visibleError('author');
    }

    @computed get isSubmitting() {
        return this.saving.isLoading;
    }

    @computed get submitLabel() {
        return this.isSubmitting ? 'Adding…' : 'Add book';
    }

    @computed get errorText() {
        return this.saving.isError ? `Could not add the book: ${this.saving.error}` : '';
    }

    onNameChange = (value: string) => this.form.setName(value);

    onAuthorChange = (value: string) => this.form.setAuthor(value);

    submit = async (): Promise<boolean> => {
        this.form.markSubmitAttempted();
        if (!this.form.isValid || this.isSubmitting) return false;
        return this.saving.run(
            () => this.repository.add(this.form.toDto()),
            () => this.form.reset(),
        );
    };

    protected onDispose() {
        this.saving.reset();
    }
}
