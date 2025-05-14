import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    server: {
        host: true,
    },
    base: './',
    build: {
        sourcemap: mode === "developement",
    },
    test: {
        globals: true,
        environment: 'jsdom'
    }
}));
