import { describe, expect, it, vi } from 'vitest';
import { deferred } from '~/test/deferred';
import { AsyncState } from '../async.state';

describe('AsyncState', () => {
    it('goes loading → done and applies the result', async () => {
        const state = new AsyncState();
        const onSuccess = vi.fn();
        const request = deferred<number>();

        const run = state.run(() => request.promise, onSuccess);
        expect(state.isLoading).toBe(true);

        request.resolve(42);
        await expect(run).resolves.toBe(true);
        expect(state.status).toBe('done');
        expect(onSuccess).toHaveBeenCalledWith(42);
    });

    it('stores the error message on failure', async () => {
        const state = new AsyncState();

        await expect(state.run(() => Promise.reject(new Error('Boom')))).resolves.toBe(false);

        expect(state.isError).toBe(true);
        expect(state.error).toBe('Boom');
    });

    it('drops a stale response when a newer run was started (latest wins)', async () => {
        const state = new AsyncState();
        const onSuccess = vi.fn();
        const first = deferred<string>();
        const second = deferred<string>();

        const firstRun = state.run(() => first.promise, onSuccess);
        const secondRun = state.run(() => second.promise, onSuccess);
        second.resolve('second');
        first.resolve('first');

        await expect(secondRun).resolves.toBe(true);
        await expect(firstRun).resolves.toBe(false);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onSuccess).toHaveBeenCalledWith('second');
    });

    it('ignores an in-flight run after reset', async () => {
        const state = new AsyncState();
        const onSuccess = vi.fn();
        const request = deferred<string>();

        const run = state.run(() => request.promise, onSuccess);
        state.reset();
        request.resolve('late');

        await expect(run).resolves.toBe(false);
        expect(state.status).toBe('idle');
        expect(onSuccess).not.toHaveBeenCalled();
    });
});
