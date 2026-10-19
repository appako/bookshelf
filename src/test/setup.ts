import 'reflect-metadata';

import { cleanup } from '@testing-library/react';
import { configure } from 'mobx';
import { container } from 'tsyringe';
import { afterEach, beforeEach, expect, vi, type MockInstance } from 'vitest';

configure({ enforceActions: 'always' });

// RTL sets this and registers cleanup itself only when test globals are enabled (they are not)
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);

let consoleWarn: MockInstance<typeof console.warn>;

beforeEach(() => {
    container.clearInstances();
    localStorage.clear();
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleWarn = vi.spyOn(console, 'warn');
});

afterEach(() => {
    // a MobX strict-mode warning alone doesn't fail a test and is easy to miss in the output
    const mobxWarnings = consoleWarn.mock.calls.map(([message]) => String(message)).filter(m => m.startsWith('[MobX]'));
    vi.restoreAllMocks();
    expect(mobxWarnings).toEqual([]);
});
