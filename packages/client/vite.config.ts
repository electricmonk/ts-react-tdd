import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
        outDir: 'dist',
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ["./setupTests.ts"],
        include: ['./test/*.spec.ts', './test/*.spec.tsx'],
    },
    plugins: [react({
        babel: {
            "plugins": ["@babel/plugin-proposal-explicit-resource-management"]
        },
        include: '**/*.tsx',
    })],
    server: {
        port: 3000,
        host: '0.0.0.0'
    }
});