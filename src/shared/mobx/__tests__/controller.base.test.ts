import { describe, expect, it, vi } from 'vitest';
import { Controller } from '../controller.base';

class TestController extends Controller {
    readonly stop = vi.fn();
    readonly onInitSpy = vi.fn();
    protected onInit() {
        this.onInitSpy();
        this.autoDispose(this.stop);
    }
}

describe('Controller', () => {
    it('runs registered disposers once on dispose and can be re-initialised (StrictMode)', () => {
        const controller = new TestController();

        controller.init();
        controller.dispose();
        controller.dispose();
        expect(controller.stop).toHaveBeenCalledTimes(1);

        controller.init();
        controller.dispose();
        expect(controller.onInitSpy).toHaveBeenCalledTimes(2);
        expect(controller.stop).toHaveBeenCalledTimes(2);
    });
});
