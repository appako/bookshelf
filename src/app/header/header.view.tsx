import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/di/container';
import { Button } from '~/shared/ui/button';
import { HeaderController } from './header.controller';

export const HeaderView = observer(function HeaderView() {
    const c = useController(HeaderController);
    return (
        <header className="header">
            <span className="header__brand">Bookshelf</span>
            <strong className="header__counter">{c.counterText}</strong>
            <span className="header__user">{c.nickname}</span>
            <Button variant="ghost" onClick={c.logout}>
                Log out
            </Button>
        </header>
    );
});
