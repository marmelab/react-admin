import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

let aliases: any[] = [];
try {
    const packages = fs.readdirSync(path.resolve(__dirname, '../../packages'));
    aliases = packages.map(dirName => {
        const packageJson = require(path.resolve(
            __dirname,
            '../../packages',
            dirName,
            'package.json'
        ));
        return {
            find: new RegExp(`^${packageJson.name}$`),
            replacement: path.resolve(
                __dirname,
                `../../packages/${packageJson.name}/src`
            ),
        };
    }, {});
} catch {}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    resolve: {
        alias: [
            ...aliases,
            {
                find: /^@mui\/icons-material\/(.*)/,
                replacement: '@mui/icons-material/esm/$1',
            },
        ],
    },
    base: './',
});
