type Disposer = () => void;

/**
 * Base for local (per-component) controllers.
 * `init()` / `dispose()` are driven by `useController`; both may run more than once (React StrictMode),
 * so everything started in `onInit` must be registered via `autoDispose` and be safe to start again.
 */
export abstract class Controller {
    private disposers: Disposer[] = [];

    init(): void {
        this.onInit();
    }

    dispose(): void {
        this.disposers.splice(0).forEach(dispose => dispose());
        this.onDispose();
    }

    protected onInit(): void {}

    protected onDispose(): void {}

    protected autoDispose(...disposers: Disposer[]): void {
        this.disposers.push(...disposers);
    }
}
