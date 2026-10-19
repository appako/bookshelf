import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { getErrorMessage } from '~/shared/api/error.message';

export type AsyncStatus = 'idle' | 'loading' | 'done' | 'error';

/**
 * Status of an async operation. The latest `run()` wins: results of superseded or reset runs are dropped,
 * and success is applied together with the status change in one action (one re-render).
 */
export class AsyncState {
    @observable status: AsyncStatus = 'idle';
    @observable error = '';

    private runId = 0;

    constructor() {
        makeObservable(this);
    }

    @computed get isLoading() {
        return this.status === 'loading';
    }

    @computed get isError() {
        return this.status === 'error';
    }

    /** Resolves to `true` only when this run completed successfully and is still the latest one. */
    async run<T>(task: () => Promise<T>, onSuccess?: (result: T) => void): Promise<boolean> {
        const runId = this.start();
        try {
            const result = await task();
            if (runId !== this.runId) return false;
            runInAction(() => {
                onSuccess?.(result);
                this.status = 'done';
            });
            return true;
        } catch (error) {
            if (runId !== this.runId) return false;
            console.debug('[AsyncState] run failed', error);
            runInAction(() => {
                this.status = 'error';
                this.error = getErrorMessage(error);
            });
            return false;
        }
    }

    @action reset() {
        this.runId++;
        this.status = 'idle';
        this.error = '';
    }

    @action private start() {
        this.status = 'loading';
        this.error = '';
        return ++this.runId;
    }
}
