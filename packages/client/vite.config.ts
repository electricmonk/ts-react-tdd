import { defineConfig } from 'vitest/config'
import { createHtmlPlugin } from 'vite-plugin-html';
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
    plugins: [
        createHtmlPlugin({
            entry: 'src/index.tsx',
            template: "./index.html",
        }),
        react({
            include: '**/*.tsx',
        }),
    ],
    server: {
        port: 3000,
        host: '0.0.0.0'
    }
});