import { defineConfig, globalIgnores } from 'eslint/config';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
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
    globalIgnores([
        '**/node_modules',
        '**/build',
        '**/lib',
        '**/esm',
        '**/prism.js',
        'packages/create-react-admin/templates/**/*',
        '**/eslintrc.*',
    ]),
    {
        extends: fixupConfigRules(
            compat.extends('plugin:prettier/recommended')
        ),

        plugins: {
            '@typescript-eslint': typescriptEslint,
            import: fixupPluginRules(_import),
            'jsx-a11y': jsxA11Y,
            prettier: fixupPluginRules(prettier),
            react,
            'react-hooks': fixupPluginRules(reactHooks),
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },

        rules: {
            'no-use-before-define': 'off',
            'prettier/prettier': 'error',

            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@mui/material',
                            importNames: ['makeStyles', 'createMuiTheme'],
                            message:
                                'Please import from @mui/material/styles instead. See https://material-ui.com/guides/minimizing-bundle-size/#option-2 for more information',
                        },
                        {
                            name: '@mui/icons-material',
                            message:
                                "Named import from @mui/icons-material should be avoided for performance reasons. Use a default import instead. E.g. `import Dashboard from '@mui/icons-material/Dashboard';` instead of `import { Dashboard } from '@mui/icons-material';`.See https://mui.com/material-ui/guides/minimizing-bundle-size/#development-environment for more information.",
                        },
                        {
                            name: 'lodash',
                            message:
                                "Named import from lodash should be avoided for performance reasons. Use a default import instead. E.g. `import merge from 'lodash/merge';` instead of `import { merge } from 'lodash';`.",
                        },
                    ],
                },
            ],

            'no-redeclare': 'off',
            'import/no-anonymous-default-export': 'off',
            '@typescript-eslint/no-redeclare': 'error',
            'no-unused-vars': 'off',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            'import/no-extraneous-dependencies': ['error'],

            'react/jsx-uses-vars': 'warn',
            'react/jsx-uses-react': 'warn',
        },
    },
    {
        files: ['**/*.stories.*', '**/*.spec.*', '**/examples/**'],

        rules: {
            'import/no-extraneous-dependencies': ['off'],
        },
    },
]);
