import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            exclude: ['src/algos/**', 'src/generated/**', 'coverage/**'],
            include: ['src/**/*.js', 'scripts/**/*.mjs'],
            provider: 'v8',
        },
        environment: 'node',
        globals: true,
        include: ['__tests__/**/*.test.js', 'scripts/__tests__/**/*.test.js'],
        setupFiles: ['__tests__/setup.js'],
    },
});
