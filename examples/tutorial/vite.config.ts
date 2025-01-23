import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
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
        ],
    },
});
