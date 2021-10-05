import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh()],
    alias: [
        {
            find: /^react-admin$/,
            replacement: path.resolve(
                __dirname,
                '../../packages/react-admin/src'
            ),
        },
        {
            find: /^ra-core$/,
            replacement: path.resolve(__dirname, '../../packages/ra-core/src'),
        },
        {
            find: /^ra-ui-materialui$/,
            replacement: path.resolve(
                __dirname,
                '../../packages/ra-ui-materialui/src'
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
            find: /^ra-no-code$/,
            replacement: path.resolve(
                __dirname,
                '../../packages/ra-no-code/src'
            ),
        },
        {
            find: /^@mui\/icons-material\/(.*)/,
            replacement: '@mui/icons-material/esm/$1',
        },
        {
            find: /^@mui\/material\/(.+)/,
            replacement: '@mui/material/es/$1',
        },
        {
            find: /^@mui\/material$/,
            replacement: '@mui/material/es',
        },
    ],
});
