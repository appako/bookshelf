import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
    variant?: 'primary' | 'ghost';
};

export function Button({ children, onClick, type = 'button', disabled, variant = 'primary' }: Props) {
    return (
        <button className={`button button--${variant}`} type={type} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
}
