/** One-line status (loading / error / empty); renders nothing visible for an empty text. */
export function StatusLine({ text, tone = 'muted' }: { text: string; tone?: 'muted' | 'error' }) {
    return (
        <p className={`status status--${tone}`} role="status">
            {text}
        </p>
    );
}
