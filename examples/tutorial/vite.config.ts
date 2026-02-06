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
            alias: [
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
                ...Object.keys(aliases).map(packageName => ({
                    find: packageName,
                    replacement: aliases[packageName],
                })),
            ],
        },
    };
});
