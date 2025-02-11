import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
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
    } catch {}

    return {
        plugins: [react()],
        resolve: {
            alias: [
                {
                    find: /^@mui\/icons-material\/(.*)/,
                    replacement: '@mui/icons-material/esm/$1',
                },
                ...Object.keys(aliases).map(packageName => ({
                    find: packageName,
                    replacement: aliases[packageName],
                })),
            ],
        },
        server: {
            port: 8080,
        },
        define: { 'process.env': {} },
    };
});
