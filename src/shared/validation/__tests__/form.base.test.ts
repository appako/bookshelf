import { IsNotEmpty } from 'class-validator';
import { action, makeObservable, observable } from 'mobx';
import { describe, expect, it } from 'vitest';
import { FormBase } from '../form.base';

class TestForm extends FormBase {
    @observable @IsNotEmpty({ message: 'Required' }) title = '';

    constructor() {
        super();
        makeObservable(this);
    }

    @action setTitle(value: string) {
        this.title = value;
        this.markTouched('title');
    }
}

describe('FormBase', () => {
    it('hides errors until the field is touched', () => {
        const form = new TestForm();

        expect(form.isValid).toBe(false);
        expect(form.visibleError('title')).toBe('');

        form.setTitle('');
        expect(form.visibleError('title')).toBe('Required');
    });

    it('shows all errors after a submit attempt and clears them on reset', () => {
        const form = new TestForm();

        form.markSubmitAttempted();
        expect(form.visibleError('title')).toBe('Required');

        form.resetValidation();
        expect(form.visibleError('title')).toBe('');
    });

    it('re-validates reactively when a field changes', () => {
        const form = new TestForm();

        form.setTitle('Dune');

        expect(form.isValid).toBe(true);
        expect(form.visibleError('title')).toBe('');
    });
});
