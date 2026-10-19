import { action, computed, makeObservable, observable } from 'mobx';
import { validateModel } from './validate.model';

export abstract class FormBase {
    @observable.shallow private touched = new Set<string>();
    @observable private submitAttempted = false;

    constructor() {
        makeObservable(this);
    }

    @computed get errors() {
        return validateModel<object>(this) as Record<string, string | undefined>;
    }

    @computed get isValid() {
        return Object.keys(this.errors).length === 0;
    }

    visibleError(field: string): string {
        const shown = this.submitAttempted || this.touched.has(field);
        return (shown && this.errors[field]) || '';
    }

    @action markTouched(field: string) {
        this.touched.add(field);
    }

    @action markSubmitAttempted() {
        this.submitAttempted = true;
    }

    @action resetValidation() {
        this.touched.clear();
        this.submitAttempted = false;
    }
}
