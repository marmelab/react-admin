import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import preserveDirectives from 'rollup-preserve-directives';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    const packages = fs.readdirSync(path.resolve(__dirname, '../../packages'));
    const aliases: Record<string, string> = {
        'data-generator-retail': path.resolve(
            __dirname,
            '../data-generator/src'
        ),
    };
    for (const dirName of packages) {
        if (dirName === 'create-react-admin') continue;
        const packageJson = JSON.parse(
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    '../../packages',
                    dirName,
                    'package.json'
                ),
                'utf8'
            )
        );
        aliases[packageJson.name] = path.resolve(
            __dirname,
            `../../packages/${packageJson.name}/src`
        );
    }

    return {
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
            rollupOptions: {
                plugins: [preserveDirectives()],
            },
        },
        resolve: {
            preserveSymlinks: true,
            alias: [
                // FIXME: doesn't work with react 19
                // allow profiling in production
                // { find: /^react-dom$/, replacement: 'react-dom/profiling' },
                // {
                //     find: 'scheduler/tracing',
                //     replacement: 'scheduler/tracing-profiling',
                // },
                // The 2 next aliases are needed to avoid having multiple react-router instances
                {
                    find: 'react-router-dom',
                    replacement: path.resolve(
                        __dirname,
                        `node_modules/react-router/dist/${mode === 'production' ? 'production' : 'development'}/index.mjs`
                    ),
                },
                {
                    find: 'react-router',
                    replacement: path.resolve(
                        __dirname,
                        `node_modules/react-router/dist/${mode === 'production' ? 'production' : 'development'}/index.mjs`
                    ),
                },
                // The 2 next aliases are needed to avoid having multiple MUI instances
                {
                    find: '@mui/material',
                    replacement: path.resolve(
                        __dirname,
                        'node_modules/@mui/material'
                    ),
                },
                {
                    find: '@mui/icons-material',
                    replacement: path.resolve(
                        __dirname,
                        'node_modules/@mui/icons-material'
                    ),
                },
                // we need to manually follow the symlinks for local packages to allow deep HMR
                ...Object.keys(aliases).map(packageName => ({
                    find: packageName,
                    replacement: aliases[packageName],
                })),
            ],
        },
    };
});
