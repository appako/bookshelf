import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        react({
            tsDecorators: true,
            // esbuild/oxc can't emit `design:paramtypes`, so TS is compiled by SWC everywhere
            // (dev, build and vitest) — tsyringe resolves constructor dependencies from that metadata.
            useAtYourOwnRisk_mutateSwcOptions(options) {
                options.jsc ??= {};
                options.jsc.transform = { ...options.jsc.transform, legacyDecorator: true, decoratorMetadata: true };
            },
        }),
    ],
    resolve: {
        alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        restoreMocks: true,
    },
});
