import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/di/container';
import { Button } from '~/shared/ui/button';
import { Form } from '~/shared/ui/form';
import { TextInput } from '~/shared/ui/text.input';
import { LoginController } from './login.controller';

export const LoginView = observer(function LoginView() {
    const c = useController(LoginController);
    return (
        <Form className="login" onSubmit={c.submit}>
            <h1 className="login__title">Bookshelf</h1>
            <p className="login__hint">Your nickname is your shelf: books you add are stored under it.</p>
            <TextInput
                label="Nickname"
                placeholder="e.g. appako"
                value={c.nickname}
                error={c.nicknameError}
                onValueChange={c.onNicknameChange}
                autoFocus
            />
            <Button type="submit">Enter</Button>
        </Form>
    );
});
