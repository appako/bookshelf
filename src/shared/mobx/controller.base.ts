type Disposer = () => void;

// init/dispose may run twice under StrictMode: whatever onInit starts must go through autoDispose
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
