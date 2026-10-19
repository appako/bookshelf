import type { ChangeEvent, SubmitEvent } from 'react';

export const toValue = (handler: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) =>
    handler(event.currentTarget.value);

export const toSubmit = (handler: () => void) => (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    handler();
};
