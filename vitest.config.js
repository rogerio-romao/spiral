import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        browser: {
            screenshotFailures: false,
        },
        coverage: {
            exclude: [
                'src/algos/**',
                'src/generated/**',
                'coverage/**',
                'src/utils/roundRectExtra.js',
            ],
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
                    name: { color: 'blue', label: 'unit' },
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
                    name: { color: 'green', label: 'browser' },
                },
            },
        ],
    },
});
