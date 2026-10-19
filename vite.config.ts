import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        react({
            tsDecorators: true,
            // oxc/esbuild can't emit decorator metadata, which tsyringe needs to resolve constructor deps
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
        reporters: ['tree'],
    },
});
