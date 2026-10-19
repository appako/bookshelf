import 'reflect-metadata';
import { configure } from 'mobx';
import { container } from 'tsyringe';
import { afterEach, beforeEach, expect, vi, type MockInstance } from 'vitest';

configure({ enforceActions: 'always' });

let consoleWarn: MockInstance<typeof console.warn>;

beforeEach(() => {
    container.clearInstances();
    localStorage.clear();
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleWarn = vi.spyOn(console, 'warn');
});

afterEach(() => {
    // vitest hides console output of passing tests, so MobX strict-mode warnings would go unnoticed
    const mobxWarnings = consoleWarn.mock.calls.map(([message]) => String(message)).filter(m => m.startsWith('[MobX]'));
    vi.restoreAllMocks();
    expect(mobxWarnings).toEqual([]);
});
