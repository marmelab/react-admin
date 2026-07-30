import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(async () => {
    // In codesandbox, we won't have the packages folder
    // We ignore errors in this case
    const aliases: Record<string, string> = {};
    try {
        const packages = fs.readdirSync(
            path.resolve(__dirname, '../../packages')
        );
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
    } catch {
        /* empty */
    }

    return {
        plugins: [react()],
        resolve: {
            preserveSymlinks: true,
            // this example pins its own react and MUI versions while the monorepo
            // root uses others, and preserveSymlinks makes the packages/*/src sources
            // resolve them from the root. Without dedupe we end up with two instances.
            dedupe: [
                'react',
                'react-dom',
                '@mui/material',
                '@mui/icons-material',
            ],
            alias: [
                ...Object.keys(aliases).map(packageName => ({
                    find: packageName,
                    replacement: aliases[packageName],
                })),
            ],
        },
    };
});
