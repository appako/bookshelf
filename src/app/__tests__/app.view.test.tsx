import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContainerProvider } from '~/shared/di/container';
import { registerFakeBooksGateway } from '~/test/fake.books.gateway';
import { AppView } from '../app.view';

/** Smoke test: views only wire controllers to markup, the whole flow works through the real UI. */
describe('AppView', () => {
    it('logs in, lists books, adds a book and updates the header counter', async () => {
        registerFakeBooksGateway();
        render(
            <ContainerProvider>
                <AppView />
            </ContainerProvider>,
        );

        fireEvent.change(screen.getByLabelText('Nickname'), { target: { value: 'Appako' } });
        fireEvent.click(screen.getByRole('button', { name: 'Enter' }));

        expect(await screen.findByText('Isaac Asimov: I, Robot')).toBeTruthy();
        expect(screen.getByText('Your books: 0')).toBeTruthy();

        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Dune' } });
        fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Frank Herbert' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add book' }));

        expect(await screen.findByText('Your books: 1')).toBeTruthy();
        expect(screen.getByText('Frank Herbert: Dune')).toBeTruthy();

        await act(() => fireEvent.click(screen.getByRole('tab', { name: 'Private books' })));
        expect(screen.queryByText('Isaac Asimov: I, Robot')).toBeNull();
        expect(screen.getByText('Frank Herbert: Dune')).toBeTruthy();
    });
});
