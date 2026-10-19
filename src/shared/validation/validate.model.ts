import { validateSync } from 'class-validator';

export type ValidationErrors<T> = Partial<Record<keyof T & string, string>>;

/** Runs class-validator and returns the first message per invalid field. */
export function validateModel<T extends object>(model: T): ValidationErrors<T> {
    const errors: ValidationErrors<T> = {};
    for (const error of validateSync(model)) {
        const [message] = Object.values(error.constraints ?? {});
        errors[error.property as keyof T & string] = message;
    }
    return errors;
}
