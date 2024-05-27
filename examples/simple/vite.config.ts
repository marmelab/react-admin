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
    let aliases: any[] = [];
    try {
        const packages = fs.readdirSync(
            path.resolve(__dirname, '../../packages')
        );
        for (const dirName of packages) {
            if (dirName === 'create-react-admin') continue;
            // eslint-disable-next-line prettier/prettier
            const packageJson = await import(
                path.resolve(__dirname, '../../packages', dirName, 'package.json'),
                { assert: { type: 'json' } }
            );
            aliases.push({
                find: new RegExp(`^${packageJson.default.name}$`),
                replacement: path.resolve(
                    __dirname,
                    `../../packages/${packageJson.default.name}/src`
                ),
            });
        }
    } catch {
    }
    
    return {
        plugins: [react()],
        resolve: {
            alias: [
                ...aliases,
                {
                    find: /^@mui\/icons-material\/(.*)/,
                    replacement: '@mui/icons-material/esm/$1',
                },
            ],
        },
        server: {
            port: 8080,
        },
        define: { 'process.env': {} },
    };
});
