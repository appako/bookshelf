import { memo } from 'react';

export const BookRowView = memo(function BookRowView({ title }: { title: string }) {
    return <li className="books__row">{title}</li>;
});
