import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/di/container';
import { Button } from '~/shared/ui/button';
import { Show } from '~/shared/ui/show';
import { StatusLine } from '~/shared/ui/status.line';
import { Tabs } from '~/shared/ui/tabs';
import { BookRowView } from './book.row.view';
import { BooksListController } from './books.list.controller';

export const BooksListView = observer(function BooksListView() {
    const c = useController(BooksListController);
    return (
        <section className="books" aria-busy={c.isRefreshing}>
            <Tabs label="Books filter" items={c.tabs} />
            <StatusLine text={c.statusText} tone={c.statusTone} />
            <Show when={c.showRetry}>
                <Button variant="ghost" onClick={c.retry}>
                    Retry
                </Button>
            </Show>
            <ul className="books__list">
                {c.items.map(item => (
                    <BookRowView key={item.key} title={item.title} />
                ))}
            </ul>
        </section>
    );
});
