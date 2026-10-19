import { reaction } from 'mobx';
import { container } from 'tsyringe';
import { describe, expect, it, vi } from 'vitest';
import { deferred } from '~/test/deferred';
import { flush, setupShelf, TEST_USER } from '~/test/test.app';
import { BooksListController } from '../books.list.controller';

function setup() {
    const shelf = setupShelf();
    const list = container.resolve(BooksListController);
    return { ...shelf, list };
}

const activeTabs = (list: BooksListController) => list.tabs.filter(tab => tab.isActive).map(tab => tab.id);

describe('BooksListController', () => {
    it('shows a loading status, then "Author: Name" rows of all books', async () => {
        const { list } = setup();

        list.init();
        expect(list.statusText).toBe('Loading…');

        await flush();
        expect(list.statusText).toBe('');
        expect(list.items.map(item => item.title)).toEqual([
            'Kenneth Graeme: Wind in the willows',
            'Isaac Asimov: I, Robot',
            'Jrr Tolkein: The Hobbit',
        ]);
    });

    it('switches between mutually exclusive "All" and "Private" tabs', async () => {
        const { list, gateway } = setup();
        list.init();
        expect(activeTabs(list)).toEqual(['all']);

        list.tabs[1].select();
        await flush();

        expect(activeTabs(list)).toEqual(['private']);
        expect(gateway.getPrivate).toHaveBeenCalledWith(TEST_USER);
        expect(list.statusText).toBe('You have not added any books yet');
    });

    it('shows the latest selected scope even if an older response arrives later', async () => {
        const { list, gateway } = setup();
        const slowAll = deferred<unknown>();
        gateway.getAll.mockReturnValueOnce(slowAll.promise);
        gateway.getPrivate.mockResolvedValueOnce([{ name: 'Mine', author: 'Me' }]);

        list.init();
        list.select('private');
        await flush();
        slowAll.resolve([{ name: 'Stale', author: 'Old' }]);
        await flush();

        expect(list.items.map(item => item.title)).toEqual(['Me: Mine']);
    });

    it('shows an error and retries on demand', async () => {
        const { list, gateway } = setup();
        gateway.getAll.mockRejectedValueOnce(new Error('Network Error'));

        list.init();
        await flush();
        expect(list.statusText).toBe('Could not load books: Network Error');
        expect(list.statusTone).toBe('error');
        expect(list.showRetry).toBe(true);

        list.retry();
        await flush();
        expect(list.showRetry).toBe(false);
        expect(list.items).toHaveLength(3);
    });

    it('keeps already loaded rows visible while refreshing', async () => {
        const { list, gateway } = setup();
        list.init();
        await flush();
        const slow = deferred<unknown>();
        gateway.getAll.mockReturnValueOnce(slow.promise);

        list.retry();

        expect(list.isRefreshing).toBe(true);
        expect(list.items).toHaveLength(3);
        expect(list.statusText).toBe('');
    });

    it('stops reacting to tab changes after dispose', async () => {
        const { list, gateway } = setup();
        list.init();
        await flush();

        list.dispose();
        list.select('private');

        expect(gateway.getPrivate).not.toHaveBeenCalled();
    });

    it('changes the view model once per first load: rows and status arrive in one action', async () => {
        const { list } = setup();
        const changes = vi.fn();
        const stop = reaction(() => ({ items: list.items, status: list.statusText, busy: list.isRefreshing }), changes);

        list.init();
        await flush();
        stop();

        expect(changes).toHaveBeenCalledTimes(1);
        expect(changes.mock.calls[0][0]).toMatchObject({ status: '', busy: false });
    });

    it('changes the view model exactly twice per refresh: "busy", then fresh rows', async () => {
        const { list } = setup();
        list.init();
        await flush();
        const changes = vi.fn();
        const stop = reaction(() => ({ items: list.items, status: list.statusText, busy: list.isRefreshing }), changes);

        list.retry();
        await flush();
        stop();

        expect(changes.mock.calls.map(([vm]) => vm.busy)).toEqual([true, false]);
    });
});
