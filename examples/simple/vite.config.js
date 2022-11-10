import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const packages = fs.readdirSync(path.resolve(__dirname, '../../packages'));
const aliases = packages.map(dirName => {
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

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default {
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
