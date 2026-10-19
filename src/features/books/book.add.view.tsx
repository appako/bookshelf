import { observer } from 'mobx-react-lite';
import { useController } from '~/shared/di/container';
import { Button } from '~/shared/ui/button';
import { Form } from '~/shared/ui/form';
import { StatusLine } from '~/shared/ui/status.line';
import { TextInput } from '~/shared/ui/text.input';
import { BookAddController } from './book.add.controller';

export const BookAddView = observer(function BookAddView() {
    const c = useController(BookAddController);
    return (
        <Form className="book-add" onSubmit={c.submit}>
            <TextInput label="Title" value={c.name} error={c.nameError} onValueChange={c.onNameChange} />
            <TextInput label="Author" value={c.author} error={c.authorError} onValueChange={c.onAuthorChange} />
            <Button type="submit" disabled={c.isSubmitting}>
                {c.submitLabel}
            </Button>
            <StatusLine text={c.errorText} tone="error" />
        </Form>
    );
});
