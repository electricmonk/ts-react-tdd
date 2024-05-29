import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['./test/*.spec.ts'],
    },
});