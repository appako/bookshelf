import { toValue } from './dom.events';

type Props = {
    label: string;
    value: string;
    error: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
};

export function TextInput({ label, value, error, onValueChange, placeholder, autoFocus }: Props) {
    return (
        <label className="field">
            <span className="field__label">{label}</span>
            <input
                className="field__input"
                value={value}
                placeholder={placeholder}
                autoFocus={autoFocus}
                aria-invalid={Boolean(error)}
                onChange={toValue(onValueChange)}
            />
            <span className="field__error">{error}</span>
        </label>
    );
}
