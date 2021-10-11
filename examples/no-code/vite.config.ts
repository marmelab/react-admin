import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default {
    plugins: [reactRefresh()],
    resolve: {
        alias: [
            {
                find: /^react-admin$/,
                replacement: path.resolve(
                    __dirname,
                    '../../packages/react-admin/src'
                ),
            },
            {
                find: /^ra-data-local-storage$/,
                replacement: path.resolve(
                    __dirname,
                    '../../packages/ra-data-localstorage/src'
                ),
            },
            {
                find: /^ra-(.*)$/,
                replacement: path.resolve(
                    __dirname,
                    '../../packages/ra-$1/src'
                ),
            },
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
