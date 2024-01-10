import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';

const packages = fs.readdirSync(path.resolve(__dirname, '../../packages'));
const aliases = packages.reduce((acc, dirName) => {
    const packageJson = require(path.resolve(
        __dirname,
        '../../packages',
        dirName,
        'package.json'
    ));
    acc[packageJson.name] = path.resolve(
        __dirname,
        `${path.resolve('../..')}/packages/${packageJson.name}/src`
    );
    return acc;
}, {});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer({
            open: process.env.NODE_ENV !== 'CI',
            filename: './dist/stats.html',
        }),
    ],
    define: {
        'process.env': process.env,
    },
    server: {
        port: 8000,
        open: true,
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
            ...Object.keys(aliases).map(packageName => ({
                find: packageName,
                replacement: aliases[packageName],
            })),
        ],
    },
});
