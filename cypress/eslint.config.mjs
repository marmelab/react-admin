import { defineConfig } from 'eslint/config';
import cypress from 'eslint-plugin-cypress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    {
        extends: compat.extends('../.eslintrc'),

        plugins: {
            cypress,
        },

        languageOptions: {
            globals: {
                ...cypress.environments.globals.globals,
            },
        },
    },
]);
