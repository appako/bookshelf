import { defineConfig } from 'orval';

export default defineConfig({
    books: {
        input: { target: './api/openapi.yaml' },
        output: {
            target: './src/shared/api/generated/books.api.ts',
            client: 'axios-functions',
            formatter: 'prettier',
            override: {
                mutator: { path: './src/shared/api/http.client.ts', name: 'apiRequest' },
            },
        },
    },
});
