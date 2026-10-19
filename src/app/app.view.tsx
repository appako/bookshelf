import { observer } from 'mobx-react-lite';
import { LoginView } from '~/features/auth/login.view';
import { BookAddView } from '~/features/books/book.add.view';
import { BooksListView } from '~/features/books/books.list.view';
import { useController } from '~/shared/di/container';
import { Show } from '~/shared/ui/show';
import { AppController } from './app.controller';
import { HeaderView } from './header/header.view';

export const AppView = observer(function AppView() {
    const c = useController(AppController);
    return (
        <>
            <Show when={c.showLogin}>
                <LoginView />
            </Show>
            <Show when={c.showShelf}>
                <HeaderView />
                <main className="shelf">
                    <BookAddView />
                    <BooksListView />
                </main>
            </Show>
        </>
    );
});
