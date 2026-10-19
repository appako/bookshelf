import type { ReactNode } from 'react';
import { toSubmit } from './dom.events';

export function Form({
    onSubmit,
    className,
    children,
}: {
    onSubmit: () => void;
    className?: string;
    children: ReactNode;
}) {
    return (
        <form className={className} onSubmit={toSubmit(onSubmit)} noValidate>
            {children}
        </form>
    );
}
