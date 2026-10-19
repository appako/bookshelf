import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/di/container';
import { Button } from '~/shared/ui/button';
import { Show } from '~/shared/ui/show';
import { StatusLine } from '~/shared/ui/status.line';
import { HeaderController } from './header.controller';

export const HeaderView = observer(function HeaderView() {
    const c = useController(HeaderController);
    return (
        <header className="header">
            <span className="header__brand">Bookshelf</span>
            <StatusLine text={c.clearErrorText} tone="error" />
            <strong className="header__counter">{c.counterText}</strong>
            <Show when={c.showClear}>
                <Button variant="ghost" disabled={c.isClearDisabled} onClick={c.requestClear}>
                    {c.clearLabel}
                </Button>
            </Show>
            <Show when={c.showClearConfirm}>
                <Button variant="danger" onClick={c.confirmClear}>
                    Yes, clear
                </Button>
                <Button variant="ghost" onClick={c.cancelClear}>
                    Cancel
                </Button>
            </Show>
            <span className="header__user">{c.nickname}</span>
            <Button variant="ghost" onClick={c.logout}>
                Log out
            </Button>
        </header>
    );
});
