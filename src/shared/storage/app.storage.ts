import { singleton } from 'tsyringe';

@singleton()
export class AppStorage {
    get(key: string): string | undefined {
        try {
            return localStorage.getItem(key) ?? undefined;
        } catch {
            return undefined;
        }
    }

    set(key: string, value: string): void {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.debug('[AppStorage] set failed', error);
        }
    }

    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.debug('[AppStorage] remove failed', error);
        }
    }
}
