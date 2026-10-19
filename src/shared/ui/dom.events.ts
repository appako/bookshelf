import type { ChangeEvent, FormEvent } from 'react';

/** DOM → plain value adapters, so controllers never deal with React/DOM events. */
export const toValue = (handler: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) =>
    handler(event.currentTarget.value);

export const toSubmit = (handler: () => void) => (event: FormEvent) => {
    event.preventDefault();
    handler();
};
