import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            exclude: ['src/algos/**', 'src/generated/**', 'coverage/**'],
            include: ['src/**/*.js', 'scripts/**/*.mjs'],
            provider: 'v8',
        },
        projects: [
            {
                test: {
                    environment: 'node',
                    exclude: ['__tests__/browser/**'],
                    globals: true,
                    include: ['__tests__/**/*.test.js', 'scripts/__tests__/**/*.test.js'],
                    name: 'unit',
                    setupFiles: ['__tests__/setup.js'],
                },
            },
            {
                test: {
                    browser: {
                        enabled: true,
                        headless: true,
                        instances: [{ browser: 'chromium' }],
                        provider: playwright(),
                    },
                    globals: true,
                    include: ['__tests__/browser/**/*.test.js'],
                    name: 'browser',
                },
            },
        ],
    },
});
