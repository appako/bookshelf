export function StatusLine({ text, tone = 'muted' }: { text: string; tone?: 'muted' | 'error' }) {
    return (
        <p className={`status status--${tone}`} role="status">
            {text}
        </p>
    );
}
