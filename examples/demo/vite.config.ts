import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    server: {
        port: 8000,
    },
    base: './',
    esbuild: {
        keepNames: true,
    },
    build: {
        sourcemap: true,
    },
    resolve: {
        preserveSymlinks: true,
        alias: [
            // allow profiling in production
            { find: 'react-dom', replacement: 'react-dom/profiling' },
            {
                find: 'scheduler/tracing',
                replacement: 'scheduler/tracing-profiling',
            },
            // we need to manually follow the symlinks for local packages to allow deep HMR
            {
                find: /^react-admin$/,
                replacement: `${path.resolve(
                    '../..'
                )}/packages/react-admin/src`,
            },
            {
                find: /^ra-ui-materialui$/,
                replacement: `${path.resolve(
                    '../..'
                )}/packages/ra-ui-materialui/src`,
            },
            {
                find: /^ra-core$/,
                replacement: `${path.resolve('../..')}/packages/ra-core/src`,
            },
        ],
    },
});
