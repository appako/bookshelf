import type { ReactNode } from 'react';

export function Show({ when, children }: { when: boolean; children: ReactNode }) {
    return when ? children : null;
}
