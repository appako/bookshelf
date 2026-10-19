import type { ReactNode } from 'react';

/** The only conditional-rendering primitive: views pass a boolean from their controller, never an expression. */
export function Show({ when, children }: { when: boolean; children: ReactNode }) {
    return when ? children : null;
}
