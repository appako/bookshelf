import 'reflect-metadata';
import { configure } from 'mobx';
import { container } from 'tsyringe';
import { afterEach, beforeEach, vi } from 'vitest';

configure({ enforceActions: 'always' });

beforeEach(() => {
    container.clearInstances();
    localStorage.clear();
    vi.spyOn(console, 'debug').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
});
